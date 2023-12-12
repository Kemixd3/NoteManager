import { useState, useEffect } from "react";
import "dhtmlx-gantt";
import { getPosts } from "../Controller/PurchaseOrderRoutes";
import "dhtmlx-gantt/codebase/skins/dhtmlxgantt_contrast_white.css";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./home.css";

export default function HomePage({ userData }) {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  document.title = "Home";

  useEffect(() => {
    if (userData && userData.Organization) {
      const fetchData = async () => {
        try {
          const data = await getPosts(userData.Organization);
          setPosts(data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }
  }, [userData, user]);

  useEffect(() => {
    if (posts.length > 0) {
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
        start_date: new Date(), //a Date object that sets the markers date
        css: "today", //a CSS class applied to the marker
        text: "Now", //the marker title
        title: dateToStr(new Date()), //the markers tooltip
      });

      // Load data into the gantt chart
      gantt.parse({ data: ganttData });
      gantt.getMarker(markerId);
      //Attach event handler for task click
      gantt.attachEvent("onTaskClick", (id, e) => {
        e.preventDefault();

        //Get order_id from the clicked task as string
        const clickedOrderId = id.toString();

        //Navigate to /scan/order.id when its clicked in the gantt
        navigate(`/scan/${clickedOrderId}`);
      });
    }
  }, [posts, navigate]);

  return (
    <section className="page">
      <section className="grid-container">
        <h1 className="text-center mb-4">Incoming Receivings</h1>
        <div
          id="gantt-container"
          style={{ width: "100%", height: "400px" }}
        ></div>
      </section>
    </section>
  );
}
