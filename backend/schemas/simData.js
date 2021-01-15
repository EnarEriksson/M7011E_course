const mongoose = require('mongoose');

const simSchema = mongoose.Schema({
    price: {
        type: Number,
        required: true
    },

    modeledPrice: {
        type: Number,
        required: true
    },

    wind: {
        type: Number,
        required: true
    },

    plantBuffer: {
        type: Number
    },

    plantRatio: {
        type: Number
    },

    plantOnline: {
        type: Boolean
    },

    plantProduction: {
        type: Number
    },

    plantConsumption: {
        type: Number
    }
})

const SimData = mongoose.model('SimData', simSchema);

module.exports = SimData;