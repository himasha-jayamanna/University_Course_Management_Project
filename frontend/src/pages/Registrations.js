import { useState, useEffect } from "react";
import { api } from "../api/api";
import Modal from "../components/Modal";
import "./Registrations.css";

function Registrations() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ studentId: "", courseId: "" });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [resStudents, resCourses, resRegs] = await Promise.all([
        api.get("/students"),
        api.get("/courses"),
        api.get("/registrations")
      ]);
      setStudents(resStudents.data || []);
      setCourses(resCourses.data || []);
      setRegistrations(resRegs.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch data");
    } finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ studentId: "", courseId: "" });
    setIsOpen(true);
  };

  const openEdit = (reg) => {
    setEditing(reg);
    setForm({ studentId: reg.studentId, courseId: reg.courseId });
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentId || !form.courseId) return alert("Please select student and course");
    try {
      if (editing) await api.put(`/registrations/${editing.id}`, {
        studentId: Number(form.studentId),
        courseId: Number(form.courseId)
      });
      else await api.post("/registrations", {
        studentId: Number(form.studentId),
        courseId: Number(form.courseId)
      });
      setIsOpen(false);
      fetchAllData();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this registration?")) return;
    try {
      await api.delete(`/registrations/${id}`);
      fetchAllData();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-header">Registrations Details</h2>

      <div className="text-center mb-3">
        <button className="btn-add" onClick={openCreate}>+ Add Registration</button>
      </div>

      <Modal open={isOpen} onClose={() => setIsOpen(false)} >
        <div className="card form-card-transparent">
          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-group">
              <label>Student</label>
              <select value={form.studentId} onChange={(e) => setForm({...form, studentId: e.target.value})} required>
                <option value="">Select Student</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Course</label>
              <select value={form.courseId} onChange={(e) => setForm({...form, courseId: e.target.value})} required>
                <option value="">Select Course</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={() => setIsOpen(false)}>Cancel</button>
              <button type="submit" className="btn-create">{editing ? "Save Changes" : "Create Registration"}</button>
            </div>
          </form>
        </div>
      </Modal>

      <div className="card main-card mt-3">
        <div className="card-body">
          {loading ? <p>Loading…</p> : (
            <table className="table table-hover table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Student</th>
                  <th>Course</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((r, index) => (
                  <tr key={r.id}>
                    <td>{index + 1}</td> {/* Sequential row number instead of DB id */}
                    <td>{r.student?.name || "N/A"}</td>
                    <td>{r.course?.title || "N/A"}</td>
                    <td className="text-center">
                      <button className="btn-sm btn-edit me-2" onClick={() => openEdit(r)}>Edit</button>
                      <button className="btn-sm btn-delete" onClick={() => handleDelete(r.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {registrations.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center">No registrations found.</td>
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

export default Registrations;
