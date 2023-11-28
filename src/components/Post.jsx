import React, { useState, useEffect } from "react";
import "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import Post from "../components/Post";

export default function HomePage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function getPosts() {
      try {
        const response = await fetch("your-api-endpoint");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }

    getPosts();
  }, []);

  useEffect(() => {
    // Initialize dhtmlx-gantt
    gantt.init("gantt-container");

    // Transform posts into the format expected by dhtmlx-gantt
    const ganttData = posts.map(post => ({
      id: post.id,
      text: post.title,
      start_date: post.startDate,
      end_date: post.endDate,
    }));

    // Load data into the gantt chart
    gantt.parse({ data: ganttData });
  }, [posts]);

  return (
    <section className="page">
      <section className="grid-container">
        {/* Container for dhtmlx-gantt */}
        <div id="gantt-container" style={{ width: "100%", height: "400px" }}></div>

        {/* Render other components, such as the Post component */}
        {posts.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </section>
    </section>
  );
}
