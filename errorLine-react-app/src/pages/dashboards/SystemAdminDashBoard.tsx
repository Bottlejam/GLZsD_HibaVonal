import { useNavigate } from "react-router-dom";

import AdminRegistrationForm from "../actions/AdminRegistrationForm";
import SystemAdminRegistrationForm from "../actions/SystemAdminRegistrationForm";
import AdminUsersList from "../actions/AdminUsersList";
import CreateDormitory from "../actions/CreateDormitory";
import GetAllDormitories from "../actions/GetAllDormitories";
import GetDormitoryById from "../actions/GetDormitoryById";
import UpdateDormitory from "../actions/UpdateDormitory";
import DeleteDormitory from "../actions/DeleteDormitory";
const SystemAdminDashBoard: React.FC = () => {
      const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
   return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={handleLogout}>Kijelentkezés</button>
      <p>User</p>
      
      <AdminRegistrationForm />
      <SystemAdminRegistrationForm />
      <AdminUsersList />
     
      
      
  
      
      <p>Dormitory</p>
      <CreateDormitory />
      <DeleteDormitory />
      <GetAllDormitories />
      <GetDormitoryById />
      <UpdateDormitory />
     
    </div>
  );
};

export default SystemAdminDashBoard;