import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import AdminDashboard from "../dashboards/AdminDashBoard";
import ManagerDashboard from "../dashboards/MaintenanceManagerDashBoard";
import SystemAdminDashboard from "../dashboards/SystemAdminDashBoard";
import StudentDashboard from "../dashboards/StudentDashBoard";
import WorkerDashboard from "../dashboards/MaintenanceWorkerDashBoard";

const RoleBasedDashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case "SystemAdmin":
      return <SystemAdminDashboard />;
    case "Admin":
      return <AdminDashboard />;
    case "MaintenanceManager":
      return <ManagerDashboard />;
    case "MaintenanceWorker":
      return <WorkerDashboard />;
    case "Student":
      return <StudentDashboard/>;
    default:
      return <p>Nincs jogosultságod az oldal megtekintéséhez.</p>;
  }
};

export default RoleBasedDashboard;