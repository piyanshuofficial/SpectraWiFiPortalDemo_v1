// src/pages/UserManagement/UserManagement.js

import React, { useState } from 'react';
import './UserManagement.css';


// Example roles/policies — ideally from your API or admin config
const USER_POLICIES = ["Standard", "Premium", "Enterprise"];
const ROLES = ["Admin", "User", "Viewer"];
const STATUS = { ACTIVE: 'Active', INACTIVE: 'Inactive', RESTRICTED: 'Restricted' };

const initialUsers = [
  {
    id: "USR1001",
    firstName: "John",
    lastName: "Doe",
    mobile: "+91 9876543210",
    email: "john.doe@example.com",
    policy: "Standard",
    department: "",
    organization: "",
    room: "A1-120",
    status: STATUS.ACTIVE,
    role: "User",
    devices: [{ id: "dev001", name: "John's iPad" }]
  },
  // Add more sample users as needed
];

function getStatusColor(status) {
  if (status === STATUS.ACTIVE) return "green";
  if (status === STATUS.INACTIVE) return "orange";
  return "red";
}

function UserManagement() {
  const [users, setUsers] = useState(initialUsers);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Registration/Edit form state
  const [form, setForm] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    mobile: "+91 ",
    email: "",
    policy: USER_POLICIES[0],
    department: "",
    organization: "",
    room: "",
    role: ROLES[1],
    status: STATUS.ACTIVE,
    password: "",
    devices: []
  });

  const startAdd = () => {
    setForm({
      userId: "",
      firstName: "",
      lastName: "",
      mobile: "+91 ",
      email: "",
      policy: USER_POLICIES[0],
      department: "",
      organization: "",
      room: "",
      role: ROLES[1],
      status: STATUS.ACTIVE,
      password: "",
      devices: []
    });
    setEditingUser(null);
    setShowForm(true);
  };

  const startEdit = (user) => {
    setForm({ ...user, password: "" });
    setEditingUser(user);
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate required fields
    if (!form.userId || !form.firstName || !form.lastName || !form.mobile || !form.policy) {
      alert("Fill all mandatory fields");
      return;
    }
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...form, id: editingUser.id } : u));
    } else {
      // Ensure unique userId
      if (users.some(u => u.id === form.userId)) {
        alert("User ID must be unique");
        return;
      }
      setUsers([{ ...form, id: form.userId }, ...users]);
    }
    setShowForm(false);
  };

  const setStatus = (user, nextStatus) => {
    setUsers(users.map(u => u.id === user.id ? { ...u, status: nextStatus } : u));
  };

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure?")) setUsers(users.filter(u => u.id !== userId));
  };

  return (
    <div className="user-management-root">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
        <h2>User Management</h2>
        <button onClick={startAdd}>+ Add User</button>
      </div>
      <table className="user-table">
        <thead>
          <tr>
            <th>Status</th>
            <th>User ID</th>
            <th>First</th>
            <th>Last</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>Policy</th>
            <th>Department</th>
            <th>Org</th>
            <th>Room</th>
            <th>Devices</th>
            <th>Role</th>
            <th colSpan={3}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>
                <span
                  style={{
                    display: "inline-block",
                    borderRadius: "50%",
                    width: 12,
                    height: 12,
                    background: getStatusColor(u.status)
                  }}
                  title={u.status}
                />
              </td>
              <td>{u.id}</td>
              <td>{u.firstName}</td>
              <td>{u.lastName}</td>
              <td>{u.mobile}</td>
              <td>{u.email}</td>
              <td>{u.policy}</td>
              <td>{u.department}</td>
              <td>{u.organization}</td>
              <td>{u.room}</td>
              <td>{u.devices.length}</td>
              <td>{u.role}</td>
              <td><button onClick={() => startEdit(u)}>Edit</button></td>
              <td>
                <button onClick={() => setStatus(u, STATUS.INACTIVE)} disabled={u.status !== STATUS.ACTIVE}>
                  Deactivate
                </button>
              </td>
              <td>
                <button onClick={() => setStatus(u, STATUS.RESTRICTED)} disabled={u.status === STATUS.RESTRICTED}>
                  Restrict
                </button>
              </td>
              <td>
                <button onClick={() => handleDelete(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showForm && (
        <div className="modal-backdrop">
          <form className="user-form" onSubmit={handleSubmit}>
            <h3>{editingUser ? "Edit User" : "Register User"}</h3>
            <div>
              <label>User ID* <input name="userId" value={form.userId} onChange={handleChange} required disabled={!!editingUser} /></label>
              <label>First Name* <input name="firstName" value={form.firstName} onChange={handleChange} required /></label>
              <label>Last Name* <input name="lastName" value={form.lastName} onChange={handleChange} required /></label>
              <label>Mobile* <input name="mobile" value={form.mobile} onChange={handleChange} required /></label>
              <label>Email <input name="email" value={form.email} onChange={handleChange} type="email" /></label>
              <label>Policy* 
                <select name="policy" value={form.policy} onChange={handleChange}>
                  {USER_POLICIES.map(p => <option key={p}>{p}</option>)}
                </select>
              </label>
              <label>Department <input name="department" value={form.department} onChange={handleChange} /></label>
              <label>Org <input name="organization" value={form.organization} onChange={handleChange} /></label>
              <label>Room <input name="room" value={form.room} onChange={handleChange} /></label>
              <label>Role 
                <select name="role" value={form.role} onChange={handleChange}>
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </label>
              <label>Status 
                <select name="status" value={form.status} onChange={handleChange}>
                  {Object.values(STATUS).map(s => <option key={s}>{s}</option>)}
                </select>
              </label>
              <label>Password {editingUser ? "(leave blank to keep unchanged)" : ""} 
                <input name="password" type="password" value={form.password} onChange={handleChange} />
              </label>
            </div>
            <div style={{ marginTop: 15 }}>
              <button type="submit" style={{ marginRight: 12 }}>
                {editingUser ? "Update" : "Register"}
              </button>
              <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
