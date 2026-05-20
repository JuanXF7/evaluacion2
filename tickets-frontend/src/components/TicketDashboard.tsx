import React, { useEffect, useMemo, useState } from 'react';
import ticketService from '../services/api';
import { Ticket, Category } from '../types';
import './TicketDashboard.css';

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Todos' },
  { value: 'ABIERTO', label: 'Abierto' },
  { value: 'EN_PROCESO', label: 'En proceso' },
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'RESUELTO', label: 'Resuelto' },
  { value: 'CERRADO', label: 'Cerrado' },
];

const AGE_OPTIONS = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'oldest', label: 'Más antiguos' },
];

export const TicketDashboard: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [ageFilter, setAgeFilter] = useState('newest');
  const [savingStatusIds, setSavingStatusIds] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ticketsData, categoriesData] = await Promise.all([
          ticketService.getTickets(),
          ticketService.getCategories(),
        ]);
        setTickets(ticketsData || []);
        setCategories(categoriesData || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'No se pudo cargar la información de tickets y categorías'
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatDate = (value?: string) => {
    if (!value) return '-';
    const date = new Date(value);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const normalizeStatus = (status?: string) =>
    String(status || '').trim().toUpperCase().replace(/\s+/g, '_');

  const updateTicketStatus = async (ticketId: number, newStatus: string) => {
    setSavingStatusIds((prev) => ({ ...prev, [ticketId]: true }));
    try {
      const updatedTicket = await ticketService.updateTicketStatus(ticketId, newStatus);
      setTickets((prev) => prev.map((ticket) => (ticket.id === ticketId ? updatedTicket : ticket)));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo actualizar el estado del ticket'
      );
    } finally {
      setSavingStatusIds((prev) => ({ ...prev, [ticketId]: false }));
    }
  };

  const handleTicketStatusChange = async (
    ticket: Ticket,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newStatus = event.target.value;
    event.target.blur();

    const currentStatus = normalizeStatus(ticket.status || ticket.estado);
    if (newStatus === 'CERRADO' && currentStatus !== 'CERRADO') {
      const confirmed = window.confirm('¿Seguro de querer cerrar este ticket?');
      if (!confirmed) {
        return;
      }
    }

    await updateTicketStatus(ticket.id ?? 0, newStatus);
  };

  const handleClearFilters = () => {
    setStatusFilter('ALL');
    setCategoryFilter('ALL');
    setAgeFilter('newest');
  };

  const renderStatus = (status?: string) => {
    const value = normalizeStatus(status);
    switch (value) {
      case 'ABIERTO':
      case 'OPEN':
        return 'Abierto';
      case 'CERRADO':
      case 'CLOSED':
        return 'Cerrado';
      case 'EN_PROCESO':
      case 'IN_PROGRESS':
        return 'En progreso';
      case 'PENDIENTE':
        return 'Pendiente';
      case 'RESUELTO':
      case 'RESOLVED':
        return 'Resuelto';
      default:
        return status || 'Sin estado';
    }
  };

  const getTitle = (ticket: Ticket) => ticket.titulo || ticket.title || ticket.nombre || 'Sin título';
  const getCategory = (ticket: Ticket) => ticket.categoriaNombre || ticket.category || ticket.categoria || 'General';
  const getUserName = (ticket: Ticket) => ticket.asignadoANombreCompleto || ticket.asignadoAUsername || ticket.assignedUser || ticket.usuario || 'No asignado';

  const ticketCategories = useMemo(() => {
    if (categories.length > 0) {
      return categories.map((category) => category.nombre || 'General');
    }
    const values = tickets
      .map((ticket) => getCategory(ticket))
      .filter((category) => category && category !== 'General');
    return Array.from(new Set(values));
  }, [categories, tickets]);

  const filteredTickets = useMemo(() => {
    return [...tickets]
      .filter((ticket) => {
        if (statusFilter === 'ALL') return true;
        return normalizeStatus(ticket.status || ticket.estado) === statusFilter;
      })
      .filter((ticket) => {
        if (categoryFilter === 'ALL') return true;
        return getCategory(ticket).toLowerCase() === categoryFilter.toLowerCase();
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || a.fecha || '').getTime();
        const dateB = new Date(b.createdAt || b.fecha || '').getTime();
        if (isNaN(dateA)) return 1;
        if (isNaN(dateB)) return -1;
        return ageFilter === 'newest' ? dateB - dateA : dateA - dateB;
      });
  }, [tickets, statusFilter, categoryFilter, ageFilter]);

  return (
    <section className="ticket-dashboard">
      <div className="ticket-dashboard__header">
        <div>
          <h2>Listado de Tickets</h2>
          <p>Revisa los tickets del backend con su estado, prioridad, categoría y usuario asignado.</p>
        </div>
      </div>

      <div className="ticket-dashboard__filters">
        <label>
          Estado
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="ticket-dashboard__filter-select"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Categoría
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="ticket-dashboard__filter-select"
          >
            <option value="ALL">Todas</option>
            {ticketCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label>
          Antigüedad
          <select
            value={ageFilter}
            onChange={(event) => setAgeFilter(event.target.value)}
            className="ticket-dashboard__filter-select"
          >
            {AGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={handleClearFilters}
          className="ticket-dashboard__clear-button"
        >
          Limpiar filtros
        </button>
      </div>

      {loading && <div className="ticket-dashboard__status">Cargando tickets...</div>}
      {error && <div className="ticket-dashboard__error">{error}</div>}
      {!loading && !error && filteredTickets.length === 0 && (
        <div className="ticket-dashboard__status">No hay tickets para mostrar.</div>
      )}

      {!loading && !error && filteredTickets.length > 0 && (
        <div className="ticket-dashboard__grid">
          {filteredTickets.map((ticket) => (
            <article key={ticket.id ?? ticket._id} className="ticket-card">
              <div className="ticket-card__header">
                <h3>{getTitle(ticket)}</h3>
                <span className={`ticket-card__badge ticket-card__badge--${((ticket.prioridad || ticket.priority) || 'media').toLowerCase()}`}>
                  {ticket.prioridad || ticket.priority || 'Media'}
                </span>
              </div>
              <p className="ticket-card__meta">
                <strong>Estado:</strong>{' '}
                <select
                  value={normalizeStatus(ticket.status || ticket.estado) || 'ABIERTO'}
                  onChange={(event) => handleTicketStatusChange(ticket, event)}
                  disabled={
                    savingStatusIds[ticket.id ?? 0] ||
                    normalizeStatus(ticket.status || ticket.estado) === 'CERRADO'
                  }
                  className="ticket-card__status-select"
                >
                  {STATUS_OPTIONS.filter((option) => option.value !== 'ALL').map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </p>
              <p className="ticket-card__meta">
                <strong>Categoría:</strong> {getCategory(ticket)}
              </p>
              <p className="ticket-card__meta">
                <strong>Asignado a:</strong> {getUserName(ticket)}
              </p>
              <p className="ticket-card__date">Creado: {formatDate(ticket.createdAt || ticket.fecha)}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
