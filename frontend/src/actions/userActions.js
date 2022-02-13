import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
} from '../constants/userConstants'

import axios from 'axios'


export const userLoginAction = (email, password) => async (dispatch) => {
    try {
        dispatch({// USER_LOGIN_REQUEST
            type: USER_LOGIN_REQUEST,
        })

        const config = {// request setting
            header: {
                'Content-type': 'application/json'
            }
        }

        const { data } = await axios.post(// send request login
            '/api/v1/users/login/',
            { 'username': email, 'password': password },
            config,
        )

        dispatch({// USER_LOGIN_SUCCESS
            type: USER_LOGIN_SUCCESS,
            payload: data
        })

        localStorage.setItem(// save user information in local storage
            'userInfo',
            JSON.stringify(data)
        )

    } catch (error) {
        dispatch({// USER_LOGIN_FAIL
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message
        })
    }

}