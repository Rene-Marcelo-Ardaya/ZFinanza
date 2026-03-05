import React from 'react';
import { Menu as MenuIcon, ChevronRight } from 'lucide-react';

export function MenuTree({ menus, selectedIds, onChange }) {
    const toggleMenu = (menuId, children = []) => {
        const childIds = children.map(c => c.id);
        const allIds = [menuId, ...childIds];

        const isSelected = selectedIds.includes(menuId);

        if (isSelected) {
            onChange(selectedIds.filter(id => !allIds.includes(id)));
        } else {
            onChange([...new Set([...selectedIds, ...allIds])]);
        }
    };

    const toggleChild = (childId, parentId) => {
        const isSelected = selectedIds.includes(childId);
        let newIds;

        if (isSelected) {
            newIds = selectedIds.filter(id => id !== childId);
        } else {
            newIds = [...new Set([...selectedIds, childId, parentId])];
        }
        onChange(newIds);
    };

    return (
        <div className="accesos-menu-tree">
            {menus.map(menu => (
                <div key={menu.id} className="accesos-menu-tree__group">
                    <label className="accesos-menu-tree__parent">
                        <input
                            type="checkbox"
                            checked={selectedIds.includes(menu.id)}
                            onChange={() => toggleMenu(menu.id, menu.children || [])}
                        />
                        <MenuIcon size={14} />
                        <span>{menu.name}</span>
                    </label>
                    {menu.children && menu.children.length > 0 && (
                        <div className="accesos-menu-tree__children">
                            {menu.children.map(child => (
                                <label key={child.id} className="accesos-menu-tree__child">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(child.id)}
                                        onChange={() => toggleChild(child.id, menu.id)}
                                    />
                                    <ChevronRight size={12} />
                                    <span>{child.name}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
