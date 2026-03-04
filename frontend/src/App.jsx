import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import CandidateProfile from './pages/CandidateProfile';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import CompanyDashboard from './pages/CompanyDashboard';
import SignIn from './pages/SignIn';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<SignIn />} />
          
          {/* Rutas protegidas */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
          <Route index element={<CandidateProfile />} />
          <Route 
            path="dashboard" 
            element={<Dashboard />} 
          />
          <Route 
            path="applications" 
            element={<Applications />} 
          />
          <Route 
            path="stats" 
            element={<Stats />} 
          />
          <Route 
            path="settings" 
            element={<Settings />} 
          />
          <Route 
            path="empresa" 
            element={<CompanyDashboard />} 
          />
          <Route 
            path="*" 
            element={
              <div className="flex h-[60vh] items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-slate-900">404</h2>
                  <p className="mt-2 text-slate-500">Página no encontrada</p>
                </div>
              </div>
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
