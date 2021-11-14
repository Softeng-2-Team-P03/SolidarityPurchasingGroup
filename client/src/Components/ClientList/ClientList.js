
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Form, Table} from "react-bootstrap";
import React, { useState} from 'react';
import { Link} from 'react-router-dom';
import { AddClientBtn, } from './AddClient';
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

    const [resultC,setResultC]=useState(props.clients);

    function changeSearchText(text){
        let c=[]
        props.clients.forEach(x=>{
            if(x.email.toLowerCase().includes(text.toLowerCase())) c.push(x);
        })

        setResultC(c);

    }

    return (
        <>

            <Form.Control type="text" className="searchB" placeholder="Search client" onChange={x=>changeSearchText(x.target.value)}/>
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
                  resultC.map((cl) =>
                    <Client key={cl.userId}
                    client = {cl}
                    />)
                }
                </tbody>
            </Table>
            <Link to="/addClient"><AddClientBtn /></Link>
        </>
    );
}

export default ClientList;