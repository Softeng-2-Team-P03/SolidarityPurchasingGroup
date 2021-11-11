import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBar.css';
import spg from '../Icons/spg.png';
import { Navbar } from "react-bootstrap";



function NavBar() {
  return (

    <Navbar className="nav" bg="primary" variant="dark" >
      <Navbar.Brand href="/">
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
