import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import Modal from "../components/Modal";
import "./Students.css";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", email: "" });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await api.get("/students");
      setStudents(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch students");
    } finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", email: "" });
    setIsOpen(true);
  };

  const openEdit = (student) => {
    setEditing(student);
    setForm({ name: student.name, email: student.email });
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return alert("Name and Email required");
    try {
      if (editing) await api.put(`/students/${editing.id}`, form);
      else await api.post("/students", form);
      setIsOpen(false);
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await api.delete(`/students/${id}`);
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="page-container">

      {/* Header */}
      <h2 className="page-header">Students Details</h2>

      {/* Add Student button */}
      <div className="text-center mb-3">
        <button className="btn-add-student" onClick={openCreate}>+ Add Student</button>
      </div>

      {/* Modal form */}
      <Modal open={isOpen} onClose={() => setIsOpen(false)} >
        <div className="card form-card-transparent">
          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={() => setIsOpen(false)}>Cancel</button>
              <button type="submit" className="btn-create">{editing ? "Save Changes" : "Create Student"}</button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Table below form */}
      <div className="card main-card mt-3">
        <div className="card-body">
          {loading ? (
            <p>Loading…</p>
          ) : (
            <table className="table table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td className="text-center">
                      <button className="btn-sm btn-edit me-2" onClick={() => openEdit(s)}>Edit</button>
                      <button className="btn-sm btn-delete" onClick={() => handleDelete(s.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center">No students found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
