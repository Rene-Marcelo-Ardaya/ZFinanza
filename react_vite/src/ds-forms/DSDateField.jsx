import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Calendar } from 'lucide-react'

function parseDateValue(raw) {
  if (!raw) return null
  const trimmed = String(raw).trim()
  if (!trimmed) return null

  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed)
  if (isoMatch) {
    const year = Number(isoMatch[1])
    const month = Number(isoMatch[2])
    const day = Number(isoMatch[3])
    const parsed = new Date(year, month - 1, day)
    if (
      parsed.getFullYear() === year &&
      parsed.getMonth() === month - 1 &&
      parsed.getDate() === day
    ) {
      return parsed
    }
    return null
  }

  const latinMatch = /^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/.exec(trimmed)
  if (latinMatch) {
    let year = Number(latinMatch[3])
    const month = Number(latinMatch[2])
    const day = Number(latinMatch[1])
    if (year < 100) {
      year = year < 50 ? 2000 + year : 1900 + year
    }
    const parsed = new Date(year, month - 1, day)
    if (
      parsed.getFullYear() === year &&
      parsed.getMonth() === month - 1 &&
      parsed.getDate() === day
    ) {
      return parsed
    }
  }

  return null
}

function formatISODate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return ''
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function supportsNativeDateInput() {
  if (typeof document === 'undefined') return false
  const input = document.createElement('input')
  input.setAttribute('type', 'date')
  return input.type === 'date'
}

function shouldUseNativeDatePicker() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false
  if (!supportsNativeDateInput()) return false

  const userAgent = navigator.userAgent || ''
  const isMobileUA = /Android|iPhone|iPad|iPod|IEMobile|Opera Mini|Mobile/i.test(userAgent)
  const isUADataMobile = navigator.userAgentData?.mobile === true
  const coarsePointer = window.matchMedia?.('(pointer: coarse)')?.matches ?? false
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0
  const isNarrowViewport = viewportWidth > 0 && viewportWidth <= 900

  return isUADataMobile || isMobileUA || (coarsePointer && isNarrowViewport)
}

