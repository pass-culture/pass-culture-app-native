export type EventSubscription = {
  remove: () => void
}

type Listener = (...args: unknown[]) => void

export default class NativeEventEmitter {
  constructor(_nativeModule?: unknown) {
    return
  }

  addListener(_eventType: string, _listener: Listener): EventSubscription {
    return { remove: jest.fn() }
  }

  removeAllListeners(_eventType?: string): void {
    return
  }

  removeSubscription(_subscription: EventSubscription): void {
    return
  }
}
