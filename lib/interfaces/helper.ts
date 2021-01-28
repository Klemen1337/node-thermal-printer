import { URLSearchParams } from "url";

export class PromiseResolver<T> {
  constructor(readonly resolve: (x: T) => void, readonly reject: (err: string | Error) => void) {}
}

export function parseQueryOptions(optionsString: string) {
  const options = new URLSearchParams(optionsString);
  return Array.from(options.entries()).reduce((o, [k, v]) => {
    const nv = Number(v);
    o[k] = nv.toString() === v ? nv : v;
    return o;
  }, {} as {[key: string]: number | string});
}

export default class PromiseQueue<T> {
  get length() {
    if (this.entryQueue.length === 0) {
      return this.promiseQueue.length * -1;
    } else {
      return this.entryQueue.length;
    }
  }
  private readonly promiseQueue: Array<PromiseResolver<T>> = [];
  private readonly entryQueue: T[] = [];
  public isEmpty() {
    return this.promiseQueue.length === 0 && this.entryQueue.length === 0;
  }
  public isBufferEmpty() {
    return this.entryQueue.length === 0;
  }

  public push(...entries: T[]) {
    for (const e of entries) {
      const p = this.promiseQueue.shift();
      if (p) {
        p.resolve(e);
      } else {
        this.entryQueue.push(e);
      }
    }
  }
  public pushError(e: Error | string) {
    const p = this.promiseQueue.shift();
    if (p) {
      p.reject(e);
    }
  }

  public read(block = true, timeout?: number): Promise<T | undefined> {
    return block ? this.readBlocking(timeout) : Promise.resolve(this.readSync());
  }
  public readSync(): T | undefined {
    return this.entryQueue.shift();
  }
  public readBlocking(timeout?: number): Promise<T> {
    const e = this.readSync();
    return e ? Promise.resolve(e) : this.queuedEntry(timeout);
  }

  public abort(error: string | Error) {
    for (const p of this.promiseQueue) {
      p.reject(error);
    }
  }

  private queuedEntry(timeout?: number) {
    return new Promise<T>((resolve, reject) => {
      let timer: number | undefined;
      const promiseResolver = new PromiseResolver<T>(
        result => {
          timer && clearTimeout(timer);
          resolve(result);
        },
        err => {
          timer && clearTimeout(timer);
          reject(err);
        }
      );
      this.promiseQueue.push(promiseResolver);
      if (timeout) {
        timer = (setTimeout(() => {
          const idx = this.promiseQueue.indexOf(promiseResolver);
          if (idx > -1) {
            this.promiseQueue.splice(idx, 1);
          }
          promiseResolver.reject(new Error("Wait-Timeout"));
        }, timeout) as unknown) as number;
      }
    });
  }
}
