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
import GetAllLocations from "./actions/GetAllLocations";
import GetLocationById from "./actions/GetLocationById";
import CreateLocationForm from "./actions/CreateLocation";
import DeleteLocationForm from "./actions/DeleteLocation";
import UpdateLocationForm from "./actions/UpdateLocation";

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
      <GetAllLocations />
      <GetLocationById />
      <CreateLocationForm />
      <DeleteLocationForm />
      <UpdateLocationForm />
    </div>
  );
};

export default Dashboard;
