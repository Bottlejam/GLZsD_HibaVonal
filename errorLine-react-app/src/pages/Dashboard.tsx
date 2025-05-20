import React, { useEffect, useState } from "react";
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
import GetAllDormitories from "./actions/GetAllDormitories";
import GetDormitoryById from "./actions/GetDormitoryById";
import CreateDormitory from "./actions/CreateDormitory";
import DeleteDormitory from "./actions/DeleteDormitory";
import UpdateDormitory from "./actions/UpdateDormitory";
import GetAllEquipments from "./actions/GetAllEquipments";
import GetEquipmentById  from "./actions/GetEquipmentById";
import CreateEquipment from "./actions/CreateEquipment";
import DeleteEquipment from "./actions/DeleteEquipment";
import UpdateEquipment from "./actions/UpdateEquipment";
import StudentGetMyNotes from "./actions/StudentGetMyNotes";
import CreateNote from "./actions/CreateNote";
import MaintenanceManagerGetAllNotes from "./actions/MaintananceManagerGetAllNotes";
import GetNoteById from "./actions/MaintananceManagerGetNoteById";
import DeleteAnyNote from "./actions/MaintananceManagerDeleteNoteById";
import DeleteMyNote from "./actions/StudentDeleteNote";
import UpdateNote from "./actions/StudentUpdateNote";


const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <strong>Token:</strong> {token}
      <button onClick={handleLogout}>Kijelentkezés</button>
      <MaintenanceRegistrationForm />
      <AdminRegistrationForm />
      <SystemAdminRegistrationForm />
      <AdminUsersList />
      <DormitoryUsersList />
      <MaintenanceWorkersList />
      <CreateOrderForm />
      <TrackOrder />
      <GetAllOrders />
      <CancelOrder />
      <GetAllDormitories />
      <GetDormitoryById />
      <CreateDormitory />
      <DeleteDormitory />
      <UpdateDormitory />
      <GetAllEquipments />
      <GetEquipmentById />
      <CreateEquipment />
      <DeleteEquipment />
      <UpdateEquipment />
      <StudentGetMyNotes />
      <CreateNote />
      <MaintenanceManagerGetAllNotes />
      <GetNoteById />
      <DeleteAnyNote />
      <DeleteMyNote />
      <UpdateNote />
    </div>
  );
};

export default Dashboard;


