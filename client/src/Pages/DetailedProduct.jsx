import React, { useState, useEffect } from "react";
import Layout from "../Layout/Layout.jsx";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card } from "antd";
import toast from "react-hot-toast";

const { Meta } = Card;

function DetailedProduct() {
  const params = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]); // Define cart state
  const [prod, setProd] = useState(null); // Define product state, initialize as null to handle loading state
  const [relatedProducts, setRelatedProducts] = useState([]); // Define related products state

  const getProducts = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/product/get-product/${params.slug}`
      );

      if (data?.product) {
        setProd(data.product);
        getRelatedProducts(data.product._id, data.product.category._id); // Fetch related products
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRelatedProducts = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/product/related-product/${pid}/${cid}`
      );

      if (data?.products) {
        setRelatedProducts(data.products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params.slug) getProducts();
  }, [params.slug]);

  if (!prod) {
    return <div>Loading...</div>; // Or any other loading indicator
  }

  return (
    <Layout>
      <div className="text-center">
        <h1 className="text-2xl font-bold">Product Details</h1>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
          <div className="md:col-span-1">
            <img
              alt={prod.name}
              src={`http://localhost:8080/api/v1/product/product-photo/${prod._id}`}
            />
          </div>
          <div className="md:col-span-1">
            <h1 className="text-4xl font-serif font-bold">{prod.name}</h1>
            <h2 className="text-xl font-serif mt-24">{prod.description}</h2>
            <h2 className="text-xl font-serif">${prod.price}</h2>
            <h2>{prod?.category?.name}</h2>
            <Button
              type="default"
              className="ml-2 mt-5"
              onClick={() => {
                setCart([...cart, prod]);
                localStorage.setItem("cart", JSON.stringify([...cart, prod]));
                //localStorage.setItem("cart", JSON.stringify([...cart, p]));
                toast.success("Item Added to cart");
              }}
            >
              Add to Cart
            </Button>
          </div>
          <div className="md:col-span-2 text-4xl font-serif mt-10 mb-11">
            Related Products
            <div>
              <h1 className="text-xl font-serif font-bold">
                {relatedProducts.length < 1 ? <h1>no similar products</h1> : ""}
              </h1>
              {relatedProducts?.map((p) => (
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
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default DetailedProduct;
