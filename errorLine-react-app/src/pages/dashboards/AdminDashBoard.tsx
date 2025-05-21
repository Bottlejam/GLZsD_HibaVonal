import { useNavigate } from "react-router-dom";
import MaintenanceRegistrationForm from "../actions/MaintenanceRegistrationForm";
import DormitoryUsersList from "../actions/DormitoryUsersList";
import CreateEquipment from "../actions/CreateEquipment";
import DeleteEquipment from "../actions/DeleteEquipment";
import GetAllEquipments from "../actions/GetAllEquipments";
import GetEquipmentById from "../actions/GetEquipmentById";
import UpdateEquipment from "../actions/UpdateEquipment";
import CreateLocationForm from "../actions/CreateLocation";
import DeleteLocationForm from "../actions/DeleteLocation";
import GetAllLocations from "../actions/GetAllLocations";
import GetLocationById from "../actions/GetLocationById";
import UpdateLocationForm from "../actions/UpdateLocation";


import UpdateIssueTypeForm from "../actions/UpdateIssueType";
import DeleteIssueType from "../actions/DeleteIssueType";
import CreateIssueType from "../actions/CreateIssueType";
import GetAllIssueTypes from "../actions/GetAllIssueTypes";
const AdminDashboard: React.FC = () => {
    
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
      
     <MaintenanceRegistrationForm />
     <DormitoryUsersList />
     
      
      <p>Equipment</p>
      <CreateEquipment />
      <DeleteEquipment />
      <GetAllEquipments />
      <GetEquipmentById />
      <UpdateEquipment />
  
      
      
       <p>Issue Types</p>
      <CreateIssueType />
      <DeleteIssueType />
      <GetAllIssueTypes />
      <UpdateIssueTypeForm />

        <p>Locaction</p>
       <CreateLocationForm />
      <DeleteLocationForm />
      <GetAllLocations />
      <GetLocationById />
      <UpdateLocationForm />
     
    </div>);
};

export default AdminDashboard;