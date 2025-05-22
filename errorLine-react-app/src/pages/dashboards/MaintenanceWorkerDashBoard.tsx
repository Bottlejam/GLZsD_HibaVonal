import GetReports_Worker from "../actions/GetReports_Worker";
import CreateOrderForm from "../actions/CreateOrderForm";
import GetAllOrdersWorker from "../actions/GetAllOrdersWorker";

import { useNavigate } from "react-router-dom";
const MaintenanceWorkerDashBoard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (<div>
      <h2>Dashboard</h2>
      <button onClick={handleLogout}>Kijelentkezés</button>

       <p>IssueReports</p>
       <GetReports_Worker />

      <p>Order</p>
      
       <CreateOrderForm />
       <GetAllOrdersWorker />
      
     
      
    
     
    </div>);
};

export default MaintenanceWorkerDashBoard;