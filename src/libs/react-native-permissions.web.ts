export type PermissionStatus = 'unavailable' | 'blocked' | 'denied' | 'granted' | 'limited'

export function checkNotifications() {
  return Promise.resolve({
    status: 'granted',
    settings: {
      alert: true,
      badge: true,
      sound: true,
      carPlay: true,
      criticalAlert: true,
      provisional: true,
      lockScreen: true,
      notificationCenter: true,
    },
  })
}
