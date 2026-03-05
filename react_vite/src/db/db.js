import Dexie from 'dexie';

import CONFIG from '../config';

export const db = new Dexie('ZdemoDB');

db.version(1).stores({
    // Cola de sincronización:
    // id (auto), url, method, body, timestamp, retryCount
    pendingSync: '++id, timestamp',

    // Caché de API:
    // key (url completa), data, timestamp
    apiCache: 'key, timestamp'
});

/**
 * Guarda una petición en la cola de pendientes
 */
export async function queueRequest(url, method, body = null) {
    try {
        await db.pendingSync.add({
            url,
            method,
            body,
            timestamp: Date.now(),
            retryCount: 0
        });
        console.log('📦 Petición guardada offline:', method, url);

        // Avisar a la UI inmediatamente
        window.dispatchEvent(new Event('zdemo:offline-saved'));

        return true;
    } catch (error) {
        console.error('Error guardando offline:', error);
        return false;
    }
}

/**
 * Guarda datos en caché para uso offline
 */
export async function cacheResponse(key, data) {
    try {
        await db.apiCache.put({
            key,
            data,
            timestamp: Date.now()
        });
    } catch (error) {
        console.warn('Error guardando cache:', error);
    }
}

/**
 * Obtiene datos de caché si existen
 */
export async function getCachedResponse(key) {
    try {
        const record = await db.apiCache.get(key);
        return record ? record.data : null;
    } catch (error) {
        return null;
    }
}

/**
 * Invalida entradas del caché que coincidan con el patrón de URL
 * @param {string} pattern - Patrón a buscar en las URLs cacheadas
 */
export async function invalidateCacheByPattern(pattern) {
    try {
        const allCache = await db.apiCache.toArray();
        const toDelete = allCache.filter(c => c.key.includes(pattern));
        for (const item of toDelete) {
            await db.apiCache.delete(item.key);
        }
        console.log(`🗑️ Invalidado ${toDelete.length} entradas de caché para: ${pattern}`);
    } catch (error) {
        console.warn('Error invalidando caché:', error);
    }
}
