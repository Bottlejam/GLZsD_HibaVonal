import { useNavigate } from "react-router-dom";
import MaintenanceRegistrationForm from "./actions/MaintenanceRegistrationForm";
import AdminRegistrationForm from "./actions/AdminRegistrationForm";
import SystemAdminRegistrationForm from "./actions/SystemAdminRegistrationForm";
import AdminUsersList from "./actions/AdminUsersList";
import DormitoryUsersList from "./actions/DormitoryUsersList";
import MaintenanceWorkersList from "./actions/MaintenanceWorkersList";
import CreateOrderForm from "./actions/CreateOrderForm";
import TrackOrder from "./actions/TrackOrder";
import GetAllOrders from "./actions/GetAllOrders";
import CancelOrder from "./actions/CancelOrder";
import CreateDormitory from "./actions/CreateDormitory";
import CreateLocationForm from "./actions/CreateLocation";
import DeleteDormitory from "./actions/DeleteDormitory";
import DeleteLocationForm from "./actions/DeleteLocation";
import GetAllDormitories from "./actions/GetAllDormitories";
import GetAllLocations from "./actions/GetAllLocations";
import GetDormitoryById from "./actions/GetDormitoryById";
import GetLocationById from "./actions/GetLocationById";
import UpdateDormitory from "./actions/UpdateDormitory";
import UpdateLocationForm from "./actions/UpdateLocation";
import CreateEquipment from "./actions/CreateEquipment";
import DeleteEquipment from "./actions/DeleteEquipment";
import GetAllEquipments from "./actions/GetAllEquipments";
import GetEquipmentById from "./actions/GetEquipmentById";
import UpdateEquipment from "./actions/UpdateEquipment";
import UpdateIssueTypeForm from "./actions/UpdateIssueType";
import DeleteIssueType from "./actions/DeleteIssueType";
import CreateIssueType from "./actions/CreateIssueType";
import GetAllIssueTypes from "./actions/GetAllIssueTypes";
import MarkCompleted from "./actions/MarkCompleted";
import GetReports_Worker from "./actions/GetReports_Worker";
import ChangeIssueStatus from "./actions/ChangeIssueStatus";
import GetAllIssueReports from "./actions/GetAllIssueReports";
import GetIssueReportById from "./actions/GetIssueReportById";
import GetStudentIssueReportById from "./actions/GetStudentIssueReportById";
import GetStudentIssueReports from "./actions/GetStudentIssueReports";
import ValidateStudentIssueReport from "./actions/ValidateStudentIssueReport";
import AssignWorkerToIssue from "./actions/AssignWorkerToIssue";
import ChangeIssueDescription from "./actions/ChangeIssueDescription";
import CreateIssueReportForm from "./actions/CreateIssueReportForm";
import DeleteStudentIssueReport from "./actions/DeleteStudentIssueReport";
import GetUserNotes from "./actions/GetUserNotes";
import CreateNote from "./actions/CreateNote";
import GetAllNotes from "./actions/GetAllNotes";
import GetNoteById from "./actions/GetNoteById";
import DeleteMyNote from "./actions/DeleteNote";
import DeleteAnyNote from "./actions/DeleteAnyNode";
import UpdateNote from "./actions/UpdateNote";

const Dashboard: React.FC = () => {
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
      <AdminRegistrationForm />
      <SystemAdminRegistrationForm />
      <AdminUsersList />
      <DormitoryUsersList />
      <MaintenanceWorkersList />
      <p>Order</p>
      <CreateOrderForm />
      <TrackOrder />
      <GetAllOrders />
      <CancelOrder />
      <p>Dormitory</p>
      <CreateDormitory />
      <DeleteDormitory />
      <GetAllDormitories />
      <GetDormitoryById />
      <UpdateDormitory />
      <p>Location</p>
      <CreateLocationForm />
      <DeleteLocationForm />
      <GetAllLocations />
      <GetLocationById />
      <UpdateLocationForm />
      <p>Equipment</p>
      <CreateEquipment />
      <DeleteEquipment />
      <GetAllEquipments />
      <GetEquipmentById />
      <UpdateEquipment />
      <p>IssueReport</p>
      <CreateIssueReportForm />
      <ChangeIssueStatus />
      <GetAllIssueReports />
      <GetIssueReportById />
      <GetStudentIssueReports />
      <GetStudentIssueReportById />
      <ValidateStudentIssueReport />
      <AssignWorkerToIssue />
      <ChangeIssueDescription />
      <GetReports_Worker />
      <MarkCompleted />
      <DeleteStudentIssueReport />
      <p>IssueTypes</p>
      <CreateIssueType />
      <DeleteIssueType />
      <GetAllIssueTypes />
      <UpdateIssueTypeForm />
      <p></p>
      <CreateNote />
      <GetUserNotes />
      <GetAllNotes />
      <GetNoteById />
      <DeleteMyNote />
      <DeleteAnyNote />
      <UpdateNote />
    </div>
  );
};

export default Dashboard;
