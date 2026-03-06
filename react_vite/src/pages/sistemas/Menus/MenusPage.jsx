import React from 'react';
import { FolderTree, Plus, ArrowUpDown, X, Save, AlertTriangle } from 'lucide-react';
import {
    DSPage,
    DSPageHeader,
    DSAlert,
    DSButton,
    SecuredButton
} from '../../../ds-components';

import './MenusPage.css';

// Hook
import { useMenus } from './hooks/useMenus';

// Components
import { MenuTreeTable } from './components/MenuTreeTable';
import { SortableMenuTree } from './components/SortableMenuTree';
import { MenuFormModal } from './components/MenuFormModal';

export function MenusPage() {
    const logic = useMenus();

    // Si hay error de acceso (403), mostrar pantalla de bloqueo
    if (logic.error && logic.error.includes('Acceso denegado')) {
        return (
            <DSPage>
                <DSPageHeader
                    title="Administración de Menús"
                    icon={<FolderTree size={22} />}
                />
                <DSAlert variant="error" className="menus-alert-margin">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle size={20} />
                        <span>{logic.error}</span>
                    </div>
                </DSAlert>
            </DSPage>
        );
    }

    return (
        <DSPage>
            {/* HEADER */}
            <DSPageHeader
                title="Administración de Menús"
                icon={<FolderTree size={22} />}
                actions={
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {!logic.isOrderMode && (
                            <>
                                <DSButton
                                    variant="outline"
                                    icon={<ArrowUpDown size={16} />}
                                    onClick={logic.enterOrderMode}
                                >
                                    Ordenar
                                </DSButton>
                                <SecuredButton
                                    securityId="menus.crear"
                                    securityDesc="Crear nuevo menú"
                                    variant="primary"
                                    icon={<Plus size={16} />}
                                    onClick={() => logic.openCreate()}
                                >
                                    Nuevo Menú
                                </SecuredButton>
                            </>
                        )}
                        {logic.isOrderMode && (
                            <>
                                <DSButton
                                    variant="outline"
                                    icon={<X size={16} />}
                                    onClick={logic.cancelOrderMode}
                                    disabled={logic.savingOrder}
                                >
                                    Cancelar
                                </DSButton>
                                <DSButton
                                    variant="primary"
                                    icon={<Save size={16} />}
                                    onClick={logic.saveOrder}
                                    loading={logic.savingOrder}
                                    disabled={logic.savingOrder}
                                >
                                    Guardar Orden
                                </DSButton>
                            </>
                        )}
                    </div>
                }
            />

            {/* ALERTAS */}
            {logic.formSuccess && (
                <DSAlert variant="success" dismissible onDismiss={() => logic.setFormSuccess(null)} className="menus-alert-margin">
                    {logic.formSuccess}
                </DSAlert>
            )}
            {logic.error && (
                <DSAlert variant="error" className="menus-alert-margin">
                    {logic.error}
                </DSAlert>
            )}

            {/* INFO BOX */}
            <DSAlert variant="info" className="menus-alert-margin">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle size={16} />
                        <span>
                            <strong>Solo Superusuarios:</strong> Esta sección permite administrar los menús del sistema.
                            Los cambios afectan a la navegación de todos los roles.
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginLeft: '24px' }}>
                        <span style={{ fontSize: '12px', marginTop: '2px' }}>•</span>
                        <span style={{ fontSize: '13px' }}>
                            <strong>Tipo "Sidebar":</strong> Menús principales que aparecen en la barra lateral de navegación.
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginLeft: '24px' }}>
                        <span style={{ fontSize: '12px', marginTop: '2px' }}>•</span>
                        <span style={{ fontSize: '13px' }}>
                            <strong>Tipo "Tab":</strong> Pestañas dentro de una página (hijas de un menú Sidebar).
                            Permiten control granular de permisos por sección.
                        </span>
                    </div>
                </div>
            </DSAlert>

            {/* CONTENIDO PRINCIPAL */}
            {logic.isOrderMode ? (
                <SortableMenuTree
                    items={logic.orderedItems}
                    onReorderChildren={logic.handleReorderChildren}
                    onParentDragEnd={logic.handleParentDragEnd}
                />
            ) : (
                <MenuTreeTable
                    menus={logic.menus}
                    loading={logic.loading}
                    onEdit={logic.openEdit}
                    onDelete={logic.handleDelete}
                    onRefresh={logic.refetch}
                    expandedIds={logic.expandedIds}
                    toggleExpand={logic.toggleExpand}
                />
            )}

            {/* MODAL FORMULARIO */}
            <MenuFormModal
                isOpen={logic.modalOpen}
                onClose={logic.closeModal}
                isEditing={!!logic.editingMenu}
                form={logic.form}
                setForm={logic.setForm}
                parentMenus={logic.parentMenus}
                icons={logic.icons}
                onChange={logic.handleChange}
                onSave={logic.handleSave}
                saving={logic.saving}
                error={logic.formError}
            />
        </DSPage>
    );
}

export default MenusPage;
