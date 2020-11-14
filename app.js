const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const corsOptions = {
  origin: 'http://192.168.0.106:3000',
  optionsSuccessStatus: 200
}

//require dotenv
const dotenv = require('dotenv');

dotenv.config();
// setup express
const app = express()

app.use(express.json())
// app.use(bodyParser.json())
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static("public"))

// app.use(cors())
app.use(cors())
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles: true
}))

// Import Router
const customersrouter = require('./routes/customers.route');
const employeesrouter = require('./routes/employees.route');
const order_detailrouter = require('./routes/order_detail.route');
const orderrouter = require('./routes/orders.route');
const payment_methodrouter = require('./routes/payment_methods.route');
const paymentrouter = require('./routes/payments.route');
const productrouter = require('./routes/products.route');
const shipping_methodrouter = require('./routes/shipping_methods.route');
const uploadImage = require('./routes/upload.route');
//
const categoriesrouter = require('./routes/categories.route')
const children_category = require('./routes/children_category.route')
const staff = require('./routes/staffs_account.route');
//
app.use(cors(corsOptions))
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '50mb',parameterLimit: 100000, extended: true}));
app.use(express.static("public"));

// const uploadImage = require('./routes/upload.route');


app.use('/api/customers', customersrouter);
app.use('/api/employees', employeesrouter);
app.use('/api/order_detail', order_detailrouter);
app.use('/api/order', orderrouter);
app.use('/api/payment_method', payment_methodrouter);
app.use('/api/payment', paymentrouter);
app.use('/api/products', productrouter);
app.use('/api/shipping_methods', shipping_methodrouter);
app.use('/api/upload', uploadImage)
app.use('/api/staff', staff);
//

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
