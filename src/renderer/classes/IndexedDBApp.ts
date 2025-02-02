export type indexedDBAppOpts = {
  /**
   * The name of the database to connect to.
   * Defaults to `primaryDatabase`
   */
  dbName?: string;

  /**
   * The primary key to use for the database.
   * Defaults to `id`.
   */
  keyPath?: string | string[];
};

export default class IndexedDBApp<
  T extends Record<string, unknown | unknown[]>,
> {
  private version = 1;
  private _dbName = "primaryDatabase";
  private _keyPath: string | string[] | undefined;

  public get dbName() {
    return this._dbName;
  }

  private set dbName(value) {
    this._dbName = value;
  }

  public get keyPath() {
    return this._keyPath;
  }

  private set keyPath(value) {
    this._keyPath = value;
  }

  constructor(
    private _storeName: string,
    opts: indexedDBAppOpts = {}
  ) {
    if (opts.dbName) {
      this.dbName = opts.dbName;
    }

    if (opts.keyPath) {
      this.keyPath = opts.keyPath;
    }
  }

  public get storeName() {
    return this._storeName;
  }

  // function to initialize the database
  private initDB = async (): Promise<IDBDatabase> => {
    return new Promise(
      (
        resolve: (arg0: IDBDatabase) => unknown,
        reject: (arg0: DOMException | null) => unknown
      ) => {
        const request = indexedDB.open(this.dbName, this.version);

        request.onupgradeneeded = () => {
          const db = request.result;

          if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName, {
              keyPath: this.keyPath ?? "id",
            });
          }
        };

        request.onsuccess = () => {
          const db = request.result;

          if (!db.objectStoreNames.contains(this.storeName)) {
            reject(
              new DOMException(`Object store "${this.storeName}" not found.`)
            );
          }
          resolve(request.result);
        };
        request.onerror = () => reject(request.error);
      }
    );
  };

  // generic wrapper for database transactions
  private async withDB<R>(
    mode: IDBTransactionMode,
    callback: (store: IDBObjectStore) => Promise<R>
  ): Promise<R> {
    const db = await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, mode);
      const store = transaction.objectStore(this.storeName);

      callback(store).then(resolve).catch(reject);

      transaction.onerror = () => reject(transaction.error);
    });
  }

  // CRUD operations
  public addItem = async (item: T): Promise<void> => {
    return this.withDB("readwrite", (store) => {
      return new Promise<void>((resolve, reject) => {
        const request = store.add(item);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });
  };

  public getItems = async (): Promise<T[]> => {
    return this.withDB("readonly", (store) => {
      return new Promise((resolve, reject) => {
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    });
  };

  public updateItem = async (item: T): Promise<void> => {
    return this.withDB("readwrite", (store) => {
      return new Promise((resolve, reject) => {
        const request = store.put(item);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });
  };

  public deleteItem = async (id: number): Promise<void> => {
    return this.withDB("readwrite", (store) => {
      return new Promise((resolve, reject) => {
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });
  };
}