// DateField con entrada manual + calendario
export function DSDateField({
  label,
  name,
  value,
  onChange,
  placeholder = 'YYYY-MM-DD',
  help,
  error,
  disabled = false,
  allowManualInput = true,
}) {
  const rootRef = useRef(null)
  const popoverRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [useNativePicker, setUseNativePicker] = useState(() => shouldUseNativeDatePicker())
  const [anchorDate, setAnchorDate] = useState(() => parseDateValue(value) || new Date())
  const [inputValue, setInputValue] = useState('')
  const [popoverStyle, setPopoverStyle] = useState({})

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

  const display = useMemo(() => {
    if (!value) return ''
    const parsed = parseDateValue(value)
    return parsed ? formatISODate(parsed) : ''
  }, [value])

  useEffect(() => {
    setInputValue(display)
  }, [display])

  useEffect(() => {
    const recompute = () => setUseNativePicker(shouldUseNativeDatePicker())
    recompute()
    window.addEventListener('resize', recompute)
    return () => window.removeEventListener('resize', recompute)
  }, [])

  useEffect(() => {
    if (useNativePicker && open) {
      setOpen(false)
    }
  }, [useNativePicker, open])

  useEffect(() => {
    const parsed = parseDateValue(value)
    if (parsed) setAnchorDate(parsed)
  }, [value])

  useEffect(() => {
    if (useNativePicker) return undefined
    if (!open) return undefined

    const handleOutside = (event) => {
      const target = event.target
      if (rootRef.current?.contains(target)) return
      if (popoverRef.current?.contains(target)) return
      setOpen(false)
    }
    const handleEsc = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [open, useNativePicker])

  useEffect(() => {
    if (useNativePicker) return undefined
    if (!open) return undefined

    const updatePopoverPosition = () => {
      const control = rootRef.current?.querySelector('.ds-date__control')
      if (!control) return

      const rect = control.getBoundingClientRect()
      const viewportW = window.innerWidth || document.documentElement.clientWidth
      const viewportH = window.innerHeight || document.documentElement.clientHeight
      const margin = 8
      const popupWidth = Math.max(260, Math.round(rect.width))
      const estimatedHeight = 300

      let left = rect.left
      if (left + popupWidth > viewportW - margin) left = viewportW - popupWidth - margin
      if (left < margin) left = margin

      let top = rect.bottom + 6
      if (top + estimatedHeight > viewportH - margin) {
        top = Math.max(margin, rect.top - estimatedHeight - 6)
      }

      setPopoverStyle({
        position: 'fixed',
        left: `${Math.round(left)}px`,
        top: `${Math.round(top)}px`,
        width: `${popupWidth}px`,
        zIndex: 3000,
      })
    }

    updatePopoverPosition()
    window.addEventListener('resize', updatePopoverPosition)
    window.addEventListener('scroll', updatePopoverPosition, true)
    return () => {
      window.removeEventListener('resize', updatePopoverPosition)
      window.removeEventListener('scroll', updatePopoverPosition, true)
    }
  }, [open, useNativePicker])

  const handleSelect = (day) => {
    const selected = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), day)
    const formatted = formatISODate(selected)
    setInputValue(formatted)
    onChange?.(formatted)
    setOpen(false)
  }

  const changeMonth = (delta) => {
    const next = new Date(anchorDate)
    next.setMonth(anchorDate.getMonth() + delta)
    setAnchorDate(next)
  }

  const commitManualValue = () => {
    const raw = String(inputValue || '').trim()
    if (!raw) {
      onChange?.('')
      setInputValue('')
      return
    }

    const parsed = parseDateValue(raw)
    if (!parsed) {
      setInputValue(display)
      return
    }

    const formatted = formatISODate(parsed)
    setInputValue(formatted)
    setAnchorDate(parsed)
    onChange?.(formatted)
  }

  const selectedDate = parseDateValue(display)
  const controlValue = useNativePicker ? display : inputValue
  const canUsePortal = typeof document !== 'undefined'
  const popoverNode =
    open && !useNativePicker ? (
      <div ref={popoverRef} className="ds-date__popover ds-date__popover--floating" style={popoverStyle}>
        <div className="ds-date__header">
          <button type="button" className="ds-btn ds-btn--ghost ds-btn--sm" onClick={() => changeMonth(-1)}>
            {'<'}
          </button>
          <div className="ds-date__title">
            {anchorDate.toLocaleString('default', { month: 'short' })} {anchorDate.getFullYear()}
          </div>
          <button type="button" className="ds-btn ds-btn--ghost ds-btn--sm" onClick={() => changeMonth(1)}>
            {'>'}
          </button>
        </div>

        <div className="ds-date__weekdays">
          {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((wd, idx) => (
            <span key={`${wd}-${idx}`}>{wd}</span>
          ))}
        </div>

        <div className="ds-date__grid">
          {weeks.map((week, wi) => (
            <div key={wi} className="ds-date__row">
              {week.map((day, di) => {
                if (!day) return <span key={di} className="ds-date__cell is-empty" />

                const isSelected = Boolean(
                  selectedDate &&
                  selectedDate.getFullYear() === anchorDate.getFullYear() &&
                  selectedDate.getMonth() === anchorDate.getMonth() &&
                  selectedDate.getDate() === day,
                )

                return (
                  <button
                    type="button"
                    key={di}
                    className={`ds-date__cell ${isSelected ? 'is-selected' : ''}`}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSelect(day)}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    ) : null

  return (
    <div ref={rootRef} className={`ds-field ds-date ${open ? 'is-open' : ''}`}>
      {label ? (
        <label className="ds-field__label" htmlFor={name}>
          {label}
        </label>
      ) : null}

      <div className={`ds-date__control ${useNativePicker ? 'is-native' : ''}`}>
        <input
          id={name}
          name={name}
          type={useNativePicker ? 'date' : 'text'}
          className="ds-field__control"
          value={controlValue}
          placeholder={useNativePicker ? undefined : placeholder}
          readOnly={!useNativePicker && !allowManualInput}
          autoComplete="off"
          inputMode={useNativePicker ? undefined : 'numeric'}
          onChange={(event) => {
            const raw = event.target.value
            setInputValue(raw)

            if (useNativePicker) {
              if (!raw) {
                onChange?.('')
                return
              }
              const parsed = parseDateValue(raw)
              if (parsed) {
                setAnchorDate(parsed)
                onChange?.(formatISODate(parsed))
              }
              return
            }

            if (!allowManualInput) return
            if (!raw.trim()) {
              onChange?.('')
              return
            }

            const parsed = parseDateValue(raw)
            if (parsed) {
              setAnchorDate(parsed)
              onChange?.(formatISODate(parsed))
            }
          }}
          onBlur={() => {
            if (!useNativePicker && allowManualInput) commitManualValue()
          }}
          onKeyDown={(event) => {
            if (useNativePicker) return
            if (event.key === 'ArrowDown' && !disabled) {
              event.preventDefault()
              setOpen(true)
            }
            if (event.key === 'Enter' && allowManualInput) {
              event.preventDefault()
              commitManualValue()
            }
          }}
          disabled={disabled}
          style={{ background: disabled ? 'var(--ds-fieldDisabledBg, #e3eaf5)' : undefined }}
        />

        {!useNativePicker ? (
          <button
            type="button"
            className="ds-date__icon-btn"
            aria-label="Abrir calendario"
            onClick={() => setOpen((prev) => !prev)}
            disabled={disabled}
          >
            <Calendar size={14} />
          </button>
        ) : null}
      </div>

      {popoverNode && canUsePortal ? createPortal(popoverNode, document.body) : null}

      {help && !error ? <div className="ds-field__help">{help}</div> : null}
      {error ? <div className="ds-field__error">{error}</div> : null}
    </div>
  )
}
