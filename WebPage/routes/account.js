var express = require('express');
var router = express.Router();
var Customer = require("../models/customer");
const jwt = require("jwt-simple");
const bcrypt = require("bcryptjs");
const fs = require('fs');

// On AWS ec2, you can use to store the secret in a separate file. 
// The file should be stored outside of your code directory. 
// For encoding/decoding JWT

//SHHH THIS IS VERY SECRET :)
const secret = fs.readFileSync(__dirname + '/../keys/jwtkey').toString();

//valid password check (1 uppercase, 1 lowercase, 1 number, 1 special character, and length > 6)
function validatePassword(pass)
{
   const upperRegex = /[A-Z]/;
   const lowerRegex = /[a-z]/;
   const numberRegex = /[0-9]/;
   const specialRegex = /[_!@#$%^&]/;

   return(upperRegex.test(pass) && lowerRegex.test(pass) && numberRegex.test(pass) && specialRegex.test(pass) && pass.length >= 6);
}

//POST create an account using email and password
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

//POST log in to account using email and password then create a token
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
               const token = jwt.encode({ email: customer.email }, secret);
               //update user's last access time
               customer.lastAccess = new Date();
               customer.save( (err, customer) => {
                  console.log("User's LastAccess has been update.");
               });
               // Send back a token that contains the user's username
               res.status(201).json({ success:true, token: token, msg: "Login success" });
         }
         else {
            res.status(401).json({ success:false, msg: "Email or password invalid."});
         }
      }
   });
});

router.put('/reset', function (req, res) {
   if(req.body.password && req.headers['x-auth']){
      const token = req.headers['x-auth'];
      const decoded = jwt.decode(token, secret);
      Customer.findOne({email: decoded.email}, function (err, Customer){
         if(err){
            res.status(401).json({success: false, message: "Failed to authenticate user."});
         }
         else{
            Customer.passwordHash = bcrypt.hashSync(req.body.password, 10);
            Customer.save(function(err){
               if(err){
                  res.status(500).json({success: false, message: "Server failed to reset password"});
               }
               else{
                  // Password changed successfully
                  res.status(201).json({ success: true, message: "Password reset successfully" });
               }
            });
            
         }
         
      });
   }
   else{
      res.status(400).json({ success: false, message: "Missing password or x-auth" });
   }
});

router.get("/status", function (req, res) {
   // See if the X-Auth header is set
   if (!req.headers["x-auth"]) {
       return res.status(401).json({ success: false, msg: "Missing X-Auth header" });
   }

   // X-Auth should contain the token 
   const token = req.headers["x-auth"];
   try {
       const decoded = jwt.decode(token, secret);
       // Send back email and last access
       Customer.find({ email: decoded.email }, "email lastAccess", function (err, users) {
           if (err) {
               res.status(400).json({ success: false, message: "Error contacting DB. Please contact support." });
           }
           else {
               res.status(200).json(users);
           }
       });
   }
   catch (ex) {
       res.status(401).json({ success: false, message: "Invalid JWT" });
   }
});



module.exports = router;