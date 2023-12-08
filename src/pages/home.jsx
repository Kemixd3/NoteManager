import { useState, useEffect } from "react";
import "dhtmlx-gantt";

import "dhtmlx-gantt/codebase/skins/dhtmlxgantt_contrast_white.css";

import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import { style } from "@mui/system";
import "./home.css";

export default function HomePage({ user, userData }) {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate
  document.title = 'Home';

  useEffect(() => {
    async function getPosts() {
      try {
        const response = await fetch(
          "http://localhost:3001/orders/purchase-orders?org=" + userData.userOrg
        );
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
    gantt.plugins({
      marker: true,
    });

    const ganttData = posts.map((post) => ({
      id: post.order_id,
      text: `Order ${post.order_id} - ${post.Buyer}`,
      start_date: new Date(post.order_date),
      end_date: new Date(post.expected_arrival),
    }));

    var dateToStr = gantt.date.date_to_str(gantt.config.task_date);
    var markerId = gantt.addMarker({
      start_date: new Date(), //a Date object that sets the marker's date
      css: "today", //a CSS class applied to the marker
      text: "Now", //the marker title
      title: dateToStr(new Date()), // the marker's tooltip
    });

    // Load data into the gantt chart
    gantt.parse({ data: ganttData });
    gantt.getMarker(markerId);
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
        <div
          id="gantt-container"
          style={{ width: "100%", height: "400px" }}
        ></div>
      </section>
    </section>
  );
}
