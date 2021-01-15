const mongoose = require('mongoose')

const managerSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },

    picture: {
        type: String,
        unique: true
    },
})

const Manager = mongoose.model('Manager', managerSchema);

module.exports = Manager;