/**
 * C# like event
 */
export class VXsEvent<TArgs extends any[]> {
    private callbacks: ((...args: TArgs) => void)[];
    constructor() {
        this.callbacks = [];
    }
    subscribe(callback: (...args: TArgs) => void) {
        this.callbacks.push(callback)
    }
    unsubscribe(callback: (...args: TArgs) => void) {
        let index = this.callbacks.findIndex(x => x === callback);
        if (-1 === index) return;
        delete this.callbacks[index];
    }
    invoke(...args: TArgs) {
        let errors = [];
        for (let k in this.callbacks) try { this.callbacks[k].apply(null, args); } catch (e) { errors.push(e); }
        if (0 !== errors.length) throw ["errors on invoke of event", errors];
    }
}