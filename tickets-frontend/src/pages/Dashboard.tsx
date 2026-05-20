import React from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Sistema de Tickets</h1>
          <div className="user-info">
            <span className="user-name">
              {user?.nombre} {user?.apellido}
            </span>
            <span className="user-role">{user?.role}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-card">
          <h2>¡Bienvenido!</h2>
          <p>
            Hola <strong>{user?.nombre} {user?.apellido}</strong>, has iniciado sesión correctamente.
          </p>

          <div className="user-details">
            <h3>Información de tu cuenta:</h3>
            <ul>
              <li><strong>Usuario:</strong> {user?.username}</li>
              <li><strong>Email:</strong> {user?.email}</li>
              <li><strong>Rol:</strong> {user?.role}</li>
              <li><strong>ID:</strong> {user?.id}</li>
            </ul>
          </div>

          <div className="info-box">
            <h3>Próximas Funcionalidades:</h3>
            <ul>
              <li>Gestión de Tickets</li>
              <li>Asignación de Tickets</li>
              <li>Categorías de Soporte</li>
              <li>Comentarios en Tickets</li>
              <li>Panel de Control</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};
