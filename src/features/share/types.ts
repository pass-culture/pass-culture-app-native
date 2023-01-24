import { ShareContent } from 'libs/share/share'

export interface WebShareModalProps {
  visible: boolean
  headerTitle: string
  shareContent: ShareContent
  dismissModal: () => void
}

export type ShareOutput = {
  share: () => void
  shareContent?: ShareContent
}
