
import 'bootstrap/dist/css/bootstrap.min.css';
import './OrderList.css';
import bookingApi from '../../api/booking-api';
import { Button, Form, Table } from "react-bootstrap";
import React, { useEffect, useState } from 'react';
//import FormCheckLabel from 'react-bootstrap/esm/FormCheckLabel';


function Order(props) {

    const [isHandedOut, setIsHandedOut] = useState("click to hand it out");
    const [timeEnabled, setTimeEnabled] = useState(false);
    const [statusUpdated, setStatusUpdated] = useState();
    const [handedOut, setHandedOut] = useState(false);

    const checkDate = () => {
        let time = new Date(localStorage.getItem('virtualDate'));
        const day = time.getDay();
        const hour = time.getHours();
        if (day >= 3 && hour >= 8 && hour <= 19 && day <= 5)
            setTimeEnabled(true);
        else
            setTimeEnabled(false);
    }

    const updateBookingState = (bookingId) => {
        setStatusUpdated("Updating order...");
        let newState;
        switch (handedOut) { 
            case false : 
                newState = 2;
                setHandedOut(true);
            break;
            case true : 
                newState = 0;
                setHandedOut(false);
            break;
            default :newState=0;
        }
        bookingApi.updateBookingState(bookingId, newState).then(() => {
            setStatusUpdated("Order status updated");
        }
        ).catch(err => setStatusUpdated("Can't update the Order status"));
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
                <td>{props.order.UserId}</td>
                <td>{props.order.BookingStartDate}</td>
                <td>{props.order.State}</td>
                {props.order.PickupTime ? <td> {props.order.PickupTime} </td> : <td> {props.order.DeliveryTime} </td>}
                <td>{props.order.TotalPrice}</td>

                {timeEnabled ? <td ><Form.Check
                    type="switch"
                    id="custom-switch"
                    label={isHandedOut}
                    onClick={(ev) => updateBookingState(props.order.BookingId)}
                /> <div style={statusUpdated==="Updating order..." ? {color : "#FFA900" }:{color : "#00B74A" }}>{statusUpdated}</div>
                </td> : <td ><Form.Check
                    type="switch"
                    id="custom-switch"
                    label={isHandedOut}
                    disabled
                /> </td>}
            </tr>
        </>
    );
}



function OrderList(props) {

    const [orders, setOrders] = useState([]);
    const [searchOrders, setSearchOrders] = useState([]);

    const [loadingProducts, setLoadingProducts] = useState(true);
    const [errorLoading, setErrorLoading] = useState(''); //Error in loading orders



    useEffect(() => {
        bookingApi.getOrders().then((orders) => {
            setOrders(orders.map(order => ({ ...order })));
            setSearchOrders(orders.map(order => ({ ...order })));
            setLoadingProducts(false);
        }).catch(err => {
            setErrorLoading('Error during the loading of the orders')
            console.error(err);
        });
    }, [])

    function changeSearchText(text) {
        let c = []
        orders.forEach(order => {
            console.log(order.UserId);
            if (order.UserId == text.toLowerCase() || text === "") c.push(order);
        })

        setSearchOrders(c);
    }

    return (
        <>
            <Form.Control type="text" className="searchB" placeholder="Search order" onChange={x => changeSearchText(x.target.value)} />
            <Table responsive striped bordered hover className="ordersTable">
                <thead>
                    <tr>
                        <th>OrderID</th>
                        <th>UserId</th>
                        <th>Booking Issue Date </th>
                        <th>State</th>
                        <th>Scheduled Date</th>
                        <th>Total price</th>
                        <th>Handed out</th>

                        <th width="13%"></th>
                    </tr>
                </thead>
                <tbody> {
                    searchOrders.map((or) =>
                        <Order key={or.BookingID}
                            order={or}
                        />)
                }
                </tbody>
            </Table>
        </>
    );
}

export default OrderList;
