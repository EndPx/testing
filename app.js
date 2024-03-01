//ambil module express
const express = require('express');
const app = express();
const PORT = 5000;

//ambil router yang mengandle endpoint user
const Router = require('./routes/router');
const association = require('./util/assoc_db')

//untuk ngambil request body
app.use(express.json());

//jalanin router
app.use(Router);

app.use("/", (req,res,next)=>{
  res.status(404).json({
    message: "Resource not found!"
  })
})

association()
.then(()=>{
  app.listen(PORT,()=>{
    console.log('server is running on port 5000');
  })
})
.catch(err=>{
  console.log(err.message);
})