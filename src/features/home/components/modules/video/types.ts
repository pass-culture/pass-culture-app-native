import { YouTubePlayer } from 'react-youtube'

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
