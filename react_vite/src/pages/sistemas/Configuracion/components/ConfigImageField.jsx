import React, { useState, useRef } from 'react';
import { Upload, X, Image, HelpCircle } from 'lucide-react';
import { DSButton } from '../../../../ds-components';
import { getImageUrl } from '../../../../services/settingService';

export function ConfigImageField({ label, value, onUpload, onDelete, help, small }) {
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [preview, setPreview] = useState(null);
    const inputRef = useRef(null);

    const currentImage = value ? getImageUrl(value) : null;

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(file);

        setUploading(true);
        await onUpload(file);
        setUploading(false);
        setPreview(null);
    };

    const handleDelete = async () => {
        if (!onDelete) return;
        if (!confirm('¿Estás seguro de eliminar esta imagen?')) return;

        setDeleting(true);
        await onDelete();
        setDeleting(false);
    };

    const displayPreview = preview || currentImage;

    return (
        <div className={`config-image-field ${small ? 'config-image-field--small' : ''}`}>
            <label className="ds-field__label">
                <Image size={14} />
                {label}
                {help && <span className="ds-field__tooltip" title={help}><HelpCircle size={12} /></span>}
            </label>
            <div className="config-image-box">
                {displayPreview ? (
                    <img src={displayPreview} alt={label} className="config-image-preview" />
                ) : (
                    <div className="config-image-placeholder">
                        <Image size={24} />
                        <span>Sin imagen</span>
                    </div>
                )}
                <input ref={inputRef} type="file" accept="image/*" onChange={handleFileSelect} hidden />
                <div className="config-image-actions">
                    <DSButton
                        variant="default"
                        size="sm"
                        onClick={() => inputRef.current?.click()}
                        disabled={uploading || deleting}
                        loading={uploading}
                        icon={!uploading && <Upload size={14} />}
                        block
                    >
                        {uploading ? 'Subiendo...' : (currentImage ? 'Cambiar' : 'Subir')}
                    </DSButton>
                    {currentImage && (
                        <DSButton
                            variant="danger"
                            size="sm"
                            onClick={handleDelete}
                            disabled={uploading || deleting}
                            loading={deleting}
                            icon={!deleting && <X size={14} />}
                            iconOnly
                            title="Eliminar imagen"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
