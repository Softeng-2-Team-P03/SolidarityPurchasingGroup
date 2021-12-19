
import 'bootstrap/dist/css/bootstrap.min.css';
import './OrderList.css';
import bookingApi from '../../api/booking-api';
import { Button, Form, Table, Modal, Row, Col, Alert } from "react-bootstrap";

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
                    <Row>{props.order.State === "Pending for cancelation" ?  <Col xs= "4"><ContactUser order={props.order} /></Col> : ""} <Col xs="8"><DeleteOrder order={props.order} setConfirmationMessage={props.setConfirmationMessage} setMessage={props.setMessage}/></Col> </Row>
                </td>
            </tr>
        </>
    );
}



function OrderList(props) {

    const [orders, setOrders] = useState([]);
    const [searchOrders, setSearchOrders] = useState([]);
    const [show, setShow] = useState(false);

    const [confirmationMessage, setConfirmationMessage] = useState('');

    useEffect(() => {
        
        bookingApi.getOrders().then((orders) => {
            
            orders.forEach((order) => {
                // modify numeric status with relative description
                switch (order.State) {
                    case 0: order.State = "Issued";
                        break;
                    case 1: order.State = "Pending for cancelation";
                        break;
                    case 2: order.State = "Paid";
                        break;
                    case 3: order.State = "Handed out";
                        break;
                    case 4: order.State = "Canceled";
                        break;
                    case 5: order.State = 'Unretrieved';
                        break;
                    default: order.State = "Created";
                }

                setOrders(orders.map(order => ({ ...order })));
                setSearchOrders(orders.map(order => ({ ...order })));

            })
        }).catch(err => {
            console.error(err);
        });

    }, [show])

    function changeSearchText(text) {
        let c = []
        orders.forEach(order => {
            let user = order.UserSurname + " " + order.UserName;
            user = user.toUpperCase();
            if (user.toUpperCase().indexOf(text.toUpperCase()) > -1 || text === "") c.push(order);
        })

        setSearchOrders(c);
    }

    return (
        <>
            {show ? <Alert variant="success" onClose={() => setShow(false)} dismissible>{confirmationMessage}</Alert> : ""}
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
                            order={or} setConfirmationMessage={setConfirmationMessage} setMessage={setShow}
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
                    <h6><b>Name : {props.order.UserName} {props.order.UserSurname} </b></h6><br></br>
                    <h6><b>Phone number : {props.order.PhoneNumber}</b></h6><br></br>
                    <h6><b>Email : {props.order.Email}</b></h6><br></br>
                    <h6><b>Total price for this order : {props.order.TotalPrice} - Actual wallet : {props.order.Wallet}  </b></h6><br></br>

                </Modal.Body>


            </Modal>
        </>
    );
}

function DeleteOrder(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = () => {
        bookingApi.deleteBooking(props.order.BookingId).then(() => {
            props.setConfirmationMessage('Order succesfully deleted');
            props.setMessage(true);
        }).catch(err => {
            props.setConfirmationMessage('Error during the order deletion');
        });
    }

    return (
        <>
            <span onClick={handleShow}>
                <Button className="d-none d-sm-block mx-auto" variant="primary" >
                    Delete Order
                </Button>
            </span>


            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title> Are you sure you want to delete this order? </Modal.Title>
                </Modal.Header>

                <Modal.Footer>

                    <Row>
                        <Col xs="8">
                            <Button variant="primary" onClick={() => { handleSubmit(); handleClose();}}>
                                Delete Order
                            </Button>
                        </Col>
                        <Col xs="2">
                            <Button variant="secondary" onClick={handleClose}>
                                Back
                            </Button>
                        </Col>
                    </Row>


                </Modal.Footer>
            </Modal>
        </>
    )
}

export { OrderList, Order, ContactUser, DeleteOrder };
