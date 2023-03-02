import React from 'react'

const DateView = (props) => {
    var myDate = new Date(props.newdate * 1000);
    var day = myDate.getDate();
    var month = myDate.toLocaleString('default', { month: 'short' });
    var year = myDate.getFullYear();
    var hours = myDate.getHours();
    return (
        <>
            {day} {month} {year} {hours}:00
        </>
    )
}

export default DateView