import React, { useState, useEffect } from 'react';
import { Save, Type } from 'lucide-react';
import { DSField, DSButton } from '../../../../ds-components';

export function ConfigTextField({ label, value, onSave, saving, help, icon: Icon = Type }) {
    const [localValue, setLocalValue] = useState(value || '');
    const [dirty, setDirty] = useState(false);

    useEffect(() => {
        setLocalValue(value || '');
        setDirty(false);
    }, [value]);

    const handleChange = (newValue) => {
        setLocalValue(newValue);
        setDirty(newValue !== (value || ''));
    };

    const handleSave = async () => {
        await onSave(localValue);
        setDirty(false);
    };

    return (
        <DSField label={label} tooltip={help}>
            <div className="config-field__row">
                <div className="config-field__icon-wrapper">
                    <Icon size={14} className="config-field__prefix-icon" />
                </div>
                <input
                    type="text"
                    className="ds-field__control config-field__input"
                    value={localValue}
                    onChange={(e) => handleChange(e.target.value)}
                />
                {dirty && (
                    <DSButton
                        variant="primary"
                        size="sm"
                        onClick={handleSave}
                        disabled={saving}
                        loading={saving}
                        icon={!saving && <Save size={14} />}
                    />
                )}
            </div>
        </DSField>
    );
}
