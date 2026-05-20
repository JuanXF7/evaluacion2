import React, { FormEvent, useEffect, useState } from 'react';
import ticketService from '../services/api';
import { TicketRequest, Category, User } from '../types';
import './TicketCreateForm.css';

export const TicketCreateForm: React.FC = () => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [prioridad, setPrioridad] = useState<TicketRequest['prioridad']>('MEDIA');
  const [categoriaId, setCategoriaId] = useState<string>('');
  const [asignadoAId, setAsignadoAId] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [categoryData, userData] = await Promise.all([
          ticketService.getCategories(),
          ticketService.getUsers(),
        ]);
        setCategories(categoryData);
        setUsers(userData);
      } catch (err: any) {
        setStatus({
          type: 'error',
          message: err.response?.data?.message || 'No se pudieron cargar las opciones de categoría y usuario.',
        });
      }
    };

    loadOptions();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      await ticketService.createTicket({
        titulo,
        descripcion,
        prioridad,
        categoriaId: categoriaId ? Number(categoriaId) : undefined,
        asignadoAId: asignadoAId ? Number(asignadoAId) : undefined,
      });
      setStatus({ type: 'success', message: 'Ticket creado correctamente.' });
      setTitulo('');
      setDescripcion('');
      setPrioridad('MEDIA');
      setCategoriaId('');
      setAsignadoAId('');
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'No se pudo crear el ticket.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ticket-create-form">
      <h3>Generar un nuevo ticket</h3>
      <p>Completa los datos para enviar tu solicitud de soporte.</p>

      {status && (
        <div className={`ticket-create-form__status ticket-create-form__status--${status.type}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="ticket-create-form__form">
        <label>
          Título
          <input
            type="text"
            value={titulo}
            onChange={(event) => setTitulo(event.target.value)}
            placeholder="Título del ticket"
            required
            maxLength={150}
          />
        </label>

        <label>
          Descripción
          <textarea
            value={descripcion}
            onChange={(event) => setDescripcion(event.target.value)}
            placeholder="Describe el problema o la solicitud"
            required
            rows={5}
          />
        </label>

        <label>
          Prioridad
          <select
            value={prioridad}
            onChange={(event) => setPrioridad(event.target.value as TicketRequest['prioridad'])}
          >
            <option value="BAJA">Baja</option>
            <option value="MEDIA">Media</option>
            <option value="ALTA">Alta</option>
            <option value="CRITICA">Crítica</option>
          </select>
        </label>

        <label>
          Categoría
          <select value={categoriaId} onChange={(event) => setCategoriaId(event.target.value)}>
            <option value="">Selecciona una categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nombre}
              </option>
            ))}
          </select>
        </label>

        <label>
          Asignado a
          <select value={asignadoAId} onChange={(event) => setAsignadoAId(event.target.value)}>
            <option value="">Selecciona un usuario</option>
            {users
              .filter((user) => user.role === 'TECNICO')
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.nombre} {user.apellido} ({user.role})
                </option>
              ))}
          </select>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Crear ticket'}
        </button>
      </form>
    </div>
  );
};
