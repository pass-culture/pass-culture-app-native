import { YouTubePlayer } from 'react-youtube'

import { VideoModule } from 'features/home/types'
import { Offer } from 'shared/offer/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare type YouTubeEvent<T = any> = {
  data: T
  target: YouTubePlayer
}

export enum PlayerState {
  UNSTARTED = 'unstarted',
  BUFFERING = 'buffering',
  PLAYING = 'playing',
  PAUSED = 'paused',
  ENDED = 'ended',
}

export interface VideoPlayerProps {
  youtubeVideoId: string
  offer?: Offer
  onPressSeeOffer: () => void
  moduleId: string
  moduleName: string
  homeEntryId: string
}

export interface VideoModalProps extends VideoModule {
  offers: Offer[]
  visible: boolean
  hideModal: () => void
  moduleId: string
  homeEntryId: string
  isMultiOffer: boolean
}
