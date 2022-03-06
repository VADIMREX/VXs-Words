export class IndexDBManager {
    private dbName: string = "";
    private storeName: string = "";
    
    constructor(dbName: string, storeName: string) {
        this.dbName = dbName;
        this.storeName = storeName;
    }

    private async getObjectStore(dbName: string, storeName: string) {
        return new Promise<IDBObjectStore>((ok, fail) => {
            let rdb = window.indexedDB.open(dbName, 1);
            rdb.onsuccess = () => {
                if (!rdb.result) fail("IndexDBManager(14): failed on get db");
                let objectStore = rdb.result.transaction([storeName], "readwrite")
                                      .objectStore(storeName);
                ok(objectStore);
            }
            rdb.onupgradeneeded = () => rdb.result.createObjectStore(storeName);
            rdb.onerror = () => fail("IndexDBManager(20): failed on db open");
        });
    }

    async add<TValue>(key: string, value: TValue) {
        let objectStore = await this.getObjectStore(this.dbName, this.storeName);
        return new Promise<void>((ok, fail) => {
            let rsave = objectStore.add(value, key);
            rsave.onsuccess = () => ok();
            rsave.onerror = () => fail("IndexDBManager(29): failed on object save");
        });
    }

    async get<TValue>(key: string): Promise<TValue> {
        let objectStore = await this.getObjectStore(this.dbName, this.storeName);
        return new Promise<TValue>((ok, fail) => {
            let rsave = objectStore.get(key);
            rsave.onsuccess = () => ok(rsave.result as TValue);
            rsave.onerror = () => fail("IndexDBManager(38): failed on object retrieve");
        });
    }
}

export default IndexDBManager;