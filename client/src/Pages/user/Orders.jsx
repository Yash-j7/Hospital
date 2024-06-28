import React from "react";
import Layout from "../../Layout/Layout";
import UserMenu from "../../Layout/UserMenu";

function Orders() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-3">
            <UserMenu />
          </div>
          <div className="md:col-span-9">
            <div className="bg-white shadow-md rounded-lg p-4"></div>
            <div>orders</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Orders;
