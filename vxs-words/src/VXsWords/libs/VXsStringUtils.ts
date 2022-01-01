/** 
 * Split string on words
 * @param str
 */
export function splitOnSpecialChars(str: string) {
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
    for (let i in arr) {
        if (!set.has(arr[i])) {
            buff.push(arr[i]);
            continue;
        }
        if (0 === buff.length) continue;
        res.push(buff.join(""));
        buff = [];
    }
    if (buff.length > 0) res.push(buff.join(""));
    return res;
}