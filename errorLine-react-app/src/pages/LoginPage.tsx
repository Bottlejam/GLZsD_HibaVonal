import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "./api";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    const userData = {
      email,
      password,
    };

    try {
      console.log(JSON.stringify({ email, password }));
      const response = await fetch(`${API_BASE_URL}/api/User/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.data);
        console.log(data);
        alert("Sikeres bejelentkezés!");
        navigate("/Dashboard");
      } else {
        const error = await response.json();
        alert("Hiba: " + error.message);
      }
    } catch (error) {
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
      <button onClick={handleToRegistration}>Új fiók egisztrálása</button>
    </div>
  );
};

export default LoginPage;
