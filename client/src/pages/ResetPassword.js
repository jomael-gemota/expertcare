import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import getJwt from '../helper/getJwt';
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
    BsPencilFill,
    BsBackspaceReverseFill,
} from 'react-icons/bs';

import {
    loginBody,
    loginHeader,
    resetPassAlert,
    resetPassCard,
} from '../css/styles';

export default function ResetPassword() {
    const [credential, setCredential] = useState({ username: '', newPassword: '', confirmPassword: '' });
    const [notif, setNotif] = useState({ header: '', content: '', status: false});
    const [isLoading, setLoading] = useState(false);
    const history = useHistory();

    const resetPassword = () => {
        setLoading(true);

        const { username, newPassword, confirmPassword } = credential;

        if (username !== "") {
            if (newPassword !== confirmPassword) {
                setNotif({ header: '', content: 'Password does not match.', status: true});
                setLoading(false);
            } else if (newPassword === "" || confirmPassword === "") {
                setNotif({ header: '', content: 'We can\'t accept empty password.', status: true});
                setLoading(false);
            } else {
                axios.patch('/api/user/updatePasswordByUsername', credential,
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
            };
        } else {
            setNotif({ header: '', content: 'Username is required.', status: true});
            setLoading(false);
        };

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
                style={resetPassAlert}
                onClose={() => setNotif({ ...notif, status: false })}
            >
                {notif.content}
            </Alert>
            <CardGroup style={resetPassCard}>
                <Card>
                    <Card.Header style={loginHeader}>Change Password in Expert Care</Card.Header>
                    <Card.Body>
                        <Form id="resetPassForm">
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
                                <Form.Label>New Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder=""
                                    onChange={e => setCredential({ ...credential, newPassword: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                                <Form.Label>Confirm New Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder=""
                                    onChange={e => setCredential({ ...credential, confirmPassword: e.target.value })}
                                />
                            </Form.Group>
                        </Form>
                        <Button
                            type='submit'
                            variant="success"
                            size="sm"
                            disabled={isLoading}
                            style={{ marginRight: '5px', float: 'left' }}
                            onClick={resetPassword}
                            >
                                {isLoading
                                    ? <div><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Updating...</div>
                                    : <span><BsPencilFill /> Reset Password</span>}                                
                        </Button>
                        <Link to='/'><Button variant='outline-secondary' size='sm'><BsBackspaceReverseFill /> Cancel</Button></Link>
                    </Card.Body>
                </Card>
            </CardGroup>
        </div>
    );
};