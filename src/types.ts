export type Listener<T> = (payload: T) => void | Promise<void>;
