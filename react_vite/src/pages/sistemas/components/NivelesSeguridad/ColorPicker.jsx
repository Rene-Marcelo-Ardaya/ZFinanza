import React from 'react';

const PRESET_COLORS = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#6b7280', // gray
];

export function ColorPicker({ value, onChange }) {
    return (
        <div className="niveles-color-picker">
            <div className="niveles-color-picker__presets">
                {PRESET_COLORS.map(color => (
                    <button
                        key={color}
                        type="button"
                        className={`niveles-color-picker__swatch ${value === color ? 'is-selected' : ''}`}
                        style={{ background: color }}
                        onClick={() => onChange(color)}
                        title={color}
                    />
                ))}
            </div>
            <input
                type="color"
                value={value || '#6b7280'}
                onChange={(e) => onChange(e.target.value)}
                className="niveles-color-picker__input"
            />
        </div>
    );
}
