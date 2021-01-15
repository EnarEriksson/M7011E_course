const mongoose = require('mongoose');

const homeSchema = mongoose.Schema({
    prosumer : {
        type: Boolean,
        required: true
    },

    batteryRatio: {
        type: Number,
    },

    consumeRatio: {
        type: Number,
    },

    buffer: {
        type: Number,
    },
    
    ownerEmail: {
        type: String,
        required: true,
        unique: true
    },

})

const Home = mongoose.model('Home', homeSchema);

module.exports = Home;