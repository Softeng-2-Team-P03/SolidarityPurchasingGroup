import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Card, CardGroup} from "react-bootstrap";
import Product from "./Product";

function ProductList() {
    return (
        <>
        <CardGroup>
            <Product/>
            <Product/>
            <Product/>
            <Product/>
            <Product/>
        </CardGroup>
            <CardGroup>
                <Product/>
                <Product/>
                <Product/>
                <Product/>
                <Product/>
            </CardGroup>
        </>
    );
}

export default ProductList;
