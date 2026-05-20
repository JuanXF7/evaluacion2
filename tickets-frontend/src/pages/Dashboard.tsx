import React, { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { TicketDashboard } from '../components/TicketDashboard';
import { TicketCreateForm } from '../components/TicketCreateForm';
import { Navbar } from '../components/Navbar';
import './Dashboard.css';

type TabId = 'account' | 'tickets' | 'create';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'ADMIN';
  const canCreateTicket = user?.role === 'TECNICO' || user?.role === 'USUARIO';
  const [activeTab, setActiveTab] = useState<TabId>('account');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <Navbar
        user={user}
        isAdmin={isAdmin}
        canCreateTicket={canCreateTicket}
        selectedTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />

      <main className="dashboard-main">
        {activeTab === 'account' && (
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
          </div>
        )}

        {activeTab === 'tickets' && isAdmin && <TicketDashboard />}

        {activeTab === 'create' && canCreateTicket && (
          <div className="ticket-action-panel">
            <div className="ticket-action-panel__header">
              <h2>Generar ticket</h2>
              <p>Puedes crear un ticket de soporte para reportar un problema o solicitar ayuda.</p>
            </div>
            <TicketCreateForm />
          </div>
        )}

        {activeTab === 'tickets' && !isAdmin && (
          <div className="info-box">
            No tienes permiso para ver el listado de tickets.
          </div>
        )}

        {activeTab === 'create' && !canCreateTicket && (
          <div className="info-box">
            No tienes permiso para generar tickets.
          </div>
        )}
      </main>
    </div>
  );
};
