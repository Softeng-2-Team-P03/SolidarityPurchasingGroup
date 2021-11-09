
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Table } from "react-bootstrap";


function Client(props) {
    return (
        <>
            <tr>
                <td>{props.client.name}</td>
                <td>{props.client.surname}</td>
                <td>{props.client.email}</td>
                <td ><Button className="buttonNewOrder" variant ="primary"> New Order </Button></td>
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
                        <th width="13%"></th>
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
