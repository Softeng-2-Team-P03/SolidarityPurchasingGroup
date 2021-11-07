import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Card, CardGroup} from "react-bootstrap";
import mainLogo from'./cipolle-dorate-bio.jpg';

function ProductList() {
    return (
        <>
        <CardGroup>
            <Card>
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
                    <Button variant="primary">-</Button>{' '}
                    <small className="text"> 0 </small>
                    <Button variant="primary">+</Button>{' '}
                </Card.Footer>
            </Card>
    </CardGroup>
        </>
    );
}

export default ProductList;
