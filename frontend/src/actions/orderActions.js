import {
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_FAIL,
} from '../constants/orderConstants'

import { CART_CLEAR_ITEMS } from '../constants/cartConstatns'

import axiosInstance from '../utils/axiosInstance'


export const createOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_CREATE_REQUEST })

        const { userLogin: { userInfo } } = getState()

        const authRequestAxios = axiosInstance(userInfo, dispatch)

        const { data } = await authRequestAxios.post(
            '/api/v1/orders/add/',
            order
        )

        dispatch({ type: ORDER_CREATE_SUCCESS, payload: data })

        dispatch({ type: CART_CLEAR_ITEMS })

        localStorage.removeItem('cartItems')
    } catch (error) {
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message
        })
    }
}
