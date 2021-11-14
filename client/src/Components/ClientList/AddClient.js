import { Button, Modal, Form } from "react-bootstrap";
import { useState } from "react";
import "./AddClient.css";
import { Client } from "../Client";
import { Redirect} from 'react-router-dom';

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
                <AddClientForm addClient={props.addClient}/>
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

    const [errorMessage, setErrorMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleAdd = (event) => {
        event.preventDefault();

        let valid = true;
        if (name === '') {
            setErrorMessage('Missing name description!');
            valid = false;
        }
        if (surname === '') {
            setErrorMessage('Missing surname description!');
            valid = false;
        }
        if (password === '') {
            setErrorMessage('Missing password description!');
            valid = false;
        }
        if (email === '') {
            setErrorMessage('Missing email description!');
            valid = false;
        }
        if (phoneNumber === '') {
            setErrorMessage('Missing phoneNumber description!');
            valid = false;
        }
        if (address === '') {
            setErrorMessage('Missing address description!');
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
        return (
            <Redirect to='/' />
            );
    } else {
        return (<>
            <Form>
                <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control required type='text' value={name} onChange={ev => setName(ev.target.value)} />
                </Form.Group>
                <Form.Group controlId="formSurname">
                    <Form.Label>Surname</Form.Label>
                    <Form.Control required type='text' value={surname} onChange={ev => setSurname(ev.target.value)} />
                </Form.Group>
                <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control required type='text' value={email} onChange={ev => setEmail(ev.target.value)} />
                </Form.Group>
                <Form.Group controlId="formPhoneNumber">
                    <Form.Label>Password</Form.Label>
                    <Form.Control required type='text' value={password} onChange={ev => setPassword(ev.target.value)} />
                </Form.Group>
                <Form.Group controlId="formPhoneNumber">
                    <Form.Label>PhoneNumber</Form.Label>
                    <Form.Control required type='text' value={phoneNumber} onChange={ev => setPhoneNumber(ev.target.value)} />
                </Form.Group>
                <Form.Group controlId="formAddress" class="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control required type='text' value={address} onChange={ev => setAddress(ev.target.value)} />
                </Form.Group>

                <Button onClick={handleAdd}>Register</Button> 
                <Form.Text className="text-danger">{errorMessage}</Form.Text>
            </Form >
        </>
        );
    }
    
}

export { AddClientBtn, AddClientForm, ClientModal};
