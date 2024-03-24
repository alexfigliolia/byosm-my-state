import { EventEmitter } from "EventEmitter";

export class State<T extends Record<string, any>> {
  state: T;
  readonly name: string;
  readonly initialState: T;
  private readonly Emitter = new EventEmitter<{ update: T }>();
  constructor(name: string, initialState: T) {
    this.name = name;
    this.initialState = initialState;
    this.state = { ...initialState };
  }

  public update(callback: (state: T) => void | Promise<void>) {
    const result = callback(this.state);
    if (result instanceof Promise) {
      void result.then(() => {
        this.Emitter.emit("update", this.state);
      });
      return;
    }
    this.Emitter.emit("update", this.state);
  }

  public subscribe(callback: (state: T) => void | Promise<void>) {
    return this.Emitter.on("update", callback);
  }

  public unsubscribe(ID: string) {
    return this.Emitter.off("update", ID);
  }
}
