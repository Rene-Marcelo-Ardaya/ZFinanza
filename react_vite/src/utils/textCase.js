export function upperVisual(value, fallback = '-') {
    if (value === null || value === undefined) return fallback;
    const text = String(value).trim();
    if (!text) return fallback;
    return text.toUpperCase();
}

export default upperVisual;
