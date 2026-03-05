/**
 * DSFontScaleModal - Modal para ajustar el tamaño de las fuentes
 */
import React from 'react'
import { DSModal } from './DSModal'
import { useTheme } from '../theme'
import { Type, RotateCcw } from 'lucide-react'
import './DSFontScaleModal.css'

const PRESETS = [
    { value: 0.75, label: 'Pequeño', description: '75%' },
    { value: 1, label: 'Normal', description: '100%' },
    { value: 1.25, label: 'Grande', description: '125%' },
    { value: 1.5, label: 'Muy Grande', description: '150%' },
]

export function DSFontScaleModal({ isOpen, onClose }) {
    const { fontScale, setFontScale } = useTheme()

    const percentage = Math.round(fontScale * 100)

    const handleSliderChange = (e) => {
        setFontScale(parseFloat(e.target.value))
    }

    const handleReset = () => {
        setFontScale(1)
    }

    const handlePresetClick = (value) => {
        setFontScale(value)
    }

    return (
        <DSModal
            isOpen={isOpen}
            onClose={onClose}
            title="Tamaño de Texto"
            icon={<Type size={18} />}
            size="md"
        >
            <div className="ds-font-scale-modal">
                {/* Preview */}
                <div className="ds-font-scale-preview">
                    <p className="ds-font-scale-preview__text">
                        Este es un texto de ejemplo para previsualizar el tamaño seleccionado.
                    </p>
                </div>

                {/* Slider */}
                <div className="ds-font-scale-slider-container">
                    <span className="ds-font-scale-slider-label">75%</span>
                    <input
                        type="range"
                        min="0.75"
                        max="1.5"
                        step="0.05"
                        value={fontScale}
                        onChange={handleSliderChange}
                        className="ds-font-scale-slider"
                    />
                    <span className="ds-font-scale-slider-label">150%</span>
                </div>

                {/* Current value */}
                <div className="ds-font-scale-current">
                    <span className="ds-font-scale-current__value">{percentage}%</span>
                </div>

                {/* Presets */}
                <div className="ds-font-scale-presets">
                    {PRESETS.map(preset => (
                        <button
                            key={preset.value}
                            type="button"
                            className={`ds-font-scale-preset ${fontScale === preset.value ? 'ds-font-scale-preset--active' : ''}`}
                            onClick={() => handlePresetClick(preset.value)}
                        >
                            <span className="ds-font-scale-preset__label">{preset.label}</span>
                            <span className="ds-font-scale-preset__desc">{preset.description}</span>
                        </button>
                    ))}
                </div>

                {/* Reset button */}
                <div className="ds-font-scale-actions">
                    <button
                        type="button"
                        className="ds-font-scale-reset-btn"
                        onClick={handleReset}
                        disabled={fontScale === 1}
                    >
                        <RotateCcw size={14} />
                        Restablecer
                    </button>
                </div>
            </div>
        </DSModal>
    )
}
