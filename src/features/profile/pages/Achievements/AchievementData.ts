import { BicolorTrophy, Trophy } from 'ui/svg/icons/Trophy'
import { AccessibleIcon } from 'ui/svg/icons/types'

export type Achievement = {
  id: AchievementId
  name: string
  descriptionLocked: string
  descriptionUnlocked: string
  illustrationUnlocked: React.FC<AccessibleIcon>
  illustrationLocked: React.FC<AccessibleIcon>
  category: AchievementCategory
}

export type UserAchievement = {
  id: AchievementId
  completedAt: Date
}

export enum AchievementId {
  FIRST_MOVIE_BOOKING = 'FIRST_MOVIE_BOOKING',
  FIRST_BOOK_BOOKING = 'FIRST_BOOK_BOOKING',
  FIRST_RECORDED_MUSIC_BOOKING = 'FIRST_RECORDED_MUSIC_BOOKING',
  FIRST_SHOW_BOOKING = 'FIRST_SHOW_BOOKING',
  FIRST_MUSEUM_BOOKING = 'FIRST_MUSEUM_BOOKING',
  FIRST_LIVE_MUSIC_BOOKING = 'FIRST_LIVE_MUSIC_BOOKING',
  FIRST_NEWS_BOOKING = 'FIRST_NEWS_BOOKING',
  FIRST_INSTRUMENT_BOOKING = 'FIRST_INSTRUMENT_BOOKING',
  FIRST_ART_LESSON_BOOKING = 'FIRST_ART_LESSON_BOOKING',
}

export enum AchievementCategory {
  FIRST_BOOKINGS = 'FIRST_BOOKINGS',
}

export const firstMovieBooking = {
  id: AchievementId.FIRST_MOVIE_BOOKING,
  name: 'Cinéphile en herbe',
  descriptionLocked: 'Réserve ta première place de cinéma',
  descriptionUnlocked: 'Tu as réservé ta première séance de cinéma',
  illustrationLocked: Trophy,
  illustrationUnlocked: BicolorTrophy,
  category: AchievementCategory.FIRST_BOOKINGS,
}

export const firstBookBooking = {
  id: AchievementId.FIRST_BOOK_BOOKING,
  name: 'Rat de bibliothèque',
  descriptionLocked: 'Réserve ton premier livre',
  descriptionUnlocked: 'Tu as réservé ton premier livre',
  illustrationLocked: Trophy,
  illustrationUnlocked: BicolorTrophy,
  category: AchievementCategory.FIRST_BOOKINGS,
}

const firstRecordedMusicBooking = {
  id: AchievementId.FIRST_RECORDED_MUSIC_BOOKING,
  name: 'Premier tour de platine',
  descriptionLocked: 'Réserve ton premier CD ou vinyle',
  descriptionUnlocked: 'Tu as réservé ton CD ou vinyle',
  illustrationLocked: Trophy,
  illustrationUnlocked: BicolorTrophy,
  category: AchievementCategory.FIRST_BOOKINGS,
}

const firstShowBooking = {
  id: AchievementId.FIRST_SHOW_BOOKING,
  name: 'Rideau rouge levé',
  descriptionLocked: 'Réserve ton premier spectacle',
  descriptionUnlocked: 'Tu as réservé ton premier spectacle',
  illustrationLocked: Trophy,
  illustrationUnlocked: BicolorTrophy,
  category: AchievementCategory.FIRST_BOOKINGS,
}

const firstMuseumBooking = {
  id: AchievementId.FIRST_MUSEUM_BOOKING,
  name: 'Explorateur culturel',
  descriptionLocked: 'Réserve ta première visite',
  descriptionUnlocked: 'Tu as réservé ta première visite ',
  illustrationLocked: Trophy,
  illustrationUnlocked: BicolorTrophy,
  category: AchievementCategory.FIRST_BOOKINGS,
}

const firstLiveMusicBooking = {
  id: AchievementId.FIRST_LIVE_MUSIC_BOOKING,
  name: 'Premier Beat',
  descriptionLocked: 'Réserve ton premier concert ou festival',
  descriptionUnlocked: 'Tu as réservé ton premier concert ou festival',
  illustrationLocked: Trophy,
  illustrationUnlocked: BicolorTrophy,
  category: AchievementCategory.FIRST_BOOKINGS,
}

export const firstNewsBooking = {
  id: AchievementId.FIRST_NEWS_BOOKING,
  name: 'Futur Hugo Décrypte',
  descriptionLocked: 'Abonne-toi à un média',
  descriptionUnlocked: 'Tu t’es abonné à ton premier média',
  illustrationLocked: Trophy,
  illustrationUnlocked: BicolorTrophy,
  category: AchievementCategory.FIRST_BOOKINGS,
}

export const firstInstrumentBooking = {
  id: AchievementId.FIRST_INSTRUMENT_BOOKING,
  name: 'Artiste en devenir',
  descriptionLocked: 'Réserve du matériel créatif',
  descriptionUnlocked: 'Tu as réservé du matériel créatif',
  illustrationLocked: Trophy,
  illustrationUnlocked: BicolorTrophy,
  category: AchievementCategory.FIRST_BOOKINGS,
}

export const firstArtLessonBooking = {
  id: AchievementId.FIRST_ART_LESSON_BOOKING,
  name: 'Se mettre à la pratique',
  descriptionLocked: 'Réserve ton premier atelier ou cours artistique',
  descriptionUnlocked: 'Tu as réservé ton premier atelier ou cours artistique',
  illustrationLocked: Trophy,
  illustrationUnlocked: BicolorTrophy,
  category: AchievementCategory.FIRST_BOOKINGS,
}

export const mockAchievements: Achievement[] = [
  firstMovieBooking,
  firstBookBooking,
  firstRecordedMusicBooking,
  firstShowBooking,
  firstMuseumBooking,
  firstLiveMusicBooking,
  firstNewsBooking,
  firstInstrumentBooking,
  firstArtLessonBooking,
]

export const userCompletedMovieBooking = {
  id: AchievementId.FIRST_MOVIE_BOOKING,
  completedAt: new Date(),
}

export const userCompletedBookBooking = {
  id: AchievementId.FIRST_BOOK_BOOKING,
  completedAt: new Date(),
}

export const userCompletedArtLessonBooking = {
  id: AchievementId.FIRST_ART_LESSON_BOOKING,
  completedAt: new Date(),
}

export const mockCompletedAchievements: UserAchievement[] = [
  userCompletedMovieBooking,
  userCompletedBookBooking,
  userCompletedArtLessonBooking,
]

export const achievementCategoryDisplayNames: Record<AchievementCategory, string> = {
  [AchievementCategory.FIRST_BOOKINGS]: 'Premières réservations',
}
