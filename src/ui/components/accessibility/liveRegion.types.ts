export type LiveRegionAnnouncement = {
  id: string
  message: string
}

export type LiveRegionProps = {
  announcement?: LiveRegionAnnouncement
  politeness?: 'polite' | 'assertive'
}
