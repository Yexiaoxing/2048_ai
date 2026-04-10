import { afterEach, describe, expect, it, vi } from "vitest";
import type { AIConfig } from "./game-ai-configs";
import {
    AIConfigStore,
    IndexedDBStorage,
    isIndexedDBAvailable,
    MemoryStorage,
} from "./game-ai-configs";

const originalIndexedDBDescriptor = Object.getOwnPropertyDescriptor(globalThis, "indexedDB");

const sampleConfig: AIConfig = {
    aiProvider: "remote",
    apiEndpoint: "https://example.com/v1/chat/completions",
    apiSecret: "secret",
    selectedLocalModel: "qwen2.5",
    selectedRemoteModel: "gpt-5.4-mini",
};

function restoreIndexedDB(): void {
    if (originalIndexedDBDescriptor) {
        Object.defineProperty(globalThis, "indexedDB", originalIndexedDBDescriptor);
        return;
    }

    Reflect.deleteProperty(globalThis, "indexedDB");
}

type RequestSuccessHandler<T> = ((this: IDBRequest<T>, ev: Event) => unknown) | null;
type RequestErrorHandler<T> = ((this: IDBRequest<T>, ev: Event) => unknown) | null;
type UpgradeHandler = ((this: IDBOpenDBRequest, ev: IDBVersionChangeEvent) => unknown) | null;

function createAsyncRequest<T>(getResult: () => T): IDBRequest<T> {
    const request: {
        error: DOMException | null;
        onerror: RequestErrorHandler<T>;
        onsuccess: RequestSuccessHandler<T>;
        result: T;
    } = {
        error: null,
        onerror: null,
        onsuccess: null,
        result: undefined as T,
    };

    queueMicrotask(() => {
        request.result = getResult();
        if (request.onsuccess) {
            request.onsuccess.call(
                request as unknown as IDBRequest<T>,
                { target: request } as unknown as Event,
            );
        }
    });

    return request as unknown as IDBRequest<T>;
}

function createFakeIndexedDB(): IDBFactory {
    let storedConfig: AIConfig | undefined;
    const storeNames = new Set<string>();

    const database = {
        createObjectStore: vi.fn((name: string) => {
            storeNames.add(name);
            return {} as IDBObjectStore;
        }),
        objectStoreNames: {
            contains: (name: string) => storeNames.has(name),
        },
        transaction: vi.fn(() => ({
            objectStore: () => ({
                delete: () =>
                    createAsyncRequest(() => {
                        storedConfig = undefined;
                        return undefined;
                    }),
                get: () => createAsyncRequest(() => storedConfig ?? undefined),
                put: (value: AIConfig) =>
                    createAsyncRequest(() => {
                        storedConfig = value;
                        return "config";
                    }),
            }),
        })),
    };

    const open: IDBFactory["open"] = vi.fn(() => {
        const request: {
            error: DOMException | null;
            onblocked: UpgradeHandler;
            onerror: RequestErrorHandler<IDBDatabase>;
            onupgradeneeded: UpgradeHandler;
            onsuccess: RequestSuccessHandler<IDBDatabase>;
            result: typeof database;
        } = {
            error: null,
            onblocked: null,
            onerror: null,
            onupgradeneeded: null,
            onsuccess: null,
            result: database,
        };

        queueMicrotask(() => {
            if (request.onupgradeneeded) {
                request.onupgradeneeded.call(
                    request as unknown as IDBOpenDBRequest,
                    { target: request } as unknown as IDBVersionChangeEvent,
                );
            }

            if (request.onsuccess) {
                request.onsuccess.call(
                    request as unknown as IDBOpenDBRequest,
                    { target: request } as unknown as Event,
                );
            }
        });

        return request as unknown as IDBOpenDBRequest;
    });

    return {
        cmp: vi.fn(() => 0),
        databases: vi.fn(async () => []),
        deleteDatabase: vi.fn(() => ({}) as IDBOpenDBRequest),
        open,
    };
}

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    restoreIndexedDB();
});

describe("game-ai-configs", () => {
    describe("MemoryStorage", () => {
        it("stores and clears config in memory", async () => {
            const storage = new MemoryStorage();

            await expect(storage.getConfig()).resolves.toBeNull();

            await storage.saveConfig(sampleConfig);
            await expect(storage.getConfig()).resolves.toEqual(sampleConfig);

            await storage.clearConfig();
            await expect(storage.getConfig()).resolves.toBeNull();
        });
    });

    describe("isIndexedDBAvailable", () => {
        it("returns false when indexedDB is unavailable", () => {
            Reflect.deleteProperty(globalThis, "indexedDB");

            expect(isIndexedDBAvailable()).toBe(false);
        });

        it("returns false when accessing indexedDB throws", () => {
            Object.defineProperty(globalThis, "indexedDB", {
                configurable: true,
                get: () => {
                    throw new Error("blocked");
                },
            });

            expect(isIndexedDBAvailable()).toBe(false);
        });

        it("returns true when indexedDB.open exists", () => {
            vi.stubGlobal("indexedDB", createFakeIndexedDB());

            expect(isIndexedDBAvailable()).toBe(true);
        });
    });

    describe("IndexedDBStorage", () => {
        it("persists and clears config through indexedDB", async () => {
            vi.stubGlobal("indexedDB", createFakeIndexedDB());
            const storage = new IndexedDBStorage();

            await expect(storage.getConfig()).resolves.toBeNull();

            await storage.saveConfig(sampleConfig);
            await expect(storage.getConfig()).resolves.toEqual(sampleConfig);

            await storage.clearConfig();
            await expect(storage.getConfig()).resolves.toBeNull();
        });
    });

    describe("AIConfigStore", () => {
        it("uses memory storage when indexedDB is unavailable", () => {
            Reflect.deleteProperty(globalThis, "indexedDB");

            const store = new AIConfigStore();

            expect(store._storage).toBeInstanceOf(MemoryStorage);
        });

        it("uses indexedDB storage when indexedDB is available", () => {
            vi.stubGlobal("indexedDB", createFakeIndexedDB());

            const store = new AIConfigStore();

            expect(store._storage).toBeInstanceOf(IndexedDBStorage);
        });
    });
});
