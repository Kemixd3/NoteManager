import "./SignInButton.css";
import { useAuth } from "../Context/AuthContext";

const SignInButton = () => {
  const { login } = useAuth();
  return (
    <div className="center">
      <div className="button-container">
        <button className="sign-in-button" onClick={login}>
          Sign in
        </button>
      </div>
    </div>
  );
};

export default SignInButton;
