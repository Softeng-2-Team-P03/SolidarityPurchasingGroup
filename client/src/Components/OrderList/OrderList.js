
import 'bootstrap/dist/css/bootstrap.min.css';
import './OrderList.css';
import bookingApi from '../../api/booking-api';
import userApi from '../../api/user-api'
import { Button, Form, Table, Modal, Row, Col } from "react-bootstrap";

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
            case false:
                newState = 3;
                setHandedOut(true);
                break;
            case true:
                newState = 2;
                setHandedOut(false);
                break;
            default: newState = 0;
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
                <td>{props.order.UserName} {props.order.UserSurname}</td>
                <td>{props.order.BookingStartDate}</td>
                <td>{props.order.State}</td>
                {props.order.PickupTime ? <td> {props.order.PickupTime} </td> : <td> {props.order.DeliveryTime} </td>}
                <td>{props.order.TotalPrice}</td>

                {timeEnabled ? <td ><Form.Check
                    type="switch"
                    id="custom-switch"
                    label={isHandedOut}
                    onClick={(ev) => updateBookingState(props.order.BookingId)}
                /> <div style={statusUpdated !== "Order status updated" ? { color: "#FFA900" } : { color: "#00B74A" }}>{statusUpdated}</div>
                </td> : <td ><Form.Check
                    type="switch"
                    id="custom-switch"
                    label={isHandedOut}
                    disabled
                /> </td>}
                <td>
                    <Row> <Col>{props.order.State === "pending for cancelation" ? <ContactUser order={props.order} /> : ""}</Col> <Col><Button>Delete order</Button> </Col> </Row>
                </td>
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

            orders.forEach((order) => {
                // modify numeric status with relative description
                switch (order.State) {
                    case 0: order.State = "issued";
                        break;
                    case 1: order.State = "pending for cancelation";
                        break;
                    case 2: order.State = "paid";
                        break;
                    case 3: order.State = "handed out";
                        break;
                    default: order.State = "created";
                }

                setOrders(orders.map(order => ({ ...order })));
                setSearchOrders(orders.map(order => ({ ...order })));
                setLoadingProducts(false);

            })
        }).catch(err => {
            setErrorLoading('Error during the loading of the orders')
            console.error(err);
        });

    }, [])

    function changeSearchText(text) {
        let c = []
        orders.forEach(order => {
            let user = order.UserSurname+" "+order.UserName;
            user = user.toUpperCase();
            console.log(user);
            if (user.toUpperCase().indexOf(text.toUpperCase()) > -1 || text === "") c.push(order);
        })

        setSearchOrders(c);
    };

    return (
        <>
            <Form.Control type="text" className="searchB" placeholder="Filter by user name and surname" onChange={x => changeSearchText(x.target.value)} />
            <Table responsive striped bordered hover className="ordersTable">
                <thead>
                    <tr>
                        <th>OrderID</th>
                        <th>User</th>
                        <th>Booking Issue Date </th>
                        <th>State</th>
                        <th>Scheduled Date</th>
                        <th>Total price</th>
                        <th>Handed out</th>

                        <th> Actions </th>
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
    )
}

function ContactUser(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <span onClick={handleShow}>
                <Button className="d-none d-sm-block mx-auto" variant="success" >
                    Contact User
                </Button>
            </span>


            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title> User info </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <h6><b>{props.order.UserName} {props.order.UserSurname} </b></h6><br></br>

                </Modal.Body>


            </Modal>
        </>
    );
}

export { OrderList, Order, ContactUser };
