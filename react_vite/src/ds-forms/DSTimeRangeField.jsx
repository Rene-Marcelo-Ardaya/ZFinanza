import React, { useMemo, useRef } from 'react'
import './DSTimeRangeField.css'

/**
 * Calcula la diferencia en horas entre dos tiempos
 * @param {string} horaInicio - Hora de inicio en formato HH:mm
 * @param {string} horaFinal - Hora final en formato HH:mm
 * @returns {string|null} - Horas calculadas con 2 decimales o null si no hay datos
 */
export function calcularHorasLluvia(horaInicio, horaFinal) {
    if (!horaInicio || !horaFinal) return null

    const inicio = new Date(`2000-01-01T${horaInicio}`)
    const fin = new Date(`2000-01-01T${horaFinal}`)

    // Si la hora final es menor, asumir que es del día siguiente
    let diffMs = fin - inicio
    if (diffMs < 0) {
        diffMs += 24 * 60 * 60 * 1000 // Agregar 24 horas
    }

    const diffHoras = diffMs / (1000 * 60 * 60)
    return diffHoras.toFixed(2)
}

/**
 * Componente interno para manejar input de hora numérico (HH:MM)
 * Fuerza formato 24h y facilita entrada en móviles
 */
function TimeInput24({ value, onChange, disabled, className, onMinutesEnter, externalHoursRef }) {
    // Parsear valor inicial "HH:MM" a partes
    const [hours, minutes] = (value || '').split(':');
    
    // Refs para manejar el foco entre campos
    const internalHoursRef = useRef(null);
    const hoursRef = externalHoursRef || internalHoursRef;
    const minutesRef = useRef(null);

    const handleChange = (type, val) => {
        // Permitir solo números
        let num = val.replace(/\D/g, '');

        // Validar rangos
        if (type === 'hours') {
            if (num.length > 2) num = num.slice(0, 2);
            if (parseInt(num) > 23) num = '23';
        } else {
            if (num.length > 2) num = num.slice(0, 2);
            if (parseInt(num) > 59) num = '59';
        }

        // Construir nuevo valor manteniendo la otra parte
        const newHours = type === 'hours' ? num : (hours || '');
        const newMinutes = type === 'minutes' ? num : (minutes || '');

        // Solo notificar cambio si ambas partes tienen algo o si se está borrando
        if (newHours === '' && newMinutes === '') {
            onChange('');
        } else {
            // Formatear para visualización y envío
            // Nota: No forzamos el padStart aquí para permitir escribir "1" -> "14" cómodamente
            // Pero al enviarlo al padre podríamos querer normalizarlo,
            // sin embargo, para input fluido mejor pasamos raw y formateamos en blur si fuera necesario,
            // pero para este caso simple, construimos el string directo.
            onChange(`${newHours}:${newMinutes}`);
        }
    };
    
    // Manejar Enter/Tab en el campo de horas para pasar automáticamente a minutos
    const handleHoursKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault();
            // Mover foco a minutos
            minutesRef.current?.focus();
        }
    };
    
    // Manejar Enter/Tab en el campo de minutos para pasar al siguiente campo (onMinutesEnter callback)
    const handleMinutesKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === 'Tab') {
            if (onMinutesEnter) {
                e.preventDefault();
                onMinutesEnter();
            }
        }
    };

    const handleBlur = () => {
        // Al perder foco, aseguramos formato HH:MM (pad con ceros)
        // IMPORTANTE: Solo formatear cuando ambos campos tengan valor
        if (!value) return;
        let [h, m] = value.split(':');

        // Si no hay horas ni minutos, no hacer nada
        if (!h && !m) return;
        
        // Si solo hay horas pero no minutos, NO forzar '00'
        // Dejar que el usuario termine de escribir
        if (h && !m) {
            return;
        }
        
        // Solo formatear cuando ambos tengan valor
        if (!h) h = '00';
        if (!m) m = '00';

        let hNum = parseInt(h);
        let mNum = parseInt(m);

        if (isNaN(hNum)) hNum = 0;
        if (isNaN(mNum)) mNum = 0;

        // Re-validar rangos finales
        if (hNum > 23) hNum = 23;
        if (mNum > 59) mNum = 59;

        const finalStr = `${hNum.toString().padStart(2, '0')}:${mNum.toString().padStart(2, '0')}`;
        if (finalStr !== value) {
            onChange(finalStr);
        }
    };

    return (
        <div className={`ds-time-input-24 ${className || ''}`}>
            <input
                ref={hoursRef}
                type="text"
                inputMode="numeric"
                className="ds-time-input-24__field"
                placeholder="HH"
                value={hours || ''}
                onChange={e => handleChange('hours', e.target.value)}
                onKeyDown={handleHoursKeyDown}
                onBlur={handleBlur}
                disabled={disabled}
                maxLength={2}
            />
            <span className="ds-time-input-24__sep">:</span>
            <input
                ref={minutesRef}
                type="text"
                inputMode="numeric"
                className="ds-time-input-24__field"
                placeholder="MM"
                value={minutes || ''}
                onChange={e => handleChange('minutes', e.target.value)}
                onKeyDown={handleMinutesKeyDown}
                onBlur={handleBlur}
                disabled={disabled}
                maxLength={2}
            />
        </div>
    );
}

