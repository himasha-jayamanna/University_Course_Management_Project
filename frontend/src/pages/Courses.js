import { useState, useEffect } from "react";
import { api } from "../api/api";
import Modal from "../components/Modal";
import "./Courses.css";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", code: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/courses");
      setCourses(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch courses");
    } finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", code: "" });
    setIsOpen(true);
  };

  const openEdit = (course) => {
    setEditing(course);
    setForm({ title: course.title, code: course.code });
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.code) return alert("Title and Code required");
    try {
      if (editing) await api.put(`/courses/${editing.id}`, form);
      else await api.post("/courses", form);
      setIsOpen(false);
      fetchCourses();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await api.delete(`/courses/${id}`);
      fetchCourses();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-header">Courses Details</h2>

      <div className="text-center mb-3">
        <button className="btn-add" onClick={openCreate}>+ Add Course</button>
      </div>

      <Modal open={isOpen} onClose={() => setIsOpen(false)} >
        <div className="card form-card-transparent">
          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                placeholder="Course Title"
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Code</label>
              <input
                type="text"
                placeholder="Course Code"
                value={form.code}
                onChange={e => setForm({...form, code: e.target.value})}
                required
              />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={() => setIsOpen(false)}>Cancel</button>
              <button type="submit" className="btn-create">{editing ? "Save Changes" : "Create Course"}</button>
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
                  <th>Title</th>
                  <th>Code</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(c => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.title}</td>
                    <td>{c.code}</td>
                    <td className="text-center">
                      <button className="btn-sm btn-edit me-2" onClick={() => openEdit(c)}>Edit</button>
                      <button className="btn-sm btn-delete" onClick={() => handleDelete(c.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {courses.length === 0 && <tr><td colSpan="4" className="text-center">No courses found.</td></tr>}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Courses;
