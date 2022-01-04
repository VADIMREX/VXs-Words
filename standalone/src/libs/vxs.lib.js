/**
 * @template TArgs extends any[]
 */
class VXsEvent {
  constructor() {
    /** @type {((...args:TArgs)=>void)[]} */
    this.callbacks = [];
  }
  /** 
   * @param {(...args:TArgs)=>void} callback
   */
  subscribe(callback) {
    this.callbacks.push(callback)
  }
  /** 
   * @param {(...args:TArgs)=>void} callback
   */
  unsubscribe(callback) {
    let index = this.callbacks.findIndex(x => x === callback);
    if (undefined == index) return;
    this.callbacks.splice(index, 1);
  }
  /**
   * @param {TArgs} args
   */
  invoke(...args) {
    let errors = [];
    for (let k in this.callbacks) if (this.callbacks[k].apply(null, args)) try { this.callbacks[k](value) } catch (e) { errors.push(e); }
    if (0 != errors.length) throw ["errors on invoke of event", errors];
  }
}

/** 
 * Разбить текст на слова
 * @param {string} str 
 */
function splitOnSpecialChars(str) {
  let set = new Set([
    "~", "`",
    "!", "@", "#", "$", "%", "^", "&", "*", "(", ")",
    "_", "+", "-", "=",
    "[", "]", "{", "}", "\\", "|",
    ";", "'", ":", "\"",
    ",", ".", "<", ">", "/", "?",
    " ", "\t", "\r", "\n"
  ]);
  let arr = Array.from(str);
  let res = [];
  let buff = [];
  for (let i = 0; i < arr.length; i++) {
    if (!set.has(arr[i])) {
      buff.push(arr[i]);
      continue;
    }
    if (0 == buff.length) continue;
    res.push(buff.join(""));
    buff = [];
  }
  if (buff.length > 0) res.push(buff.join(""));
  return res;
}
function b64EncodeUnicode(str) {
  // first we use encodeURIComponent to get percent-encoded UTF-8,
  // then we convert the percent encodings into raw bytes which
  // can be fed into btoa.
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
    function toSolidBytes(match, p1) {
      return String.fromCharCode('0x' + p1);
    }));
}
function b64DecodeUnicode(str) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(atob(str).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}