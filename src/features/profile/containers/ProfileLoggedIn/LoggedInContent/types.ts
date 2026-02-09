import { SectionItem } from 'features/profile/helpers/createProfileContent'

export type LoggedInContentConfig = {
  section: string
  items: SectionItem[]
}

export type LoggedInNonBeneficiaryContentParams = {
  ChatbotButton: React.ReactNode
} & {
  HelpButton: React.ReactNode
} & {
  AppearanceButton: React.ReactNode
} & {
  LocationButton: React.ReactNode
} & {
  FeedbackInAppButton: React.ReactNode
}

export type LoggedInBeneficiaryContentParams = {
  ChatbotButton: React.ReactNode
} & {
  HelpButton: React.ReactNode
} & {
  AppearanceButton: React.ReactNode
} & {
  LocationButton: React.ReactNode
} & {
  FeedbackInAppButton: React.ReactNode
}
