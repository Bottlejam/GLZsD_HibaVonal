import { useNavigate } from "react-router-dom";
import MaintenanceWorkersList from "../actions/MaintenanceWorkersList";
import GetAllIssueReports from "../actions/GetAllIssueReports";
import GetIssueReportById from "../actions/GetIssueReportById";
import AssignWorkerToIssue from "../actions/AssignWorkerToIssue";
import ChangeIssueStatus from "../actions/ChangeIssueStatus";
import GetAllNotes from "../actions/GetAllNotes";
import GetNoteById from "../actions/GetNoteById";
import DeleteAnyNote from "../actions/DeleteAnyNode";
import CreateOrderForm from "../actions/CreateOrderForm";
import TrackOrder from "../actions/TrackOrder";
import GetAllOrders from "../actions/GetAllOrders";
import CancelOrder from "../actions/CancelOrder";
const MaintenanceManagerDashBoard: React.FC = () => {
     const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (<div>
      <h2>Dashboard</h2>
      <button onClick={handleLogout}>Kijelentkezés</button>

       <p>User</p>
       <MaintenanceWorkersList />

      <p>IssueReports</p>
      
      <GetAllIssueReports />
      
     
      
     
      
      <p>Notes</p>
      <GetAllNotes />
     

  
      
      
       

    

      <p>Order</p>
      <CreateOrderForm />
     
      <GetAllOrders />
      
     
    </div>);
};

export default MaintenanceManagerDashBoard;