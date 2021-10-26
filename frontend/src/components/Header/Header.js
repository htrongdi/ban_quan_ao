/** @format */

import React, { useEffect, useState } from "react";
import TopHeader from "./../TopHeader/TopHeader";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import jwt from "jsonwebtoken";
import { signout } from "../../actions/userActions";
import { toast } from "react-toastify";
import { openModalSearch } from './../../actions/productActions';
import SearchBox from "../SearchBox/SearchBox";


function Header() {
  const { userInfo } = useSelector((state) => state.userSignin);
  const { cartItems } = useSelector((state) => state.cart);
  const [account, setAccount] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo) {
      jwt.verify(userInfo.token, "somthingsecret", (err, decode) => {
        setAccount(decode);
        toast.error(err);
      });
    }
  }, [userInfo]);
  return (
    <div>
      <TopHeader />
      <SearchBox/>
      <div>
        <div className="flex justify-between items-center px-12 py-6">
          <Link to="/" className="block w-36 ">
            <img src={logo} alt="logo" />
          </Link>
          <ul>
            <li className="inline text-15 uppercase pt-10px pb-10px leading-22 text-center px-3">
              <NavLink
                to="/"
                activeStyle={{
                  fontWeight: 600,
                }}
              >
                Trang Chủ
              </NavLink>
            </li>
            <li className="inline text-15 uppercase pt-10px pb-10px leading-22 text-center px-3">
              <NavLink
                to="/san-pham"
                activeStyle={{
                  fontWeight: 600,
                }}
              >
                Sản Phẩm
              </NavLink>
            </li>
            <li className="inline text-15 uppercase pt-10px pb-10px leading-22 text-center px-3">
              <NavLink
                to="/huong-dan-chinh-sach"
                activeStyle={{
                  fontWeight: 600,
                }}
              >
                Hướng Dẫn - Chính Sách
              </NavLink>
            </li>
            <li className="inline text-15 uppercase pt-10px pb-10px leading-22 text-center px-3">
              <NavLink
                to="/lien-he"
                activeStyle={{
                  fontWeight: 600,
                }}
              >
                Liên Hệ
              </NavLink>
            </li>
          </ul>
          <ul className="">
            <li className="inline-block text-xl leading-5 mx-3">
              {account && userInfo ? (
                <div className="dropdown">
                  <Link
                    to="#"
                    className=" group text-base text-black font-semibold inline-block"
                  >
                    Hi, {account.name}
                  </Link>
                  <ul className="dropdown-menu w-32 bg-red-300 p-4">
                    <li>
                      <Link to="/profile" className="text-base block ">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link to="/order" className="text-base block ">
                        Order
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        className="text-base block "
                        onClick={() => {
                          dispatch(signout());
                          toast.success("🦄 Đăng Xuất Thành Công!");
                        }}
                      >
                        Sign out
                      </Link>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link to="/dang-nhap">
                  <i className="fa fa-user-circle"></i>
                </Link>
              )}
            </li>
            <li className="inline text-xl leading-5 mx-3 cursor-pointer" onClick={() => dispatch(openModalSearch())}>
              <i className="fab fa-sistrix"></i>
            </li>
            <li className="inline-block text-xl leading-5 mx-3">
              <Link to="/gio-hang" className="relative">
                <i className="fa fa-shopping-bag "></i>
                <span className="block absolute -right-3 -top-2 font-semibold text-center leading-5 text-10 text-white w-5 h-5 rounded-full bg-red-1">
                  {cartItems ? cartItems.length : 0}
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;
