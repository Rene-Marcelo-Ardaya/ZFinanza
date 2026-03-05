import React, { useState, useEffect } from 'react';
import { Users, UserPlus, UserMinus } from 'lucide-react';
import {
    DSModal,
    DSButton,
    DSLoading,
    DSModalSection
} from '../../../../ds-components';
import {
    fetchMiembros,
    addMiembro,
    removeMiembro,
    fetchEmpleadosDisponibles
} from '../../../../services/securityLevelService';

export function MiembrosModal({ isOpen, onClose, nivel, onUpdate }) {
    const [miembros, setMiembros] = useState([]);
    const [disponibles, setDisponibles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedToAdd, setSelectedToAdd] = useState([]);

    useEffect(() => {
        if (isOpen && nivel) {
            loadData();
        }
    }, [isOpen, nivel]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [miembrosRes, disponiblesRes] = await Promise.all([
                fetchMiembros(nivel.id),
                fetchEmpleadosDisponibles(nivel.id)
            ]);
            setMiembros(miembrosRes.data || []);
            setDisponibles(disponiblesRes.data || []);
        } catch (err) {
            console.error('Error loading members:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMiembros = async () => {
        if (selectedToAdd.length === 0) return;
        setSaving(true);
        try {
            await addMiembro(nivel.id, selectedToAdd);
            setSelectedToAdd([]);
            await loadData();
            onUpdate();
        } catch (err) {
            console.error('Error adding members:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleRemoveMiembro = async (personaId) => {
        if (!window.confirm('¿Quitar este empleado del grupo?')) return;
        setSaving(true);
        try {
            await removeMiembro(nivel.id, personaId);
            await loadData();
            onUpdate();
        } catch (err) {
            console.error('Error removing member:', err);
        } finally {
            setSaving(false);
        }
    };

    const toggleSelected = (id) => {
        setSelectedToAdd(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

    return (
        <DSModal
            isOpen={isOpen}
            onClose={onClose}
            title={`Miembros de "${nivel?.nombre}"`}
            icon={<Users size={20} />}
            size="lg"
        >
            {loading ? (
                <DSLoading text="Cargando miembros..." />
            ) : (
                <div className="niveles-miembros">
                    {/* Miembros actuales */}
                    <DSModalSection title="Miembros Actuales" icon={<Users size={16} />}>
                        {miembros.length === 0 ? (
                            <p className="niveles-miembros__empty">No hay miembros en este grupo</p>
                        ) : (
                            <div className="niveles-miembros__list">
                                {miembros.map(m => (
                                    <div key={m.id} className="niveles-miembros__item">
                                        <div className="niveles-miembros__info">
                                            <strong>{m.nombre} {m.apellido_paterno} {m.apellido_materno}</strong>
                                            <span className="niveles-miembros__meta">
                                                CI: {m.ci} • {m.cargo?.nombre || 'Sin cargo'}
                                            </span>
                                        </div>
                                        <DSButton
                                            size="sm"
                                            variant="outline-danger"
                                            iconOnly
                                            icon={<UserMinus size={14} />}
                                            onClick={() => handleRemoveMiembro(m.id)}
                                            disabled={saving}
                                            title="Quitar del grupo"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </DSModalSection>

                    {/* Agregar miembros */}
                    <DSModalSection title="Agregar Miembros" icon={<UserPlus size={16} />}>
                        {disponibles.length === 0 ? (
                            <p className="niveles-miembros__empty">No hay empleados disponibles</p>
                        ) : (
                            <>
                                <div className="niveles-miembros__list niveles-miembros__list--selectable">
                                    {disponibles.map(e => (
                                        <label key={e.id} className="niveles-miembros__item niveles-miembros__item--selectable">
                                            <input
                                                type="checkbox"
                                                checked={selectedToAdd.includes(e.id)}
                                                onChange={() => toggleSelected(e.id)}
                                            />
                                            <div className="niveles-miembros__info">
                                                <strong>{e.nombre} {e.apellido_paterno} {e.apellido_materno}</strong>
                                                <span className="niveles-miembros__meta">
                                                    CI: {e.ci} • {e.cargo?.nombre || 'Sin cargo'}
                                                </span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                <div className="niveles-miembros__actions">
                                    <DSButton
                                        variant="primary"
                                        icon={<UserPlus size={16} />}
                                        onClick={handleAddMiembros}
                                        disabled={selectedToAdd.length === 0 || saving}
                                        loading={saving}
                                    >
                                        Agregar Seleccionados ({selectedToAdd.length})
                                    </DSButton>
                                </div>
                            </>
                        )}
                    </DSModalSection>
                </div>
            )}
        </DSModal>
    );
}
