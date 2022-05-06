import React, { useEffect, useState } from 'react';

import { Alert } from 'react-bootstrap';
import { BsExclamationCircle, BsExclamationCircleFill } from 'react-icons/bs'

export default function NavigationBar() {
    

    return (
        <Alert variant="success">
            <Alert.Heading><BsExclamationCircleFill /> Hey, nice to see you!</Alert.Heading>
            <p>
                Aww yeah, you successfully read this important alert message. The development team just want you to know that they are still working on this page.
                I will let you know as soon as I have updates from them!
            </p>
            <hr />
            <p className="mb-0">
                Whenever you need something, be sure to contact the development team through Philip and he will surely assist you.
            </p>
        </Alert>
    );
};