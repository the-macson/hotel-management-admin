import React from 'react'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import DateView from './DateView';
import { Link } from 'react-router-dom';
import { confirm } from 'react-confirm-box';

const Dashbored = () => {
    const [roomType, setRoomType] = useState('');
    const [roomNumber, setRoomNumber] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [data, setData] = useState([]);
    const [filterData, setFilterData] = useState([]);

    // get all bookings
    useEffect(() => {
        axios.get('http://localhost:3000/all-bookings/')
            .then(res => {
                setData(res.data);
                setFilterData(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }, [])

    // filter by room number and room type
    useEffect(() => {
        if (roomType !== '' && roomNumber !== '') {
            setFilterData(data.filter(item => item.roomType === roomType && item.roomNumber == roomNumber));
        } else if (roomType !== '') {
            setFilterData(data.filter(item => item.roomType == roomType));
        } else if (roomNumber !== '') {
            setFilterData(data.filter(item => item.roomNumber == roomNumber));
        } else {
            setFilterData(data);
        }
    }, [roomType, roomNumber])

    // filter by check in and check out
    useEffect(() => {
        if (checkIn !== '' && checkOut !== '') {
            let checkInDate = Date.parse(checkIn)/1000;
            let checkOutDate = Date.parse(checkOut)/1000 + 86400;
            setFilterData(data.filter(item => item.checkIn >= checkInDate && item.checkOut <= checkOutDate));
        } else if (checkIn !== '') {
            let checkInDate = Date.parse(checkIn)/1000;
            setFilterData(data.filter(item => item.checkIn >= checkInDate));
        } else if (checkOut !== '') {
            let checkOutDate = Date.parse(checkOut);
            setFilterData(data.filter(item => item.checkOut <= checkOutDate));
        } else {
            setFilterData(data);
        }
    }, [checkIn, checkOut])

    // delete booking
    const handleDelete = async(id) => {
        let userData = data.filter(item => item._id === id);
        let bookingTime = userData[0].createdAt;
        let currentTime = Date.now();
        let timeDiff = Math.abs(Date.parse(bookingTime)/1000 - (currentTime)/1000);
        let diffHours = Math.ceil(timeDiff / 3600);
        let refund = 0;
        if(diffHours > 48){
            refund = 100;
        }else if(diffHours > 24){
            refund = 50;
        }
        const result = await confirm(`Are you sure you want to cancel this booking? You will get ${refund}% refund.`, {
            title: 'Confirm',
            confirmLabel: 'Yes',
            cancelLabel: 'No'
        });
        if(!result){
            return false;
        }
        console.log(id);
        axios.delete(`http://localhost:3000/delete-booking/${id}`)
            .then(res => {
                console.log(res);
                setData(data.filter(item => item._id !== id));
                setFilterData(filterData.filter(item => item._id !== id));
            })
            .catch(err => {
                console.log(err);
        })
    }

    return (
        <div>
            <div className='container'>
                {/* button to reset filter */}
                <div className='row mb-3'>
                    <div className='col-md-12'>
                        <button onClick={() => { setFilterData(data) }} className='btn btn-primary btn-sm'>Reset Filter</button>
                    </div>
                </div>

                {/* filter by room number and room type */}
                <div className='row mb-3'>
                    <div className='col-md-3'>
                        <div className='form-group'>
                            <label htmlFor="roomType">Room Type</label>
                            <select onChange={(e)=>{setRoomType(e.target.value)}} className="form-control" id="roomType">
                                <option value="" selected disabled>Choose here</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                            </select>
                        </div>
                    </div>
                    <div className='col-md-3'>
                        <div className='form-group'>
                            <label htmlFor="roomNumber">Room Number</label>
                            <select onChange={(e)=>{setRoomNumber(e.target.value)}} className="form-control" id="roomNumber">
                                <option value="" selected disabled>Choose here</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        </div>
                    </div>
                    {/* filter by check in and check out */}
                    <div className='col-md-3'>
                        <div className='form-group'>
                            <label htmlFor="checkIn">Check In</label>
                            <input onChange={(e)=>{setCheckIn(e.target.value)}} type="date" className="form-control" id="checkIn" />
                        </div>
                    </div>
                    <div className='col-md-3'>
                        <div className='form-group'>
                            <label htmlFor="checkOut">Check Out</label>
                            <input onChange={(e)=>{setCheckOut(e.target.value)}} type="date" className="form-control" id="checkOut" />
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <Table bordered hover responsive className='mb-0' >
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Room Type</th>
                                <th>Room Number</th>
                                <th>Email</th>
                                <th>Check In</th>
                                <th>Check Out</th>
                                <th>Booking Cancel</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filterData.map((item) => {
                                return (
                                  <tr key={item._id}>
                                    <td>
                                      <Link
                                        className="text-decoration-none"
                                        to={`/${item._id}`}
                                      >
                                        {item.name}
                                      </Link>
                                    </td>
                                    <td>{item.roomType}</td>
                                    <td>{item.roomNumber}</td>
                                    <td>{item.email}</td>
                                    <td>
                                      {<DateView newdate={item.checkIn} />}
                                    </td>
                                    <td>
                                      {<DateView newdate={item.checkOut} />}
                                    </td>
                                    <td>
                                      <button
                                        onClick={() => {
                                          handleDelete(item._id);
                                        }}
                                        className="btn btn-danger btn-sm"
                                      >
                                        Cancel
                                      </button>
                                    </td>
                                  </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </div>
            </div>                       
        </div>
    )
}

export default Dashbored;