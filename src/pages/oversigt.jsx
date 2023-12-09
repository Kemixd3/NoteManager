import { useState, useEffect } from "react";
import "./POoversigt.css";
import Table from "@mui/material/Table"; //Testing out mui table libary
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { getPosts } from "../Controller/PurchaseOrderRoutes";

const POOversigt = (userData) => {
  const [purchaseOrders, setpurchaseOrders] = useState([]);
  document.title = "PO Overview";

  useEffect(() => {
    if (userData.userData) {
      const fetchData = async () => {
        try {
          const data = await getPosts(userData.userData);
          setpurchaseOrders(data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }
  }, []);

  const handleOrderClick = (orderId) => {
    window.location.href = `/scan/${orderId}`;
  };

  function createRow(order) {
    return {
      desc: "Order details", //data for each column
      order_id: order.order_id,
      Buyer: order.Buyer,
      notes: order.notes,
    };
  }

  const rows = purchaseOrders.map((order) => createRow(order));

  return (
    <TableContainer component={Paper}>
      <h2>Order Details</h2>
      <Table sx={{ minWidth: 700 }} aria-label="spanning table">
        <TableHead>
          <TableCell align="right">
            <strong>Order ID</strong>
          </TableCell>
          <TableCell align="right">
            <strong>Ordered By</strong>
          </TableCell>
          <TableCell align="right">
            <strong>Notes</strong>
          </TableCell>
          <TableCell align="right"></TableCell>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
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
