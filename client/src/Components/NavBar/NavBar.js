import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBar.css';
import spg from '../Icons/spg.png';
import { Nav, Navbar, Button, Row, Col, Table, NavDropdown, Container } from "react-bootstrap";
import { showTime } from './clock.js'

var hourMultiplier = 0;
var dayMultiplier = 0;
var minutesMultiplier = 0;
window.setInterval(showTime, 1000) // per mostrare il passare dei secondi nell'orologio
function NavBar(props) {

  const chooseNavbar = (accessType) => {
    if (accessType === 1) {
      return <ManagerNavbar />;
    }
    if (accessType === 2) {
      return <EmployeeNavbar />;
    }
    if (accessType === 3) {
      return <ClientNavbar />;
    }
    if (accessType === 4) {
      return <FarmerNavbar />;
    }
    if (accessType === 5) {
      return <DelivererNavbar />;
    }
    return <></>;
  }

  return (
    <div>
        <Navbar bg="primary" variant="dark" expand="lg">
         
            <Navbar.Brand href="/" className="col-md-4">
              <img
                src={spg}
                width="30"
                height="30"
                className="d-inline-block align-top"
                alt="SPG"
              /> SPG
            </Navbar.Brand>
          
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
           
            <Navbar.Collapse id="basic-navbar-nav">
              <div className="col-md-6"> 
        
            </div>
            <Nav className="me-auto " />
          {props.loggedIn && props.user !== undefined && chooseNavbar(props.user.accessType)}
          <Nav>
            {props.loggedIn ?
              <Nav.Link onClick={() => props.userLogoutCallback()}>Logout</Nav.Link> :
              <Nav.Link href='/login'>Login</Nav.Link>
            }
          </Nav>
            </Navbar.Collapse>
        </Navbar>
    <div class="timer">
    <div className="me-auto"> 
      <Nav className="me-auto " >
      <ShowClock />
      </Nav>
      </div>
      </div>
      </div>
  );
}

//Wallet could be integrated in account info
function ClientNavbar() {
  return (
    <Nav>
      <Nav.Link href='/products'>Browse Shop</Nav.Link>
      <Nav.Link>My Orders</Nav.Link>
      <Nav.Link>My Wallet</Nav.Link>
    </Nav>
  );
}

//Separate nav.link for wallet top up or in clients ?
function EmployeeNavbar() {
  return (
    <Nav>
      <Nav.Link href='/products'>Browse Shop</Nav.Link>
      <Nav.Link href='/clients'>Clients</Nav.Link>
      <Nav.Link href='/orders'>Orders</Nav.Link>
    </Nav>
  );
}

//TO DO:
function ManagerNavbar() {
  return (
    <Nav>
      <Nav.Link href='/products'>Browse Shop</Nav.Link>
      <Nav.Link href='/clients'>Clients</Nav.Link>
      <Nav.Link href='/orders'>Orders</Nav.Link>
      <Nav.Link>Join Requests</Nav.Link>
    </Nav>
  );
}

//TO DO:
function FarmerNavbar() {
  return (
    <Nav>
      <Nav.Link>Clients</Nav.Link>
      <Nav.Link>Orders</Nav.Link>
    </Nav>
  );
}

//TO DO:
function DelivererNavbar() {
  return (
    <Nav>
      <Nav.Link>Clients</Nav.Link>
      <Nav.Link>Orders</Nav.Link>
    </Nav>
  );
}

function ShowClock() {
  /* FUNZIONI PER POTER MODIFICARE ORARIO */
  const setHourPlus = () => {
    if (localStorage.getItem('hourMultiplier') === null)
      hourMultiplier = 0;
    else
      hourMultiplier = parseInt(localStorage.getItem('hourMultiplier'));
    hourMultiplier += 1;
    localStorage.setItem('hourMultiplier', hourMultiplier.toString());
    showTime()
  }
  const setHourMinus = () => {
    if (localStorage.getItem("hourMultiplier") === null)
      hourMultiplier = 0;
    else {
      hourMultiplier = parseInt(localStorage.getItem("hourMultiplier"));
      hourMultiplier -= 1;
    }
    localStorage.setItem("hourMultiplier", hourMultiplier.toString());
    showTime()
  }
  const setDayPlus = () => {
    if (localStorage.getItem('dayMultiplier') === null)
      dayMultiplier = 0;
    else {
      dayMultiplier = parseInt(localStorage.getItem('dayMultiplier'));
      dayMultiplier += 1;
    }
    localStorage.setItem('dayMultiplier', dayMultiplier.toString());
    showTime()
  }
  const setDayMinus = () => {
    if (localStorage.getItem("dayMultiplier") === null)
      dayMultiplier = 0;
    else {
      dayMultiplier = parseInt(localStorage.getItem("dayMultiplier"));
      dayMultiplier -= 1;
    }
    localStorage.setItem("dayMultiplier", dayMultiplier.toString());
    showTime()
  }
  const setMinutesPlus = () => {
    if (localStorage.getItem('minutesMultiplier') === null)
      minutesMultiplier = 0;
    else {
      minutesMultiplier = parseInt(localStorage.getItem('minutesMultiplier'));
      minutesMultiplier += 1;
    }
    localStorage.setItem('minutesMultiplier', minutesMultiplier.toString());
    showTime()
  }
  const setMinutesMinus = () => {
    if (localStorage.getItem("minutesMultiplier") === null)
      minutesMultiplier = 0;
    else {
      minutesMultiplier = parseInt(localStorage.getItem("minutesMultiplier"));
      minutesMultiplier -= 1;
    }
    localStorage.setItem("minutesMultiplier", minutesMultiplier.toString());
    showTime()
  }

  const resetTime = () => {
    localStorage.setItem('hourMultiplier', '0');
    localStorage.setItem('dayMultiplier', '0');
    localStorage.setItem('minutesMultiplier', '0');
  }

  return (
    <div className="clockWrapper glow">
      <Table responsive borderless size="sm">
        <thead>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
        </thead>
        <tbody>
          <tr>
            <td>
            </td>
            <td>
              <span id='incrementHour' className="buttonArrow" onClick={setHourPlus}>▲</span>
            </td>
            <td></td>
            <td>
              <span id='incrementMinutes' className="buttonArrow" onClick={setMinutesPlus}>▲</span>
            </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <div className="glow">
              <span id='incrementDay' className="buttonArrow" onClick={setDayPlus}>〈</span>
              <span className="timer-box">
                <span id="dayName" className="day-name" /> 
                <span id="day" />/<span  id="month" />/<span  id="year" />
              </span>
              <span id='decrementDay' className="buttonArrow" onClick={setDayMinus}>〉</span>
              </div>
            </td>
            <td>
              <span id="hours" className="timer-box" />
            </td>
            <td>
              <span>:</span>
            </td>
            <td>
              <span id="minutes" className="timer-box" />
            </td>
            <td>
              <span>:</span>
            </td>
            <td>
              <span id="seconds" className="timer-box" />
            </td>
            <td>
              <button id='resetTime' className="modifyButton" onClick={resetTime}>resetTime</button>
            </td>
          </tr>
          <tr>
            <td>
            </td>
            <td>
              <span id='decrementHour' className="buttonArrow" onClick={setHourMinus}>▼</span>
            </td>
            <td></td>
            <td>
              <span id='decrementMinutes' className="buttonArrow" onClick={setMinutesMinus}>▼</span>
            </td>
            <td></td>
            <td> </td>
            <td></td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}

export default NavBar;
