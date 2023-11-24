import { useState, useEffect } from "react";
import "./POOversigt.css";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

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

  function createRow(order) {
    return {
      desc: "Order details", // Provide meaningful data for each column
      order_id: order.order_id,
      Buyer: order.Buyer,
      notes: order.notes,
    };
  }

  const rows = productOrders.map((order) => createRow(order));

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="spanning table">
        <TableHead></TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.desc}</TableCell>
              <TableCell align="right">{row.order_id}</TableCell>
              <TableCell align="right">{row.Buyer}</TableCell>
              <TableCell align="right">{row.notes}</TableCell>
              <TableCell>
                <Button onClick={() => handleOrderClick(row.order_id)}>
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default POOversigt;
