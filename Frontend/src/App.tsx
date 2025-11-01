import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ClassesPage from './pages/ClassesPage';
import CalendarPage from './pages/CalendarPage';
import SupportPage from './pages/SupportPage';
import WarRoomPage from './pages/WarRoomPage';
import { authHelpers } from './lib/auth';

// Protected Route Component
function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = authHelpers.isAuthenticated();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="classes" element={<ClassesPage />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="support" element={<SupportPage />} />
                <Route path="war-room" element={<WarRoomPage />} />
              </Routes>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tutor/*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="classes" element={<ClassesPage />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="support" element={<SupportPage />} />
                <Route path="war-room" element={<WarRoomPage />} />
              </Routes>
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent/*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="classes" element={<ClassesPage />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="support" element={<SupportPage />} />
                <Route path="war-room" element={<WarRoomPage />} />
              </Routes>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
