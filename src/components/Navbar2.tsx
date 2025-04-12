// components/Navbar2.tsx or Navbar.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar2 = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if token is present in localStorage
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="bg-white px-4 py-3 shadow flex justify-between items-center">
      <div className="text-xl font-bold text-indigo-700">SpeakSpace</div>
      <div className="space-x-4">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar2;
