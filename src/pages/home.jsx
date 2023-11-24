import React, { useState, useEffect } from "react";
import "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/skins/dhtmlxgantt_contrast_black.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

export default function HomePage({ user, userData }) {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    async function getPosts() {
      try {
        const response = await fetch("http://localhost:3001/orders/product-orders?org=" + userData.userData);
        const data = await response.json();
        console.log("a", data);
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }

    getPosts();
  }, []);

  useEffect(() => {
    gantt.init("gantt-container");

    const ganttData = posts.map(post => ({
      id: post.order_id,
      text: `Order ${post.order_id} - ${post.Buyer}`,
      start_date: new Date(post.order_date),
      end_date: new Date(post.expected_arrival),
    }));

    // Load data into the gantt chart
    gantt.parse({ data: ganttData });

    // Attach event handler for task click
    gantt.attachEvent("onTaskClick", (id, e) => {
        // Prevent default behavior
        e.preventDefault();
      
        // Get the order_id from the clicked task
        const clickedOrderId = id.toString(); // Convert to string
      
        // Navigate to /scan/order.id
        navigate(`/scan/${clickedOrderId}`);
      });
  }, [posts, navigate]);

  return (
    <section className="page">
      <section className="grid-container">
        <div id="gantt-container" style={{ width: "100%", height: "400px"}}></div>
      </section>
    </section>
  );
}
