import React from "react";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import { UserManagement } from "../../components/admin/users/UserManagement.jsx";
import "../../styles/admin/user.css";

export default function AdminUsersPage() {
  return (
    <AdminLayout active="users">
      <UserManagement />
    </AdminLayout>
  );
}
