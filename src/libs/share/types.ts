import { ShareContent } from './share'

export interface WebShareModalProps {
  visible: boolean
  headerTitle: string
  shareContent: ShareContent
  dismissModal: () => void
}
