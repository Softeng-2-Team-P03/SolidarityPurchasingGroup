import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import {Nav} from "react-bootstrap";



function SideBar() {


    return (
        <Nav  activeKey="home" className="flex-column"
              onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}  >
            <Nav.Link className="text-center" eventKey="home">Frutta</Nav.Link>
            <Nav.Link className="text-center" eventKey="link-1">Verdura</Nav.Link>
            <Nav.Link className="text-center" eventKey="link-2">Carne</Nav.Link>
            <Nav.Link className="text-center" eventKey="home">Pesce</Nav.Link>
            <Nav.Link className="text-center" eventKey="link-1">Pasta</Nav.Link>
            <Nav.Link className="text-center" eventKey="link-2">Riso</Nav.Link>

        </Nav>
    );
}

export default SideBar;
