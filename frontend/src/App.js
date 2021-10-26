/** @format */

import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./assets/styles/css/tailwind.css";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import { ToastContainer } from "react-toastify";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import GoToTop from "./components/GoToTop/GoToTop";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import Products from './pages/Products/Products';
import OrderComplete from './pages/OrderComplete/OrderComplete';


export default function App() {
  return (
    <BrowserRouter>
      <GoToTop />
      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Header />
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/dang-nhap" component={Login} exact />
        <Route path="/dang-ky" component={Register} exact />
        <Route path="/san-pham/:id" component={ProductDetails} exact />
        <Route path="/san-pham" component={Products} exact />
        <Route path="/gio-hang" component={Cart} exact />
        <Route path="/thanh-toan" component={Checkout} exact />
        <Route path="/thanh-toan/order-complete/:id" component={OrderComplete} />
      </Switch>
      <ScrollToTop showBelow={250} />
      <Footer />
    </BrowserRouter>
  );
}
