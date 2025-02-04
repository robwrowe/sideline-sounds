import { INDEXED_DB_VERSION } from "../../constants";

export type InitDBStore = {
  /**
   * The name of the store in the database
   */
  storeName: string;

  /**
   * The primary key to use for the database.
   * Defaults to `id`.
   */
  keyPath?: string | string[];
};

type InitDBOpts = {
  /**
   * The name of the database to connect to.
   * Defaults to `primaryDatabase`
   */
  dbName?: string;
};

const initDB = async (
  stores: InitDBStore[],
  opts: InitDBOpts = {}
): Promise<IDBDatabase> => {
  const dbName = opts?.dbName ?? "primaryDatabase";

  return new Promise(
    (
      resolve: (arg0: IDBDatabase) => unknown,
      reject: (arg0: DOMException | null) => unknown
    ) => {
      const request = indexedDB.open(dbName, INDEXED_DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;

        for (const store of stores) {
          const { storeName, keyPath } = store;

          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, {
              keyPath: keyPath ?? "id",
            });
          }
        }
      };

      request.onsuccess = () => {
        const db = request.result;

        for (const store of stores) {
          const { storeName } = store;
          // check if the stores exist after success
          if (!db.objectStoreNames.contains(storeName)) {
            reject(new DOMException(`Object store "${storeName}" not found.`));
          }
        }
        resolve(request.result);
      };
      request.onerror = () => reject(request.error);
    }
  );
};

export default initDB;
