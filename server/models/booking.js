const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bookingSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    roomType : {
        type: String,
        required: true,
        enum:['A','B','C']
    },
    checkIn : {
        type: String,
        required: true
    },
    checkOut : {
        type: String,
        required: true
    },
    roomNumber : {
        type: Number,
        required: true
    },
    price : {
        type: Number,
        required: true
    },
    paymentMethod : {
        type: String,
        required: true
    },
    tip : {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = Booking = mongoose.model('booking', bookingSchema);