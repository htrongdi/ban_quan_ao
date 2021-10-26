/** @format */

import axios from "axios";
import { CART_EMPTY } from "../constants/cartConstants";
import {
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_PAY_FAIL,
  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
} from "../constants/orderConstants";

export const createOrder = (order) => async (dispacth, getState) => {
  dispacth({ type: ORDER_CREATE_REQUEST, payload: order });
  try {
    const {
      userSignin: { userInfo },
    } = getState();
    const { data } = await axios.post("https://xstore-fashion.herokuapp.com/api/orders", order, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    dispacth({ type: ORDER_CREATE_SUCCESS, payload: data });
    dispacth({ type: CART_EMPTY });
    localStorage.removeItem("cartItems");
  } catch (error) {
    dispacth({
      type: ORDER_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const payOrder =
  (order, paymentResult) => async (dispatch, getState) => {
    dispatch({ type: ORDER_PAY_REQUEST, payload: { order, paymentResult } });
    const {
      userSignin: { userInfo },
    } = getState();
    try {
      const { data } = axios.put(
        `https://xstore-fashion.herokuapp.com/api/orders/${order._id}/pay`,
        paymentResult,
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      console.log("data",data)
      dispatch({ type: ORDER_PAY_SUCCESS, payload: data });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: ORDER_PAY_FAIL, payload: message });
    }
  };

// export const paymentWithVNPAY =
//   (id,amount, bankCode, orderDescription, orderType, language) =>
//   async (dispatch, getState) => {
//     dispatch({
//       type: ORDER_PAYMENT_VNPAY_REQUEST,
//       payload: { id,amount, bankCode, orderDescription, orderType, language },
//     });
//     const {
//       userSignin: { userInfo },
//     } = getState();
//     try {
//       const { data } = await axios.post(
//         "https://xstore-fashion.herokuapp.com/api/orders/create_payment_url",
//         { id, amount, bankCode, orderDescription, orderType, language },
//         {
//           headers: { Authorization: `Bearer ${userInfo.token}` },
//         }
//       );
//       dispatch({ type: ORDER_PAYMENT_VNPAY_SUCCESS, payload: data });
//     } catch (error) {
//       const message =
//         error.response && error.response.data.message
//           ? error.response.data.message
//           : error.message;
//       dispatch({ type: ORDER_PAYMENT_VNPAY_FAIL, payload: message });
//     }
//   };

export const detailsOrder = (orderId) => async (dispacth, getState) => {
  dispacth({ type: ORDER_DETAILS_REQUEST, payload: orderId });
  try {
    const {
      userSignin: { userInfo },
    } = getState();
    const { data } = await axios.get(`https://xstore-fashion.herokuapp.com/api/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    dispacth({ type: ORDER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispacth({
      type: ORDER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
