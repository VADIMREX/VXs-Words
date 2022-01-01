import { b64EncodeUnicode, b64DecodeUnicode } from '../libs/Base64Utils';

const CookieManager = new (class CookieManager {
    getRaw(key: string) {
        return document.cookie.replace(`(?:(?:^|.*;\\s*)${key}\\s*\\=\\s*([^;]*).*$)|^.*$`, "$1");
    }
    get<T>(key: string, def?: T): T | null{
        let s = this.getRaw(key);
        s = b64DecodeUnicode(s);
        return s ? JSON.parse(s) : undefined === def ? null : def;
    }
    setRaw(key: string, value: string) {
        document.cookie = `${key}=${value}`;
    }
    set(key: string, value: any) {
        value = null == value ? "" : JSON.stringify(value);
        value = b64EncodeUnicode(value);
        this.setRaw(key, value);
    }
})()

export default CookieManager;