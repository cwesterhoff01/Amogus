var express = require('express');
var router = express.Router();
var Customer = require('../models/customer');

// Get data from device
router.post('/', (req, res) => {
    const coreID = req.body.coreid;
    const rxData = JSON.parse(req.body.data);
    const rxTime = req.body.published_at;

    console.log(req.body);
    res.status(200).send('ok');
    
    Customer.findOne({ "devices.deviceID": coreID }), function(err, customer) {
        if(err) {
            res.status(500).json({ success: false, msg: "Unknown error", error: err });
        }

        else if(!customer) {
            res.status(404).json({ success: false, msg: "Device not recognized."});
        }

        else {
            for (let i = 0; i < customer.devices.length; i++) {
                let device = customer.devices[i];
                if(device.deviceID == coreID) {
                    let newData = {
                        time: rxTime,
                        heartRate: rxData.heartRate,
                        spo2: rxData.spo2
                    };
                    device.data.push(newData);
                    break;
                }
            }

            customer.save(function (err) {
                if (err) {
                    res.status(500).json({ success: false, msg: "Unknown error", error: err});
                }
                else {
                    res.status(201).json({ success: true, msg: "Updated data"});
                }
            })
        }
    }
});

module.exports = router;