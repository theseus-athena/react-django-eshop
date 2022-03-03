import React, { useState, useEffect } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useSelector, useDispatch } from 'react-redux'
import { getUserDetailsAction, updateUserProfileAction } from '../actions/userActions'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'
function ProfileScreen({ history }) {
    // local states
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')
    const [successUpdate, setSuccessUpdate] = useState('')

    // handle getUserDetails
    const dispatch = useDispatch()
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    const userDetails = useSelector(state => state.userDetails)
    const { user } = userDetails
    const errorOfUserDetails = userDetails.error
    const loadingOfUserDetails = userDetails.loading

    const userUpdateProfile = useSelector(state => state.userUpdateProfile)
    const { success } = userUpdateProfile
    const errorOfUserUpdateProfile = userUpdateProfile.error
    const loadingOfUserUpdateProfile = userUpdateProfile.loading

    var loading = false
    var error = ''

    if (loadingOfUserDetails || loadingOfUserUpdateProfile) {
        loading = true
    }

    if (errorOfUserDetails) {
        error = errorOfUserDetails
    } else if (errorOfUserUpdateProfile) {
        error = errorOfUserUpdateProfile
    }





    useEffect(() => {
        if (!userInfo) {
            history.push('/login')
        } else {
            if (!user || !user.name || success) {
                dispatch({ type: USER_UPDATE_PROFILE_RESET })
                dispatch(getUserDetailsAction('profile'))
            } else {
                setEmail(user.email)
                setName(user.name)
            }
        }
    }, [history, userInfo, user, dispatch, success])

    const submitHandler = (e) => {
        e.preventDefault()
        if (password != confirmPassword) {
            setMessage('Passwords do not match !')
        } else {
            dispatch(updateUserProfileAction({
                'id': user._id,
                'name': name,
                'email': email,
                'password': password
            }))
            setMessage('')
            setPassword('')
            setConfirmPassword('')
            setSuccessUpdate('Profile successfully updated !')
        }
    }
    return (
        <Row>
            <Col md={3}>
                <h2>my profile</h2>
                {
                    loading ? <Loader />
                        : error ? <Message variant='danger' text={error} />
                            : message ? <Message variant='danger' text={message} />
                                : successUpdate ? <Message variant='success' text={successUpdate} />
                                    : <></>
                }
                <Form onSubmit={submitHandler}>
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