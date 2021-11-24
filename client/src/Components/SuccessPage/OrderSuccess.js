import 'bootstrap/dist/css/bootstrap.min.css';
import './OrderSuccess.css';
import { Link } from 'react-router-dom';
import { Table, Image, Button } from "react-bootstrap";
import { Redirect, useLocation } from 'react-router-dom';


function OrderSuccess() {
    const location = useLocation();
    console.log(location.state);
    const allOk = (location.state && location.state.orderId && location.state.booking && location.state.booking.products);
    return (
        <>
            {!allOk && <Redirect to='/' />}
            <div className="containerSuccess">
                <section className="confirmation">
                    <h1>Booking #{allOk && location.state.orderId} received</h1>
                    <p>Info for scheduled pickup/delivery will be added here...</p>
                    <Link to = '/' >
                        <Button>Go to Homepage</Button>
                    </Link>
                    <br />
                    <Table responsive striped bordered hover>
                        <thead>
                            <tr>
                                <th width="15%">Product</th>
                                <th>Quantity</th>
                                <th>Price (Total: € {allOk && location.state.booking.totalPrice})</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                allOk ? location.state.booking.products.map((product) =>
                                    <Product key={product.productId} product={product} />)
                                    : <></>
                            }
                            <td></td>
                            <td></td>
                            <td>Total: € {allOk && location.state.booking.totalPrice}</td>
                        </tbody>
                    </Table>
                </section>
            </div>
        </>
    );
}

function Product(props) {
    return (
        <>
            <tr>
                <td><Image src={require('../../../public/ProductImages' + props.product.imagePath).default} thumbnail /> {props.product.name} </td>
                <td>{props.product.quantity}</td>
                <td> € {props.product.price}</td>
            </tr>
        </>
    );
}

export default OrderSuccess;
