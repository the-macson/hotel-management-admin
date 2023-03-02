const Booking = require('../models/booking');
exports.deleteBooking = (req, res) => {
    Booking.findByIdAndDelete(req.params.id)
        .then(booking => res.json(booking))
        .catch(err => console.log(err));
}