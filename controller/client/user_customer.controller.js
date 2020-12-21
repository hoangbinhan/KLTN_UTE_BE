const CustomerAccount = require('../../models/customers_account.model');
const Product = require('../../models/products.model');
const Order = require('../../models/orders.model');
const Order_Detail = require('../../models/orders_detail.model');
const service = require('../../common/function');
const bcrypt = require('bcrypt');
const sendMail = require('.././sendMail.controller');
const jwt = require('jsonwebtoken');
const uuidv1 = require('uuid/v1');
const https = require('https');
const moment = require('moment');
var endpoint = 'https://test-payment.momo.vn/gw_payment/transactionProcessor';
var hostname = 'https://test-payment.momo.vn';
var path = '/gw_payment/transactionProcessor';
var partnerCode = 'MOMOPWRX20201211';
var accessKey = 'VBWuaoUC0N69pBvg';
var serectkey = 'GJOorUVT2R6txlsnCeI4ZGnYpmGNFvPp';
var orderInfo = 'pay with MoMo';
var returnUrl = process.env.RETURN_URL_MOMO || ''
var notifyurl = process.env.NOTIFY_URL_MOMO || ''
var requestType = 'captureMoMoWallet';
var extraData = '';
//

const {
  CLIENT_URL
} = process.env;
class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    const queryObj = {
      ...this.queryString,
    };
    const excludedfields = ['page', 'sort', 'limit'];
    excludedfields.forEach((el) => delete queryObj[el]);
    let querystr = JSON.stringify(queryObj);
    querystr = querystr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);
    this.query.find(JSON.parse(querystr));
    return this;
  }
  sorting() {
    if (this.queryString.sort) {
      const sortby = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortby);
    } else {
      this.query = this.query.sort('-createAt');
    }
    return this;
  }
  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 4;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
