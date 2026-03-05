import React, { useMemo, useState, useRef, useEffect } from 'react'
import { Calendar, Clock, ChevronLeft, ChevronRight, X } from 'lucide-react'

/**
 * DSDateTimeField - Campo de fecha y hora personalizado
 * Combina selector de fecha (calendario) y selector de hora
 */
export function DSDateTimeField({
    label,
    name,
    value,
    onChange,
    placeholder = 'Seleccionar fecha y hora',
    help,
    error,
    disabled = false,
    required = false,
    stepMinutes = 15,
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('date') // 'date' | 'time'
    const [anchorDate, setAnchorDate] = useState(() => (value ? new Date(value) : new Date()))
    const containerRef = useRef(null)

    // Cerrar al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Calendario
    const startOfMonth = useMemo(() => new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 1), [anchorDate])
    const daysInMonth = useMemo(
        () => new Date(anchorDate.getFullYear(), anchorDate.getMonth() + 1, 0).getDate(),
        [anchorDate],
    )
    const startWeekday = startOfMonth.getDay()

    const weeks = useMemo(() => {
        const cells = []
        for (let i = 0; i < startWeekday; i++) cells.push(null)
        for (let d = 1; d <= daysInMonth; d++) cells.push(d)
        const out = []
        for (let i = 0; i < cells.length; i += 7) {
            out.push(cells.slice(i, i + 7))
        }
        return out
    }, [daysInMonth, startWeekday])

    // Slots de hora
    const timeSlots = useMemo(() => {
        const out = []
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += stepMinutes) {
                out.push({ hour: h, minute: m, label: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}` })
            }
        }
        return out
    }, [stepMinutes])

    // Parsear valor
    const parseValue = (val) => {
        if (!val) return { date: null, time: '12:00' }
        const date = new Date(val)
        if (Number.isNaN(date.getTime())) return { date: null, time: '12:00' }
        return {
            date: date,
            time: `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`,
        }
    }

    const { date: selectedDate, time: selectedTime } = parseValue(value)

    // Formatear display
    const display = useMemo(() => {
        if (!value) return ''
        const d = new Date(value)
        if (Number.isNaN(d.getTime())) return ''
        return d.toLocaleString('es-BO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }, [value])

    // Cambiar mes
    const changeMonth = (delta) => {
        const next = new Date(anchorDate)
        next.setMonth(anchorDate.getMonth() + delta)
        setAnchorDate(next)
    }

    // Seleccionar fecha
    const handleSelectDate = (day) => {
        const next = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), day)
        setAnchorDate(next)
        setActiveTab('time')
    }

    // Seleccionar hora
    const handleSelectTime = (timeObj) => {
        if (!selectedDate) {
            const newDate = new Date(anchorDate)
            newDate.setHours(timeObj.hour, timeObj.minute, 0, 0)
            onChange?.(newDate.toISOString())
        } else {
            const newDate = new Date(selectedDate)
            newDate.setHours(timeObj.hour, timeObj.minute, 0, 0)
            onChange?.(newDate.toISOString())
        }
        setIsOpen(false)
    }

    // Hoy
    const handleToday = () => {
        const now = new Date()
        setAnchorDate(now)
        if (selectedTime) {
            const [h, m] = selectedTime.split(':').map(Number)
            now.setHours(h, m, 0, 0)
        } else {
            now.setHours(12, 0, 0, 0)
        }
        onChange?.(now.toISOString())
        setIsOpen(false)
    }

    // Limpiar
    const handleClear = (e) => {
        e.stopPropagation()
        onChange?.('')
        setIsOpen(false)
    }

    return (
        <div ref={containerRef} className={`ds-field ds-datetime ${isOpen ? 'is-open' : ''}`}>
            {label && (
                <label className="ds-field__label" htmlFor={name}>
                    {label}
                    {required && <span className="ds-field__required">*</span>}
                </label>
            )}

            <div className="ds-datetime__control" onClick={() => !disabled && setIsOpen(true)}>
                <input
                    id={name}
                    name={name}
                    className="ds-field__control"
                    value={display}
                    placeholder={placeholder}
                    readOnly
                    disabled={disabled}
                    style={{
                        background: disabled ? 'var(--ds-fieldDisabledBg, #e3eaf5)' : undefined,
                        cursor: disabled ? 'not-allowed' : 'pointer'
                    }}
                />
                <span className="ds-datetime__icon">
                    <Calendar size={18} />
                </span>
                {value && !disabled && (
                    <button
                        type="button"
                        className="ds-datetime__clear"
                        onClick={handleClear}
                        tabIndex={-1}
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="ds-datetime__popover">
                    {/* Header con tabs */}
                    <div className="ds-datetime__header">
                        <button
                            type="button"
                            className={`ds-datetime__tab ${activeTab === 'date' ? 'is-active' : ''}`}
                            onClick={() => setActiveTab('date')}
                        >
                            <Calendar size={14} />
                            <span>Fecha</span>
                        </button>
                        <button
                            type="button"
                            className={`ds-datetime__tab ${activeTab === 'time' ? 'is-active' : ''}`}
                            onClick={() => setActiveTab('time')}
                        >
                            <Clock size={14} />
                            <span>Hora</span>
                        </button>
                        <div className="ds-datetime__actions">
                            <button
                                type="button"
                                className="ds-btn ds-btn--ghost ds-btn--sm"
                                onClick={handleToday}
                            >
                                Hoy
                            </button>
                        </div>
                    </div>

                    {/* Vista de Fecha */}
                    {activeTab === 'date' && (
                        <>
                            <div className="ds-datetime__nav">
                                <button
                                    type="button"
                                    className="ds-datetime__nav-btn"
                                    onClick={() => changeMonth(-1)}
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <div className="ds-datetime__title">
                                    {anchorDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                </div>
                                <button
                                    type="button"
                                    className="ds-datetime__nav-btn"
                                    onClick={() => changeMonth(1)}
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                            <div className="ds-datetime__weekdays">
                                {['D', 'L', 'Ma', 'Mi', 'J', 'V', 'S'].map((wd) => (
                                    <span key={wd}>{wd}</span>
                                ))}
                            </div>
                            <div className="ds-datetime__grid">
                                {weeks.map((week, wi) => (
                                    <div key={wi} className="ds-datetime__row">
                                        {week.map((day, di) => {
                                            if (!day) return <span key={di} className="ds-datetime__cell is-empty" />
                                            const isSelected = selectedDate &&
                                                selectedDate.getDate() === day &&
                                                selectedDate.getMonth() === anchorDate.getMonth() &&
                                                selectedDate.getFullYear() === anchorDate.getFullYear()
                                            const isToday = new Date().toISOString().slice(0, 10) ===
                                                new Date(anchorDate.getFullYear(), anchorDate.getMonth(), day).toISOString().slice(0, 10)
                                            return (
                                                <button
                                                    type="button"
                                                    key={di}
                                                    className={`ds-datetime__cell ${isSelected ? 'is-selected' : ''} ${isToday ? 'is-today' : ''}`}
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    onClick={() => handleSelectDate(day)}
                                                >
                                                    {day}
                                                </button>
                                            )
                                        })}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Vista de Hora */}
                    {activeTab === 'time' && (
                        <div className="ds-datetime__time">
                            <div className="ds-datetime__time-scroll">
                                {timeSlots.map((slot) => (
                                    <button
                                        type="button"
                                        key={slot.label}
                                        className={`ds-datetime__time-option ${slot.label === selectedTime ? 'is-selected' : ''}`}
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => handleSelectTime(slot)}
                                    >
                                        <Clock size={14} />
                                        <span>{slot.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {help && !error && <div className="ds-field__help">{help}</div>}
            {error && <div className="ds-field__error">{error}</div>}
        </div>
    )
}

export default DSDateTimeField
