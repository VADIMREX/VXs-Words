import { VXsEvent } from './VXsEvent';

const OnlineConnection = new class {
  constructor() {
    this.isConnected = false;
    /** @type {VXsEvent<[boolean]>} */
    this.onIsOnlineChanged = new VXsEvent();
  }
}

export default OnlineConnection;