import { HistoryItem } from '../types';

const HISTORY_KEY = 'gourmet_ai_history';
const MAX_HISTORY_ITEMS = 50;

/**
 * Guarda una nueva generación en el historial local
 * @param {Omit<HistoryItem, 'id' | 'timestamp'>} generation - Objeto con los datos de la generación
 */
export const saveToHistory = (generation: Omit<HistoryItem, 'id' | 'timestamp'>): HistoryItem | null => {
  try {
    const history = getHistory();
    
    const newGeneration: HistoryItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...generation
    };
    
    const updatedHistory = [newGeneration, ...history].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    
    return newGeneration;
  } catch (error) {
    console.error('Error guardando en historial:', error);
    return null;
  }
};

/**
 * Obtiene el historial completo
 * @returns {HistoryItem[]} - Lista de generaciones
 */
export const getHistory = (): HistoryItem[] => {
  try {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    return [];
  }
};

/**
 * Elimina un elemento del historial
 * @param {string} id - ID de la generación a eliminar
 */
export const deleteFromHistory = (id: string): boolean => {
  try {
    const history = getHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error('Error eliminando del historial:', error);
    return false;
  }
};

/**
 * Limpia todo el historial
 */
export const clearHistory = (): void => {
  localStorage.removeItem(HISTORY_KEY);
};
