import { SectionItem } from 'features/profile/containers/createProfileContent'

export type LoggedInContentConfig = {
  section: string
  items: SectionItem[]
}

export type LoggedInContentParams = {
  HelpButton: React.ReactElement
} & {
  AppearanceButton: React.ReactElement
} & {
  LocationButton: React.ReactElement
} & {
  FeedbackInAppButton: React.ReactElement
}
