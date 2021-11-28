

import 'bootstrap/dist/css/bootstrap.min.css';
import './OrderList.css';
import bookingApi from '../../api/booking-api';
import { Button, Form, Table } from "react-bootstrap";
import React, { useEffect, useState } from 'react';

function Order(props) {

    const [isHandedOut, setIsHandedOut] = useState("click to hand it out");
    const [timeEnabled, setTimeEnabled] = useState(false);

    const checkDate = () => {
        let time = new Date(localStorage.getItem('virtualDate'));
        const day = time.getDay();
        const hour = time.getHours();
        console.log("day "+day +" hour "+hour)
        if (day >= 3 && hour >= 8 && hour<=19 && day<= 5 ) 
            setTimeEnabled(true);
        else
            setTimeEnabled(false);
    }

    useEffect(() => {
        const id = setInterval(checkDate, 1000);
        checkDate();
        return () => clearInterval(id);
    }, [])
    
    return (
        <>
            <tr>
                <td>{props.order.BookingId}</td>
                <td>{props.order.UserId}  </td>
                <td>{props.order.UserName} {props.order.UserSurname}</td>
                <td>{props.order.BookingStartDate}</td>
                <td>{props.order.State}</td>
                {props.order.PickupTime ? <td> {props.order.PickupTime} </td> : <td> {props.order.DeliveryTime} </td>}
                <td>{props.order.TotalPrice}</td>
                
                {console.log(timeEnabled)}
                {timeEnabled ? <td ><Form.Check
                    type="switch"
                    id="custom-switch"
                    label={isHandedOut}
                    onClick={() => { isHandedOut === "click to hand it out" ? setIsHandedOut("Handed out") : setIsHandedOut("click to hand it out") }}
                /></td> : <td ><Form.Check
                type="switch"
                id="custom-switch"
                label={isHandedOut}
                disabled
            /></td>}
            </tr>
        </>
    );
}

export default Order;