import { VXsEvent } from '../libs/VXsEvent';

const OnlineConnection = new (class OnlineConnection{
  constructor() {
    this.isConnected = false;
    /** @type {VXsEvent<[boolean]>} */
    this.onIsOnlineChanged = new VXsEvent();
  }
})();

export default OnlineConnection;