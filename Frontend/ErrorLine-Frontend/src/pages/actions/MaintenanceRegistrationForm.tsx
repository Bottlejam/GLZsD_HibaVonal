import { useState } from "react";
import API_BASE_URL from "../api";
import toast, { Toaster } from "react-hot-toast";

const MaintenanceRegistrationForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("MaintenanceWorker");
  const token = localStorage.getItem("token");
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      username,
      email,
      password,
      role,
    };

     try {
      const response = await fetch(
        `${API_BASE_URL}/api/User/Admin/registerMaintenanceStaff`,
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
        const result = await response.json();
        toast.success("Sikeres regisztráció!");
        console.log(result);
      } else {
        const error = await response.json();
        toast.error("Hiba: " + error.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Ismeretlen hiba történt.");
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <h3>Admin - Karbantartó regisztrálása</h3>
      <input
        type="text"
        placeholder="Felhasználónév"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
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
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="MaintenanceWorker">Karbantartó</option>
        <option value="MaintenanceManager">Karbantartásvezető</option>
      </select>
      <button type="submit">Regisztrálás</button>
    </form>
  );
};

export default MaintenanceRegistrationForm;
