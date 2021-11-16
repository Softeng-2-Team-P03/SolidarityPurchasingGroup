
import 'bootstrap/dist/css/bootstrap.min.css';
import './OrderList.css';
import bookingApi from '../../api/booking-api';
import { Button, Form, Table } from "react-bootstrap";
import React, { useEffect, useState } from 'react';
//import FormCheckLabel from 'react-bootstrap/esm/FormCheckLabel';


function Order(props) {

    const [isHandedOut, setIsHandedOut] = useState("click to hand it out");

    return (
        <>
            <tr>
                <td>{props.order.BookingId}</td>
                <td>{props.order.UserId}</td>
                <td>{props.order.BookingStartDate}</td>
                <td>{props.order.State}</td>
                {props.order.PickupTime ? <td> {props.order.PickupTime} </td> : <td> {props.order.DeliveryTime} </td>}
                <td>{props.order.TotalPrice}</td>
                

                <td ><Form.Check
                    type="switch"
                    id="custom-switch"
                    label={isHandedOut}
                    onClick={() => { isHandedOut === "click to hand it out" ? setIsHandedOut("Handed out") : setIsHandedOut("click to hand it out") }}
                /></td>
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
            setOrders(orders.map(order => ({ ...order})));
            setSearchOrders(orders.map(order => ({ ...order})));
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
