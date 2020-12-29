const formatVND = require('../common/formatVND');
const modelOrder = require('../models/orders.model');
const Customer = require('../models/customers.model');
const CustomerAccount = require('../models/customers_account.model');
const Order = require('../models/orders.model');

const getWidget = async (socket) => {
  let profit = 0;
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const orderComplete = await modelOrder.find({ status: 'DELIVERED' });
  for (let i = 0; i < orderComplete.length; i++) {
    profit += parseInt(orderComplete[i].total, 10);
  }
  const newCustomer = await CustomerAccount.find({
    dateAdded: {
      $gte: firstDay,
      $lte: date,
    },
  });
  socket.emit('getWidget', {
    orderComplete: orderComplete.length,
    profit: formatVND(profit),
    newCustomer: newCustomer.length,
    customerSatisfaction: '90%',
  });
};

const getNewestOrder = async (socket) => {
  let data = [];
  try {
    const listOrder = await Order.find({});
    let temp = listOrder.reverse();
    const result = temp.slice(0, 7);
    socket.emit('getNewestOrder', {
      data: result,
    });
  } catch (err) {}
};

const getGoldCustomer = async (req, res) => {
  try {
    const customerOnline = await CustomerAccount.find({});
    const result = await customerOnline.sort(
      (a, b) => b.invoices.length - a.invoices.length
    );
    let data = [];
    const temp = result.slice(0, 5);
    for (let i = 0; i < temp.length; i++) {
      data.push({ key: i, name: temp[i].name, total: temp[i].invoices.length });
    }
    return res.status(200).json({ data });
  } catch (err) {
    return;
  }
};

const getNewFeedChart = async (req, res) => {
  try {
    let data = [];
    for (let i = 0; i < 12; i++) {
      let profit = 0;
      const date = new Date();
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      const month = new Date(firstDay.setMonth(i));
      const orderComplete = await modelOrder.find({
        status: 'DELIVERED',
        dateAdded: {
          $gte: month,
          $lte: new Date(firstDay.setMonth(i + 1)),
        },
      });
      for (let i = 0; i < orderComplete.length; i++) {
        profit += parseInt(orderComplete[i].total, 10);
      }
      await data.push({ key: i, month: i + 1, profit: parseInt(profit) });
    }
    return res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ msg: 'Error' });
  }
};

module.exports = {
  getWidget,
  getNewFeedChart,
  getGoldCustomer,
  getNewestOrder,
};
