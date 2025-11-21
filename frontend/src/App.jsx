import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PaginaAutenticacao from './pages/PaginaAutenticacao';
import Dashboard from './pages/DashBoard';
import Investimentos from './pages/Investimentos';
import Relatorios from './pages/Relatorios';
import ActivesPage from './pages/ActivesPage';
import HistoricalBalancesPage from './pages/HistoricalBalancesPage';
import ProtectedRoute from './components/ProtectRout';
import './styles/estilo.css';

export default function App() {
    return (
        <Router>
            <Routes>
                {/* Rota padrão é o Login */}
                <Route path="/" element={<PaginaAutenticacao />} />

                {/* Rotas protegidas */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/investimentos"
                    element={
                        <ProtectedRoute>
                            <Investimentos />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/relatorios"
                    element={
                        <ProtectedRoute>
                            <Relatorios />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/actives"
                    element={
                        <ProtectedRoute>
                            <ActivesPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/actives/:activeId/historical-balances"
                    element={
                        <ProtectedRoute>
                            <HistoricalBalancesPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}
