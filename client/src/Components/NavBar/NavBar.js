import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBar.css';
import spg from '../Icons/spg.png';
import { Navbar } from "react-bootstrap";
import {showTime} from './clock.js'


setInterval(showTime, 1000) // per mostrare il passare dei secondi nell'orologio

function NavBar() {
  return (

    <Navbar className="nav" bg="primary" variant="dark">
      <Navbar.Brand href="/">
        <img
          src={spg}
          width="30"
          height="30"
          className="d-inline-block align-top"
          alt="SPG"
        /> SPG
      </Navbar.Brand>
      <div id="clock" class="glow">00:00:00</div>
    </Navbar>
  );
}

export default NavBar;
