import { useState, useEffect } from "react";
import "./POOversigt.css";

const POOversigt = (userData) => {
  const [productOrders, setProductOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //mangler at connect til API

        const getOrders = await fetch(
          "http://localhost:3001/orders/product-orders?org=" + userData.userData
        );
        const response = await getOrders.json();
        setProductOrders(response);
        console.log(productOrders);
        console.log(response);
      } catch (error) {
        console.error("Error fetching product orders:", error);
      }
    };

    fetchData();
  }, []);

  const handleOrderClick = (orderId) => {
    window.location.href = `/scan/${orderId}`;
  };

  return (
    <div className="container">
      <h1>PO oversigt</h1>
      <table>
        {productOrders.map((order) => (
          <tr key={order.id} onClick={() => handleOrderClick(order.id)}>
            <td>{order.notes}</td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default POOversigt;
