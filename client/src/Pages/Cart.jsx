import React, { useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
function Cart() {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleCartItem = (pid) => {
    try {
      const myCart = [...cart];
      let idx = myCart.findIndex((item) => item._id === pid);
      myCart.splice(idx, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
      toast.success("Patient removed successfuly");
    } catch (error) {
      console.log(error);
    }
  };

  const getToken = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/v1/product/braintree/token",
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );
      if (!data?.token) console.log("here");
      setClientToken(data?.token);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getToken();
  }, [auth?.token]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post(
        "http://localhost:8080/api/v1/product/braintree/payment",
        {
          nonce,
          cart,
        },
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully ");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="text-center my-10">
        <h1 className="text-3xl font-bold">
          {`Hello ${auth?.user?.name ? auth.user.name : ""}, you have ${
            cart?.length
          } Patients with critical condition`}
        </h1>
        {!auth?.token && (
          <button
            className="mt-5 btn btn-primary"
            onClick={() => navigate("/login")}
          >
            Login to Checkout
          </button>
        )}
      </div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 bg-blue-50 p-6 rounded-lg shadow-md">
            {cart.length === 0 ? (
              <p className="text-center text-xl">Your cart is empty</p>
            ) : (
              cart.map((p, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 border-b py-4 items-center"
                >
                  <div className="col-span-4">
                    <img
                      alt={p.name}
                      className="w-full h-auto object-cover rounded-lg"
                      src={`http://localhost:8080/api/v1/product/product-photo/${p._id}`}
                    />
                  </div>
                  <div className="col-span-8 pl-4">
                    <h2 className="text-2xl font-bold">{p.name}</h2>
                    <p className="text-gray-600">{p.description}</p>
                    <p className="text-lg font-semibold mt-2">
                      {p.price} years old
                    </p>
                    <button
                      className="p-2 border rounded-lg mt-2 bg-red-400"
                      onClick={() => handleCartItem(p._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="col-span-4 bg-green-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Patient Summary</h2>
            <p className="text-lg">
              <span className="font-semibold">Total Patient:</span>{" "}
              {cart.length}
            </p>
            <p className="text-lg mb-4">
              {/* <span className="font-semibold">Total Price:</span>{" "} */}
              {/* {cart
                .reduce((total, item) => total + item.price, 0)
                .toLocaleString("en-US", {
                  style: "currency",
                  currency: "INR",
                })} */}
            </p>
            <button className="btn btn-success w-full">
              Proceed to Ventilation
            </button>
            {auth?.user?.address ? (
              <div className="mt-2">
                <h4 className="text-2xl font-semibold">
                  Current Availability at:
                </h4>
                <h5 className="text-xl">{auth?.user?.address}</h5>
                <button
                  onClick={() => navigate("/dashboard/user/profile")}
                  className="btn btn-success mt-2 "
                  type="button"
                >
                  Update address
                </button>
              </div>
            ) : (
              <div className="mb-3">
                {auth?.token ? (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() =>
                      navigate("/login", {
                        state: "/cart",
                      })
                    }
                  >
                    Plase Login to Allot ventilators
                  </button>
                )}
              </div>
            )}
            {/* <div className="mt-2">
              {!clientToken || !auth?.token || !cart?.length ? (
                ""
              ) : (
                <>
                  <DropIn
                    options={{
                      authorization: clientToken,
                      paypal: {
                        flow: "vault",
                      },
                    }}
                    onInstance={(instance) => setInstance(instance)}
                  />

                  <button
                    className="btn btn-primary mt-3"
                    onClick={handlePayment}
                    disabled={loading || !instance || !auth?.user?.address}
                  >
                    {loading ? "Processing ...." : "Make Payment"}
                  </button>
                </>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Cart;
