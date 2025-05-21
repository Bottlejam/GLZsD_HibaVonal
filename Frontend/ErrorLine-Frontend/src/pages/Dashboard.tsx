import React, { useEffect, useRef, useState } from 'react';
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
import "./index.css";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(2);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  useEffect(() => {
    const navbarToggle = document.querySelector('.navbar-toggle') as HTMLElement | null;
    const navbarMenu = document.querySelector('.navbar-menu') as HTMLElement | null;

    function updateColumns() {
      if (!containerRef.current) return;
      const height = containerRef.current.clientHeight;
      setColumns(height > 1000 ? 2 : 3);
    }
  
    updateColumns();
    window.addEventListener("resize", updateColumns);

    const handleClick = () => {
      navbarToggle?.classList.toggle('active');
      navbarMenu?.classList.toggle('active');
    };

    navbarToggle?.addEventListener('click', handleClick);
    return () => {
      navbarToggle?.removeEventListener('click', handleClick);
      window.removeEventListener("resize", updateColumns);
    };
  }, []);

  const [activeSection, setActiveSection] = useState<string>('');

  return (
    <div className="cont">
      <nav className="navbar">
        <div className="navbar-container">
          <a className="navbar-logo">Dashboard</a>

          <button className="navbar-toggle">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>

          <ul className="navbar-menu">
            <li><a href="#" onClick={() => setActiveSection('User')}>User</a></li>
            <li><a href="#" onClick={() => setActiveSection('Order')}>Order</a></li>
            <li><a href="#" onClick={() => setActiveSection('Dormitory')}>Dormitory</a></li>
            <li><a href="#" onClick={() => setActiveSection('Location')}>Location</a></li>
            <li><a href="#" onClick={() => setActiveSection('Equipment')}>Equipment</a></li>
            <li><a href="#" onClick={() => setActiveSection('IssueReport')}>IssueReport</a></li>
            <li><a href="#" onClick={() => setActiveSection('IssueTypes')}>IssueTypes</a></li>
            <li><a href="#" onClick={() => setActiveSection('Notes')}>Notes</a></li>
            <button onClick={handleLogout}>Kijelentkezés</button>
          </ul>
        </div>
      </nav>
      <div className='contentwalls' ref={containerRef}
  style={{ "--cols": columns } as React.CSSProperties}>
        {activeSection === 'User' && (
          <>
            <p className="pageName">User</p>
            <section className="section">
            <MaintenanceRegistrationForm />
            <AdminRegistrationForm />
            <SystemAdminRegistrationForm />
            <AdminUsersList />
            <DormitoryUsersList />
            <MaintenanceWorkersList />
            </section>
          </>
        )}
        {activeSection === 'Order' && (
          <>
            <p className="pageName">Order</p>
            <section className="section">
            <CreateOrderForm />
            <TrackOrder />
            <GetAllOrders />
            <CancelOrder />
            </section>
          </>
        )}
        {activeSection === 'Dormitory' && (
          <>
            <p className="pageName">Dormitory</p>
            <section className="section">
            <CreateDormitory />
            <DeleteDormitory />
            <GetAllDormitories />
            <GetDormitoryById />
            <UpdateDormitory />
            </section>
          </>
        )}
        {activeSection === 'Location' && (
          <>
            <p className="pageName">Location</p>
            <section className="section">
            <CreateLocationForm />
            <DeleteLocationForm />
            <GetAllLocations />
            <GetLocationById />
            <UpdateLocationForm />
            </section>
          </>
        )}
        {activeSection === 'Equipment' && (
          <>
            <p className="pageName">Equipment</p>
            <section className="section">
            <CreateEquipment />
            <DeleteEquipment />
            <GetAllEquipments />
            <GetEquipmentById />
            <UpdateEquipment />
            </section>
          </>
        )}
        {activeSection === 'IssueReport' && (
          <>
            <p className="pageName">IssueReport</p>
            <section className="section">
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
            </section>
          </>
        )}
        {activeSection === 'IssueTypes' && (
          <>
            <p className="pageName">IssueTypes</p>
            <section className="section">
            <CreateIssueType />
            <DeleteIssueType />
            <GetAllIssueTypes />
            <UpdateIssueTypeForm />
            </section>
          </>
        )}
        {activeSection === 'Notes' && (
          <>
            <p className="pageName">Notes</p>
            <section className="section">
            <CreateNote />
            <GetUserNotes />
            <GetAllNotes />
            <GetNoteById />
            <DeleteMyNote />
            <DeleteAnyNote />
            <UpdateNote />
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
