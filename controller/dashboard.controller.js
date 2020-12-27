const formatVND = require('../common/formatVND');
const modelOrder = require('../models/orders.model');
const modelCustomers = require('../models/customers_account.model');

const getWidget = async (socket) => {
  let profit = 0;
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

  const orderComplete = await modelOrder.find({ status: 'DELIVERED' });
  for (let i = 0; i < orderComplete.length; i++) {
    profit += parseInt(orderComplete[i].total, 10);
  }
  const newCustomer = await modelCustomers.find({
    dateAdded: {
      $gte: firstDay,
      $lte: date,
    },
  });
  console.log('get widget');
  socket.emit('getWidget', {
    orderComplete: orderComplete.length,
    profit: formatVND(profit),
    newCustomer: newCustomer.length,
    customerSatisfaction: '90%',
  });
};

module.exports = { getWidget };
