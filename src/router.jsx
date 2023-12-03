import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/home";
import POOversigt from "./pages/oversigt";
import Account from "./components/Account";
import StockReceiving from "./pages/scanning";

function Router({ user, userData }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<HomePage user={user} userData={userData} />}
        />
        <Route
          path="/account"
          element={<Account user={user} userData={userData} />}
        />
        <Route
          path="/PO"
          element={<POOversigt userData={userData.userOrg} />}
        />
        <Route
          path="/scan/:id"
          element={<StockReceiving user={user} userData={userData} />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
