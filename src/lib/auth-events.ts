type AuthInvalidatedListener = () => void;

const target = new EventTarget();
const EVENT = "auth:invalidated";

export function emitAuthInvalidated() {
  target.dispatchEvent(new Event(EVENT));
}

export function onAuthInvalidated(listener: AuthInvalidatedListener) {
  const handler = () => listener();
  target.addEventListener(EVENT, handler);
  return () => target.removeEventListener(EVENT, handler);
}
