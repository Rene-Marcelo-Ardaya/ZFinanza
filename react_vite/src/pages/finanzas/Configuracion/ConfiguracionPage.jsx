import React from 'react';
import { Wallet, Settings } from 'lucide-react';
import {
    DSPage,
    DSPageHeader,
    DSTabsByRole,
} from '../../../ds-components';

import './ConfiguracionPage.css';

export function ConfiguracionPage() {
    const renderTabContent = (tab) => {
        return (
            <div className="finanzas-configuracion-content">
                <div className="finanzas-en-progreso">
                    <Wallet size={48} className="en-progreso-icon" />
                    <h2>En progreso</h2>
                    <p>La funcionalidad de <strong>{tab.label}</strong> está siendo desarrollada.</p>
                    <p>Próximamente estará disponible.</p>
                </div>
            </div>
        );
    };

    return (
        <DSPage>
            <DSPageHeader
                title="Configuración Finanzas"
                icon={<Settings size={22} />}
            />

            <DSTabsByRole
                route="/finanzas/configuracion"
                renderContent={renderTabContent}
            />
        </DSPage>
    );
}

export default ConfiguracionPage;
