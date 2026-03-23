import { SectionItem } from 'features/profile/helpers/createProfileContent'

export type LoggedInContentConfig = {
  section: string
  items: SectionItem[]
}

export type LoggedInContentParams = {
  ChatbotButton: React.ReactNode
} & {
  HelpButton: React.ReactNode | null
} & {
  AppearanceButton: React.ReactNode
} & {
  LocationButton: React.ReactNode
} & {
  FeedbackInAppButton: React.ReactNode
} & {
  ShareBanner: React.ReactNode | null
} & {
  SocialNetwork: React.ReactNode
}
