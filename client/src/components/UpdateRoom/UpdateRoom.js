import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DateView from "../Home/DateView";
import { confirm } from "react-confirm-box";
import { Table } from "react-bootstrap";
const UpdateRoom = () => {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const { id } = useParams();
  console.log(data);
  const [room, setRoom] = useState("");
  const [name, setName] = useState(data.name);
  const [email, setEmail] = useState(data.email);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [tip, setTip] = useState(0);
  const [totalBill, setTotalBill] = useState(0);
  const [payment, setPayment] = useState(0);
  useEffect(() => {
    axios
    .get(`http://localhost:3000/booking/${id}`)
      .then((res) => {
        setData(res.data);
        setTip(res.data.tip);
        setPayment(res.data.paymentMethod);
        setName(res.data.name);
        setEmail(res.data.email);
        setRoom(res.data.roomType.toUpperCase() + res.data.roomNumber);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  console.log(tip);
  useEffect(() => {
    if(tip == "0"){
      setTip(data.tip);
    }
    console.log("tip is " + tip);
  },[data.tip]);

  const [availableRooms, setAvailableRooms] = useState(["A1","A2","B1","B2","B3","C1","C2","C3","C4","C5"]);
  // function for update room
  const handleSubmit = async (e) => {
    if(name == "" || email == "" || checkInDate == "" || checkInTime == "" || checkOutDate == "" || checkOutTime == "" || room == "" || payment == "") {
      alert("Please fill all the fields");
      return;
    }
    e.preventDefault();
    const updateRoom = {
      name : name,
      email : email,
      checkIn : Date.parse(`${checkInDate} ${checkInTime}:00`) / 1000,
      checkOut : Date.parse(`${checkOutDate} ${checkOutTime}:00`) / 1000,
      roomType : room.slice(0,1),
      roomNumber : room.slice(1,2),
      tip : tip,
      price : totalBill,
      paymentMethod : payment
    }
   const result = await confirm(`Are you sure you want to update this booking? The total bill is ${totalBill}`, {
     buttons: [
       {  
         label: 'Yes',
         onClick: () => {
            return true;
          }
        },
        {
          label: 'No',
          onClick: () => {
            return false;
          }
        }
      ]
    }
   );
    if(result == false) {
      return;
    }
    axios.put(`http://localhost:3000/update-booking/${id}`, updateRoom);
    window.location = '/';
  };
  const [check,setCheck] = useState(false);
  
  
  useEffect(() => {
    axios
    .get("http://localhost:3000/all-bookings/")
    .then((res) => {
      setAllData(res.data);
    })
    .catch((err) => {
        console.log(err);
      });
    }, []);
    
    // check available rooms
    useEffect(() => {
      setAvailableRooms(["A1","A2","B1","B2","B3","C1","C2","C3","C4","C5"]);
    if (checkInDate != "" && checkInTime != "" && checkOutDate != "" && checkOutTime != "") {
        let checkIn = Date.parse(`${checkInDate} ${checkInTime}:00`) / 1000;
        let checkOut = Date.parse(`${checkOutDate} ${checkOutTime}:00`) / 1000;
        console.log(checkIn, checkOut);
        if (checkIn > checkOut) {
          alert("Check In date and time must be before Check Out date and time");
        } else if (checkIn == checkOut) {
          alert("Check In date and time must be before Check Out date and time");
        } else {
          let timeDiff = Math.abs(checkOut - checkIn);
          let diffHours = Math.ceil(timeDiff / 3600);
          console.log(diffHours);
          let filteredData = allData.filter((item) => {
            let itemCheckIn = item.checkIn;
            let itemCheckOut = item.checkOut;
            if (itemCheckOut > checkIn || checkOut < itemCheckIn) {
              let room = item.roomType.toUpperCase() + item.roomNumber;
              const Pending = availableRooms.filter((element) =>{
                if(data.checkIn >= itemCheckIn && data.checkOut <= itemCheckOut && data.roomType == item.roomType && data.roomNumber == item.roomNumber) {
                  return element;
                }
                return element !== room;
              });
              setAvailableRooms(Pending);
            }
          });
        console.log(availableRooms);
        console.log(filteredData);
      }
    }
  }, [checkInDate, checkInTime, checkOutDate, checkOutTime]);

  console.log(room);
  // calculate total bill
  useEffect(() => {
    console.log(room);
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
    <div className="container">
      <div className="row pb-2 fs-5">
        <h3>Current Details</h3>
          <Table bordered hover responsive className="my-3">
            <tr>
              <th>Name</th>
              <td>{data.name}</td>
              <th>Email</th>
              <td>{data.email}</td>
            </tr>
            <tr>
              <th>Check In</th>
              <td>
                <DateView newdate={data.checkIn} />
              </td>
              <th>Check Out</th>
              <td>
                <DateView newdate={data.checkOut} />
              </td>
            </tr>
            <tr>
              <th>Room Number</th>
              <td>{data.roomType + data.roomNumber}</td>
              <th>Total Bill</th>
              <td>{data.price}</td>
            </tr>
            <tr>
              <th>Tip</th>
              <td>{data.tip}</td>
              <th>Payment Method</th>
              <td>{data.paymentMethod}</td>
            </tr>
          </Table>
      </div>
      <form className="row g-3">
        <h3>Update Details</h3>
        <div className="col-md-6 pb-1">
          <label htmlFor="inputName4" className="form-label">
            Name
          </label>
          <input
            defaultValue={data.name}
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
            defaultValue={data.email}
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
                <option selected="" value="">
                  Choose...
                </option>
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
                <option selected="" value="">
                  Choose...
                </option>
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
            defaultValue={data.tip}
            required
            onChange={(e) => {
              setTip(e.target.value);
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
            <option selected="" value="">
              Choose...
            </option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
          </select>
        </div>
        {availableRooms.length > 0 && (
          <div className="col-md-4 pb-1">
            <label htmlFor="inputRoom" className="form-label">
              Room
            </label>
            <select
              onChange={(e) => {
                setRoom(e.target.value);
              }}
              required
              id="inputRoom"
              className="form-select"
            >
              <option selected="" value="">
                Choose...
              </option>
              {availableRooms.map((room, index) => (
                <option key={index} value={room}>
                  {room}
                </option>
              ))}
            </select>
          </div>
        )}
        {availableRooms.length === 0 && (
          <div className="col-md-6 pb-1">
            <label htmlFor="inputRoom" className="form-label">
              Room
            </label>
            <select disabled required id="inputRoom" className="form-select">
              <option selected="" value="">
                Choose...
              </option>
              <option value="">No Rooms Available</option>
            </select>
          </div>
        )}
        <div className="d-grid gap-2 col-3 mx-auto pb-3">
          <button onClick={handleSubmit} className="btn btn-primary center">
            Update Details
          </button>
        </div>
        {check && (
          <div className="alert alert-success" role="alert">
            Total Bill: {totalBill}
          </div>
        )}
      </form>
    </div>
  );
};

export default UpdateRoom;