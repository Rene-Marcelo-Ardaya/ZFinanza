import React, { useState } from 'react'

/**
 * Componente de Tabs moderno y versátil
 * 
 * @param {Object[]} tabs - Array de objetos con: key, label, icon (opcional), content
 * @param {string|number} defaultActive - Tab activa por defecto (key del tab)
 * @param {Function} onChange - Callback cuando se cambia de tab (recibe la key)
 * @param {string} variant - Variante visual: 'default', 'pills', 'underline'
 * @param {string} size - Tamaño: 'sm', 'md', 'lg'
 */
export function DSTabs({
  tabs = [],
  defaultActive,
  onChange,
  variant = 'underline',
  size = 'md'
}) {
  const initial = defaultActive || (tabs[0]?.key ?? tabs[0]?.id)
  const [active, setActive] = useState(initial)

  const getTabKey = (tab) => tab.key ?? tab.id
  const current = tabs.find((t) => getTabKey(t) === active) || tabs[0]

  const handleSelect = (key) => {
    setActive(key)
    onChange?.(key)
  }

  const variantClass = `ds-tabs--${variant}`
  const sizeClass = `ds-tabs--${size}`

  return (
    <div className={`ds-tabs ${variantClass} ${sizeClass}`}>
      <div className="ds-tabs__list" role="tablist">
        {tabs.map((tab) => {
          const key = getTabKey(tab)
          const isActive = key === active

          return (
            <button
              key={key}
              role="tab"
              aria-selected={isActive}
              className={`ds-tabs__tab ${isActive ? 'is-active' : ''}`}
              onClick={() => handleSelect(key)}
            >
              {tab.icon && (
                <span className="ds-tabs__icon">
                  {React.isValidElement(tab.icon) ? tab.icon : React.createElement(tab.icon, { size: 18 })}
                </span>
              )}
              <span className="ds-tabs__label">{tab.label}</span>
            </button>
          )
        })}
      </div>
      {current && (
        <div className="ds-tabs__panel" role="tabpanel">
          {current.content}
        </div>
      )}

      <style>{`
        .ds-tabs {
          --tabs-gap: 0;
          --tabs-padding: 0.75rem 1rem;
          --tabs-font-size: 0.875rem;
          --tabs-border-width: 2px;
          --tabs-active-color: #3b82f6;
          --tabs-hover-color: #f3f4f6;
          --tabs-text-color: #6b7280;
          --tabs-active-text: #111827;
        }
        
        .ds-tabs--sm {
          --tabs-padding: 0.5rem 0.75rem;
          --tabs-font-size: 0.75rem;
        }
        
        .ds-tabs--lg {
          --tabs-padding: 1rem 1.25rem;
          --tabs-font-size: 1rem;
        }
        
        .ds-tabs__list {
          display: flex;
          gap: var(--tabs-gap);
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 1rem;
          overflow-x: auto;
          scrollbar-width: thin;
          scrollbar-color: #d1d5db transparent;
          -webkit-overflow-scrolling: touch;
        }
        
        .ds-tabs__list::-webkit-scrollbar {
          height: 6px;
        }
        
        .ds-tabs__list::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .ds-tabs__list::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 3px;
        }
        
        .ds-tabs__list::-webkit-scrollbar-thumb:hover {
          background-color: #9ca3af;
        }
        
        .ds-tabs__tab {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: var(--tabs-padding);
          font-size: var(--tabs-font-size);
          font-weight: 500;
          color: var(--tabs-text-color);
          background: none;
          border: none;
          border-bottom: var(--tabs-border-width) solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: -1px;
          flex-shrink: 0;
          white-space: nowrap;
        }
        
        .ds-tabs__tab:hover {
          color: var(--tabs-active-text);
          background: var(--tabs-hover-color);
        }
        
        .ds-tabs__tab.is-active {
          color: var(--tabs-active-color);
          border-bottom-color: var(--tabs-active-color);
        }
        
        .ds-tabs__icon {
          display: inline-flex;
          width: 1em;
          height: 1em;
        }
        
        .ds-tabs__panel {
          animation: ds-tabs-fade-in 0.2s ease;
        }
        
        /* Variant: Pills */
        .ds-tabs--pills .ds-tabs__list {
          border-bottom: none;
          background: #f3f4f6;
          padding: 0.25rem;
          border-radius: 0.5rem;
          gap: 0.25rem;
        }
        
        .ds-tabs--pills .ds-tabs__tab {
          border-radius: 0.375rem;
          border: none;
          margin: 0;
        }
        
        .ds-tabs--pills .ds-tabs__tab.is-active {
          background: white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          color: var(--tabs-active-color);
        }
        
        /* Variant: Default (underline) */
        .ds-tabs--default .ds-tabs__list {
          gap: 0.5rem;
        }
        
        .ds-tabs--default .ds-tabs__tab {
          border-radius: 0.375rem 0.375rem 0 0;
        }
        
        .ds-tabs--default .ds-tabs__tab.is-active {
          background: #f9fafb;
        }
        
        @keyframes ds-tabs-fade-in {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
