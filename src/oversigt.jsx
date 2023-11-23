import React, { useState, useEffect } from "react";
import "./POOversigt.css";

const POOversigt = () => {
  const [productOrders, setProductOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //mangler at connect til API


        const response = await get("/api/productOrders");
        
        
        
        
        setProductOrders(response.data);
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
          <tr
            key={order.id}
            onClick={() => handleOrderClick(order.id)}
          >
            <td>{order.orderName}</td>
            <td>{order.orderTime}</td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default POOversigt;
