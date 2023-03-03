
# Hotel Room Management Admin App

### Description
Created a complete admin-facing solution for the management of rooms in a hotel with all the functionality that is given.

Some of them are

- Admin Page
    - Admin can filter the booking list by their room type and room number.
    - Admin can filter the booking list by their check-in and check-out time.
- Create Page
    - A page where the admin can book the room, which takes the user’s email, room number, start time, and end time, and books the room accordingly.
    - The price of the booking should update as soon as the user updates any one of the room number, start time, or end time.
    - No two bookings should have overlapping start and end time for the same room.
    - No one can book the room if the check-in time is before the current time (meaning in the past).
    - Every time check-in time is always less than check-out time.
    - Also, save the tip and payment method.
- Update Page
    - Allow the admin to edit any variables like user email, room number, start time, end time and correspondingly take confirmation on the updated price.
- Delete Page
    - Allow the admin to cancel any future booking with the following conditions:
    - If the booking start time is more than 48 hours, show a complete refund on the UI.
    - If the booking start time is within 24 to 48 hours, show a 50% refund on the UI.
    - Else no refund (but admin can still cancel).





## Run Locally
### Pre Requisite 

- Node js with updated version 

- MongoDb or you can use atles MongoDb

- npm for installing dependencies

Clone the project

```bash
  git clone https://github.com/the-macson/hotel-management-admin
```

Go to the project directory

```bash
  cd hotel-management-admin
```

First setup Backend

Go to the server directory

```bash
  cd server
```

Install dependencies for server

```bash
  npm install
```

Start your MongoDb or configure atles MongoDb to editing  .env file

Start the server

```bash
   npm start
```

Go back to the Project directory

```bash
    cd ..
```

Go to the client directory

```bash
    cd client
```

Install dependencies for client

```bash
    npm install
```

start the client side. it run in Port 3000

```bash
    npm start
```

Open the link 
```bash
    http://localhost:3000
```

## Approach 

### Finding the which room are available in given time slot.

Finding the rooms that are available in the given time slot so that one room is not booked more than once.

```javascript
    useEffect(() => {
    setAvailableRooms(["A1","A2","B1","B2","B3","C1","C2","C3","C4","C5"]);
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
        let filteredData = data.filter((item) => {
          let itemCheckIn = item.checkIn;
          let itemCheckOut = item.checkOut;
          if (!(itemCheckIn <= checkIn && itemCheckOut <= checkIn) && !(itemCheckIn >= checkOut && itemCheckOut >= checkOut)) {
            let room = item.roomType.toUpperCase() + item.roomNumber;
            const Pending = availableRooms.filter((element) => element != room);
            setAvailableRooms(Pending);
          }
        });
      }
    }
  }, [checkInDate, checkInTime, checkOutDate, checkOutTime]);
```

### Filter the room by their room type and room number

```javascript
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
```

### Filter the room by their check in and check out time

```javascript
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
```

## Added all cases that are possible for completion of functionality 

## Screenshots

![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)

