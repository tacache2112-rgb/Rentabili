import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    getHistoricalBalancesByActive,
    createHistoricalBalance,
    updateHistoricalBalance,
    deleteHistoricalBalance,
    getActiveById // To display active name
} from '../utils/api';
const HistoricalBalancesPage = () => {
    const { activeId } = useParams();
    const [historicalBalances, setHistoricalBalances] = useState([]);
    const [active, setActive] = useState(null);
    const [newBalance, setNewBalance] = useState({ date: '', value: '' });
    const [editingBalance, setEditingBalance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchActiveAndBalances();
    }, [activeId]);

    const fetchActiveAndBalances = async () => {
        try {
            setLoading(true);
            const activeData = await getActiveById(activeId);
            setActive(activeData);
            const balancesData = await getHistoricalBalancesByActive(activeId);
            setHistoricalBalances(balancesData);
        } catch (err) {
            setError('Failed to fetch active or historical balances.');
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBalance = async (e) => {
        e.preventDefault();
        try {
            await createHistoricalBalance({
                ...newBalance,
                activeId: parseInt(activeId),
            });
            setNewBalance({ date: '', value: '' });
            fetchActiveAndBalances();
        } catch (err) {
            setError('Failed to create historical balance.');
            console.error('Error creating balance:', err);
        }
    };

    const handleUpdateBalance = async (e) => {
        e.preventDefault();
        if (!editingBalance) return;
        try {
            await updateHistoricalBalance(editingBalance.id, {
                date: editingBalance.date,
                value: editingBalance.value,
            });
            setEditingBalance(null);
            fetchActiveAndBalances();
        } catch (err) {
            setError('Failed to update historical balance.');
            console.error('Error updating balance:', err);
        }
    };

    const handleDeleteBalance = async (id) => {
        try {
            await deleteHistoricalBalance(id);
            fetchActiveAndBalances();
        } catch (err) {
            setError('Failed to delete historical balance.');
            console.error('Error deleting balance:', err);
        }
    };

    if (loading) return <div className="main-content">Loading historical balances...</div>;
    if (error) return <div className="main-content error-message">{error}</div>;
    if (!active) return <div className="main-content error-message">Active not found.</div>;

    return (
        <div className="main-content">
            <h1 className="form-title">Saldos Históricos para {active.name} ({active.type})</h1>

            {/* Formulário para Criar/Editar Saldo Histórico */}
            <form onSubmit={editingBalance ? handleUpdateBalance : handleCreateBalance} className="form-area">
                <div className="floating-input-group">
                    <input
                        type="date"
                        className="floating-input"
                        id="balanceDate"
                        placeholder=" "
                        value={editingBalance ? editingBalance.date.split('T')[0] : newBalance.date}
                        onChange={(e) =>
                            editingBalance
                                ? setEditingBalance({ ...editingBalance, date: e.target.value })
                                : setNewBalance({ ...newBalance, date: e.target.value })
                        }
                        required
                    />
                    <label htmlFor="balanceDate" className="floating-label">Data</label>
                </div>
                <div className="floating-input-group">
                    <input
                        type="number"
                        step="0.01"
                        className="floating-input"
                        id="balanceValue"
                        placeholder=" "
                        value={editingBalance ? editingBalance.value : newBalance.value}
                        onChange={(e) =>
                            editingBalance
                                ? setEditingBalance({ ...editingBalance, value: parseFloat(e.target.value) })
                                : setNewBalance({ ...newBalance, value: parseFloat(e.target.value) })
                        }
                        required
                    />
                    <label htmlFor="balanceValue" className="floating-label">Valor</label>
                </div>
                <button type="submit" className="holo-button">
                    {editingBalance ? 'Atualizar Saldo' : 'Criar Saldo'}
                </button>
                {editingBalance && (
                    <button type="button" className="flip-button" onClick={() => setEditingBalance(null)}>
                        Cancelar
                    </button>
                )}
            </form>

            {/* Lista de Saldos Históricos */}
            <div className="data-list-container">
                <h2 className="form-subtitle">Saldos Registrados</h2>
                {historicalBalances.length === 0 ? (
                    <p>Nenhum saldo histórico encontrado para este ativo.</p>
                ) : (
                    <ul className="data-list">
                        {historicalBalances.map((balance) => (
                            <li key={balance.id} className="data-list-item">
                                <span className="item-details">
                                    {new Date(balance.date).toLocaleDateString()}: {balance.value.toFixed(2)}
                                </span>
                                <div className="item-actions">
                                    <button className="holo-button small-button" onClick={() => setEditingBalance(balance)}>
                                        Editar
                                    </button>
                                    <button className="flip-button small-button" onClick={() => handleDeleteBalance(balance.id)}>
                                        Excluir
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

export default HistoricalBalancesPage;