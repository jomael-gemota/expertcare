import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import {
    Card,
    Button,
    Form,
    Alert,
    CardGroup,
    Spinner
} from 'react-bootstrap';
import getJwt from '../helper/getJwt';
import axios from 'axios';

import {
    loginBody,
    loginHeader,
    registerAlert,
    registerCard,
} from '../css/styles';

export default function ResetPassword() {
    const [userInfo, setUserInfo] = useState({
        fullname: '',
        username: '',
        password: '',
        rePassword: '',
        status: 'Active'
    });
    const [notif, setNotif] = useState({ header: '', content: '', status: false});
    const [isLoading, setLoading] = useState(false);
    const history = useHistory();

    const resetForm = () => document.getElementById("registerForm").reset();

    const register = () => {
        setLoading(true);

        const { fullname, username, password, rePassword } = userInfo;

        if (fullname === "") {
            setNotif({ header: '', content: 'Your Fullname is required.', status: 'true' });
            setLoading(false);
        } else if (username === "") {
            setNotif({ header: '', content: 'Your Username is required.', status: 'true' });
            setLoading(false);
        } else if (password !== rePassword) {
            setNotif({ header: '', content: 'Password does not match.', status: 'true' });
            setLoading(false);
        } else if (password === "" || rePassword === "") {
            setNotif({ header: '', content: 'We can\'t accept empty password.', status: 'true' });
            setLoading(false);
        } else {
            axios.post('/api/user/createUser', userInfo,
                { headers: { Authorization: getJwt() } })
                .then(res => {
                    const { success, name, message } = res.data;

                        if (success) {
                            history.push('/');
                        } else setNotif({ header: name, content: message, status: true });
                    
                        setLoading(false);
                }).catch(err => {
                    setNotif({ header: err.name, content: err.message, status: true });
                    setLoading(false);
                });
        }
    };

    return (
        <div style={loginBody}>
            <Alert
                show={notif.status}
                variant='danger'
                dismissible
                style={registerAlert}
                onClose={() => setNotif({ ...notif, status: false })}
            >
                {notif.content}
            </Alert>
            <CardGroup style={registerCard}>
                <Card>
                    <Card.Header style={loginHeader}>Register in Expert Care</Card.Header>
                    <Card.Body>
                        <Alert dismissible variant='info'>Exclusive for Admin only!</Alert>
                        <Form id="registerForm">
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder=""
                                    style={{ fontSize: '15px' }}
                                    onChange={e => setUserInfo({ ...userInfo, fullname: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder=""
                                    style={{ fontSize: '15px' }}
                                    onChange={e => setUserInfo({ ...userInfo, username: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder=""
                                    onChange={e => setUserInfo({ ...userInfo, password: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                                <Form.Label>Re-enter Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder=""
                                    onChange={e => setUserInfo({ ...userInfo, rePassword: e.target.value })}
                                />
                            </Form.Group>
                        </Form>
                        <Button
                            type='submit'
                            variant="success"
                            size="sm"
                            disabled={isLoading}
                            style={{ marginRight: '5px'}}
                            onClick={register}
                            >
                                {isLoading
                                    ? <div><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Creating profile...</div>
                                    : 'Register'}                                
                        </Button>
                        <Link to='/'><Button variant='outline-secondary' size='sm'>Cancel</Button></Link>
                    </Card.Body>
                </Card>
            </CardGroup>
        </div>
    );
};