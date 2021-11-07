import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Container, Nav, Navbar} from "react-bootstrap";
import Logo from "./icons8-pomodoro-64.png";



function NavBar() {
    return (
        <Navbar bg="primary" variant="dark">

            <Container>
                <Navbar.Brand href="#home"><img width="35px" height="auto" className="img-responsive" src={Logo}  alt="logo" /> SPG</Navbar.Brand>

            </Container>
        </Navbar>
    );
}

export default NavBar;
