import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "./api";
import toast from "react-hot-toast";

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dormitoryid, setDormitoryId] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    const userData = {
      username,
      password,
      email,
      dormitoryid,
    };

      try {
    const response = await fetch(`${API_BASE_URL}/api/User/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.data);
      toast.success("Sikeres regisztráció!");
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

  const handleToLogin = () => {
    navigate("/login");
  };

  return (
    <div>
      <h2>Regisztráció</h2>
      <input
        type="text"
        placeholder="Felhasználónév"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
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
      <input
        type="number"
        placeholder="Kollégium id"
        value={dormitoryid}
        onChange={(e) => setDormitoryId(e.target.value)}
      />
      <button onClick={handleRegister}>Fiók regisztrálása</button>
      <button onClick={handleToLogin}>Bejelentkezés meglévő fiókkal</button>
    </div>
  );
};

export default RegisterPage;
