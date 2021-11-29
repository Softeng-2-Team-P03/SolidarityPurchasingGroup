
import 'bootstrap/dist/css/bootstrap.min.css';
import './OrderList.css';
import bookingApi from '../../api/booking-api';
import { Form, Table,Button,Spinner } from "react-bootstrap";
import React, { useEffect, useState } from 'react';

function Order(props) {

    const [isHandedOut, setIsHandedOut] = useState("click to hand it out");
    const [timeEnabled, setTimeEnabled] = useState(false);

    const checkDate = () => {
        let time = new Date(localStorage.getItem('virtualDate'));
        const day = time.getDay();
        const hour = time.getHours();
        if (day >= 3 && hour >= 8 && hour <= 19 && day <= 5)
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
                <td>{props.order.UserId}</td>
                <td>{props.order.BookingStartDate}</td>
                <td>{props.order.State}</td>
                {props.order.PickupTime ? <td> {props.order.PickupTime} </td> : <td> {props.order.DeliveryTime} </td>}
                <td>{props.order.TotalPrice}</td>
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



function OrderList(props) {

    const [orders, setOrders] = useState([]);
    const [searchOrders, setSearchOrders] = useState([]);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        bookingApi.getOrders().then((orders) => {
            setPendingOrders(orders.flatMap(order => order.State===1 ? {...order} : []));
            console.log(pendingOrders);
        }).catch(err => {
            console.error(err);
        });
    }, [])

    const [loadingOrders, setLoadingOrders] = useState(true);
    const [errorLoading, setErrorLoading] = useState(''); //Error in loading orders



    useEffect(() => {
        bookingApi.getOrders().then((orders) => {
            setOrders(orders.map(order => ({ ...order })));
            setSearchOrders(orders.map(order => ({ ...order })));
            setLoadingOrders(false);
            setErrorLoading('');
        }).catch(err => {
            console.error(err);
        });
    }, [])

    function changeSearchText(text) {
        let c = []
        orders.forEach(order => {
            console.log(order.UserId);
            if (order.UserId == text.toLowerCase() || text === "") c.push(order);
        })
        
        if (c.length==0)
        {
            c = orders.filter(function (order) { return order.UserName.toLowerCase().includes(text.toLowerCase()); });
        }
        setSearchOrders(c);
    }

    return (
        <>
            <Form.Control type="text" className="searchB" placeholder="Search order" onChange={x => changeSearchText(x.target.value)} />
            <div  align="center">{isPending ?<Button className='pending' onClick={() =>{setIsPending(false)}}>Show All Orders</Button> :<Button className='pending' onClick={() =>{setIsPending(true)}}>Show Only Pending Orders</Button>}</div>
            {loadingOrders ? <h1 style={{ textAlign: "center" }}>Loading orders... <Spinner animation="border" /></h1>
                :
                <Table data-testid="tableOrders" responsive striped bordered hover className="ordersTable">
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
                    {isPending ? 
                <tbody> {
                    pendingOrders.map((or) =>
                        <Order key={or.BookingID}
                            order={or}
                        />)
                }
                </tbody>
                : <tbody> {
                    searchOrders.map((or) =>
                        <Order key={or.BookingID}
                            order={or}
                        />)
                }
                </tbody>}
                </Table>
            }
            <h2 style={{ textAlign: "center", color: "red" }}>{errorLoading}</h2>
        </>
    );
}

export {OrderList, Order};
