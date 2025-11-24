/**
 * Improved localStorage Management
 * Provides type-safe, validated storage with error handling
 */

export interface StorageConfig {
  key: string;
  defaultValue?: any;
  ttl?: number; // Time to live in milliseconds
  encrypted?: boolean;
}

export interface StorageItem<T> {
  data: T;
  timestamp: number;
  ttl?: number;
  version: number;
}

const STORAGE_VERSION = 1;
const STORAGE_PREFIX = 'loveinthecity_';

/**
 * Enhanced localStorage manager with validation and TTL support
 */
export class StorageManager {
  private static instance: StorageManager | null = null;
  private cache: Map<string, any> = new Map();
  private watchers: Map<string, Set<(value: any) => void>> = new Map();
  private initialized: boolean = false;

  private constructor() {
    // Don't initialize here - do it lazily
  }

  /**
   * Get singleton instance
   */
  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  /**
   * Initialize on first access
   */
  private ensureInitialized(): void {
    if (this.initialized) return;
    this.initialized = true;
    this.initializeCache();
  }

  /**
   * Initialize cache from localStorage
   */
  private initializeCache(): void {
    try {
      if (typeof localStorage === 'undefined') {
        console.warn('localStorage not available');
        return;
      }
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          const cleanKey = key.replace(STORAGE_PREFIX, '');
          const item = this.getRaw(key);
          if (item) {
            this.cache.set(cleanKey, item.data);
          }
        }
      });
      console.log('✅ Storage cache initialized with', this.cache.size, 'items');
    } catch (error) {
      console.error('❌ Error initializing storage cache:', error);
    }
  }

  /**
   * Get prefixed key
   */
  private getPrefixedKey(key: string): string {
    return STORAGE_PREFIX + key;
  }

  /**
   * Get raw item with metadata
   */
  private getRaw<T>(fullKey: string): StorageItem<T> | null {
    try {
      const item = localStorage.getItem(fullKey);
      if (!item) return null;

      const parsed = JSON.parse(item) as StorageItem<T>;

      // Check TTL
      if (parsed.ttl) {
        const age = Date.now() - parsed.timestamp;
        if (age > parsed.ttl) {
          console.log('⏰ Item expired:', fullKey);
          localStorage.removeItem(fullKey);
          return null;
        }
      }

      return parsed;
    } catch (error) {
      console.error('❌ Error parsing storage item:', fullKey, error);
      return null;
    }
  }

  /**
   * Set item with optional TTL
   */
  set<T>(key: string, value: T, ttl?: number): boolean {
    try {
      this.ensureInitialized();
      const fullKey = this.getPrefixedKey(key);
      const item: StorageItem<T> = {
        data: value,
        timestamp: Date.now(),
        ttl,
        version: STORAGE_VERSION
      };

      localStorage.setItem(fullKey, JSON.stringify(item));
      this.cache.set(key, value);

      // Notify watchers
      this.notifyWatchers(key, value);

      console.log('💾 Storage item set:', key);
      return true;
    } catch (error) {
      console.error('❌ Error setting storage item:', key, error);
      return false;
    }
  }

  /**
   * Get item
   */
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      this.ensureInitialized();
      // Check cache first
      if (this.cache.has(key)) {
        return this.cache.get(key) as T;
      }

      const fullKey = this.getPrefixedKey(key);
      const item = this.getRaw<T>(fullKey);

      if (item) {
        this.cache.set(key, item.data);
        return item.data;
      }

      return defaultValue ?? null;
    } catch (error) {
      console.error('❌ Error getting storage item:', key, error);
      return defaultValue ?? null;
    }
  }

  /**
   * Remove item
   */
  remove(key: string): boolean {
    try {
      this.ensureInitialized();
      const fullKey = this.getPrefixedKey(key);
      localStorage.removeItem(fullKey);
      this.cache.delete(key);

      // Notify watchers with null
      this.notifyWatchers(key, null);

      console.log('🗑️ Storage item removed:', key);
      return true;
    } catch (error) {
      console.error('❌ Error removing storage item:', key, error);
      return false;
    }
  }

  /**
   * Check if key exists
   */
  has(key: string): boolean {
    this.ensureInitialized();
    const fullKey = this.getPrefixedKey(key);
    return localStorage.getItem(fullKey) !== null;
  }

  /**
   * Clear all app storage
   */
  clear(): boolean {
    try {
      this.ensureInitialized();
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      this.cache.clear();
      console.log('🧹 All storage cleared');
      return true;
    } catch (error) {
      console.error('❌ Error clearing storage:', error);
      return false;
    }
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    this.ensureInitialized();
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        keys.push(key.replace(STORAGE_PREFIX, ''));
      }
    }
    return keys;
  }

  /**
   * Get storage size in bytes
   */
  getSize(): number {
    this.ensureInitialized();
    let size = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        const item = localStorage.getItem(key);
        if (item) {
          size += item.length + key.length;
        }
      }
    }
    return size;
  }

  /**
   * Get storage stats
   */
  getStats() {
    this.ensureInitialized();
    return {
      itemCount: this.keys().length,
      sizeBytes: this.getSize(),
      sizeMB: (this.getSize() / 1024 / 1024).toFixed(2)
    };
  }

  /**
   * Watch for changes
   */
  watch(key: string, callback: (value: any) => void): () => void {
    this.ensureInitialized();
    if (!this.watchers.has(key)) {
      this.watchers.set(key, new Set());
    }

    this.watchers.get(key)!.add(callback);

    // Return unwatch function
    return () => {
      this.watchers.get(key)?.delete(callback);
    };
  }

  /**
   * Notify watchers
   */
  private notifyWatchers(key: string, value: any): void {
    const callbacks = this.watchers.get(key);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(value);
        } catch (error) {
          console.error('❌ Error in storage watcher:', error);
        }
      });
    }
  }

  /**
   * Validate data structure
   */
  validate<T>(key: string, schema: (data: any) => boolean): boolean {
    const data = this.get(key);
    if (!data) return false;
    return schema(data);
  }

  /**
   * Merge object with existing data
   */
  merge<T>(key: string, updates: Partial<T>): T | null {
    try {
      const existing = this.get<T>(key);
      const merged = {
        ...(existing || {}),
        ...updates
      } as T;

      this.set(key, merged);
      return merged;
    } catch (error) {
      console.error('❌ Error merging storage item:', key, error);
      return null;
    }
  }

  /**
   * Batch operations
   */
  batch(operations: Array<{ action: 'set' | 'remove'; key: string; value?: any }>): boolean {
    try {
      operations.forEach(op => {
        if (op.action === 'set') {
          this.set(op.key, op.value);
        } else if (op.action === 'remove') {
          this.remove(op.key);
        }
      });
      console.log('📦 Batch operation completed:', operations.length, 'items');
      return true;
    } catch (error) {
      console.error('❌ Error in batch operation:', error);
      return false;
    }
  }

  /**
   * Export all data
   */
  export(): Record<string, any> {
    const data: Record<string, any> = {};
    this.keys().forEach(key => {
      data[key] = this.get(key);
    });
    return data;
  }

  /**
   * Import data
   */
  import(data: Record<string, any>): boolean {
    try {
      Object.entries(data).forEach(([key, value]) => {
        this.set(key, value);
      });
      console.log('📥 Data imported:', Object.keys(data).length, 'items');
      return true;
    } catch (error) {
      console.error('❌ Error importing data:', error);
      return false;
    }
  }
}

