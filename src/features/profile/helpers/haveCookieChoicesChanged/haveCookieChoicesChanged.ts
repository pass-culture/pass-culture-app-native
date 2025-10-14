import { CookiesChoiceByCategory } from 'features/cookies/types'

const COOKIE_CHOICE_KEYS = ['customization', 'performance', 'marketing', 'video']
type CookieChoiceKey = (typeof COOKIE_CHOICE_KEYS)[number]

export const haveCookieChoicesChanged = (
  edited: CookiesChoiceByCategory,
  persisted: CookiesChoiceByCategory
): boolean => {
  return COOKIE_CHOICE_KEYS.some((key: CookieChoiceKey) => edited[key] !== persisted[key])
}
