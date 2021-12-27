import { b64EncodeUnicode, b64DecodeUnicode } from './Base64Utils';

const CookieManager = new class {
    /**
     * @param {string} key
     * @return {string}
     */
    getRaw(key) {
        return document.cookie.replace(`(?:(?:^|.*;\\s*)${key}\\s*\\=\\s*([^;]*).*$)|^.*$`, "$1");
    }
    /**
     * @param {string} key
     * @param {T?} def
     * @return {T}
     * @template T
     */
    get(key, def) {
        if (arguments.length < 2) def = null;
        let s = this.getRaw(key);
        s = b64DecodeUnicode(s);
        return s ? JSON.parse(s) : def;
    }
    /**
     * @param {string} key
     * @param {string} value
     */
    setRaw(key, value) {
        document.cookie = `${key}=${value}`;
    }
    /**
     * @param {string} key
     * @param {any} value
     */
    set(key, value) {
        value = null == value ? "" : JSON.stringify(value);
        value = b64EncodeUnicode(value);
        this.setRaw(key, value);
    }
}

export default CookieManager;