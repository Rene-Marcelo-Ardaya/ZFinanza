function toBoolean(value, defaultValue) {
  if (value == null || value === '') return defaultValue
  const normalized = String(value).trim().toLowerCase()
  return normalized === '1' || normalized === 'true' || normalized === 'yes'
}

export const UI_REFRESH_V1_ENABLED = toBoolean(import.meta.env.VITE_UI_REFRESH_V1, true)
