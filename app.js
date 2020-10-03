const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// require('dotenv').config() 
// setup express
const app = express()
// Import Router
const customersrouter = require('./routes/customers.route');
const employeesrouter = require('./routes/employees.route');
const order_detailrouter = require('./routes/order_detail.route');
const orderrouter = require('./routes/orders.route');
const payment_methodrouter = require('./routes/payment_methods.route');
const paymentrouter = require('./routes/payments.route');
const productrouter = require('./routes/products.route');
const shipping_methodrouter = require('./routes/shipping_methods.route');

// 
app.use(bodyParser.json());

app.use('/api/customer', customersrouter);
app.use('/api/employees', employeesrouter);
app.use('/api/order_detail', order_detailrouter);
app.use('/api/order', orderrouter);
app.use('/api/payment_method', payment_methodrouter);
app.use('/api/payment', paymentrouter);
app.use('/api/product', productrouter);
app.use('/api/shipping_method', shipping_methodrouter);

//Router
app.get('/', function (req, res, next) {
  res.send('Hello form node!!');
});
// Connect Database
app.listen(3000);

mongoose.connect('mongodb+srv://dangdai:e8wUyOLobqi8jRnn@cluster0.3l6w7.mongodb.net/MyDB?retryWrites=true&w=majority', {
  useUnifiedTopology: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useCreateIndex: true
})
  .then(async () => {
    console.log('Database connection created')
  }).catch((err) => {
    console.log(err)
  })
// End connnect
