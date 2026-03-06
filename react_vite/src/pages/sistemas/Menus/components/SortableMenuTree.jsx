import React from 'react';
import { Menu as MenuIcon, GripVertical } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DSBadge, DSCount, DSSection } from '../../../../ds-components';

function getLucideIcon(iconName) {
    if (!iconName) return MenuIcon;
    const Icon = LucideIcons[iconName];
    return Icon || MenuIcon;
}

function SortableChildRow({ menu }) {
    const Icon = getLucideIcon(menu.icon);
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: `child-${menu.id}` });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        background: isDragging ? 'var(--ds-accent-10)' : undefined
    };

    return (
        <div ref={setNodeRef} style={style} className="menus-order-child">
            <button
                className="menus-drag-handle"
                {...attributes}
                {...listeners}
            >
                <GripVertical size={14} />
            </button>
            <Icon size={14} />
            <span>{menu.name}</span>
            <DSCount style={{ marginLeft: 'auto' }}>{menu.order}</DSCount>
        </div>
    );
}

function SortableParentItem({ parent, children, onReorderChildren }) {
    const Icon = getLucideIcon(parent.icon);
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: `parent-${parent.id}` });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
    };

    const handleChildDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = children.findIndex(c => `child-${c.id}` === active.id);
            const newIndex = children.findIndex(c => `child-${c.id}` === over.id);
            if (oldIndex !== -1 && newIndex !== -1) {
                const reordered = arrayMove(children, oldIndex, newIndex).map((c, idx) => ({
                    ...c,
                    order: idx + 1
                }));
                onReorderChildren(parent.id, reordered);
            }
        }
    };

    return (
        <div ref={setNodeRef} style={style} className="menus-order-group">
            {/* Header del grupo padre */}
            <div className="menus-order-group__header">
                <button
                    className="menus-drag-handle"
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical size={18} />
                </button>
                <Icon size={18} />
                <strong>{parent.name}</strong>
                <DSBadge variant="neutral" style={{ marginLeft: 'auto' }}>
                    {children.length} submenús
                </DSBadge>
            </div>

            {/* Lista de hijos ordenables */}
            {children.length > 0 && (
                <div className="menus-order-group__children">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleChildDragEnd}
                    >
                        <SortableContext
                            items={children.map(c => `child-${c.id}`)}
                            strategy={verticalListSortingStrategy}
                        >
                            {children.map(child => (
                                <SortableChildRow key={child.id} menu={child} />
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>
            )}
        </div>
    );
}

export function SortableMenuTree({ items, onReorderChildren, onParentDragEnd }) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    return (
        <DSSection title="Ordenar Menús (Arrastra para reordenar)">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={onParentDragEnd}
            >
                <SortableContext
                    items={items.map(p => `parent-${p.id}`)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="menus-order-list">
                        {items.map(parent => (
                            <SortableParentItem
                                key={parent.id}
                                parent={parent}
                                children={parent.children || []}
                                onReorderChildren={onReorderChildren}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </DSSection>
    );
}
