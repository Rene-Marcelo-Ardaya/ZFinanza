import React, { useState, useEffect } from 'react';
import { Save, Palette } from 'lucide-react';
import { DSField, DSButton } from '../../../../ds-components';

export function ConfigColorField({ label, value, onSave, saving, help }) {
    const [localValue, setLocalValue] = useState(value || '#15428b');
    const [dirty, setDirty] = useState(false);

    useEffect(() => {
        setLocalValue(value || '#15428b');
        setDirty(false);
    }, [value]);

    const handleChange = (newValue) => {
        setLocalValue(newValue);
        setDirty(newValue !== (value || '#15428b'));
    };

    return (
        <DSField label={label} tooltip={help}>
            <div className="config-field__row">
                <div className="config-field__icon-wrapper">
                    <Palette size={14} className="config-field__prefix-icon" />
                </div>
                <input
                    type="color"
                    className="config-color-picker"
                    value={localValue}
                    onChange={(e) => handleChange(e.target.value)}
                />
                <input
                    type="text"
                    className="ds-field__control config-color-input"
                    value={localValue}
                    onChange={(e) => handleChange(e.target.value)}
                />
                {dirty && (
                    <DSButton
                        variant="primary"
                        size="sm"
                        onClick={() => onSave(localValue)}
                        disabled={saving}
                        loading={saving}
                        icon={!saving && <Save size={14} />}
                    />
                )}
            </div>
        </DSField>
    );
}
