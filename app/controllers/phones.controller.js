const Phone = require('../models/phones.model');

//get all phones
exports.findAll = (req, res) => {
    Phone.findAll((err, phone) => {
        if (err)
        res.status(500).send(err);
        res.send(phone);
    });
};

// create a phone
exports.create = (req, res) => {
    //handles null error
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return res.status(400).send({message: 'Please provide all required fields' });
    }

    let { make, model, storage, monthly_premium, yearly_premium, excess, start_date } = req.body

    //checking if any of the input data is missing
    if (!make || !model || !storage || !monthly_premium || !excess)
        return res.status(400).send({ message: 'Please provide make, model, storage, monthly premium and excess values' });

    // validating the monthly premium for 2 decimal numbers    
    if (monthly_premium) {
        let regexp = /^\d+(\.\d{1,2})?$/
        if (!regexp.test(monthly_premium)) {
            return res.status(400).send({ message: 'Monthly premium should be two decimal numbers' });
        }
    }
    //  calculating the yearly premium based on the monthly premium if it is missing from the input   
    if (!yearly_premium && monthly_premium) {
        yearly_premium = monthly_premium * 11
    }
    const newPhone = new Phone({ make, model, storage, monthly_premium, yearly_premium, excess });
    //create the phone
    Phone.create(newPhone, (err, phone) => {
        if (err)
            return res.status(500).send(err);

            if (start_date && monthly_premium) {
                const premium = { monthly_premium, yearly_premium, excess, start_date }
                //update premium
                Phone.updatePremium(phone.id, premium, (err, premium) => {
                    if (err)
                        return res.status(500).send(err);
                });
            }

        res.json({
            message: "Phone added successfully!",
            data: phone
        });
    });

};

//Get a phone based on id
exports.findById = (req, res) => {
    Phone.findPhonePremiumById(req.params.id, (err, phone) => {
        if (err)
        res.status(500).send(err);
        if (res.length == 0) {
            res.status(404).send({ message: 'Phone not found' });
        }
        res.json(phone);
    });
};

//Updates the phone
exports.update = (req, res) => {
    //handles null error
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({ message: 'Please provide all required fields' });
    }

    let { id, make, model, storage, monthly_premium, yearly_premium, excess, start_date } = req.body

    if (!make && !model && !storage && !monthly_premium && !excess)
        return res.status(400).send({message: 'Please provide at least one field to update' });

    if (monthly_premium) {
        let regexp = /^\d+(\.\d{1,2})?$/
        if (!regexp.test(monthly_premium)) {
            return res.status(400).send({ message: 'Monthly premium should be two decimal numbers' });
        }
    }
    //  calculating the yearly premium based on the monthly premium if it is missing from the input   
    if (!yearly_premium && monthly_premium) {
        yearly_premium = monthly_premium * 11
    }

    // find the phone before the update
    Phone.findById(id, (err, phoneResp) => {
        console.log(phoneResp)
        if (err)
            res.send(err);
        if (phoneResp && phoneResp.length === 0) {
            return res.status(404).json({ message: 'phone is not found' });
        }
        phone = JSON.parse(JSON.stringify(phoneResp));
        phone.make = make ? make : phone.make;
        phone.model = model ? model : phone.model;
        phone.storage = storage ? storage : phone.storage;

        if (start_date && monthly_premium) {
            const premium = { monthly_premium, yearly_premium, excess, start_date }
            //update premium
            Phone.updatePremium(id, premium, (err, premium) => {
                if (err)
                    return res.status(500).send(err);
            });
        } else { // no start date so update, default premium
            phone.monthly_premium = monthly_premium ? monthly_premium : phone.monthly_premium;
            phone.yearly_premium = yearly_premium ? yearly_premium : phone.yearly_premium;
            phone.excess = excess ? excess : phone.excess;
        }

        //update the phone
        Phone.update(id, phone, (err, phone) => {
            if (err)
                return res.status(500).send(err);
            res.json({ message: 'Phone successfully updated'});
        });
    });
};

// delete the phone
exports.delete = (req, res) => {
    //find the phone before delete
    Phone.findById(req.params.id, (err, phone) => {
        if (err)
            return res.status(500).send(err);
        if (phone && phone.length === 0) {
            return res.status(404).json({ message: 'phone is not found' });

        }
    });
    Phone.delete(req.params.id, (err, phone) => {
        if (err)
            return res.status(500).send(err);
        res.json({ message: 'Phone successfully deleted' });
    });
};