const StaffServices = {
  search: async (req, res) => {
    try {
      var regex = new RegExp(req.params.name, 'i');
      Staff.find({
        name: regex,
      }).then((result) => {
        res.status(200).json(result);
      });
    } catch {
      return res.status(500).json({
        msg: err.message,
      });
    }
  },
  register: async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        phoneNumber,
        address
      } = req.body;
      if (!name || !email || !password)
        return res.status(400).json({
          msg: 'Please fill in all fields!',
        });
      if (!service.validateEmail(email))
        return res.status(400).json({
          msg: 'Invalid emails.',
        });
      const customer = await CustomerAccount.findOne({
        email,
      });
      if (customer)
        return res.status(400).json({
          msg: 'This email already exists.',
        });
      if (password.length < 6)
        return res.status(400).json({
          msg: 'Pass word must be at least 6 characters',
        });
      const passwordHash = await bcrypt.hash(password, 12);
      const newStaff = {
        name,
        email,
        password: passwordHash,
        phoneNumber,
        address,
      };
      const post = new CustomerAccount(newStaff);
      await post.save();
      // const activation_token = service.createActivationToken(newStaff);
      // const url = `${CLIENT_URL}/api/staff/activate/${activation_token}`
      // sendMail(email, url, "Verify your email address")
      res.json({
        msg: 'Register Success! Please activate your email to start',
      });
    } catch (err) {
      return res.status(500).json({
        msg: err.message,
      });
    }
  },
  registerWithThirdParty: async (req, res) => {
    try {
      const {
        name,
        email
      } = req.body;
      if (!name || !email)
        return res.status(400).json({
          msg: 'Some thing went wrong!',
        });
      if (!service.validateEmail(email))
        return res.status(400).json({
          msg: 'Invalid emails.',
        });
      const customer = await CustomerAccount.findOne({
        email,
      });
      const token = service.createAccessToken({
        email: email,
        name: name,
        role: 'customer',
      });
      if (customer) {
        return res.status(200).json({
          status: 'Login success!',
          token: {
            token,
          },
        });
      }
      const newStaff = {
        name,
        email,
      };
      const post = new CustomerAccount(newStaff);
      await post.save();
      return res.status(200).json({
        status: 'Login success!',
        token: {
          token,
        },
      });
    } catch (err) {
      return res.status(500).json({
        msg: err.message,
      });
    }
  },
  activateEmail: async (req, res) => {
    try {
      const {
        activation_token
      } = req.body;
      const staff = jwt.verify(
        activation_token,
        process.env.ACTIVATION_TOKEN_SECRET
      );

      const {
        staffID,
        name,
        email,
        password
      } = staff;

      const check = await Staff.findOne({
        email,
      });
      if (check)
        return res.status(400).json({
          msg: 'This email already exists.',
        });
      const newStaff = new Staff({
        staffID,
        name,
        email,
        password,
      });
      await newStaff.save();
      res.json({
        msg: 'Account has been activated!',
      });
    } catch (err) {
      return res.status(500).json({
        msg: err.message,
      });
    }
  },

  addToCart: async (req, res) => {
    try {
      let isAdd = false;
      const email = req.staff.email;
      const {
        product,
        quantity
      } = req.body;
      const productInStore = await Product.findOne({
        _id: product,
      });
      if (!productInStore)
        return res.status(500).json({
          msg: 'product invalid',
        });
      if (productInStore.quantity - quantity < 0)
        return res.status(500).json({
          msg: 'quantity is too large',
        });

      const customer = await CustomerAccount.findOne({
        email,
      });
      if (!customer)
        return res.status(500).json({
          msg: 'customer invalid',
        });
      for (let i = 0; i < customer.cart.length; i++) {
        if (customer.cart[i].id === product) {
          customer.cart[i].quantity += quantity;
          isAdd = true;
          break;
        }
      }
      if (!isAdd) {
        customer.cart.push({
          id: product,
          quantity: quantity,
        });
      }
      await CustomerAccount.findOneAndUpdate({
          email,
        },
        customer
      );
      return res.status(200).json({
        msg: 'successful',
      });
    } catch (err) {
      return res.status(500).json({
        msg: err.message,
      });
    }
  },
  updateCart: async (req, res) => {
    const email = req.staff.email;
    const {
      id,
      quantity
    } = req.body;
    try {
      const customer = await CustomerAccount.findOne({
        email,
      });
      if (!customer)
        return res.status(500).json({
          msg: 'customer invalid',
        });
      for (let i = 0; i < customer.cart.length; i++) {
        if (customer.cart[i].id === id) {
          customer.cart[i].quantity += quantity;
          break;
        }
      }
      await CustomerAccount.findOneAndUpdate({
          email,
        },
        customer
      );
      return res.status(200).json({
        msg: 'successful',
      });
    } catch (err) {
      return res.status(500).json({
        msg: err.message,
      });
    }
  },
  deleteCart: async (req, res) => {
    const email = req.staff.email;
    const {
      id
    } = req.body;
    try {
      const customer = await CustomerAccount.findOne({
        email,
      });
      if (!customer)
        return res.status(500).json({
          msg: 'customer invalid',
        });
      for (let i = 0; i < customer.cart.length; i++) {
        if (customer.cart[i].id === id) {
          customer.cart.splice(i, 1);
          break;
        }
      }
      await CustomerAccount.findOneAndUpdate({
          email,
        },
        customer
      );
      return res.status(200).json({
        msg: 'successful',
      });
    } catch (err) {
      return res.status(500).json({
        msg: err.message,
      });
    }
  },

  getCart: async (req, res) => {
    const email = req.staff.email;
    try {
      let cart = [];
      let price = 0;
      let totalItem = 0;
      let customer = await CustomerAccount.findOne({
        email,
      });
      if (!customer)
        return res.status(400).json({
          msg: err.message,
        });
      for (let i = 0; i < customer.cart.length; i++) {
        const productCart = await Product.findOne({
          _id: customer.cart[i].id,
        });
        if (!productCart) continue;
        const result = {
          item: productCart,
          quantity: customer.cart[i].quantity,
        };
        totalItem += customer.cart[i].quantity;
        cart.push(result);
        price += productCart.price * customer.cart[i].quantity;
      }
      return res.status(200).json({
        cart,
        totalQuantity: cart.length,
        totalPrice: price,
        totalItem,
      });
    } catch (err) {
      return res.status(400).json({
        msg: err.message,
      });
    }
  },

  login: async (req, res) => {
    try {
      const {
        email,
        password
      } = req.body;
      const customer = await CustomerAccount.findOne({
        email,
      });
      if (!customer)
        return res.status(400).json({
          msg: 'This email does not exist.',
        });
      const isMatch = await bcrypt.compare(password, customer.password);
      if (!isMatch)
        return res.status(400).json({
          msg: 'Password is incorrect.',
        });
      const refresh_token = service.createRefreshToken({
        email: customer.email,
        name: customer.name,
        role: customer.role,
      });
      const token = service.createAccessToken({
        email: customer.email,
        name: customer.name,
        role: customer.role,
      });
      res.cookie('refreshtoken', refresh_token, {
        httpOnly: true,
        path: '/api/staff/refresh_token',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      res.status(200).json({
        status: 'Login success!',
        token: {
          token,
          refresh_token,
        },
      });
    } catch (err) {
      return res.status(500).json({
        msg: err.message,
      });
    }
  },

  checkout: async (req, res) => {
    let {
      customerDetail,
      productsInvoice,
      paymentDetail,
      totalDetail,
    } = req.body;
    customerDetail = {
      ...customerDetail,
    };
    var idCustomer = '';
    try {
      await CustomerAccount.findOne({
          email: req.staff.email,
        },
        async function (err, customer) {
          if (err) {
            res.status(400).json({
              message: err.message,
            });
          } else {
            if (customer) {
              idCustomer = customer._id;
              const postOrder = new Order({
                customer: idCustomer,
                total: totalDetail.total,
              });
              await postOrder.save((err) => {
                if (err) {
                  res.status(400).json({
                    err: err.message,
                    postSave: 'err in postSave',
                  });
                } else {
                  CustomerAccount.findOneAndUpdate({
                      _id: idCustomer,
                    }, {
                      $push: {
                        invoices: postOrder._id,
                      },
                      $set: {
                        cart: [],
                      },
                    },
                    async (err) => {
                      if (err) {
                        res.status(400).json({
                          err: err.message,
                        });
                      } else {
                        try {
                          for (let i = 0; i < productsInvoice.length; i++) {
                            const storedProduct = await Product.findOne({
                              _id: productsInvoice[i]._id,
                            });
                            const isSoldOut =
                              (await storedProduct.quantity) -
                              productsInvoice[i].quantity;
                            if (isSoldOut < 0) {
                              res.status(400).json({
                                message: 'product is sold out!',
                              });
                            } else {
                              try {
                                await Product.findOneAndUpdate({
                                  _id: productsInvoice[i]._id,
                                }, {
                                  quantity: isSoldOut,
                                });
                              } catch (err) {
                                res.status(400).json({
                                  message: err.message,
                                });
                              }
                            }
                          }
                          try {
                            const postDetail = new Order_Detail({
                              orderID: postOrder._id,
                              customerDetail,
                              productsInvoice,
                              paymentDetail,
                              totalDetail,
                            });
                            const detailOrder = await postDetail.save();
                            //TODO: Fix here
                            if (paymentDetail.paymentMethod == 'Momo Payment') {
                              var rawSignature =
                                'partnerCode=' +
                                partnerCode +
                                '&accessKey=' +
                                accessKey +
                                '&requestId=' +
                                postOrder._id +
                                '&amount=' +
                                totalDetail.total +
                                '&orderId=' +
                                postOrder._id +
                                '&orderInfo=' +
                                orderInfo +
                                '&returnUrl=' +
                                returnUrl +
                                '&notifyUrl=' +
                                notifyurl +
                                '&extraData=' +
                                extraData;
                              const crypto = require('crypto');
                              var signature = await crypto
                                .createHmac('sha256', serectkey)
                                .update(rawSignature)
                                .digest('hex');
                              var body = JSON.stringify({
                                partnerCode: partnerCode,
                                accessKey: accessKey,
                                requestId: postOrder._id,
                                amount: totalDetail.total + '',
                                orderId: postOrder._id,
                                orderInfo: orderInfo,
                                returnUrl: returnUrl,
                                notifyUrl: notifyurl,
                                extraData: extraData,
                                requestType: requestType,
                                signature: signature,
                              });
                              var options = {
                                hostname: 'test-payment.momo.vn',
                                port: 443,
                                path: '/gw_payment/transactionProcessor',
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Content-Length': Buffer.byteLength(body),
                                },
                              };
                              var reqMomo = https.request(
                                options,
                                (resMomo) => {
                                  resMomo.setEncoding('utf8');
                                  resMomo.on('data', async (body) => {
                                    await Order.findOneAndUpdate({
                                      _id: postOrder._id
                                    }, {
                                      momoUrl: JSON.parse(body).payUrl
                                    }, {
                                      new: true
                                    })
                                    await res.status(200).json({
                                      urlQrcode: JSON.parse(body).payUrl,
                                      message: 'successful',
                                    });
                                  });
                                  resMomo.on('end', (data) => {
                                    console.log(data);
                                    console.log('No more data in response.');
                                  });
                                }
                              );
                              reqMomo.on('error', (e) => {
                                console.log(
                                  `problem with request: ${e.message}`
                                );
                              });
                              // write data to request body
                              reqMomo.write(body);
                              reqMomo.end();
                            } else {
                              res.status(200).json({
                                message: 'successful',
                              });
                            }
                          } catch (err) {
                            res.status(400).json({
                              message: err.message,
                            });
                          }
                        } catch (err) {
                          res.status(400).json({
                            message: err.message,
                          });
                        }
                      }
                    }
                  );
                }
              });
            }
          }
        }
      );
    } catch (err) {
      res.status(400).json({
        message: err.message,
      });
    }
  },

  responseDataMomo: async (req, res) => {
    console.log('abc');
  },

  getAccessToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token)
        return res.status(400).json({
          msg: 'Please login now!',
        });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, staff) => {
        if (err)
          return res.status(400).json({
            msg: 'Please login now!',
          });

        const access_token = service.createAccessToken({
          id: staff.id,
        });
        res.status(200).json({
          status: 'gettoken success',
          refresh_token: access_token,
        });
      });
    } catch (err) {
      return res.status(500).json({
        msg: err.message,
      });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const {
        email
      } = req.body;
      const customer = await CustomerAccount.findOne({
        email,
      });
      if (!customer)
        return res.status(400).json({
          msg: 'This email does not exist.',
        });

      const access_token = service.createAccessToken({
        email: customer.email,
      });
      const url = `${CLIENT_URL}/user/update-password/${access_token}`;
      sendMail(email, url, 'Reset your password');
      res.json({
        msg: 'Re-send the password, please check your email.',
      });
    } catch (err) {
      return res.status(500).json({
        msg: err.message,
      });
    }
  },

  updatePassword: async (req, res) => {
    try {
      const {
        password
      } = req.body;
      const passwordHash = await bcrypt.hash(password, 12);
      await CustomerAccount.findOneAndUpdate({
        email: req.staff.email,
      }, {
        password: passwordHash,
      });
      res.json({
        msg: 'Password successfully changed!',
      });
    } catch (err) {
      return res.status(500).json({
        msg: err.message,
      });
    }
  },

  getOrders: async (req, res) => {
    try {
      const {
        email
      } = req.staff;
      const customer = await CustomerAccount.findOne({
        email,
      });
      if (!customer)
        res.status(500).json({
          msg: err.message,
        });
      let orders = [];
      for (let i = 0; i < customer.invoices.length; i++) {
        let order = await Order.findOne({
          _id: customer.invoices[i],
        });
        if (order) orders.push(order);
      }
      orders.reverse()
      return res.status(200).json({
        data: orders,
        length: orders.length,
      });
    } catch (err) {
      res.status(500).json({
        msg: err.message,
      });
    }
  },
  getDetailOrder: async (req, res) => {
    try {
      const id = req.query.id;
      const {
        email
      } = req.staff;
      const customer = await CustomerAccount.findOne({
        email,
      });
      if (!customer)
        return res.status(500).json({
          msg: 'Can not find the customer!',
        });
      const invoicesLength = customer.invoices.length;
      for (let i = 0; i < invoicesLength; i++) {
        if (customer.invoices[i] == id) {
          const order = await Order.findOne({
            _id: id
          })
          const orderDetail = await Order_Detail.findOne({
            orderID: id,
          });
          if (!orderDetail || !order)
            return res.status(500).json({
              msg: 'Can not find the order!',
            });
          const data = JSON.parse(JSON.stringify(orderDetail))
          data.status = order.status
          return res.status(200).json({
            data
          });
        }
      }
    } catch (err) {
      res.status(500).json({
        msg: err.message,
      });
    }
  },
  getInformation: async (req, res) => {
    try {
      const {
        email
      } = req.staff;
      const info = await CustomerAccount.findOne({
        email,
      });
      if (!info)
        return res.status(500).json({
          msg: 'Can not find the customer!',
        });
      const data = {
        email: info.email,
        name: info.name,
        phoneNumber: info.phoneNumber,
        address: info.address,
      };
      return res.status(200).json({
        data,
      });
    } catch (err) {
      return res.status(500).json({
        msg: err.message,
      });
    }
  },
  updateInformation: async (req, res) => {
    try {
      const {
        email
      } = req.staff;
      const info = await CustomerAccount.findOneAndUpdate({
        email,
      }, {
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
      }, {
        new: true,
      });
      if (!info)
        return res.status(500).json({
          msg: 'Can not find the customer!',
        });
      return res.status(200).json({
        msg: 'successfull',
      });
    } catch (err) {
      return res.status(500).json({
        msg: err.message,
      });
    }
  },
  ratingProduct: async (req, res) => {
    try {
      const {
        email
      } = req.staff;
      const {
        rating,
        comment,
        id
      } = req.body;
      if (!email)
        return res.status(500).json({
          msg: 'can not find the customer!',
        });
      const record = {
        email,
        rating,
        comment,
        date: moment().format('MMMM Do YYYY, h:mm:ss a'),
      };
      const product = await Product.findByIdAndUpdate({
        _id: id,
      }, {
        $push: {
          comment: record,
        },
      });
      if (!product)
        return res.status(500).json({
          msg: 'can not find the customer!',
        });
      return res.status(200).json({
        msg: 'successfull',
      });
    } catch (err) {
      return res.status(500).json({
        msg: err.message,
      });
    }
  },
  cancelInvoice: async (req, res) => {
    try {
      const id = req.body.id
      await Order.findOneAndUpdate({
        _id: id
      }, {
        status: 'CANCEL',
        momoUrl: ''
      }, {
        new: true
      });
      const orderDetail = await Order_Detail.findOne({
        orderID: id
      })
      if (!orderDetail) return res.status(500).json({
        msg: 'Can not find the order detail'
      })
      const {
        productsInvoice
      } = orderDetail
      for (let i = 0; i < productsInvoice.length; i++) {
        const {
          _id
        } = productsInvoice[i]
        const quantityProductOrder = productsInvoice[i].quantity
        const product = await Product.findOne({
          _id
        })
        if (product) {
          let updateQuantity = product.quantity + quantityProductOrder
          await Product.findOneAndUpdate({
            _id: product._id
          }, {
            quantity: updateQuantity
          }, {
            new: true
          })
        }
      }
      return res.status(200).json({
        msg: 'successful'
      })
    } catch (err) {
      return res.status(500).json({
        msg: err.message
      })
    }
  },
  getStaffInfor: async (req, res) => {
    try {
      const feature = new APIfeatures(
          Staff.findOne({
            staffID: req.staff.id,
          }).select('-password'),
          req.query
        )
        .filtering()
        .sorting();
      // const staff = await Staff.findOne({ staffID: req.staff.id }).select('-password')
      const staff = await feature.query;

      // console.log(user);
      res.json(staff);
    } catch (err) {
      return res.status(500).json({
        msg: err.message,
      });
    }
  },
  getStaffsAllInfor: async (req, res) => {
    try {
      const staffs = await Staff.find().select('-password');
      res.json(staffs);
    } catch (err) {
      return res.status(500).json({
        msg: err.message,
      });
    }
  },
  // avatar
  updateStaff: async (req, res) => {
    try {
      // const { name, avatar } = req.body
      // await Staff.findOneAndUpdate({ staffID: req.staff.id }, {
      //     name, // avatar
      // })
      // res.json({ msg: "Update Success!" })
      const {
        staffID
      } = req.body;
      const updateField = service.genUpdate(req.body, ['name', 'status']);
      await Staff.findOneAndUpdate({
          staffID,
        },
        updateField, {
          new: true,
        },
        (err, result) => {
          if (result || !err) {
            res.json(result);
          } else {
            res.json(false);
          }
        }
      );
    } catch (err) {
      return res.status(500).json({
        msg: err.message,
      });
    }
  },
  updateStaffsRole: async (req, res) => {
    try {
      const {
        role
      } = req.body;

      await Staff.findOneAndUpdate({
        staffID: req.params.id,
      }, {
        role,
      });

      res.json({
        msg: 'Update Success!',
      });
    } catch (err) {
      return res.status(500).json({
        msg: err.message,
      });
    }
  },
  deleteStaff: async (req, res) => {
    try {
      // const { userID } = req.body
      // await Staff.findByIdAndDelete(req.params.id, async (err, result) => {
      //     console.log(staff)
      // if (result || !err) {
      //     res.json(result)
      // } else {
      //     res.json(false)
      // }

      const {
        staffID
      } = req.body;
      await Staff.deleteOne({
          staffID,
        },
        async (err, result) => {
          if (result || !err) {
            res.json(result);
          } else {
            res.json(false);
          }
        }
      );
    } catch (error) {
      res.send('error :' + error);
    }
  },
  deleteStaffStatus: async (req, res) => {
    try {
      const {
        staffID
      } = req.body;
      await Staff.findOneAndUpdate({
          staffID,
        }, {
          status: 'INACTIVE',
        }, {
          new: true,
        },
        async (err, result) => {
          if (result || !err) {
            res.json(result);
          } else {
            res.json(false);
          }
        }
      );
    } catch (error) {
      res.send('error :' + error);
    }
  },
};
module.exports = StaffServices;