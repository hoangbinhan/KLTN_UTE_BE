const Post = require('../models/employees.model');
const STATUS_TYPE = require('../common/constants').statusActive
const service = require('../common/function');
const counter = require('../models/numberID');

class TestServices {
    //
    static async getIDID(name) {
        console.log("aaaaaaaaaa");
        var cos = counter.findByIdAndUpdate({
            query : {ID: name},
            update : { $inc : {req:1}},
            new : true
        });
        return cos.req; 
    }
    //
    static async get(req, res) {
        try {
            const payload = await Post.find()
            res.json(payload)
        } catch (err) {
            res.json({ message: err })
        }
    }
    //
    static async getById(req, res) {
        try {
            const payload = await Post.findOne({ employeeID: req.params.id })
            res.json(payload)
        } catch (err) {
            res.json({ message: err });
        }
    }
    ////
    static async create(req, res) {
        const post = new Post({
            employeeID: service.generateID('employee'),
            // employeeID: this.getIDID('employeeID'),
            // employeeID: req.body.employeeID,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            age: req.body.age,
            dayBirth: req.body.dayBirth,
            address: req.body.address,
            gmail: req.body.gmail
        });
        try {
            const savePost = await post.save();
            res.json(savePost);
        } catch (err) {
            res.json({ message: err });
        }
    }
    //Edit
    static async update(req, res) {
        try {
            const { employeeID } = req.body
            const updateField = service.genUpdate(req.body,
                ['firstName', 'lastName', 'age', 'dayBirth', 'address', 'gmail', 'status'])
            await Post.findOneAndUpdate({ employeeID }, updateField, { new: true }, (err, result) => {
                if (result || !err) {
                    res.json(result)
                } else {
                    res.json(false)
                }
            })
        } catch (error) {
            res.status(500).send('error :' + error)
        }
    }
    //Delete
    static async delete(req, res) {
        try {
            const { employeeID } = req.body
            await Post.deleteOne({ employeeID }, async (err, result) => {
                if (result || !err) {
                    res.json(result)
                } else {
                    res.json(false)
                }
            })
        } catch (error) {
            res.send('error :' + error)
        }
    }
    //Delete Status
    static async deletestatus(req, res) {
        try {
            const employeeID = req.params.id
            const payload = await Post.findOneAndUpdate({ employeeID }, { status: 'INACTIVE' })
            if (!payload) {
                return res.json(false)
            }
            res.json(payload)
        } catch (error) {
            res.send('error :' + error)
        }
    }
}
module.exports = {
    TestServices
}