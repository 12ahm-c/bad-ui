import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EmailEscapePage from "./features/EmailEscape";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/email-escape" element={<EmailEscapePage />} />
      </Routes>
    </Router>
  );
}

export default App;
