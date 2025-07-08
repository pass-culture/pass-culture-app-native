import { MeasureOnSuccessCallback } from 'react-native'

export type YoutubeRendererProps = {
  height: number
  width?: number
  videoId?: string
  play?: boolean
  onError?: (error: string) => void
  onReady?: () => void
  initialPlayerParams?: Record<string, unknown>
  onChangeState?: (event: string) => void
  onFullScreenChange?: (status: boolean) => void
}

export type YoutubeRendererRef = {
  getDuration: () => Promise<number>
  getVideoUrl: () => Promise<string>
  getCurrentTime: () => Promise<number>
  isMuted: () => Promise<boolean>
  getVolume: () => Promise<number>
  getPlaybackRate: () => Promise<number>
  getAvailablePlaybackRates: () => Promise<number[]>
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
}

export type YoutubePlayerRef = YoutubeRendererRef & {
  unload: () => void
  measure?: (callback: MeasureOnSuccessCallback) => void
}
