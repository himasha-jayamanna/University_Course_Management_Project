import { useState, useEffect } from "react";
import { api } from "../api/api";
import Modal from "../components/Modal";
import "./Results.css";

function Results() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ studentId: "", courseId: "", score: "" });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [resStudents, resCourses, resResults] = await Promise.all([
        api.get("/students"),
        api.get("/courses"),
        api.get("/results")
      ]);
      setStudents(resStudents.data || []);
      setCourses(resCourses.data || []);
      setResults(resResults.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch data");
    } finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ studentId: "", courseId: "", score: "" });
    setIsOpen(true);
  };

  const openEdit = (res) => {
    setEditing(res);
    setForm({ studentId: res.studentId, courseId: res.courseId, score: res.score });
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentId || !form.courseId || form.score === "") return alert("Please fill all fields");
    try {
      const payload = {
        studentId: Number(form.studentId),
        courseId: Number(form.courseId),
        score: Number(form.score)
      };
      if (editing) await api.put(`/results/${editing.id}`, payload);
      else await api.post("/results", payload);
      setIsOpen(false);
      fetchAllData();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this result?")) return;
    try {
      await api.delete(`/results/${id}`);
      fetchAllData();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-header">Results Details</h2>

      <div className="text-center mb-3">
        <button className="btn-add" onClick={openCreate}>+ Add Result</button>
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
            <div className="form-group">
              <label>Score</label>
              <input
                type="number"
                placeholder="Enter Score"
                value={form.score}
                onChange={e => setForm({...form, score: e.target.value})}
                required
              />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={() => setIsOpen(false)}>Cancel</button>
              <button type="submit" className="btn-create">{editing ? "Save Changes" : "Create Result"}</button>
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
                  <th>Score</th>
                  <th>Grade</th>
                  <th>Remarks</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map(r => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.student?.name}</td>
                    <td>{r.course?.title}</td>
                    <td>{r.score}</td>
                    <td>{r.grade}</td>
                    <td>{r.remarks}</td>
                    <td className="text-center">
                      <button className="btn-sm btn-edit me-2" onClick={() => openEdit(r)}>Edit</button>
                      <button className="btn-sm btn-delete" onClick={() => handleDelete(r.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {results.length === 0 && <tr><td colSpan="7" className="text-center">No results found.</td></tr>}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Results;
