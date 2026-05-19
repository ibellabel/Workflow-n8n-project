import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/login/index";
import DashboardPage from "./pages/dashboard/index";
import ResultadosCV from './pages/dashboard/ResultadosCV'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/dashboard/resultados" element={<ResultadosCV />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;