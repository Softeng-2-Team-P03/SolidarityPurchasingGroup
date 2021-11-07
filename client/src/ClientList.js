import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, CardGroup, Table } from "react-bootstrap";
import Product from "./Product";

function Client(props) {
    return (
        <>
            <tr>
                <td>{props.client.name}</td>
                <td>{props.client.surname}</td>
                <td>{props.client.email}</td>
                <td ><Button className="buttonNewOrder" variant ="primary"> new Order </Button></td>
            </tr>
        </>
    );
}

function ClientList(props) {
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
                <tbody> {
                  props.clients.map((cl) =>
                    <Client key={cl.userId}
                    client = {cl}
                    />) 
                }
                </tbody>
            </Table>
        </>
    );
}

export default ClientList;
