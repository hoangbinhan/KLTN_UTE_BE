const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}

//require dotenv
const dotenv = require('dotenv');
dotenv.config();
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
const categoriesrouter = require('./routes/categories.route')
const children_category = require('./routes/children_category.route')
//
app.use(cors(corsOptions))
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static("public"));

app.use('/api/customer', customersrouter);
app.use('/api/employees', employeesrouter);
app.use('/api/order_detail', order_detailrouter);
app.use('/api/order', orderrouter);
app.use('/api/payment_method', payment_methodrouter);
app.use('/api/payment', paymentrouter);
app.use('/api/product', productrouter);
app.use('/api/shipping_method', shipping_methodrouter);
app.use('/api/categories', categoriesrouter)
app.use('/api/children_category', children_category)
//Router
app.get('/', function (req, res, next) {
  res.send('Hello form node!!');
});

// Connect Database
app.listen(process.env.PORT || 3000, () => { 
  console.log(`SERVER RUN IN PORT ${process.env.PORT} `)
}) ;

mongoose.connect(process.env.MONGO_URL, {
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
