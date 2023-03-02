const Booking = require('../models/booking');
exports.allBookings = (req, res) => {
    Booking.find()
        .then(bookings => res.json(bookings))
        .catch(err => console.log(err));
}
exports.booking = (req, res) => {
    Booking.findById(req.params.id)
        .then(booking => res.json(booking))
        .catch(err => console.log(err));
}
