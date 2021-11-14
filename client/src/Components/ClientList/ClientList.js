
import 'bootstrap/dist/css/bootstrap.min.css';
import './ClientList.css';
import { Button, Form, Table } from "react-bootstrap";
import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { AddClientBtn, } from './AddClient';
import API from '../../API';


function Client(props) {
    return (
        <>
            <tr>
                <td>{props.client.name}</td>
                <td>{props.client.surName}</td>
                <td>{props.client.email}</td>
                <td >
                    <Link to={{ pathname: '/products', state: { userId: props.client.userId, userName: props.client.name } }}>
                        <Button className="buttonNewOrder" variant="primary"> New Order </Button>
                    </Link>
                </td>
            </tr>
        </>
    );
}



function ClientList(props) {
    let clients = [];
    const [resultC, setResultC] = useState([]);


     useEffect(()=> {
         let mounted = true;

         const getAllClients = async () => {
             clients = await API.getAllClients();
         };
         getAllClients().then(data => {
             if (mounted){
                setResultC(clients);
                console.log(clients);

             }
         })
             .catch(err => {
                 console.error(err);
             });
         return () => { mounted = false };
     }, []);



    function changeSearchText(text) {
        let c = []
        resultC.forEach(x => {
            if (x.email.toLowerCase().includes(text.toLowerCase())) c.push(x);
        })

        setResultC(c);

    }

    return (
        <>

            <Form.Control type="text" className="searchB" placeholder="Search client" onChange={x => changeSearchText(x.target.value)} />
            <Table responsive striped bordered hover className="clientsTable">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Email</th>
                        <th width="13%"></th>
                    </tr>
                </thead>
                <tbody> {
                    resultC.map((cl) =>
                        <Client key={cl.userId}
                            client={cl}
                        />)
                }
                </tbody>
            </Table>
            <Link to="/addClient"><AddClientBtn /></Link>
        </>
    );
}

export default ClientList;
