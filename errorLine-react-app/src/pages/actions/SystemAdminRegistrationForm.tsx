import { useState } from "react";
import API_BASE_URL from "../api";

const SystemAdminRegistrationForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      username,
      email,
      password,
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/User/SystemAdmin/registerSystemAdmin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        alert("Sikeres regisztráció!");
        const result = await response.json();
        console.log(result);
      } else {
        const error = await response.json();
        alert("Hiba: " + error.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>SystemAdmin - Rendszeradminisztrátor regisztrálása</h3>
      <input
        type="text"
        placeholder="Felhasználónév"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email cím"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Jelszó"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Regisztrálás</button>
    </form>
  );
};

export default SystemAdminRegistrationForm;
