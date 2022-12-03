var express = require('express');
var router = express.Router();
var Customer = require("../models/customer");
const jwt = require("jwt-simple");
const bcrypt = require("bcryptjs");
const fs = require('fs');

// On AWS ec2, you can use to store the secret in a separate file. 
// The file should be stored outside of your code directory. 
// For encoding/decoding JWT
const secret = fs.readFileSync(__dirname + '/../keys/jwtkey').toString();

// example of authentication
// register a new customer

// please fiil in the blanks
// see javascript/signup.js for ajax call
// see Figure 9.3.5: Node.js project uses token-based authentication and password hashing with bcryptjs
// in https://learn.zybooks.com/zybook/ARIZONAECE413SalehiFall2022/chapter/9/section/3
function validatePassword(pass)
{
   const upperRegex = /[A-Z]/;
   const lowerRegex = /[a-z]/;
   const numberRegex = /[0-9]/;
   const specialRegex = /[_!@#$%^&]/;

   return(upperRegex.test(pass) && lowerRegex.test(pass) && numberRegex.test(pass) && specialRegex.test(pass) && pass.length >= 6);
}
router.post("/signUp", function(req, res){
   Customer.findOne({email: req.body.email}, function (err, customer) {
      if (err) res.status(401).json({success: false, err: err});
      else if (customer) {
         res.status(401).json({success: false, msg: "This email already used"});
      }
      else {
         if(validatePassword(req.body.password)){
            const bcryptPass = bcrypt.hashSync(req.body.password, 10);
            const newCustomer = new Customer({
               email: req.body.email,
               passwordHash: bcryptPass  
            });
                  
            newCustomer.save(function(err, customer) {
               if (err) {
                  res.status(400).json({success: false, err: err});
               } 
               else {
                  let msgStr = `Customer (${req.body.email}) account has been created.`;
                  res.status(201).json({success: true, message: msgStr});
                  console.log(msgStr);
               }
            });
         }
         else{
            res.status(400).json({success: false, message: "err_password"});
         }
         
       }
   });
});


// please fiil in the blanks
// see javascript/login.js for ajax call
// see Figure 9.3.5: Node.js project uses token-based authentication and password hashing with bcryptjs
// in https://learn.zybooks.com/zybook/ARIZONAECE413SalehiFall2022/chapter/9/section/3

router.post("/logIn", function(req, res){
   if (!req.body.email || !req.body.password) {
      res.status(401).json({ error: "Missing email and/or password"});
      return;
   }
   // Get user from the database
   Customer.findOne({ email: req.body.email }, function(err, customer) {
      if (err) {
         res.status(400).send(err);
      }
      else if (!customer) {
         // Username not in the database
         res.status(401).json({ error: "Login failure!!"});
      }
      else {
         if (bcrypt.compareSync(req.body.password, customer.passwordHash)) {
               //update user's last access time
               customer.lastAccess = new Date();
               customer.save( (err, customer) => {
                  console.log("User's LastAccess has been update.");
               });
               // Send back a token that contains the user's username
               res.status(201).json({ success:true, msg: "Login success" });
         }
         else {
            res.status(401).json({ success:false, msg: "Email or password invalid."});
         }
      }
   });
});


module.exports = router;