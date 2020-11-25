const Employee = require('../models/employees.model');
const STATUS_TYPE = require('../common/constants').statusActive
const service = require('../common/function');


class EmployeeServices {
    static async get(req, res) {
        // BaseAPI.authorizationAPI(req, res, async () => {
            try {
                const payload = await Employee.find()
                res.json(payload)
            } catch (err) {
                res.json({ message: err })
            }
        // });
    }
    //
    static async getById(req, res) {
        // BaseAPI.authorizationAPI(req, res, async () => {
            try {
                const payload = await Employee.findOne({ employeeID: req.params.id })
                res.json(payload)
            } catch (err) {
                res.json({ message: err });
            }
        // });
    }
    ////
    static async create(req, res) {
        // BaseAPI.authorizationAPI(req, res, async () => {
            const post = new Employee({
                employeeID: service.generateID('employee'),
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
        // });
    }
    //Edit
    static async update(req, res) {
        // BaseAPI.authorizationAPI(req, res, async () => {
            try {
                const { employeeID } = req.body
                const updateField = service.genUpdate(req.body,
                    ['firstName', 'lastName', 'age', 'dayBirth', 'address', 'gmail', 'status'])
                await Employee.findOneAndUpdate({ employeeID }, updateField, { new: true }, (err, result) => {
                    if (result || !err) {
                        res.json(result)
                    } else {
                        res.json(false)
                    }
                })
            } catch (error) {
                res.status(500).send('error :' + error)
            }
        // });
    }
    //Delete
    static async delete(req, res) {
        // BaseAPI.authorizationAPI(req, res, async () => {
            try {
                const { employeeID } = req.body
                await Employee.deleteOne({ employeeID }, async (err, result) => {
                    if (result || !err) {
                        res.json(result)
                    } else {
                        res.json(false)
                    }
                })
            } catch (error) {
                res.send('error :' + error)
            }
        // });
    }
    //Delete Status
    static async deletestatus(req, res) {
        // BaseAPI.authorizationAPI(req, res, async () => {
            try {
                const employeeID = req.params.id
                const payload = await Employee.findOneAndUpdate({ employeeID }, { status: 'INACTIVE' })
                if (!payload) {
                    return res.json(false)
                }
                res.json(payload)
            } catch (error) {
                res.send('error :' + error)
            }
        // });
    }
}
module.exports = EmployeeServices
