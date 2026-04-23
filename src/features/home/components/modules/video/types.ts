import { Offer } from 'shared/offer/types'

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
  moduleId: string
  moduleName: string
  homeEntryId: string
  onPressSeeOffer()
}
