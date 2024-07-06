import React, { useEffect, useState } from "react";
import Layout from "./../Layout/Layout";
import axios from "axios";
import { Card, Checkbox, Radio, Button } from "antd";
import { Prices } from "./Prices";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useAuth } from "../context/auth.jsx"; // Import useAuth

const { Meta } = Card;

function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [cart, setCart] = useState([]); // Define cart state
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { auth } = useAuth(); // Use auth from context

  const getProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      if (data.success) setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/v1/category/get-category"
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/v1/product/product-count"
      );
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (page == 1) return;
    loadmore();
  }, [page]);
  const loadmore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      if (data.success) setProducts([...products, ...data?.products]);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const filterProduct = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/v1/product/product-filters",
        {
          checked,
          radio,
        }
      );
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  useEffect(() => {
    if (!checked.length && !radio.length) getProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  return (
    <Layout>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3 p-3 m-3">
          <h3>Filter by category</h3>
          <div className="flex flex-col space-y-5 p-3 m-3">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          <div className="">
            <h3 className="mt-4">Filter By Price</h3>
            <div>
              <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                {Prices?.map((p) => (
                  <div key={p._id} className="m-2 mt-5">
                    <Radio value={p.array}>{p.name}</Radio>
                  </div>
                ))}
              </Radio.Group>
            </div>
            <button
              className="btn mt-5 btn-error"
              onClick={() => window.location.reload()}
            >
              {" "}
              Reset Filter
            </button>
          </div>
        </div>

        <div className="col-span-9">
          <h1 className="text-center text-4xl text-sky-900">Products</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
            {products?.map((p) => (
              <Card
                key={p._id}
                hoverable
                style={{ width: 300 }}
                className="m-3 p-2"
                cover={
                  <img
                    alt={p.name}
                    src={`http://localhost:8080/api/v1/product/product-photo/${p._id}`}
                  />
                }
              >
                <Meta title={p.name} description={p.description} />
                <div className="card-name-price mt-3">
                  <h5 className="card-title">
                    {p.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </h5>
                </div>
                <div className="mt-3">
                  <Button
                    type="primary"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    More Details
                  </Button>
                  <Button
                    type="default"
                    className="ml-2"
                    onClick={() => {
                      setCart([...cart, p]);
                      localStorage.setItem(
                        "cart",
                        JSON.stringify([...cart, p])
                      );
                      toast.success("Item Added to cart");
                    }}
                  >
                    Add to Cart
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn btn-info"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? "loading..." : "loadmore"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;
