import React from 'react';
import { Settings, Palette, Building2, Monitor } from 'lucide-react';
import { useTheme } from '../../theme';

// Importar componentes DS reutilizables
import {
    DSPage,
    DSPageHeader,
    DSPageContent,
    DSSection,
    DSSubsection,
    DSAlert,
    DSLoading,
    DSFieldsGrid,
    DSImagesGrid,
} from '../../../ds-components';

import './ConfiguracionPage.css';

// Hook
import { useConfiguracion } from './hooks/useConfiguracion';

// Componentes
import { ConfigTextField } from './components/ConfigTextField';
import { ConfigColorField } from './components/ConfigColorField';
import { ConfigImageField } from './components/ConfigImageField';

export function ConfiguracionPage() {
    const { theme } = useTheme();
    const logic = useConfiguracion();

    // Estado de carga
    if (logic.loading) {
        return (
            <DSPage>
                <DSLoading text="Cargando configuración..." />
            </DSPage>
        );
    }

    return (
        <DSPage>
            {/* HEADER */}
            <DSPageHeader
                title="Configuración del Sistema"
                icon={<Settings size={22} />}
            />

            {/* ALERTAS */}
            {logic.success && (
                <DSAlert
                    variant="success"
                    dismissible
                    onDismiss={() => logic.setSuccess(null)}
                    className="config-alert-margin"
                >
                    {logic.success}
                </DSAlert>
            )}
            {(logic.error) && (
                <DSAlert
                    variant="error"
                    dismissible
                    onDismiss={() => logic.setError(null)}
                    className="config-alert-margin"
                >
                    {logic.error}
                </DSAlert>
            )}

            {/* CONTENIDO */}
            <DSPageContent>
                {/* SECCIÓN: Información de la Empresa */}
                <DSSection
                    title="Información de la Empresa"
                    icon={<Building2 size={18} />}
                >
                    <DSFieldsGrid columns={2}>
                        <ConfigTextField
                            label="Nombre de la Empresa"
                            value={logic.flatSettings.company_name?.value}
                            onSave={(v) => logic.handleSave('company_name', v)}
                            saving={logic.saving.company_name}
                            icon={Building2}
                            help="Nombre legal o comercial de tu empresa. Se mostrará en reportes y documentos."
                        />
                        <ConfigTextField
                            label="RIF / NIT"
                            value={logic.flatSettings.company_rif?.value}
                            onSave={(v) => logic.handleSave('company_rif', v)}
                            saving={logic.saving.company_rif}
                            help="Número de identificación fiscal de la empresa."
                        />
                        <ConfigTextField
                            label="Teléfono"
                            value={logic.flatSettings.company_phone?.value}
                            onSave={(v) => logic.handleSave('company_phone', v)}
                            saving={logic.saving.company_phone}
                            help="Número de teléfono principal de contacto."
                        />
                        <ConfigTextField
                            label="Correo Electrónico"
                            value={logic.flatSettings.company_email?.value}
                            onSave={(v) => logic.handleSave('company_email', v)}
                            saving={logic.saving.company_email}
                            help="Email corporativo para comunicaciones del sistema."
                        />
                    </DSFieldsGrid>
                    <ConfigTextField
                        label="Dirección"
                        value={logic.flatSettings.company_address?.value}
                        onSave={(v) => logic.handleSave('company_address', v)}
                        saving={logic.saving.company_address}
                        help="Dirección física de la empresa para documentos oficiales."
                    />
                </DSSection>

                {/* SECCIÓN: Identidad Visual */}
                <DSSection
                    title="Identidad Visual (Branding)"
                    icon={<Palette size={18} />}
                >
                    <DSFieldsGrid columns={2}>
                        <ConfigTextField
                            label="Nombre de la Aplicación"
                            value={logic.flatSettings.app_name?.value}
                            onSave={(v) => logic.handleSave('app_name', v)}
                            saving={logic.saving.app_name}
                            help="Aparece en el título del navegador"
                        />
                        <ConfigTextField
                            label="Nombre Corto"
                            value={logic.flatSettings.app_short_name?.value}
                            onSave={(v) => logic.handleSave('app_short_name', v)}
                            saving={logic.saving.app_short_name}
                            help="Para PWA y móviles"
                        />
                    </DSFieldsGrid>

                    <DSSubsection title="Textos del Login">
                        <ConfigTextField
                            label="Título del Login"
                            value={logic.flatSettings.login_title?.value}
                            onSave={(v) => logic.handleSave('login_title', v)}
                            saving={logic.saving.login_title}
                            help="Texto de bienvenida que aparece en la página de inicio de sesión."
                        />
                    </DSSubsection>

                    <DSSubsection title="Colores del Login">
                        <p className="config-hint">
                            Estos colores se usan en la página de login (fondo degradado y acentos)
                        </p>
                        <DSFieldsGrid columns={2}>
                            <ConfigColorField
                                label="Color Primario (Login)"
                                value={logic.flatSettings.primary_color?.value}
                                onSave={(v) => logic.handleSave('primary_color', v)}
                                saving={logic.saving.primary_color}
                                help="Color principal del fondo degradado en la página de login."
                            />
                            <ConfigColorField
                                label="Color Secundario (Login)"
                                value={logic.flatSettings.secondary_color?.value}
                                onSave={(v) => logic.handleSave('secondary_color', v)}
                                saving={logic.saving.secondary_color}
                                help="Color secundario del degradado y acentos en el login."
                            />
                        </DSFieldsGrid>
                    </DSSubsection>

                    <DSSubsection title="Logos e Imágenes">
                        <DSImagesGrid>
                            <ConfigImageField
                                label="Logo del Login (Principal)"
                                value={logic.flatSettings.logo_login?.value}
                                onUpload={(f) => logic.handleUpload('logo_login', f)}
                                onDelete={() => logic.handleDeleteImage('logo_login')}
                                help="Logo grande en la página de login"
                            />
                            <ConfigImageField
                                label="Logo Lateral (Izquierda)"
                                value={logic.flatSettings.logo_login_secondary?.value}
                                onUpload={(f) => logic.handleUpload('logo_login_secondary', f)}
                                onDelete={() => logic.handleDeleteImage('logo_login_secondary')}
                                help="Imagen o logo del lado izquierdo"
                            />
                            <ConfigImageField
                                label="Logo del Sidebar"
                                value={logic.flatSettings.logo_sidebar?.value}
                                onUpload={(f) => logic.handleUpload('logo_sidebar', f)}
                                onDelete={() => logic.handleDeleteImage('logo_sidebar')}
                                help="180x50px recomendado"
                                small
                            />
                            <ConfigImageField
                                label="Favicon"
                                value={logic.flatSettings.favicon?.value}
                                onUpload={(f) => logic.handleUpload('favicon', f)}
                                onDelete={() => logic.handleDeleteImage('favicon')}
                                help="Icono del navegador"
                                small
                            />
                        </DSImagesGrid>
                    </DSSubsection>
                </DSSection>

                {/* SECCIÓN: Vista Previa Real (Iframe) */}
                <DSSection
                    title="Vista Previa del Login (Sitio Real)"
                    icon={<Monitor size={18} />}
                >
                    <div className="config-iframe-wrapper">
                        <iframe
                            key={`${logic.iframeKey}-${theme}`}
                            src={`/?mode=preview&theme=${theme}`}
                            title="Vista previa del login"
                            className="config-iframe-preview"
                        />
                        {/* Overlay para bloquear interacción (solo ver) */}
                        <div className="config-iframe-overlay"></div>
                    </div>
                </DSSection>
            </DSPageContent>
        </DSPage>
    );
}

export default ConfiguracionPage;
