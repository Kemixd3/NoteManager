import "./frontcss.css";
import AuthenticatedView from "./components/AuthenticatedView";
import { AuthProvider } from "./Context/AuthContext";
function App() {
  return (
    <AuthProvider>
      <AuthenticatedView />
    </AuthProvider>
  );
}

export default App;
