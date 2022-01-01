import { ChangeEvent } from "react";

/**
 * сохранить файл 
 * @param filename
 * @param text
 */
export function saveFile(filename: string, text: string) {
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

export type openFileCallback<Scope> = ((this: Scope, content: string | null) => void);
/**
 * открыть файл
 * @param callback
 * @param scope
 */
export function openFile<Scope>(callback: openFileCallback<Scope>, scope: Scope) {
  var iFile = document.createElement('input');
  iFile.type = 'file';
  iFile.onchange = ((e: ChangeEvent<HTMLInputElement>) => {
    if (null === e.target || null === e.target.files || 0 === e.target.files.length) {
      callback.call(scope, null);
      return;
    }
    var reader = new FileReader();
    reader.readAsText(e.target.files[0], 'UTF-8');
    reader.onload = readerEvent => callback.call(scope, null === readerEvent.target ||
      null == readerEvent.target.result ? null : readerEvent.target.result as any);
  }) as any;
  if (document.createEvent) {
    let event = document.createEvent('MouseEvents');
    event.initEvent('click', true, true);
    iFile.dispatchEvent(event);
  }
  else {
    iFile.click();
  }
}
