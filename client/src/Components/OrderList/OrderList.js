
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
                <td>{props.order.orderID}</td>
                <td>{props.order.user.name} {props.order.user.surname}</td>
                <td>{props.order.user.email}</td>
                <td>{props.order.state}</td>
                {props.order.pickupTime ? <td> {props.order.pickupTime} </td> : <td> {props.order.deliveryTime} </td>}
                <td>{props.order.totalPrice}</td>

                <td ><Form.Check
                    type="switch"
                    id="custom-switch"
                    label={isHandedOut}
                    onClick={() => {  isHandedOut === "click to hand it out" ?  setIsHandedOut("Handed out") : setIsHandedOut("click to hand it out") } }
                /></td>
            </tr>
        </>
    );
}



function OrderList(props) {

/*     useEffect(() => {
        productApi.getAllProducts().then((products) => {
            setProducts(products.map(product => ({ ...product, pricePerUnit: product.pricePerUnit.toFixed(2) })));
            setSearchProducts(products.map(product => ({ ...product, pricePerUnit: product.pricePerUnit.toFixed(2) })));
            setLoadingProducts(false);
            productApi.getProductTypes().then((types) => {
                setTypes(types);
                setLoadingTypes(false);
                setErrorLoading('');
            }).catch(err => {
                setErrorLoading('Error during the loading of the types')
                console.error(err);
            })
        }).catch(err => {
            setErrorLoading('Error during the loading of the products')
            console.error(err);
        });
    }, []) */

    const [resultC, setResultC] = useState(props.orders);

    function changeSearchText(text) {
        let c = []
        props.orders.forEach(x => {
            if (x.user.email.toLowerCase().includes(text.toLowerCase())) c.push(x);
        })

        setResultC(c);

    }

    return (
        <>
            <Form.Control type="text" className="searchB" placeholder="Search order" onChange={x => changeSearchText(x.target.value)} />
            <Table responsive striped bordered hover className="ordersTable">
                <thead>
                    <tr>
                        <th>OrderID</th>
                        <th>User</th>
                        <th>email</th>
                        <th>State</th>
                        <th>Scheduled Date</th>
                        <th>Total price</th>
                        <th>Handed out</th>

                        <th width="13%"></th>
                    </tr>
                </thead>
                <tbody> {
                    resultC.map((or) =>
                        <Order key={or.orderID}
                            order={or}
                        />)
                }
                </tbody>
            </Table>
        </>
    );
}

export default OrderList;
