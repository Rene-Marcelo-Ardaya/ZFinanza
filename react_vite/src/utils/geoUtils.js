/**
 * Utilidades para geolocalización
 */

/**
 * Parsea un texto para intentar extraer latitud y longitud.
 * Soporta formatos:
 * - "15.714 S, 61.931 W"
 * - "-15.714, -61.931"
 * - "15° 42' 53.2" S, 61° 55' 52.8" W" (simple decimal conversion attempt)
 * 
 * @param {string} input Texto a parsear
 * @returns {object|null} { lat, lng } o null si no encuentra
 */
export const parseCoordinates = (input) => {
    if (!input || typeof input !== 'string') return null;

    const clean = input.trim();

    // 1. Caso coordenadas decimales con letras (Ej: 15.714 S, 61.931 W)
    // Regex busca dos grupos de números (con decimales opcionales) seguidos opcionalmente de letras
    // Separados por coma o espacio
    const pairRegex = /([-\d.]+\s*[NS]?)[,\s]+([-\d.]+\s*[WEOX]?)/i;
    const match = clean.match(pairRegex);

    if (match) {
        // Función auxiliar para parsear una parte
        const parsePart = (str) => {
            if (!str) return null;
            const upper = str.toUpperCase().trim();
            // Extraer solo números y signo negativo inicial
            const numPart = upper.replace(/[^\d.-]/g, '');
            let val = parseFloat(numPart);
            
            if (isNaN(val)) return null;

            // Ajustar signo según letra
            if (upper.includes('S') || upper.includes('O') || upper.includes('W')) {
                val = -Math.abs(val);
            }
            return val;
        };

        const lat = parsePart(match[1]);
        const lng = parsePart(match[2]);

        if (lat !== null && lng !== null) {
            // Validación básica de rangos
            if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
                return { lat, lng };
            }
        }
    }

    return null;
};

/**
 * Genera un link a Google Maps
 * @param {number} lat 
 * @param {number} lng 
 * @returns {string} URL
 */
export const getGoogleMapsLink = (lat, lng) => {
    if (!lat || !lng) return '#';
    
    let nLat = parseFloat(lat);
    let nLng = parseFloat(lng);

    if (isNaN(nLat) || isNaN(nLng)) return '#';

    // Heurística Regional para el Mapa (Bolivia/Sudamérica)
    // Si tenemos coordenadas positivas en rango de Bolivia, Google Maps necesita negativos.
    // Latitud: 9 a 25 -> Convertir a negativo (Sur)
    // Longitud: 57 a 75 -> Convertir a negativo (Oeste)
    if (nLat > 0 && nLat >= 9 && nLat <= 25) nLat = -nLat;
    if (nLng > 0 && nLng >= 57 && nLng <= 75) nLng = -nLng;

    return `https://www.google.com/maps/search/?api=1&query=${nLat},${nLng}`;
};

/**
 * Limpia una coordenada, quitando letras pero PRESERVANDO el texto original (ceros finales).
 * Solo aplica signo negativo si hay dirección explícita (S/W/O).
 */
export const cleanCoordinate = (input) => {
    if (!input) return '';
    const str = input.toString().toUpperCase().trim();
    if (!str) return '';

    // Detectar dirección explícita
    const isSouth = str.includes('S');
    const isWest = str.includes('W') || str.includes('O');

    // Limpiar todo lo que no sea número, punto o guión
    // Preservamos el string para no perder '0' finales (ej: 10.50)
    let cleanStr = str.replace(/[^\d.-]/g, '');

    if (!cleanStr) return input;

    // Si tenía dirección explícita, forzar signo negativo
    if (isSouth || isWest) {
        if (!cleanStr.startsWith('-')) {
            cleanStr = '-' + cleanStr;
        }
    }
    
    // Retornamos STRING, no número, para que el input no cambie de "10.50" a "10.5"
    return cleanStr;
};
