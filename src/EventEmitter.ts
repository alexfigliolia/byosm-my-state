import type { Listener } from "types";

export class EventEmitter<T extends Record<string, any>> extends Map<
  Extract<keyof T, string>,
  Bucket
> {
  public on<K extends Extract<keyof T, string>>(
    event: K,
    listener: Listener<T[K]>
  ) {
    const bucket = this.get(event) || new Bucket();
    const ID = bucket.add(listener);
    this.set(event, bucket);
    return ID;
  }

  public off<K extends Extract<keyof T, string>>(event: K, ID: string) {
    const bucket = this.get(event);
    if (!bucket) {
      return;
    }
    bucket.delete(ID);
    if (bucket.size === 0) {
      this.delete(event);
    }
  }

  public emit<K extends Extract<keyof T, string>>(event: K, payload: T[K]) {
    const bucket = this.get(event);
    if (!bucket) {
      return;
    }
    for (const [_, listener] of bucket) {
      void listener(payload);
    }
  }
}

export class Bucket extends Map<string, Listener<any>> {
  private ID = -1;

  public add(listener: Listener<any>) {
    const ID = this.getID();
    this.set(ID, listener);
    return ID;
  }

  private getID() {
    return `${++this.ID}`;
  }
}
