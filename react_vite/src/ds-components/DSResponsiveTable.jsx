import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { DSSection, DSRefreshButton } from './index';
import { DSTable } from '../ds-lists/DSTable';
import './DSResponsiveTable.css';

const AUTO_CARD_TITLE_FIELDS = ['numero_compra', 'numero_factura', 'codigo', 'nombre', 'id'];
const AUTO_CARD_BODY_LIMIT = 5;

function getByPath(source, accessor) {
  if (!source || !accessor || typeof accessor !== 'string') return undefined;
  return accessor.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), source);
}

function extractPrimitiveChildren(children) {
  if (children == null) return '';
  if (typeof children === 'string' || typeof children === 'number') return String(children);

  if (Array.isArray(children)) {
    return children
      .map((child) => extractPrimitiveChildren(child))
      .filter(Boolean)
      .join(' ')
      .trim();
  }

  if (React.isValidElement(children)) {
    return extractPrimitiveChildren(children.props?.children);
  }

  return '';
}

function normalizeCellValue(rawValue) {
  if (rawValue == null || rawValue === '') return '-';

  if (React.isValidElement(rawValue)) {
    const content = extractPrimitiveChildren(rawValue.props?.children);
    return content || '-';
  }

  if (Array.isArray(rawValue)) {
    if (rawValue.length === 0) return '-';

    const plain = rawValue
      .map((entry) => normalizeCellValue(entry))
      .filter((entry) => entry !== '-');

    if (plain.length === 0) return `${rawValue.length} items`;
    return plain.join(', ');
  }

  if (typeof rawValue === 'object') {
    return String(
      rawValue.nombre ??
        rawValue.label ??
        rawValue.codigo ??
        rawValue.simbolo ??
        rawValue.descripcion ??
        rawValue.numero ??
        rawValue.id ??
        '-',
    );
  }

  if (typeof rawValue === 'boolean') return rawValue ? 'Si' : 'No';
  return String(rawValue);
}

function resolveColumnValue(column, item) {
  const accessorValue =
    typeof column?.accessor === 'function'
      ? column.accessor(item)
      : getByPath(item, column?.accessor);

  if (typeof column?.render === 'function') {
    try {
      const rendered = column.render(accessorValue, item);
      const renderedValue = normalizeCellValue(rendered);
      if (renderedValue !== '-') return renderedValue;
    } catch {
      // Ignore custom render failures in automatic fallback cards.
    }
  }

  return normalizeCellValue(accessorValue);
}

