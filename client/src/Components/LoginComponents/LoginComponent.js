import { Form, Button, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import './LoginComponent.css';

function LoginComponent(props) {
    const [validated, setValidated] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleLogin = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            props.userLoginCallback(email, password);
        }
        setValidated(true);

    }
    return (

        <div className="center-block col-md-6 login col-sm-11   col-11" >
            <Form noValidate validated={validated} onSubmit={handleLogin} className=" login-form col-md-4">

                <div class="login-header mb-20 col-11 col-sm-11">
                    <div className="logo-user">
                    <img  src={window.location.origin + '/images/user.png'} width="50"></img>
                    </div>
                    <h3 className="welcomeLogin">Welcome to SPG</h3>
                </div>
                <Form.Group className="mb-3 mt-10" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <InputGroup hasValidation>
                        <Form.Control required type="email" placeholder="Email" onChange={ev => setEmail(ev.target.value)} />
                        <Form.Control.Feedback type="invalid">
                            Please enter a valid email.
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <InputGroup hasValidation>
                        <Form.Control required type="password" placeholder="Password" onChange={ev => setPassword(ev.target.value)} />
                    </InputGroup>
                </Form.Group>
                <Button className="loginButton" variant=" w-50 mt-100 submit-botton" type="submit">
                    Login
                </Button>
                <div><Form.Text className={"mb-3 " + props.message.type}>{props.message.msg}</Form.Text></div>
            </Form>
        </div>
    );
}

export { LoginComponent };
