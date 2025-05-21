import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "./api";
import toast from "react-hot-toast";
import { useAuth } from "./actions/AuthContext";  // hozzáadva

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();  // contextből a login metódus
  const navigate = useNavigate();

  const handleLogin = async () => {
  const userData = { email, password };

  try {
    const response = await fetch(`${API_BASE_URL}/api/User/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
  const result = await response.json();
  console.log("Login response:", result);

  if (!result.data || !result.data.token || !result.data.user) {
    toast.error("Hiányzó adat a válaszban.");
    return;
  }

  // Itt átadod a contextnek csak a token-t és a user objektumot
  login(result.data.token, result.data.user);

  toast.success("Sikeres bejelentkezés!");
  navigate("/dashboard");
} else {
      const error = await response.json();
      toast.error("Hiba: " + error.message);
    }
  } catch (error) {
    toast.error("Hálózati hiba történt.");
    console.error(error);
  }
};
  const handleToRegistration = () => {
    navigate("/register");
  };

  return (
    <div>
      <h2>Bejelentkezés</h2>
      <input
        type="text"
        placeholder="Email cím"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Jelszó"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="button" onClick={handleLogin}>
        Bejelentkezés
      </button>
      <button onClick={handleToRegistration}>Új fiók regisztrálása</button>
    </div>
  );
};

export default LoginPage;