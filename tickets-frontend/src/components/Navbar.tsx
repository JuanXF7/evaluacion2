import React from 'react';
import { User } from '../types';
import './Navbar.css';

type TabId = 'account' | 'tickets' | 'create';

interface NavbarProps {
  user: User | null;
  isAdmin: boolean;
  canCreateTicket: boolean;
  selectedTab: TabId;
  onTabChange: (tab: TabId) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, isAdmin, canCreateTicket, selectedTab, onTabChange, onLogout }) => {
  const tabs: Array<{ id: TabId; label: string; visible: boolean }> = [
    { id: 'account', label: 'Información de cuenta', visible: true },
    { id: 'tickets', label: 'Listado de tickets', visible: isAdmin },
    { id: 'create', label: 'Generar ticket', visible: canCreateTicket },
  ];

  return (
    <aside className="navbar">
      <div className="navbar__brand">
        <div className="navbar__logo">Soporte</div>
        <p className="navbar__subtitle">Sistema de tickets</p>
      </div>

      <nav className="navbar__menu">
        <div className="navbar__section-title">Navegación</div>
        <ul>
          {tabs.map(
            (tab) =>
              tab.visible && (
                <li key={tab.id}>
                  <button
                    type="button"
                    className={`navbar__item ${selectedTab === tab.id ? 'active' : ''}`}
                    onClick={() => onTabChange(tab.id)}
                  >
                    {tab.label}
                  </button>
                </li>
              )
          )}
        </ul>
      </nav>

      <div className="navbar__footer">
        <div className="navbar__account">
          <div className="navbar__account-name">{user?.nombre} {user?.apellido}</div>
          <div className="navbar__account-role">{user?.role}</div>
        </div>
        <button className="navbar__logout" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};
