var express = require('express');
var router = express.Router();
var Customer = require("../models/customer");
const jwt = require("jwt-simple");
const fs = require('fs');
const superagent =  require('superagent');

// Register new device
router.post('/device', function (req, res) {
    // Check if fields present
    if (!req.body.deviceId || !req.body.deviceToken) {
        res.status(401).json({ error: "Missing device id and/or token"});
        return;
    }
    else {
        // Check if device already registerd
        Customer.findOne({ "devices.deviceId": req.body.deviceId }, function(err, device) {
            if(err) {
                res.status(500).send(err);
            }
            else if(device) {
                res.status(400).json({ error: "Device already registerd" });
            }
            // Find user
            else {
                Customer.findOne({ email: req.body.email }, function (err, user) {
                    if (err) {
                        res.status(500).send(err);
                    }
                    else if (!user) {
                        res.status(401).json({ error: "User could not be found" });
                    }
                    // Add device to list
                    else {
                        Customer.devices.push({
                            deviceId: req.body.deviceId,
                            deviceToken: req.body.deviceToken,
                            data: []
                        });
                        Customer.save(function (err) {
                            if (err) {
                                res.status(500).send(err);
                            }
                            else {
                                res.status(201).json({ success:true, msg: "Device Added" });
                            }
                        });
                    }
                });
            }
        });
    }
});

module.exports = router;