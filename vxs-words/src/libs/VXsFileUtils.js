/**
 * сохранить файл 
 * @param {string} filename
 * @param {string} text
 */
export function saveFile(filename, text) {
    let oFile = document.createElement('a');
    oFile.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
    oFile.setAttribute('download', filename);
    if (document.createEvent) {
        let event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        oFile.dispatchEvent(event);
    }
    else {
        oFile.click();
    }
}

/**
 * открыть файл
 * @param {(this:Scope, content: string )=>void} callback
 * @param {Scope} scope
 * @template Scope
 */
 export function openFile(callback, scope) {
    var iFile = document.createElement('input');
    iFile.type = 'file';
    iFile.onchange = e => {
      var reader = new FileReader();
      reader.readAsText(e.target.files[0], 'UTF-8');
      reader.onload = readerEvent => callback.call(scope || this, readerEvent.target.result);
    }
    if (document.createEvent) {
      let event = document.createEvent('MouseEvents');
      event.initEvent('click', true, true);
      iFile.dispatchEvent(event);
    }
    else {
      iFile.click();
    }
  }
  