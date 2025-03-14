import { ModalSettings } from 'ui/components/modals/useModal'

export type StickyFooterNotificationsProps = {
  onPressNotificationsCTA: () => void
  hasEnabledNotifications: boolean
  notificationAuthModal: ModalSettings
}