/**
 * Get storage manager instance
 */
export function getStorage(): StorageManager {
  return StorageManager.getInstance();
}

/**
 * Convenience functions
 */
export const storage = {
  set: <T,>(key: string, value: T, ttl?: number) => getStorage().set(key, value, ttl),
  get: <T,>(key: string, defaultValue?: T) => getStorage().get<T>(key, defaultValue),
  remove: (key: string) => getStorage().remove(key),
  has: (key: string) => getStorage().has(key),
  clear: () => getStorage().clear(),
  keys: () => getStorage().keys(),
  getSize: () => getStorage().getSize(),
  getStats: () => getStorage().getStats(),
  watch: (key: string, callback: (value: any) => void) => getStorage().watch(key, callback),
  merge: <T,>(key: string, updates: Partial<T>) => getStorage().merge<T>(key, updates),
  batch: (ops: any[]) => getStorage().batch(ops),
  export: () => getStorage().export(),
  import: (data: Record<string, any>) => getStorage().import(data),
  validate: (key: string, schema: (data: any) => boolean) => getStorage().validate(key, schema),
};

/**
 * Hook for React components (requires React)
 */
export function useStorage<T>(key: string, defaultValue?: T): [T | null, (value: T) => void] {
  // Note: This is a placeholder. Use with useEffect and useState in actual components
  return [
    getStorage().get<T>(key, defaultValue),
    (value: T) => getStorage().set(key, value)
  ];
}