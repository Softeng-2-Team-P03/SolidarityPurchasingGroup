import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import {Button, Card} from "react-bootstrap";
import mainLogo from "../cipolle-dorate-bio.jpg";

function Product() {
    return (
        <Card className="text-center">
            <Card.Img variant="top" src={mainLogo} />
            <Card.Body>
                <h2>Cipolla</h2>
                <Card.Text>
                    1 pezzo circa 300g
                </Card.Text>
                <h4>
                    0.10€
                </h4>
            </Card.Body>
            <Card.Footer>
                <small className="text-muted">0.30 €/kg</small>
            </Card.Footer>
            <Card.Footer>
                <Button className ="button" variant="primary">-</Button>{' '}
                <small className="text"> 0 </small>
                <Button className ="button" variant="primary">+</Button>{' '}
            </Card.Footer>
            <Card.Footer>
            <Button  variant="success">Add to basket</Button>{' '}
            </Card.Footer>
        </Card>
    );
}

export default Product;
