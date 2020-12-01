// const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const i18n = require('i18n');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const cloud = require('./common/cloudinaryConfig');
const cloudinary = require('cloudinary')

//require dotenv
const dotenv = require('dotenv');

dotenv.config();
// setup express
const app = express()
app.use(cors())

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json())
app.use(express.static("public"))

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
const categoriesrouter = require('./routes/categories.route')
const children_category = require('./routes/children_category.route')
const staff = require('./routes/staffs_account.route');
//client
const clientCategories = require('./controller/client/categories.controller')

//
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '50mb',parameterLimit: 100000, extended: true}));
app.use(express.static("public"));

// const uploadImage = require('./routes/upload.route');

//dashboard
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
app.use('/api/categories', categoriesrouter)
app.use('/api/children_category', children_category)

//client
app.use('/api/client/home', clientCategories)


//Router
app.get('/', function (req, res, next) {
  res.send('Hello form node!!');
});

app.post('/upload-image', async function(req,res){
  try{
    // const result = await cloud.uploads(req.files.file.tempFilePath)
    cloudinary.v2.uploader.upload(req.files.file.tempFilePath, function(err, result){
      if(err){
        console.log('err')
      }
    })
    console.log(req.files.file.tempFilePath);
    res.json({message: 'oke'})
  }catch(err){
    res.status(500).json({err})
  }
})

// 
i18n.configure({
  locales: ['en', 'vi'],
  directory: './locales'
})
// Connect Database
app.listen(process.env.PORT || 3000, () => { 
  console.log(`SERVER RUN IN PORT ${process.env.PORT} `)
});

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
