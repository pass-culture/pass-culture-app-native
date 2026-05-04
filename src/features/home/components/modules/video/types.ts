import { Offer } from 'shared/offer/types'

export interface VideoPlayerProps {
  youtubeVideoId: string
  offer?: Offer
  moduleId: string
  moduleName: string
  homeEntryId: string
  onPressSeeOffer()
}
