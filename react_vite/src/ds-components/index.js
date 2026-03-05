/**
 * DS Components - Unified Export
 * Re-exporta todos los componentes DS desde un punto unificado
 */

// DS Forms
export {
  DSFormPanel,
  DSTextField,
  DSNumberField,
  DSTextArea,
  DSPasswordField,
  DSCheckbox,
  DSRadio,
  DSDateField,
  DSDateTimeField,
  DSComboBox,
  DSCheckboxGroup,
  DSRadioGroup,
  DSTimeField,
  DSButton,
  DSButtonGroup,
  DSRefreshButton,
  DSField,
  DSFieldInput,
  DSFieldsGrid,
  DSFieldsRow,
  DSColorField,
  DSImageUpload,
  DSImagesGrid,
  DSFieldContainer,
  DSFieldSet,
  DSLabel,
  DSFormToolbar,
  DSHelpText,
  DSValidationMessage,
  DSSearchSelect,
  SecuredButton,
  DSTimeRangeField,
  calcularHorasLluvia,
} from '../ds-forms';

// Alias de compatibilidad
export { DSTextField as DSInput } from '../ds-forms';
export { DSTextArea as DSTextarea } from '../ds-forms';

// DS Layout
export {
  DSPanel,
  DSTabs,
  DSAccordion,
  DSBorderLayout,
  DSPage,
  DSPageHeader,
  DSPageContent,
  DSPageGrid,
  DSBreadcrumbs,
  DSToolbar,
  DSToolbarGroup,
  DSToolbarSeparator,
  DSToolbarSpacer,
  DSSection,
  DSSubsection,
  DSSectionDivider,
  DSViewport,
  DSSplitter,
} from '../ds-layout';

// DS Lists
export {
  DSList,
  DSGrid,
  DSTable,
  DSBadge,
  DSCount,
  DSCode,
  DSListItem,
  DSGridColumn,
  DSGridToolbar,
  DSGridPagination,
  DSSortHeader,
  DSSelectionModel,
  DSEditableGrid,
} from '../ds-lists';

// DS Overlays
export {
  DSWindow,
  DSDialog,
  DSLoadingMask,
  DSMessageBox,
  DSOverlayProvider,
  useMessageBox,
  DSModal,
  DSModalInfo,
  DSModalSection,
  DSModalGrid,
  DSAlert,
  DSSpinner,
  DSLoading,
  DSSkeleton,
  DSSkeletonGroup,
  DSSkeletonRow,
  DSEmpty,
  DSErrorState,
  DSToast,
  DSBulkImportModal,
  DSTooltip,
  DSMobileNav,
} from '../ds-overlays';

// DS Navigation (exportaciones específicas para evitar conflictos)
export { DSTree, DSMenuBar, DSMenu, DSMenuItem } from '../ds-navigation';

// DS Responsive Table - Tabla/Cards responsive
export { DSResponsiveTable } from './DSResponsiveTable';
