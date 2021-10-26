/** @format */

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Loading from "../../components/Loading/Loading";
import { formatPrice } from "../../utils/helper";
import BankTransfer from "./BankTransfer/BankTransfer";
import { useDispatch } from "react-redux";
import { detailsOrder } from "../../actions/orderActions";

function OrderComplete(props) {
  const dispatch = useDispatch();
  const { order } = useSelector((state) => state.orderDetails);


  const orderId = props.match.params.id;

  useEffect(() => {
    dispatch(detailsOrder(orderId));
  }, [dispatch, orderId]);

  if (!order) return <Loading />;
  return (
    <div className="py-20 px-8 ">
      <h3 className="mb-6 text-2xl">
        Cảm ơn bạn. Đơn hàng của bạn đã được nhận.
      </h3>
      <div className="grid grid-cols-4 mb-4 pb-4 border-b-2 border-solid border-gray  ">
        <div>
          <h3 className="text-base uppercase font-semibold ">Mã đơn hàng</h3>
          <p className="text-gray">{order._id}</p>
        </div>
        <div>
          <h3 className="text-base uppercase font-semibold">Ngày</h3>
          <p className="text-gray">{order.createdAt}</p>
        </div>
        <div>
          <h3 className="text-base uppercase font-semibold ">Tổng Cộng</h3>
          <p className="text-gray">
            {formatPrice(order.checkoutDetails.totalOrder)}
          </p>
        </div>
        <div>
          <h3 className="text-base uppercase font-semibold ">
            Phương Thức Thanh Toán
          </h3>
          <p className="text-gray">{order.checkoutDetails.paymentMethod}</p>
        </div>
      </div>
      {order.checkoutDetails.paymentMethod === "Thanh Toán Khi Nhận Hàng" && (
        <h2 className="text-base font-semibold py-8 ">
          Trả tiền mặt khi nhận hàng.
        </h2>
      )}
      {order.checkoutDetails.paymentMethod === "Chuyển Khoản Ngân Hàng" && (
        <BankTransfer />
      )}
      {order.checkoutDetails.paymentMethod === "Paypal"  ? (
        <div>
          <p>
            <span>Trạng Thái : </span> <span>{`${order.paymentResult.status === 'COMPLETED' ? "Bạn Đã Thanh Toán Thành Công"  : "Thanh Toán Thất Bại"}`}</span>
          </p>
          <p>
            <span>Email thanh toán : </span>{" "}
            <span>{order.paymentResult.email_address}</span>
          </p>
        </div>
      ): ''}
    </div>
  );
}

export default OrderComplete;
