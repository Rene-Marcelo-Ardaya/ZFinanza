import React from 'react';
import { ChevronRight, ChevronDown, Pencil, Trash2, Menu as MenuIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import {
    DSSection,
    DSLoading,
    DSBadge,
    DSCode,
    DSCount,
    SecuredButton,
    DSRefreshButton,
    DSButton
} from '../../../../ds-components';

function getLucideIcon(iconName) {
    if (!iconName) return MenuIcon;
    const Icon = LucideIcons[iconName];
    return Icon || MenuIcon;
}

function MenuTreeItem({ menu, level = 0, onEdit, onDelete, expandedIds, toggleExpand }) {
    const hasChildren = menu.children && menu.children.length > 0;
    const isExpanded = expandedIds.includes(menu.id);
    const Icon = getLucideIcon(menu.icon);
    const isActive = menu.is_active == 1 || menu.is_active === true;

    return (
        <>
            <tr className={`menus-tree-row menus-tree-row--level-${level}`}>
                <td style={{ paddingLeft: `${level * 24 + 12}px` }}>
                    <div className="menus-tree-row__name">
                        {hasChildren ? (
                            <button
                                className="menus-tree-row__toggle"
                                onClick={() => toggleExpand(menu.id)}
                            >
                                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                        ) : (
                            <span className="menus-tree-row__spacer" />
                        )}
                        <Icon size={16} className="menus-tree-row__icon" />
                        <strong>{menu.name}</strong>
                    </div>
                </td>
                <td>
                    {menu.url ? (
                        <DSCode>{menu.url}</DSCode>
                    ) : (
                        <span className="menus-tree-row__no-url">—</span>
                    )}
                </td>
                <td>
                    <span className="menus-tree-row__icon-name">
                        <Icon size={14} />
                        {menu.icon || '—'}
                    </span>
                </td>
                <td className="ds-table__center">
                    <DSCount>{menu.order}</DSCount>
                </td>
                <td>
                    {menu.module ? (
                        <DSBadge variant="neutral">{menu.module}</DSBadge>
                    ) : '—'}
                </td>
                <td className="ds-table__center">
                    <DSBadge variant={menu.menu_type === 'tab' ? 'info' : 'success'}>
                        {menu.menu_type === 'tab' ? 'Tab' : 'Sidebar'}
                    </DSBadge>
                </td>
                <td className="ds-table__center">
                    <DSCount variant="purple">{menu.roles_count || 0}</DSCount>
                </td>
                <td>
                    <DSBadge variant={isActive ? 'success' : 'error'}>
                        {isActive ? 'Activo' : 'Inactivo'}
                    </DSBadge>
                </td>
                <td>
                    <div className="ds-table__actions">
                        <SecuredButton
                            securityId="menus.editar"
                            securityDesc="Editar menú"
                            size="sm"
                            iconOnly
                            icon={<Pencil size={15} />}
                            onClick={() => onEdit(menu)}
                            title="Editar"
                        />
                        <SecuredButton
                            securityId="menus.eliminar"
                            securityDesc="Eliminar menú"
                            size="sm"
                            variant="outline-danger"
                            iconOnly
                            icon={<Trash2 size={15} />}
                            onClick={() => onDelete(menu)}
                            title="Eliminar"
                            disabled={hasChildren}
                        />
                    </div>
                </td>
            </tr>
            {hasChildren && isExpanded && menu.children.map(child => (
                <MenuTreeItem
                    key={child.id}
                    menu={child}
                    level={level + 1}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    expandedIds={expandedIds}
                    toggleExpand={toggleExpand}
                />
            ))}
        </>
    );
}

export function MenuTreeTable({
    menus,
    loading,
    onEdit,
    onDelete,
    onRefresh,
    expandedIds,
    toggleExpand
}) {
    return (
        <DSSection
            title="Estructura de Menús"
            actions={
                <div className="ds-section__actions-row">
                    <DSRefreshButton onClick={onRefresh} loading={loading} />
                </div>
            }
        >
            <div className="ds-table-wrapper">
                {loading ? (
                    <DSLoading text="Cargando..." />
                ) : (
                    <table className="ds-table ds-table--striped ds-table--hover">
                        <thead>
                            <tr>
                                <th style={{ width: '25%' }}>Nombre</th>
                                <th style={{ width: '18%' }}>URL / Ruta</th>
                                <th style={{ width: '12%' }}>Icono</th>
                                <th style={{ width: '6%' }}>Orden</th>
                                <th style={{ width: '10%' }}>Módulo</th>
                                <th style={{ width: '8%' }}>Tipo</th>
                                <th style={{ width: '6%' }}>Roles</th>
                                <th style={{ width: '7%' }}>Estado</th>
                                <th style={{ width: '8%' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menus.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="ds-table__empty">
                                        No hay menús registrados
                                    </td>
                                </tr>
                            ) : (
                                menus.map(menu => (
                                    <MenuTreeItem
                                        key={menu.id}
                                        menu={menu}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        expandedIds={expandedIds}
                                        toggleExpand={toggleExpand}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </DSSection>
    );
}
