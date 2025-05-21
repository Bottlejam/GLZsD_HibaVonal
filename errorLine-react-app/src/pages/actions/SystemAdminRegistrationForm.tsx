import { useState } from "react";
import API_BASE_URL from "../api";
import toast, { Toaster } from "react-hot-toast";

const SystemAdminRegistrationForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     if (loading) return;

    setLoading(true);
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

      const result = await response.json();

      if (response.ok) {
        toast.success("Sikeres regisztráció!");
        // Ha akarod, itt törölheted a formot:
        setUsername("");
        setEmail("");
        setPassword("");
        console.log(result);
      } else {
        toast.error(result.message || "Hiba történt a regisztráció során.");
      }
    } catch (error) {
      toast.error("Hálózati hiba történt.");
      console.error(error);
    } finally {
      setLoading(false);
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
