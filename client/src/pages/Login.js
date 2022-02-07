import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import {
    Card,
    Button,
    Form,
    Alert,
    CardGroup,
    Spinner
} from 'react-bootstrap';
import {
    BsPersonBoundingBox,
    BsPersonLinesFill,
} from 'react-icons/bs';

import {
    loginBody,
    loginCard,
    loginHeader,
    loginForgotPass,
    loginAlert,
} from '../css/styles';

export default function Login() {
    const [credential, setCredential] = useState({ email: '', password: '' });
    const [notif, setNotif] = useState({ header: '', content: '', status: false });
    const [isLoading, setLoading] = useState(false);
    const history = useHistory();

    const signIn = () => {
        setLoading(true);

        axios.post('/api/user/login', credential)
            .then(res => {
                const { success, name, message, token } = res.data;
                const username = JSON.parse(res.config.data).username;
                
                if (success) {
                    localStorage.setItem('jwt', token);
                    localStorage.setItem('username', username)
                    history.push('/home');
                } else setNotif({ header: name, content: message, status: true });

                setLoading(false);

            }).catch(err => {
                setNotif({ header: err.name, content: err.message, status: true });
                setLoading(false);
            });

        setTimeout(function() {
            setNotif({ ...notif, status: false });
        }, 2000);
    };

    return (
        <div style={loginBody}>
            <Alert
                show={notif.status}
                variant='danger'
                dismissible
                style={loginAlert}
                onClose={() => setNotif({ ...notif, status: false })}
            >
                {notif.content}
            </Alert>
            <CardGroup style={loginCard}>
                <Card>
                    <Card.Header style={loginHeader}>Sign in to Expert Care</Card.Header>
                    <Card.Body>
                        <Form id="loginForm">
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder=""
                                    style={{ fontSize: '15px' }}
                                    onChange={e => setCredential({ ...credential, username: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder=""
                                    onChange={e => setCredential({ ...credential, password: e.target.value })}
                                />
                            </Form.Group>
                        </Form>
                        <Button
                            type='submit'
                            variant="success"
                            size="sm"
                            disabled={isLoading}
                            style={{ marginRight: '5px', float: 'left' }}
                            onClick={signIn}
                        >
                            {isLoading
                                ? <div><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Loading...</div>
                                : <span><BsPersonBoundingBox /> Sign In</span>}
                        </Button>
                        <Link
                            to='/register'
                            // onClick={ (event) => event.preventDefault() }
                            // style={{ cursor: 'not-allowed' }}
                        >
                            <Button variant="warning" size="sm"><BsPersonLinesFill /> Register</Button>
                        </Link>
                        <p style={loginForgotPass}>Forgot Password? <Link to='/reset-password'>Click Here!</Link></p>
                    </Card.Body>
                </Card>
            </CardGroup>
        </div>
    );
};