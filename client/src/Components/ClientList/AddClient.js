import { Button, Modal, Form, Alert } from "react-bootstrap";
import { useState } from "react";
import "./AddClient.css";
import { Client } from "../Client";
import { Redirect } from 'react-router-dom';

function AddClientBtn(props) {
    return (
        <>
            <Button id="add-client-btn">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fillRule="currentColor"
                    className="bi bi-plus"
                    viewBox="0 0 16 16"
                >
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                </svg>
            </Button>
        </>
    );
}

function ClientModal(props) {
    const [show, setShow] = useState(true);

    const handleClose = () => {
        setShow(false);
    }

    if (show) {
        return (
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>New client</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddClientForm addClient={props.addClient} />
                </Modal.Body>
            </Modal>
        );
    } else {
        return (
            <Redirect to='/' />
        );
    }

}

function AddClientForm(props) {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');

    const [errorMessage, setErrorMessage] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    
    let error = [];

    const handleAdd = (event) => {
        event.preventDefault();
        

        let valid = true;
        if (name === '') {
            error[0] = 'Missing name description!';
            setErrorMessage(error);
            valid = false;

        }
        if (surname === '') {
            error[1] = 'Missing surname description!'
            setErrorMessage(error);
            valid = false;

        }
        if (password === '') {
            error[2] = 'Missing password description!'
            setErrorMessage(error);
         //   setErrorMessage('Missing password description!');
            valid = false;

        }

        if (email === '') {
            error[3] = 'Missing email description!'
            setErrorMessage(error);
        
          //  setErrorMessage('Missing email description!');
            valid = false;

        }
        if (phoneNumber === '') {
            error[4] = 'Missing phoneNumber description!'
            setErrorMessage(error);
         //   setErrorMessage('Missing phoneNumber description!');
            valid = false;

        }
        if (address === '') {
            error[5] = 'Missing address description!'
            setErrorMessage(error);
         //   setErrorMessage('Missing address description!');
            valid = false;

        }


        if (valid) {
            props.addClient(new Client(name, surname, email, password, phoneNumber, address));
            formReset();
            setSubmitted(true);
        }
    };

    const formReset = () => {
        setName('')
        setSurname('');
        setEmail('');
        setPassword('');
        setPhoneNumber('');
        setAddress('');

    };

    if (submitted) {
        return (<>
            <Redirect to='/' />
        </>
        );
    } else {
        return (<>
            <Form>               
                <Form.Group className = "nameForm" controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <h6 class="text-danger">{errorMessage[0]}</h6>                 
                    <Form.Control required type='text' value={name} onChange={ev => setName(ev.target.value)} />                   
                </Form.Group>
                <Form.Group className = "mt-2" controlId="formSurname">
                    <Form.Label>Surname</Form.Label>
                    <h6 class="text-danger">{errorMessage[1]}</h6>   
                    <Form.Control required type='text' value={surname} onChange={ev => setSurname(ev.target.value)} />
                    
                </Form.Group>
                <Form.Group className = "mt-2"controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <h6 class="text-danger">{errorMessage[2]}</h6>   
                    <Form.Control required type='text' value={email} onChange={ev => setEmail(ev.target.value)} />
                    
                </Form.Group>
                <Form.Group className = "mt-2" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <h6 class="text-danger">{errorMessage[3]}</h6>   
                    <Form.Control required type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
                   
                </Form.Group>
                <Form.Group className = "mt-2" controlId="formPhoneNumber">
                    <Form.Label>PhoneNumber</Form.Label>
                    <h6 class="text-danger">{errorMessage[4]}</h6>   
                    <Form.Control required type='text' value={phoneNumber} onChange={ev => setPhoneNumber(ev.target.value)} />
             
                </Form.Group>
                <Form.Group className = "mt-2" controlId="formAddress" class="mb-3">
                    <Form.Label>Address</Form.Label>
                    <h6 class="text-danger">{errorMessage[5]}</h6>   
                    <Form.Control required type='text' value={address} onChange={ev => setAddress(ev.target.value)} />
                </Form.Group>
                <Button className = "mt-2" onClick={handleAdd}>Register</Button>
                
            </Form >
        </>
        );
    }

}

export { AddClientBtn, AddClientForm, ClientModal };
