import React, { useState, useEffect } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useSelector, useDispatch } from 'react-redux'
import { getUserDetailsAction } from '../actions/userActions'

function ProfileScreen({ history }) {
    // local states
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')

    // handle getUserDetails
    const dispatch = useDispatch()
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    const userDetails = useSelector(state => state.userDetails)
    const { user, error, loading } = userDetails

    useEffect(() => {
        if (!userInfo) {
            history.push('/login')
        } else {
            if (!user || !user.name) {
                dispatch(getUserDetailsAction('profile'))
            } else {
                setEmail(user.email)
                setName(user.name)
            }
        }
    }, [history, userInfo, user, dispatch])


    return (
        <Row>
            <Col md={3}>
                <h2>my profile</h2>
                {error && <Message variant='danger' text={error} />}
                {message && <Message variant='danger' text={message} />}
                {loading && <Loader />}
                <Form>
                    <Form.Group controlId='name'>
                        <Form.Label>FullName</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter FullName'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group className='mt-4' controlId='email'>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='Enter Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group className='mt-4' controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Enter Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group className='mt-4' controlId='confirmPassword'>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Enter Confirm Password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Button
                        type='submit'
                        className='my-4 col-6'
                    >
                        update
                    </Button>
                </Form>
            </Col>
            <Col md={8}>
                <h2>my orders</h2>
            </Col>
        </Row>
    )
}

export default ProfileScreen