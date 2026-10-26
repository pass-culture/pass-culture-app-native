export type CinemaScreeningAccessibilityCategory = 'visual' | 'audio' | 'mental' | 'motor'

type CinemaScreeningDetailContent = {
  label: string
  description: string
}

export type CinemaScreeningDetail = CinemaScreeningDetailContent &
  (
    | {
        type: 'tag'
        category: 'special-event' | 'video' | 'audio'
      }
    | {
        type: 'accessibility'
        category: CinemaScreeningAccessibilityCategory
      }
  )

export type CinemaScreeningDetailsModalProps = {
  details: CinemaScreeningDetail[]
  onClose: VoidFunction
}
