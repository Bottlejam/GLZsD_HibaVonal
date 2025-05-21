import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope, FaBuilding } from "react-icons/fa";
import "./LoginPage.css";
import "./index.css";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const isRegister = location.pathname === "/register";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [username, setUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [dormitoryId, setDormitoryId] = useState("");

  const switchToRegister = () => {
    navigate("/register");
  };

  const switchToLogin = () => {
    navigate("/login");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData = {
      email,
      password,
    };

    try {
      const response = await fetch("https://localhost:7020/api/User/login", {
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
      console.error("Hálózati hiba:", error);
      alert("Hálózati hiba történt.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData = {
      username,
      password: registerPassword,
      email: registerEmail,
      dormitoryid: dormitoryId,
    };

    try {
      const response = await fetch("https://localhost:7020/api/User/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert("Sikeres regisztráció!");
        navigate("/login");
      } else {
        const error = await response.json();
        alert("Hiba: " + error.message);
      }
    } catch (error) {
      console.error("Hálózati hiba:", error);
      alert("Hálózati hiba történt.");
    }
  };

  return (
    <div className={`wrapper${isRegister ? " active" : ""}`}>
      {/* Bejelentkezés */}
      <div className="form-box login">
        <form onSubmit={handleLogin}>
          <h1>Bejelentkezés</h1>
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FaEnvelope className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Jelszó"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FaLock className="icon" />
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox" />
              Emlékezz rám{/* Ez moodle-be se működik, se sehol máshol a neten, ezért nincs backendje*/}
            </label>
            <a href="#">Elfelejtettem a jelszót</a>
          </div>

          <button className="thick" type="submit">Bejelentkezés</button>

          <div className="register-link">
          <p>
            Nincs fiókja?
            <button type="button" className="link-button" onClick={switchToRegister}>
            Regisztráljon!
            </button>
          </p>

          </div>
        </form>
      </div>

      {/* Regisztráció */}
      <div className="form-box register">
        <form onSubmit={handleRegister}>
          <h1>Regisztráció</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Felhasználónév"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              required
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
            <FaEnvelope className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Jelszó"
              required
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
            <FaLock className="icon" />
          </div>
          <div className="input-box">
            <input
              type="number"
              placeholder="Kollégium ID"
              required
              value={dormitoryId}
              onChange={(e) => setDormitoryId(e.target.value)}
            />
            <FaBuilding className="icon"/>
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox" />
              Elfogadom a felhasználói szabályzatot
            </label>
          </div>

          <button className="thick" type="submit">Regisztráció</button>

          <div className="register-link">
            <p>
              Van már fiókja?
              <button type="button" className="link-button" onClick={switchToLogin}>
              Bejelentkezés!
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
