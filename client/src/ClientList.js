import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, CardGroup, Table } from "react-bootstrap";
import Product from "./Product";

function Client() {
    return (
        <>
            <tr>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
                <td ><Button className="buttonNewOrder" variant ="primary"> new Order </Button></td>
            </tr>
        </>
    );
}

function ClientList() {
    return (
        <>
            <Table responsive striped bordered hover>
                <thead>
                    <tr>                      
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Email</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <Client />
                </tbody>
            </Table>
        </>
    );
}

export default ClientList;
