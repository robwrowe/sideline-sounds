export type indexedDBAppOpts = {
  /**
   * The name of the database to connect to.
   * Defaults to `primaryDatabase`
   */
  dbName?: string;

  /**
   * The version to open the database with.
   * If the version is not provided and the database exists,
   * then a connection to the database will be opened without
   * changing its version.
   * If the version is not provided and the database does not exist,
   * then it will be created with version `1`
   * More info here: https://developer.mozilla.org/en-US/docs/Web/API/IDBFactory/open
   */
  version?: number;

  /**
   * The primary key to use for the database.
   * Defaults to `id`.
   */
  keyPath?: string;
};

export default function indexedDBApp<
  T extends Record<string, unknown | unknown[]>,
>(storeName: string, opts: indexedDBAppOpts = {}) {
  const dbName = opts.dbName ?? "primaryDatabase";
  const version = opts.version ?? undefined;
  // function to initialize the database
  const initDB = async (): Promise<IDBDatabase> => {
    return new Promise(
      (
        resolve: (arg0: IDBDatabase) => unknown,
        reject: (arg0: DOMException | null) => unknown
      ) => {
        const request = indexedDB.open(dbName, version);

        request.onupgradeneeded = () => {
          const db = request.result;

          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: "id" });
          }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      }
    );
  };

  // generic wrapper for database transactions
  async function withDB<R>(
    mode: IDBTransactionMode,
    callback: (store: IDBObjectStore) => Promise<R>
  ): Promise<R> {
    const db = await initDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);

      callback(store).then(resolve).catch(reject);

      transaction.onerror = () => reject(transaction.error);
    });
  }

  // CRUD operations
  // add one item
  const addItem = async (item: T): Promise<void> => {
    return withDB("readwrite", (store) => {
      return new Promise<void>((resolve, reject) => {
        const request = store.add(item);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });
  };

  const getItems = async (): Promise<T[]> => {
    return withDB("readonly", (store) => {
      return new Promise((resolve, reject) => {
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    });
  };

  const updateItem = async (item: T): Promise<void> => {
    return withDB("readwrite", (store) => {
      return new Promise((resolve, reject) => {
        const request = store.put(item);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });
  };

  const deleteItem = async (id: number): Promise<void> => {
    return withDB("readwrite", (store) => {
      return new Promise((resolve, reject) => {
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });
  };

  return { addItem, getItems, updateItem, deleteItem };
}
