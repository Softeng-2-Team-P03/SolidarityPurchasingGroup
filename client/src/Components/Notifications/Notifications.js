import NavBar from "../NavBar/NavBar";
import {useState} from "react";
import {Button, Offcanvas} from "react-bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Notifications.css'

function Notifications({ name, ...props }) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <i variant="primary" onClick={handleShow} class="bi bi-bell-fill text-warning" style={{ fontSize: 25 }}>
                {name}
            </i>
            <Offcanvas show={show} onHide={handleClose} {...props}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Offcanvas</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    Some text as placeholder. In real life you can have the elements you
                    have chosen. Like, text, images, lists, etc.
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

export default Notifications;

