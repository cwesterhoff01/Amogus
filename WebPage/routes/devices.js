var express = require('express');
var router = express.Router();
var Customer = require("../models/customer");
const jwt = require("jwt-simple");
const fs = require('fs');

const secret = fs.readFileSync(__dirname + '/../keys/jwtkey').toString();

// Register new device
router.post('/device', function (req, res) {
    if (req.headers['x-auth']) {
        // Check if fields present
        if (!req.body.deviceId || !req.body.deviceToken || !req.body.deviceName) {
            res.status(401).json({ success: false, msg: "Missing device info"});
            return;
        }
        else {
            const token = req.headers['x-auth'];
            const decoded = jwt.decode(token, secret);
            // Check if device already registerd
            Customer.findOne({ "devices.deviceId": req.body.deviceId }, function(err, device) {
                if(err) {
                    res.status(500).json({ success: false, msg: "Server error"});
                }
                else if(device) {
                    res.status(400).json({ success: false, msg: "Device already registerd" });
                }
                // Find user
                else {
                    Customer.findOne({ email: decoded.email }, function (err, customer) {
                        if (err) {
                            res.status(500).json({ success: false, msg: "Server error"});
                        }
                        else if (!customer) {
                            res.status(401).json({ success: false, msg: "User could not be found" });
                        }
                        // Add device to list
                        else {
                            customer.devices.push({
                                deviceId: req.body.deviceId,
                                deviceName: req.body.deviceName,
                                deviceToken: req.body.deviceToken,
                                data: []
                            });
                            customer.save(function (err) {
                                if (err) {
                                    res.status(500).json({ success: false, msg: "Could not add device"});
                                }
                                else {
                                    res.status(201).json({ success: true, msg: "Device Added" });
                                }
                            });
                        }
                    });
                }
            });
        }
    }
    else {
        res.status(400).json({ success: false, msg: "Missing x-auth" });
    }
});

// Remove device
router.delete('/device', function (req, res) {
    if (req.headers['x-auth']) {
        const token = req.headers['x-auth'];
        const decoded = jwt.decode(token, secret);
        Customer.findOne({ email: decoded.email }, function (err, customer) {
            if (err) {
                res.status(500).json({ success: false, msg: "Server error" });
            }
            else if (!customer) {
                res.status(401).json({ success: false, msg: "User could not be found" });
            }
            else {
                let index = -1;
                // find device
                for (let i = 0; i < customer.devices.length; i++) {
                    if (customer.devices[i].deviceName == req.body.deviceName) {
                        index = i;
                    }
                }
                if (index >= 0) {
                    customer.devices.splice(index, 1);
                    customer.save(function (err) {
                        if (err) {
                            res.status(500).json({ success: false, msg: "Could not remove device" });
                        }
                        else {
                            res.status(201).json({ success: true, msg: "Device Removed" });
                        }
                    });
                }
                else {
                    res.status(400).json({ success: false, msg: "Could not find device" });
                }
            }
        });
    }
    else {
        res.status(400).json({ success: false, msg: "Missing x-auth" });
    }
});

router.get('/device', function (req, res) {
    if (req.headers['x-auth']) {
        const token = req.headers['x-auth'];
        const decoded = jwt.decode(token, secret);
        Customer.findOne({ email: decoded.email }, function (err, customer) {
            if (err) {
                res.status(500).json({ success: false, msg: "Server error" });
            }
            else if (!customer) {
                res.status(401).json({ success: false, msg: "User could not be found" });
            }
            else {
                let device = [];
                for (let i = 0; i < customer.devices.length; ++i) {
                        device.push(customer.devices[i]);
                }
                
                var myJson = JSON.stringify(device);
                if (device) {
                    res.status(200).json({success: true, param: myJson});
                }
                else {
                    res.status(400).json({success: false, msg: "User has no devices"})
                }
            }
        });
    }
    else {
        res.status(400).json({success:false, msg: "Missing x-auth or device name"})
    }
});

//Gets the report for the past 7 days
//The max, min, and average
router.get('/report', function(req,res){

});

//Gets the past 24 hour sensor data
router.get('/recent', function(req, res){

});

module.exports = router;