/**
 * Determina si una hora en formato 24h es AM o PM
 * @param {string} hora - Hora en formato HH:mm o HH
 * @returns {string|null} - 'AM', 'PM' o null si no hay hora válida
 */
function getAmPm(hora) {
    if (!hora) return null;
    const [horaStr] = hora.split(':');
    const horaNum = parseInt(horaStr);
    if (isNaN(horaNum)) return null;
    return horaNum < 12 ? 'AM' : 'PM';
}

/**
 * DSTimeRangeField - Campo de rango de tiempo con cálculo automático de horas
 * Actualizado para usar inputs numéricos 24h con indicador AM/PM inteligente
 */
export function DSTimeRangeField({
    label = 'Rango de Tiempo',
    horaInicio,
    horaFinal,
    onHoraInicioChange,
    onHoraFinalChange,
    disabled = false,
    required = false,
    help,
    error,
}) {
    // Refs para los inputs del campo final
    const finalHoursRef = useRef(null);
    
    // Determinar AM/PM para cada hora
    const amPmInicio = getAmPm(horaInicio);
    const amPmFinal = getAmPm(horaFinal);
    
    // Verificar si hora inicio está completa (formato HH:MM válido)
    const horaInicioCompleta = horaInicio && horaInicio.length === 5 && horaInicio.includes(':');

    // Calcular horas de lluvia automáticamente
    const horasCalculadas = useMemo(() => {
        // Solo calcular si tenemos horas válidas completas (longitud 5: HH:MM)
        if (horaInicio?.length === 5 && horaFinal?.length === 5) {
            return calcularHorasLluvia(horaInicio, horaFinal)
        }
        return null;
    }, [horaInicio, horaFinal])

    const hasError = !!error

    return (
        <div className={`ds-field ds-time-range ${hasError ? 'has-error' : ''}`}>
            {label && (
                <label className="ds-field__label">
                    {label}
                    {required && <span className="ds-field__required"> *</span>}
                </label>
            )}

            <div className="ds-time-range__inputs">
                {/* Hora Inicio */}
                <div className="ds-time-range__input-group">
                    <span className="ds-time-range__label">
                        Inicio {amPmInicio && <span className="ds-time-range__ampm">({amPmInicio})</span>}
                    </span>
                    <TimeInput24
                        value={horaInicio}
                        onChange={onHoraInicioChange}
                        disabled={disabled}
                        onMinutesEnter={() => finalHoursRef.current?.focus()}
                    />
                </div>

                {/* Separador */}
                <div className="ds-time-range__separator">
                    <span className="ds-time-range__arrow">→</span>
                </div>

                {/* Hora Final */}
                <div className="ds-time-range__input-group">
                    <span className="ds-time-range__label">
                        Final {amPmFinal && <span className="ds-time-range__ampm">({amPmFinal})</span>}
                    </span>
                    <TimeInput24
                        value={horaFinal}
                        onChange={onHoraFinalChange}
                        disabled={disabled || !horaInicioCompleta}
                        externalHoursRef={finalHoursRef}
                    />
                </div>
            </div>

            {/* Horas Calculadas */}
            <div className="ds-time-range__result">
                <div className={`ds-time-range__calculated ${horasCalculadas ? 'has-value' : ''}`}>
                    <span className="ds-time-range__result-label">Duración:</span>
                    <span className="ds-time-range__result-value">
                        {horasCalculadas ? (() => {
                            const numericValue = Number(horasCalculadas);
                            const horas = Math.floor(numericValue);
                            const minutos = Math.round((numericValue - horas) * 60);
                            
                            if (horas === 0 && minutos === 0) return '--';
                            if (horas === 0) return `${minutos} min`;
                            if (minutos === 0) return `${horas}h`;
                            return `${horas}h ${minutos}min`;
                        })() : '--'}
                    </span>
                </div>
            </div>

            {help && !error && <div className="ds-field__help">{help}</div>}
            {error && <div className="ds-field__error">{error}</div>}
        </div>
    )
}