function useResponsiveViewport(breakpoint = 1024) {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= breakpoint;
  });

  useEffect(() => {
    const checkViewport = () => {
      setIsMobileOrTablet(window.innerWidth <= breakpoint);
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, [breakpoint]);

  return { isMobileOrTablet };
}

export function DSResponsiveTable({
  data = [],
  columns,
  renderCard,
  loading = false,
  emptyMessage = 'No hay registros',
  emptyIcon,
  rowStyle,
  enableRowInfo = true,
  onRefresh,
  cardGridClassName = '',
  tableClassName = '',
  children,
  breakpoint = 1024,
  expandedRowRender,
  pageSize = 25,
  showPagination = true,
  paginationPosition = 'bottom',
}) {
  const { isMobileOrTablet } = useResponsiveViewport(breakpoint);
  const hasRenderCard = typeof renderCard === 'function';
  const warnedFallbackRef = useRef(false);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(data.length / pageSize)), [data.length, pageSize]);
  const effectiveCurrentPage = useMemo(
    () => Math.min(Math.max(1, currentPage), totalPages),
    [currentPage, totalPages],
  );

  const displayData = useMemo(() => {
    if (!showPagination) return data;

    const startIndex = (effectiveCurrentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, effectiveCurrentPage, pageSize, showPagination]);

  const showPaginationControls = showPagination && totalPages > 1;
  const showTopPagination =
    showPaginationControls && (paginationPosition === 'top' || paginationPosition === 'both');
  const showBottomPagination =
    showPaginationControls && (paginationPosition === 'bottom' || paginationPosition === 'both');

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i += 1) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    let startPage = Math.max(2, effectiveCurrentPage - 1);
    let endPage = Math.min(totalPages - 1, effectiveCurrentPage + 1);

    if (effectiveCurrentPage <= 3) {
      endPage = 4;
    }

    if (effectiveCurrentPage >= totalPages - 2) {
      startPage = totalPages - 3;
    }

    if (startPage > 2) pages.push('...');

    for (let i = startPage; i <= endPage; i += 1) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) pages.push('...');
    pages.push(totalPages);

    return pages;
  }, [effectiveCurrentPage, totalPages]);

  const countElement = (
    <span className="ds-responsive-table__count">
      {showPagination && data.length > pageSize ? (
        <>
          {(effectiveCurrentPage - 1) * pageSize + 1} -{' '}
          {Math.min(effectiveCurrentPage * pageSize, data.length)} de {data.length} registros
        </>
      ) : (
        <>{data.length} registros</>
      )}
    </span>
  );

  const renderPaginationControls = () => {
    if (!showPaginationControls) return null;

    return (
      <div className="ds-pagination">
        <div className="ds-pagination__info">
          Pagina {effectiveCurrentPage} de {totalPages}
        </div>

        <div className="ds-pagination__controls">
          <button
            className="ds-pagination__btn"
            onClick={() => goToPage(1)}
            disabled={effectiveCurrentPage === 1}
            title="Primera pagina"
          >
            <ChevronsLeft size={16} />
          </button>

          <button
            className="ds-pagination__btn"
            onClick={() => goToPage(effectiveCurrentPage - 1)}
            disabled={effectiveCurrentPage === 1}
            title="Pagina anterior"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="ds-pagination__pages">
            {pageNumbers.map((page, index) =>
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="ds-pagination__ellipsis">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  className={`ds-pagination__page ${effectiveCurrentPage === page ? 'ds-pagination__page--active' : ''}`}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              ),
            )}
          </div>

          <button
            className="ds-pagination__btn"
            onClick={() => goToPage(effectiveCurrentPage + 1)}
            disabled={effectiveCurrentPage === totalPages}
            title="Pagina siguiente"
          >
            <ChevronRight size={16} />
          </button>

          <button
            className="ds-pagination__btn"
            onClick={() => goToPage(totalPages)}
            disabled={effectiveCurrentPage === totalPages}
            title="Ultima pagina"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  const renderEmpty = () => (
    <div className="ds-responsive-table__empty">
      {emptyIcon && <div className="ds-responsive-table__empty-icon">{emptyIcon}</div>}
      <div className="ds-responsive-table__empty-title">Sin registros</div>
      <div className="ds-responsive-table__empty-desc">{emptyMessage}</div>
    </div>
  );

  const usingAutoFallbackCard = isMobileOrTablet && !hasRenderCard;

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (!usingAutoFallbackCard) return;
    if (warnedFallbackRef.current) return;

    warnedFallbackRef.current = true;
    console.warn('[DSResponsiveTable] renderCard no definido; usando fallback automatico de card.');
  }, [usingAutoFallbackCard]);

  const buildAutoCard = (item, index) => {
    let title = '';

    for (const field of AUTO_CARD_TITLE_FIELDS) {
      const value = normalizeCellValue(getByPath(item, field));
      if (value && value !== '-') {
        title = value;
        break;
      }
    }

    const rows = [];

    for (const column of columns || []) {
      const accessor = String(column?.accessor || '').toLowerCase();
      const header = String(column?.header || '').trim();

      if (!header) continue;
      if (header.toLowerCase().includes('accion')) continue;
      if (accessor === 'actions') continue;

      const value = resolveColumnValue(column, item);
      if (!value || value === '-') continue;

      if (title && AUTO_CARD_TITLE_FIELDS.includes(accessor) && value === title) continue;

      rows.push({ label: header, value });
      if (rows.length >= AUTO_CARD_BODY_LIMIT) break;
    }

    const safeTitle = title || `Registro #${item?.id ?? index + 1}`;

    return (
      <article className="ds-card ds-card--auto">
        <div className="ds-card__header">
          <strong className="ds-card__title-text">{safeTitle}</strong>
        </div>

        <div className="ds-card__body">
          {rows.length > 0 ? (
            rows.map((row) => (
              <div key={`${safeTitle}-${row.label}`} className="ds-card__row">
                <span className="ds-card__label">{row.label}:</span>
                <span className="ds-card__value">{row.value}</span>
              </div>
            ))
          ) : (
            <div className="ds-card__row">
              <span className="ds-card__label">Detalle:</span>
              <span className="ds-card__value">Sin datos adicionales</span>
            </div>
          )}
        </div>
      </article>
    );
  };

  return (
    <DSSection
      actions={
        <div className="ds-section__actions-row">
          {onRefresh && <DSRefreshButton onClick={onRefresh} loading={loading} />}
          {countElement}
        </div>
      }
    >
      {children}

      {showTopPagination && renderPaginationControls()}

      {isMobileOrTablet ? (
        <div className="ds-responsive-table__cards-section">
          {data.length === 0 ? (
            renderEmpty()
          ) : (
            <div className={`ds-responsive-table__cards-grid ${cardGridClassName}`}>
              {displayData.map((item, index) => (
                <React.Fragment key={item?.id || index}>
                  {hasRenderCard ? renderCard(item) : buildAutoCard(item, index)}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className={`ds-responsive-table__table-wrapper ${tableClassName}`}>
          <DSTable
            data={displayData}
            columns={columns}
            loading={loading}
            emptyMessage={emptyMessage}
            emptyIcon={emptyIcon}
            rowStyle={rowStyle}
            enableRowInfo={enableRowInfo}
            expandedRowRender={expandedRowRender}
          />
        </div>
      )}

      {showBottomPagination && renderPaginationControls()}
    </DSSection>
  );
}

export default DSResponsiveTable;
