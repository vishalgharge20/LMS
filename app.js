
if(process.env.NODE_ENV !== "production"){
  require('dotenv').config()
}


const express = require('express');
const app = express();
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const Organization = require('./models/organizations')
const organizationRoutes = require('./routes/organization')
const courseRoutes = require('./routes/courses')
const Course = require('./models/courses')

//load environmental variables from .env files
dotenv.config();

//---> connect mangoose
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Mongo - we are connected");
  })
  .catch((err) => {
    console.log("Mongo - Oh No! Error!!!", err);
  });


// override
const methodOverride = require('method-override');

// Middleware to parse URL-encoded data (form submissions)
app.use(express.urlencoded({ extended: true }));
// Middleware to parse JSON data
app.use(express.json());


// Middleware to support PUT and DELETE methods
app.use(methodOverride('_method'));

app.set('view engine','ejs')





//start server
const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log('Serving on port 3000')
})


/// routes
app.use('/',organizationRoutes)
app.use('/',courseRoutes)


app.get('/',async(req,res)=>{
  const allOrganizations = await Organization.find({}).populate('admins').populate('createdBy')
  const allCourses = await Course.find({})
    res.render('home',{allOrganizations,allCourses})
})


