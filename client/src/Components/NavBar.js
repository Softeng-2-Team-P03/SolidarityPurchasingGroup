import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import spg from '../spg.png';
import {Container, Navbar} from "react-bootstrap";



function NavBar() {
    return (

        <Navbar className="nav" bg="primary" variant="dark" >

    <Navbar.Brand href="#home">
      <img
        src={spg}
        width="30"
        height="30"
        className="d-inline-block align-top"
        alt="SPG"
      /> SPG
    </Navbar.Brand>

        </Navbar>
    );
}

export default NavBar;
