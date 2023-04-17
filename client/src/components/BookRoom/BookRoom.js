// imported modules
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
const BookRoom = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [tip, setTip] = useState(0);
  const [totalBill, setTotalBill] = useState(0);
  const [payment, setPayment] = useState("");
  const [data, setData] = useState([]);
  const [availableRooms, setAvailableRooms] = useState(["A1","A2","B1","B2","B3","C1","C2","C3","C4","C5"]);
  const [check, setCheck] = useState(false);
  const [room, setRoom] = useState("");

  // get all bookings
  useEffect(() => {
    axios
      .get(`http://localhost:4000/all-bookings/`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // book available room
  const handleSubmit = (e) => {
    e.preventDefault();
    if(name == "" || email == "" || checkInDate == "" || checkInTime == "" || checkOutDate == "" || checkOutTime == "" || room == "" || payment == ""){
      alert("Please fill all the fields");
      return;
    }
    let checkEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(!email.match(checkEmail)){
      alert("Email is not valid");
      return;
    }
    let checkIn = Date.parse(`${checkInDate} ${checkInTime}:00`) / 1000;
    let checkOut = Date.parse(`${checkOutDate} ${checkOutTime}:00`) / 1000;
    let currentTime = Date.parse(new Date()) / 1000;
    if(checkIn > checkOut){
      alert("Check In date and time must be before Check Out date and time");
      return;
    }
    if(checkIn < currentTime){
      alert("Check In date and time must be after current date and time");
      return;
    }
    const bookRoom = {
      name: name,
      email: email,
      checkIn: Date.parse(`${checkInDate} ${checkInTime}:00`) / 1000,
      checkOut: Date.parse(`${checkOutDate} ${checkOutTime}:00`) / 1000,
      roomType: room.slice(0, 1),
      roomNumber: room.slice(1, 2),
      tip: tip,
      price: totalBill,
      paymentMethod: payment,
    };
    
    // alert(bookRoom);
    axios.post(`http://localhost:4000/add-booking/`, bookRoom);
    window.location = "/";
  };

  useEffect(() => {
    setAvailableRooms(["A1","A2","B1","B2","B3","C1","C2","C3","C4","C5","D1"]);
    if(checkInDate != "" && checkInTime != ""){
      let checkIn = Date.parse(`${checkInDate} ${checkInTime}:00`) / 1000;
      let currentTime = Date.parse(new Date()) / 1000;
      if(checkIn < currentTime){
        alert("Check In date and time must be after current date and time");
      }
    }
    if (checkInDate != "" && checkInTime != "" && checkOutDate != "" && checkOutTime != "") {
      let checkIn = Date.parse(`${checkInDate} ${checkInTime}:00`) / 1000;
      let checkOut = Date.parse(`${checkOutDate} ${checkOutTime}:00`) / 1000;
      
      if (checkIn > checkOut) {
        alert("Check In date and time must be before Check Out date and time");
      } else if (checkIn == checkOut) {
        alert("Check In date and time must be before Check Out date and time");
      } else {
        let timeDiff = Math.abs(checkOut - checkIn);
        let diffHours = Math.ceil(timeDiff / 3600);
        let Pending = ["A1","A2","B1","B2","B3","C1","C2","C3","C4","C5","D1"];
        let filteredData = data.filter((item) => {
          let itemCheckIn = item.checkIn;
          let itemCheckOut = item.checkOut;
          console.log(!(itemCheckIn > checkOut || itemCheckOut < checkIn));
          if (!((itemCheckIn > checkOut)|| (itemCheckOut < checkIn))) {
            let room = item.roomType.toUpperCase() + item.roomNumber;
            console.log(room);
            Pending = Pending.filter((element) => element != room);
            // Pendings = [...Pendings, ...Pending];
            // console.log(Pending);
          }
        });
        console.log(Pending);
        setAvailableRooms(Pending);
      }
    }
  }, [checkInDate, checkInTime, checkOutDate, checkOutTime]);
  useEffect(() => {
    if (room == "") {
      setCheck(false);
    }
    if (
      room !== "" &&
      checkInDate !== "" &&
      checkInTime !== "" &&
      checkOutDate !== "" &&
      checkOutTime !== ""
    ) {
      let roomPrice = 0;
      let roomT = room.slice(0, 1);
      if (roomT === "A") {
        roomPrice = 100;
      } else if (roomT === "B") {
        roomPrice = 80;
      } else if (roomT === "C") {
        roomPrice = 50;
      }
      let checkIn = Date.parse(`${checkInDate} ${checkInTime}:00`) / 1000;
      let checkOut = Date.parse(`${checkOutDate} ${checkOutTime}:00`) / 1000;
      let timeDiff = Math.abs(checkOut - checkIn);
      let diffHours = Math.ceil(timeDiff / 3600);
      let total = parseInt(roomPrice) * parseInt(diffHours);
      total = total + parseInt(tip);
      setTotalBill(total);
      setCheck(true);
    }
  }, [room, tip, checkInDate, checkInTime, checkOutDate, checkOutTime]);

  return (
    <div className="book-room-container">
      <div className="container-xl outer-box">
        <form className="row g-3 form-style-5">
          <div className="col-md-6 pb-1">
            <label htmlFor="inputName4" className="form-label">
              Name
            </label>
            <input
              onChange={(e) => {
                setName(e.target.value);
              }}
              required
              type="text"
              className="form-control"
              id="inputName4"
            />
          </div>
          <div className="col-md-6 pb-1">
            <label htmlFor="inputEmail4" className="form-label">
              Email
            </label>
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
              type="email"
              className="form-control"
              id="inputEmail4"
            />
          </div>
          <div className="col-md-6 pb-1">
            <label htmlFor="inputCheckInDate" className="form-label">
              Check In
            </label>
            <div className="row">
              <div className="col-6">
                <input
                  onChange={(e) => {
                    setCheckInDate(e.target.value);
                  }}
                  required
                  type="date"
                  className="form-control"
                  id="inputCheckInDate"
                  placeholder="1234 Main St"
                />
              </div>
              <div className="col-6">
                <select
                  required
                  onChange={(e) => {
                    setCheckInTime(e.target.value);
                  }}
                  name="time"
                  id="time"
                  className="form-select"
                >
                  <option defaultValue="">Choose...</option>
                  <option value="0">12:00 AM</option>
                  <option value="1">01:00 AM</option>
                  <option value="2">02:00 AM</option>
                  <option value="3">03:00 AM</option>
                  <option value="4">04:00 AM</option>
                  <option value="5">05:00 AM</option>
                  <option value="6">06:00 AM</option>
                  <option value="7">07:00 AM</option>
                  <option value="8">08:00 AM</option>
                  <option value="9">09:00 AM</option>
                  <option value="10">10:00 AM</option>
                  <option value="11">11:00 AM</option>
                  <option value="12">12:00 PM</option>
                  <option value="13">01:00 PM</option>
                  <option value="14">02:00 PM</option>
                  <option value="15">03:00 PM</option>
                  <option value="16">04:00 PM</option>
                  <option value="17">05:00 PM</option>
                  <option value="18">06:00 PM</option>
                  <option value="19">07:00 PM</option>
                  <option value="20">08:00 PM</option>
                  <option value="21">09:00 PM</option>
                  <option value="22">10:00 PM</option>
                  <option value="23">11:00 PM</option>
                </select>
              </div>
            </div>
          </div>
          <div className="col-md-6 pb-1">
            <label htmlFor="inputCheckOut" className="form-label">
              Check Out
            </label>
            <div className="row">
              <div className="col-6">
                <input
                  required
                  onChange={(e) => {
                    setCheckOutDate(e.target.value);
                  }}
                  type="date"
                  className="form-control"
                  id="inputCheckOut"
                  placeholder="1234 Main St"
                />
              </div>
              <div className="col-6">
                <select
                  onChange={(e) => {
                    setCheckOutTime(e.target.value);
                  }}
                  required
                  name="time"
                  id="time"
                  className="form-select"
                >
                  <option defaultValue="">Choose...</option>
                  <option value="0">12:00 AM</option>
                  <option value="1">01:00 AM</option>
                  <option value="2">02:00 AM</option>
                  <option value="3">03:00 AM</option>
                  <option value="4">04:00 AM</option>
                  <option value="5">05:00 AM</option>
                  <option value="6">06:00 AM</option>
                  <option value="7">07:00 AM</option>
                  <option value="8">08:00 AM</option>
                  <option value="9">09:00 AM</option>
                  <option value="10">10:00 AM</option>
                  <option value="11">11:00 AM</option>
                  <option value="12">12:00 PM</option>
                  <option value="13">01:00 PM</option>
                  <option value="14">02:00 PM</option>
                  <option value="15">03:00 PM</option>
                  <option value="16">04:00 PM</option>
                  <option value="17">05:00 PM</option>
                  <option value="18">06:00 PM</option>
                  <option value="19">07:00 PM</option>
                  <option value="20">08:00 PM</option>
                  <option value="21">09:00 PM</option>
                  <option value="22">10:00 PM</option>
                  <option value="23">11:00 PM</option>
                </select>
              </div>
            </div>
          </div>
          <div className="col-md-4 pb-1">
            <label htmlFor="inputTip" className="form-label">
              Tip for the staff
            </label>
            <input
              defaultValue={0}
              value={tip}
              required
              onChange={(e) => {
                if (e.target.value < 0) {
                  alert("Tip cannot be negative");
                  setTip(0);
                } else {
                  setTip(e.target.value);
                }
              }}
              type="number"
              className="form-control"
            />
          </div>
          <div className="col-md-4 pb-1">
            <label htmlFor="inputPaymetMethod" className="form-label">
              Paymet Method
            </label>
            <select
              onChange={(e) => {
                setPayment(e.target.value);
              }}
              required
              id="inputPaymetMethod"
              className="form-select"
            >
              <option defaultValue="">Choose...</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
            </select>
          </div>
          {availableRooms.length > 0 && (
            <div className="col-md-4">
              <label htmlFor="inputRoom" className="form-label">
                Available Room
              </label>
              <select
                onChange={(e) => {
                  setRoom(e.target.value);
                }}
                required
                id="inputRoom"
                className="form-select"
              >
                <option defaultValue="">Choose...</option>
                {availableRooms.map((room, index) => (
                  <option key={index} value={room}>
                    {room}
                  </option>
                ))}
              </select>
            </div>
          )}
          {availableRooms.length === 0 && (
            <div className="col-md-6">
              <label htmlFor="inputRoom" className="form-label">
                Available Room
              </label>
              <select disabled required id="inputRoom" className="form-select">
                <option defaultValue="">Choose...</option>
                <option value="">No Rooms Available</option>
              </select>
            </div>
          )}
          <div className="d-grid gap-2 col-3 mx-auto">
            <button onClick={handleSubmit} className="btn btn-primary center">
              Book Room
            </button>
          </div>
          {check && (
            <div className="alert alert-success" role="alert">
              Total Bill: {totalBill}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default BookRoom;


