import React from 'react';
import './dashboard.css';

export const DashboardPage = ({ userData }) => {
    return (
        <div className="dashboard-container">
            <div className="dashboard-message-card">
                <h1>Dashboard</h1>
                <div className="progress-indicator">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                </div>
                <p className="status-message">En progreso...</p>
                <p className="sub-message">Estamos trabajando en las funcionalidades de esta área.</p>
            </div>
        </div>
    );
};
