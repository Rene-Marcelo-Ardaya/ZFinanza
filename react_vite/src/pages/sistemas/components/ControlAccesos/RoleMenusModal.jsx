import React, { useMemo } from 'react';
import { Shield, Menu, ChevronRight } from 'lucide-react';
import {
    DSModal,
    DSButton,
    DSLoading
} from '../../../../ds-components';

export function RoleMenusModal({
    isOpen,
    onClose,
    role,
    roleMenus,
    allMenus,
    loading
}) {
    const roleTitle = role ? `Menús Permitidos: ${role.name}` : 'Menús del Rol';

    // Construir el árbol de menús permitidos
    // Solo mostrar los que están en roleMenus (lista de IDs)
    const allowedTree = useMemo(() => {
        if (!allMenus || !roleMenus) return [];

        return allMenus.map(menu => {
            const isParentAllowed = roleMenus.includes(menu.id);
            const allowedChildren = (menu.children || []).filter(child => roleMenus.includes(child.id));

            // Si el padre o algún hijo está permitido, mostrar el grupo
            if (isParentAllowed || allowedChildren.length > 0) {
                return {
                    ...menu,
                    isAllowed: isParentAllowed,
                    children: allowedChildren
                };
            }
            return null;
        }).filter(Boolean); // Eliminar nulos
    }, [allMenus, roleMenus]);

    return (
        <DSModal
            isOpen={isOpen}
            onClose={onClose}
            title={roleTitle}
            size="md"
            footer={
                <DSButton onClick={onClose}>
                    Cerrar
                </DSButton>
            }
        >
            <div className="role-menus-content">
                {loading ? (
                    <DSLoading text="Cargando permisos..." />
                ) : allowedTree.length === 0 ? (
                    <div className="ds-empty-state" style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
                        <Shield size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                        <p>Este rol no tiene acceso a ningún menú.</p>
                    </div>
                ) : (
                    <div className="accesos-menu-tree" style={{ border: 'none', padding: 0 }}>
                        {allowedTree.map(menu => (
                            <div key={menu.id} className="accesos-menu-tree__group">
                                <label className="accesos-menu-tree__parent" style={{ cursor: 'default' }}>
                                    <Menu size={14} className={menu.isAllowed ? 'text-success' : 'text-muted'} />
                                    <span style={{ fontWeight: 600 }}>{menu.name}</span>
                                    {!menu.isAllowed && <span style={{ fontSize: '10px', color: '#94a3b8', marginLeft: '6px' }}>(Solo hijos)</span>}
                                </label>
                                {menu.children && menu.children.length > 0 && (
                                    <div className="accesos-menu-tree__children">
                                        {menu.children.map(child => (
                                            <label key={child.id} className="accesos-menu-tree__child" style={{ cursor: 'default' }}>
                                                <ChevronRight size={12} className="text-success" />
                                                <span>{child.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DSModal>
    );
}
