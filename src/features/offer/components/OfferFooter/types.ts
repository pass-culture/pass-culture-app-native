import { ModalSettings } from 'ui/components/modals/useModal'

export type StickyFooterNotificationsProps = {
  onPressReminderCTA: () => void
  hasReminder: boolean
  reminderAuthModal: ModalSettings
}
