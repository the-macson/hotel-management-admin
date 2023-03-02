const Booking = require('../models/booking');
exports.updateBooking = (req, res) => {
    Booking.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        roomType: req.body.roomType,
        checkIn: req.body.checkIn,
        checkOut: req.body.checkOut,
        roomNumber: req.body.roomNumber,
        price: req.body.price,
        paymentMethod: req.body.paymentMethod,    
        tip: req.body.tip
    }, { new: true })
        .then(booking => res.json(booking))
        .catch(err => console.log(err));
}
