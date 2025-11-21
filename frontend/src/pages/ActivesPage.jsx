import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActives, createActive, updateActive, deleteActive } from '../utils/api';

const ActivesPage = () => {
    const navigate = useNavigate();
    const [actives, setActives] = useState([]);
    const [newActive, setNewActive] = useState({ name: '', type: '' });
    const [editingActive, setEditingActive] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchActives();
    }, []);

    const fetchActives = async () => {
        try {
            setLoading(true);
            const data = await getActives();
            setActives(data);
        } catch (err) {
            setError('Failed to fetch actives.');
            console.error('Error fetching actives:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateActive = async (e) => {
        e.preventDefault();
        try {
            await createActive(newActive);
            setNewActive({ name: '', type: '' });
            fetchActives();
        } catch (err) {
            setError('Failed to create active.');
            console.error('Error creating active:', err);
        }
    };

    const handleUpdateActive = async (e) => {
        e.preventDefault();
        if (!editingActive) return;
        try {
            await updateActive(editingActive.id, { name: editingActive.name, type: editingActive.type });
            setEditingActive(null);
            fetchActives();
        } catch (err) {
            setError('Failed to update active.');
            console.error('Error updating active:', err);
        }
    };

    const handleDeleteActive = async (id) => {
        try {
            await deleteActive(id);
            fetchActives();
        } catch (err) {
            setError('Failed to delete active.');
            console.error('Error deleting active:', err);
        }
    };

    if (loading) return <div className="main-content">Loading actives...</div>;
    if (error) return <div className="main-content error-message">{error}</div>;

    return (
        <div className="main-content">
            <h1 className="form-title">Gerenciar Ativos</h1>

            {/* Formulário para Criar/Editar Ativo */}
            <form onSubmit={editingActive ? handleUpdateActive : handleCreateActive} className="form-area">
                <div className="floating-input-group">
                    <input
                        type="text"
                        className="floating-input"
                        id="activeName"
                        placeholder=" "
                        value={editingActive ? editingActive.name : newActive.name}
                        onChange={(e) =>
                            editingActive
                                ? setEditingActive({ ...editingActive, name: e.target.value })
                                : setNewActive({ ...newActive, name: e.target.value })
                        }
                        required
                    />
                    <label htmlFor="activeName" className="floating-label">Nome do Ativo</label>
                </div>
                <div className="floating-input-group">
                    <input
                        type="text"
                        className="floating-input"
                        id="activeType"
                        placeholder=" "
                        value={editingActive ? editingActive.type : newActive.type}
                        onChange={(e) =>
                            editingActive
                                ? setEditingActive({ ...editingActive, type: e.target.value })
                                : setNewActive({ ...newActive, type: e.target.value })
                        }
                        required
                    />
                    <label htmlFor="activeType" className="floating-label">Tipo do Ativo</label>
                </div>
                <button type="submit" className="holo-button">
                    {editingActive ? 'Atualizar Ativo' : 'Criar Ativo'}
                </button>
                {editingActive && (
                    <button type="button" className="flip-button" onClick={() => setEditingActive(null)}>
                        Cancelar
                    </button>
                )}
            </form>

            {/* Lista de Ativos */}
            <div className="data-list-container">
                <h2 className="form-subtitle">Meus Ativos</h2>
                {actives.length === 0 ? (
                    <p>Nenhum ativo encontrado.</p>
                ) : (
                    <ul className="data-list">
                        {actives.map((active) => (
                            <li key={active.id} className="data-list-item">
                                <span className="item-details">{active.name} ({active.type})</span>
                                <div className="item-actions">
                                    <button className="holo-button small-button" onClick={() => setEditingActive(active)}>
                                        Editar
                                    </button>
                                    <button className="flip-button small-button" onClick={() => handleDeleteActive(active.id)}>
                                        Excluir
                                    </button>
                                    <button className="holo-button small-button" onClick={() => navigate(`/actives/${active.id}/historical-balances`)}>
                                        Ver Saldos
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ActivesPage;