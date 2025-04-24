import { LocationCircleArea } from 'features/home/types'

export interface BusinessModuleProps {
  homeEntryId: string | undefined
  moduleId: string
  analyticsTitle: string
  title?: string
  subtitle?: string
  index: number
  image: string
  imageWeb?: string
  url?: string
  shouldTargetNotConnectedUsers?: boolean
  localizationArea?: LocationCircleArea
  callToAction?: string
  date?: string
}
