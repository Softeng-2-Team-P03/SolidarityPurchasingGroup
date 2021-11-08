import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import {ListGroup, Nav} from "react-bootstrap";



function SideBar() {


    return (
        <ListGroup className="side" defaultActiveKey="#link1">
            <ListGroup.Item action href="title" disabled>
                <h4>
                    <small className="text-muted">Tipo Prodotti</small>
                </h4>
            </ListGroup.Item>
            <ListGroup.Item action href="#link1">
                Frutta
            </ListGroup.Item>
            <ListGroup.Item action href="#link2">
                Verdura
            </ListGroup.Item>
            <ListGroup.Item action href="#link3">
                Carne
            </ListGroup.Item>
            <ListGroup.Item action href="#link4">
                Pesce
            </ListGroup.Item>
            <ListGroup.Item action href="#link5">
                Latticini
            </ListGroup.Item>
        </ListGroup>

    );
}

export default SideBar;
