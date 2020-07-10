const dbConnection = require('../config/db')

// phone model
const Phone = function (phone) {
    this.make = phone.make;
    this.model = phone.model;
    this.storage = phone.storage;
    this.monthly_premium = phone.monthly_premium;
    this.yearly_premium = phone.yearly_premium;
    this.excess = phone.excess;
    // this.premium_start = new Date();
    // this.premium_end = new Date();
    this.last_modified = new Date();
};

// Create phone
Phone.create = (new_phone, result) => {
    dbConnection.query("INSERT INTO phones set ?", new_phone, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {

            Phone.findPhonePremiumById(res.insertId, (err, phone) => {
                if (err)
                    res.send(err);
                    result(null, phone);
            });

            console.log(res.insertId);
            
        }
    });
};

// Get all phones
Phone.findAll = result => {
    dbConnection.query("SELECT p.id, p.make, p.model, p.storage, \
      COALESCE(pp.monthly_premium, p.monthly_premium) as monthly_premium, \
      COALESCE(pp.yearly_premium, p.yearly_premium) as yearly_premium, \
      COALESCE(pp.excess, p.excess) as excess \
      FROM phones as p \
      LEFT JOIN (select* from premiums WHERE start_date < now() \
      order by start_date DESC LIMIT 1) as pp on pp.phone_id=p.id",
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
            }
            else {
                console.log('phones : ', res);
                result(null, res);
            }
        });
};

// find phone based on id
Phone.findById = (id, result) => {
    dbConnection.query("SELECT * FROM phones WHERE id = ? ", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else if (res.length == 0) {
            result(null, res);
        }
        else {
            result(null, res[0]);
        }
    });
};

// find phone based on id
Phone.findPhonePremiumById = (id, result) => {
    dbConnection.query("SELECT p.id, p.make, p.model, p.storage, \
    COALESCE(pp.monthly_premium, p.monthly_premium) as monthly_premium, \
    COALESCE(pp.yearly_premium, p.yearly_premium) as yearly_premium, \
    COALESCE(pp.excess, p.excess) as excess \
    FROM phones as p \
    LEFT JOIN (select* from premiums WHERE phone_id=? and  \
    start_date < now() order by start_date DESC LIMIT 1) as pp on pp.phone_id=p.id \
    WHERE p.id = ? ", [id, id], (err, res) => {
          console.log(res)
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else if (res.length == 0) {
            result(null, res);
        }
        else {
            result(null, res[0]);
        }
    });
};

// Update the phone
Phone.update = (id, phone, result) => {
    dbConnection.query("UPDATE phones SET make=?,model=?,storage=?,monthly_premium=?,yearly_premium=?,excess=? \
    WHERE id = ?", [
        phone.make,
        phone.model,
        phone.storage,
        phone.monthly_premium,
        phone.yearly_premium,
        phone.excess,
        id], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
            } else {
                result(null, res);
            }
        });
};

// Update the phone premium with start date
Phone.updatePremium = (phoneId, premium, result) => {
    dbConnection.query("INSERT INTO premiums (phone_id, monthly_premium, yearly_premium, excess, start_date) \
    VALUES \
        (?, ?, ?, ?, ?)", [
        phoneId,
        premium.monthly_premium,
        premium.yearly_premium,
        premium.excess,
        premium.start_date
    ], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        } else {
            result(null, res);
        }
    });
};

// Delete the phone
Phone.delete = (id, result) => {

    dbConnection.query("DELETE FROM premiums WHERE phone_id = ?", [id], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            dbConnection.query("DELETE FROM phones WHERE id = ?", [id], (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(null, err);
                }
                else {
                    result(null, res);
                }
            });
        }
    });


};

module.exports = Phone;