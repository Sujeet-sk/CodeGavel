import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    navigate("/login", { replace: true });
  }

  return (
    <button className="cg-logout-button" onClick={handleLogout}>
      <LogOut size={15} />
      <span>Log out</span>
    </button>
  );
}

export default LogoutButton;
