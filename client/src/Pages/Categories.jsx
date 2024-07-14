import React from "react";
import Layout from "../Layout/Layout";
import useCategory from "../hooks/useCategory";
import { Link } from "react-router-dom";

function Categories() {
  const categories = useCategory();
  return (
    <Layout>
      <h1 className="text-center text-4xl"> All categories</h1>
      <div className="grid grid-cols-4 gap-4 p-4 m-4 mt-10">
        {categories?.map((c) => {
          return (
            <div key={c._id}>
              <button className="btn btn-primary">
                <Link to={`/category/${c.slug}`}>{c.name}</Link>
              </button>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}

export default Categories;
