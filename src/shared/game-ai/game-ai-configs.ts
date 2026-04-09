/** biome-ignore-all lint/style/noNonNullAssertion: all null are well protected */
export interface AIConfig {
    aiProvider: "local" | "remote";
    apiEndpoint: string;
    apiSecret: string;
    selectedLocalModel: string;
    selectedRemoteModel: string;
}

const DB_NAME = "2048AI";
const DB_VERSION = 1;
const STORE_NAME = "aiConfigs";

interface ConfigStorage {
    getConfig(): Promise<AIConfig | null>;
    saveConfig(config: AIConfig): Promise<void>;
    clearConfig(): Promise<void>;
}

class IndexedDBStorage implements ConfigStorage {
    private db: IDBDatabase | null = null;

    async init(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            };
        });
    }

    async getConfig(): Promise<AIConfig | null> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_NAME], "readonly");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get("config");

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                resolve(request.result || null);
            };
        });
    }

    async saveConfig(config: AIConfig): Promise<void> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_NAME], "readwrite");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.put(config, "config");

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    async clearConfig(): Promise<void> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_NAME], "readwrite");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete("config");

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }
}

class MemoryStorage implements ConfigStorage {
    private config: AIConfig | null = null;

    async getConfig(): Promise<AIConfig | null> {
        return this.config;
    }

    async saveConfig(config: AIConfig): Promise<void> {
        this.config = config;
    }

    async clearConfig(): Promise<void> {
        this.config = null;
    }
}

function isIndexedDBAvailable(): boolean {
    try {
        return (
            typeof indexedDB !== "undefined" &&
            indexedDB !== null &&
            typeof indexedDB.open === "function"
        );
    } catch {
        return false;
    }
}

class AIConfigStore {
    public _storage: ConfigStorage;

    constructor() {
        this._storage = isIndexedDBAvailable() ? new IndexedDBStorage() : new MemoryStorage();
    }

    async getConfig(): Promise<AIConfig | null> {
        return this._storage.getConfig();
    }

    async saveConfig(config: AIConfig): Promise<void> {
        return this._storage.saveConfig(config);
    }

    async clearConfig(): Promise<void> {
        return this._storage.clearConfig();
    }
}

export const aiConfigStore = new AIConfigStore();

// Export classes and functions for testing
export { AIConfigStore, IndexedDBStorage, isIndexedDBAvailable, MemoryStorage };
