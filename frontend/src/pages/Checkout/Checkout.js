/** @format */

import React, { useEffect, useState } from "react";
import Meta from "../../components/Meta/Meta";
import Breadcrumb from "./../../components/Breadcrumb/Breadcrumb";
import paypal from "../../assets/images/thanh-toan/paypal.jpg";

import { useDispatch, useSelector } from "react-redux";
import { formatPrice } from "./../../utils/helper";
import axios from "axios";
import {
  createOrder,
  payOrder,
} from "../../actions/orderActions";
import { PayPalButton } from "react-paypal-button-v2";
import { toast } from "react-toastify";

function Checkout(props) {
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const { order, success,paymentResult } = useSelector((state) => state.orderCreate);
  const { userInfo } = useSelector((state) => state.userSignin);
  console.log(order)
  if (!userInfo) {
    props.history.push("/dang-nhap");
  }

  // if (cartItems.length === 0) {
  //   props.history.push("/gio-hang");
  // }
  const dispatch = useDispatch();

  const totalPrice = cartItems.reduce((a, c) => a + c.price * c.amount, 0);

  const shippingFee = totalPrice > 500000 ? 0 : 25000;
  const totalOrder = totalPrice + shippingFee;
  const totalOrderDollar = (totalOrder / 22760).toFixed(2);

  const [province, setProvince] = useState("");
  const [provinceCode, setProvinceCode] = useState("");
  const [district, setDistrict] = useState("");
  const [districtCode, setDistrictCode] = useState("");
  const [wards, setWards] = useState("");

  //Order info
  const [fullname, setFullname] = useState("");
  const [numberPhone, setNumberPhone] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [provinceCustomer, setProvinceCustomer] = useState();
  const [districtCustomer, setDistrictCustomer] = useState();
  const [wardsCustomer, setWardsCustomer] = useState();
  const [address, setAddress] = useState("");
  const [noteOrder, setNoteOrder] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    const addPayPalScript = async () => {
      const { data } = await axios.get("/api/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if (!window.paypal) {
      addPayPalScript();
    } else {
      setSdkReady(true);
    }
  }, [sdkReady]);

  useEffect(() => {
    if(success){
      dispatch(payOrder(order, paymentResult));
      props.history.push(`thanh-toan/order-complete/${order._id}`);
    }
  },[dispatch,success,props.history,order,paymentResult])
  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult);
    if (paymentResult ) {
      dispatch(
        createOrder({
          ...cart,
          orderItems: cart.cartItems,
          checkoutDetails: {
            paymentMethod,
            fullname,
            numberPhone,
            email,
            company,
            provinceCustomer,
            districtCustomer,
            wardsCustomer,
            address,
            noteOrder,
            totalPrice,
            shippingFee,
            totalOrder,
          },
          paymentResult: {
            id: paymentResult.id,
            status: paymentResult.status,
            update_time: paymentResult.update_time,
            email_address: paymentResult.payer.email_address,
          },
        })
      );
      
    }

    toast.error(paymentResult.err);
  };

  useEffect(() => {
    axios.get("https://provinces.open-api.vn/api/p").then((res) => {
      setProvince(res.data);
    });

    if (provinceCode) {
      axios
        .get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
        .then((res) => {
          setDistrict(res.data.districts);
          setProvinceCustomer(res.data.name);
        });
    }
    if (districtCode) {
      axios
        .get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
        .then((res) => {
          setWards(res.data.wards);
          setDistrictCustomer(res.data.name);
        });
    }
  }, [provinceCode, districtCode]);

  const submitHandler = (e) => {
    e.preventDefault();
    const data = {
      paymentMethod,
      fullname,
      numberPhone,
      email,
      company,
      provinceCustomer,
      districtCustomer,
      wardsCustomer,
      address,
      noteOrder,
      totalPrice,
      shippingFee,
      totalOrder,
    };
    dispatch(
      createOrder({
        ...cart,
        orderItems: cart.cartItems,
        checkoutDetails: data,
      })
    );
    if (order) {
      props.history.push(`/thanh-toan/order-complete/${order._id}`);
    }
  };

  // const placeOrder = () => {
  //   dispatch(createOrder({ ...cart, orderItems: cart.cartItems }));
  // };

  return (
    <div>
      <Meta title="Thanh Toán" />
      <Breadcrumb title="Thanh Toán" />
      <form action="" onSubmit={submitHandler}>
        <div className="py-20 px-8 grid grid-cols-2">
          <div className="pr-5">
            <h2 className="text-xl font-semibold capitalize mb-5 ">
              Thông Tin Thanh Toán
            </h2>

            <div className="flex items-center">
              <div className="mb-5 mx-3">
                <label htmlFor="hovaten">
                  Họ và Tên <span className="text-red-600">*</span>
                </label>
                <input
                  className="block w-64 border mt-1 text-15 border-solid border-black p-2 rounded-none focus:outline-none focus:border-red-1 focus:placeholder-transparent"
                  type="text"
                  id="hovaten"
                  placeholder="Nhập Họ và Tên"
                  value={fullname}
                  required
                  onChange={(e) => setFullname(e.target.value)}
                />
              </div>
              <div className="mb-5 mx-3">
                <label htmlFor="sodienthoai">
                  Số điện thoại <span className="text-red-600">*</span>
                </label>
                <input
                  className="block w-64 border mt-1 text-15 border-solid border-black p-2 rounded-none focus:outline-none focus:border-red-1 focus:placeholder-transparent"
                  type="text"
                  placeholder="Nhập Số Điện Thoại"
                  value={numberPhone}
                  onChange={(e) => setNumberPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center ">
              <div className="mb-5 mx-3">
                <label htmlFor="email">
                  Địa chỉ Email <span className="text-red-600">*</span>
                </label>
                <input
                  className="block w-64 border mt-1 text-15 border-solid border-black p-2 rounded-none focus:outline-none focus:border-red-1 focus:placeholder-transparent"
                  type="email"
                  id="email"
                  placeholder="Nhập Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <div className="mb-5 mx-3">
                  <label htmlFor="company">Công ty (nếu có)</label>
                  <input
                    className="block w-64 border mt-1 text-15 border-solid border-black p-2 rounded-none focus:outline-none focus:border-red-1 focus:placeholder-transparent"
                    type="text"
                    id="company"
                    placeholder="Nhập Tên Công Ty"
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="mb-5 mx-3">
                <label className="block text-left">
                  <span className="text-gray-700">
                    Tỉnh/ thành phố <span className="text-red-600">*</span>
                  </span>
                  <select
                    className="block w-64 border mt-1 text-15 border-solid border-black p-2 rounded-none focus:outline-none focus:border-red-1 focus:placeholder-transparent "
                    onChange={(e) => setProvinceCode(e.target.value)}
                  >
                    <option value=""></option>
                    {province &&
                      province.map((x, index) => {
                        return (
                          <option key={index} value={x.code}>
                            {x.name}
                          </option>
                        );
                      })}
                  </select>
                </label>
              </div>
              {/* Quận Huyện */}
              <div className="mb-5 mx-3">
                <label className="block text-left">
                  <p className="text-gray-700">
                    Quận huyện <span className="text-red-600">*</span>
                  </p>
                  <select
                    className="block w-64 border mt-1 text-15 border-solid border-black p-2 rounded-none focus:outline-none focus:border-red-1 focus:placeholder-transparent"
                    onChange={(e) => setDistrictCode(e.target.value)}
                  >
                    <option value=""></option>
                    {district &&
                      district.map((x, index) => {
                        return (
                          <option key={index} value={x.code}>
                            {x.name}
                          </option>
                        );
                      })}
                  </select>
                </label>
              </div>
            </div>
            {/* Phường Xã */}
            <div className="flex items-center">
              <div className="mb-5 mx-3">
                <label className="block text-left">
                  <p className="text-gray-700">
                    Phường Xã <span className="text-red-600">*</span>
                  </p>
                  <select
                    className=" block w-64 border mt-1 text-15 border-solid border-black p-2 rounded-none focus:outline-none focus:border-red-1 focus:placeholder-transparent"
                    onClick={(e) => setWardsCustomer(e.target.value)}
                  >
                    <option value=""></option>
                    {wards &&
                      wards.map((x, index) => {
                        return (
                          <option key={index} value={x.name}>
                            {x.name}
                          </option>
                        );
                      })}
                  </select>
                </label>
              </div>
              <div className="mb-5 mx-3">
                <label htmlFor="diachigiaohang">
                  Địa Chỉ Giao Hàng<span className="text-red-600">*</span>{" "}
                </label>
                <input
                  className="block w-64 border mt-1 text-15 border-solid border-black p-2 rounded-none focus:outline-none focus:border-red-1 focus:placeholder-transparent"
                  type="text"
                  id="diachigiaohang"
                  placeholder="Nhập Địa Chỉ Giao Hàng"
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

            <textarea
              className="block w-full mx-3 h-44 mt-8 border border-solid p-3 border-black rounded-none outline-none focus:border-red-1"
              name="thongtinbosung"
              id=""
              placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
              value={noteOrder}
              onChange={(e) => setNoteOrder(e.target.value)}
            ></textarea>
          </div>

          <div className="p-10 ml-5 border border-gray border-solid">
            <h2 className="text-xl font-semibold capitalize mb-5">
              Đơn Hàng của bạn
            </h2>
            <div className="mb-7">
              <div>
                <div className="flex justify-between mb-5">
                  <span className="font-semibold">Sản Phẩm</span>
                  <span className="font-semibold">Tạm Tính </span>
                </div>
                {cartItems.map((item) => {
                  return (
                    <div
                      key={item.product}
                      className="flex justify-between border-gray-7 py-2 border-t border-solid"
                    >
                      <span className="pr-3">
                        {item.name}{" "}
                        <span className="ml-3">
                          <i className="material-icons text-10">close</i>
                          {item.amount}
                        </span>{" "}
                      </span>
                      <span>
                        {formatPrice(Number(item.amount) * Number(item.price))}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between py-4 border-gray-7 border-t border-solid">
                <span className="font-semibold"> Tổng tiền : </span>{" "}
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between py-4 border-gray-7 border-t border-solid">
                <span className="font-semibold"> Phí ship : </span>
                <span>{formatPrice(shippingFee)}</span>
              </div>
              <div className="flex justify-between pt-6 border-gray-7 border-t border-solid">
                <span className="font-semibold"> Tổng Đơn Hàng : </span>
                <span>{formatPrice(totalOrder)}</span>
              </div>
            </div>
            <div className="">
              <h2 className="text-xl font-semibold capitalize mb-5">
                Phương Thức Thanh Toán
              </h2>
              <ul className="mb-5">
                <li className="mb-3">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio "
                      name="paymentMethod"
                      value="Thanh Toán Khi Nhận Hàng"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="ml-2 capitalize">
                      Thanh Toán Khi Nhận Hàng
                    </span>
                  </label>
                </li>
                <li className="mb-3">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio"
                      name="paymentMethod"
                      value="Chuyển Khoản Ngân Hàng"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="ml-2 capitalize">
                      Chuyển Khoản Ngân Hàng
                    </span>
                  </label>
                </li>
                <li className="mb-3">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio"
                      name="paymentMethod"
                      value="Paypal"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="ml-2 capitalize inline-block">
                      {" "}
                      <img src={paypal} alt="" />
                    </span>
                  </label>
                </li>
                {/* <li className="mb-3">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio"
                      name="paymentMethod"
                      value="Thanh Toán Qua VNPAY"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="ml-2 capitalize flex items-center">
                      <span className="mr-2">Thanh Toán Qua VNPAY</span>
                      <img src={vnpayimg} alt="" className="w-10 h-10 block" />
                    </span>
                  </label>
                </li> */}
              </ul>

              {paymentMethod === "Paypal" ? (
                <PayPalButton
                  amount={totalOrderDollar}
                  onSuccess={successPaymentHandler}
                ></PayPalButton>
              ) : (
                <button
                  type="submit"
                  className="px-8 py-2 bg-transparent border-2 border-solid border-black hover:border-red-1 hover:bg-red-1 hover:text-white"
                  // onClick={placeOrder}
                >
                  Đặt Hàng
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Checkout;
