import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Students from "./pages/Students";
import Courses from "./pages/Courses";
import Registrations from "./pages/Registrations";
import Results from "./pages/Results";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";


function App() {
  return (
    <Router>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/students" element={<Students />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/registrations" element={<Registrations />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
