import {
  DetailedAchievementIllustrations,
  SimpleAchievementIllustrations,
} from 'features/internal/cheatcodes/pages/AppComponents/illustrationsExports'
import { AccessibleIcon } from 'ui/svg/icons/types'

export type Achievement = {
  id: AchievementId
  name: string
  descriptionLocked: string
  descriptionUnlocked: string
  illustrationUnlocked: React.FC<AccessibleIcon>
  illustrationLocked: React.FC<AccessibleIcon>
  illustrationUnlockedDetailed?: React.FC<AccessibleIcon>
  illustrationLockedDetailed?: React.FC<AccessibleIcon>
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
  illustrationLocked: SimpleAchievementIllustrations.FirstMovieBookingLocked,
  illustrationUnlocked: SimpleAchievementIllustrations.FirstMovieBookingUnlocked,
  illustrationUnlockedDetailed: DetailedAchievementIllustrations.FirstMovieBookingUnlockedDetailed,
  illustrationLockedDetailed: DetailedAchievementIllustrations.FirstMovieBookingLockedDetailed,
  category: AchievementCategory.FIRST_BOOKINGS,
}

export const firstBookBooking = {
  id: AchievementId.FIRST_BOOK_BOOKING,
  name: 'Rat de bibliothèque',
  descriptionLocked: 'Réserve ton premier livre',
  descriptionUnlocked: 'Tu as réservé ton premier livre',
  illustrationLocked: SimpleAchievementIllustrations.FirstBookBookingLocked,
  illustrationUnlocked: SimpleAchievementIllustrations.FirstBookBookingUnlocked,
  illustrationUnlockedDetailed: DetailedAchievementIllustrations.FirstBookBookingUnlockedDetailed,
  illustrationLockedDetailed: DetailedAchievementIllustrations.FirstBookBookingLockedDetailed,
  category: AchievementCategory.FIRST_BOOKINGS,
}

const firstRecordedMusicBooking = {
  id: AchievementId.FIRST_RECORDED_MUSIC_BOOKING,
  name: 'Premier tour de platine',
  descriptionLocked: 'Réserve ton premier CD ou vinyle',
  descriptionUnlocked: 'Tu as réservé ton CD ou vinyle',
  illustrationLocked: SimpleAchievementIllustrations.FirstRecordedMusicBookingLocked,
  illustrationUnlocked: SimpleAchievementIllustrations.FirstRecordedMusicBookingUnlocked,
  illustrationUnlockedDetailed:
    DetailedAchievementIllustrations.FirstRecordedMusicBookingUnlockedDetailed,
  illustrationLockedDetailed:
    DetailedAchievementIllustrations.FirstRecordedMusicBookingLockedDetailed,
  category: AchievementCategory.FIRST_BOOKINGS,
}

const firstShowBooking = {
  id: AchievementId.FIRST_SHOW_BOOKING,
  name: 'Rideau rouge levé',
  descriptionLocked: 'Réserve ton premier spectacle',
  descriptionUnlocked: 'Tu as réservé ton premier spectacle',
  illustrationLocked: SimpleAchievementIllustrations.FirstShowBookingLocked,
  illustrationUnlocked: SimpleAchievementIllustrations.FirstShowBookingUnlocked,
  illustrationUnlockedDetailed: DetailedAchievementIllustrations.FirstShowBookingUnlockedDetailed,
  illustrationLockedDetailed: DetailedAchievementIllustrations.FirstShowBookingLockedDetailed,
  category: AchievementCategory.FIRST_BOOKINGS,
}

const firstMuseumBooking = {
  id: AchievementId.FIRST_MUSEUM_BOOKING,
  name: 'Explorateur culturel',
  descriptionLocked: 'Réserve ta première visite',
  descriptionUnlocked: 'Tu as réservé ta première visite ',
  illustrationLocked: SimpleAchievementIllustrations.FirstMuseumBookingLocked,
  illustrationUnlocked: SimpleAchievementIllustrations.FirstMuseumBookingUnlocked,
  illustrationUnlockedDetailed: DetailedAchievementIllustrations.FirstMuseumBookingUnlockedDetailed,
  illustrationLockedDetailed: DetailedAchievementIllustrations.FirstMuseumBookingLockedDetailed,
  category: AchievementCategory.FIRST_BOOKINGS,
}

const firstLiveMusicBooking = {
  id: AchievementId.FIRST_LIVE_MUSIC_BOOKING,
  name: 'Premier Beat',
  descriptionLocked: 'Réserve ton premier concert ou festival',
  descriptionUnlocked: 'Tu as réservé ton premier concert ou festival',
  illustrationLocked: SimpleAchievementIllustrations.FirstLiveMusicBookingLocked,
  illustrationUnlocked: SimpleAchievementIllustrations.FirstLiveMusicBookingUnlocked,
  illustrationUnlockedDetailed:
    DetailedAchievementIllustrations.FirstLiveMusicBookingUnlockedDetailed,
  illustrationLockedDetailed: DetailedAchievementIllustrations.FirstLiveMusicBookingLockedDetailed,
  category: AchievementCategory.FIRST_BOOKINGS,
}

export const firstNewsBooking = {
  id: AchievementId.FIRST_NEWS_BOOKING,
  name: 'Futur Hugo Décrypte',
  descriptionLocked: 'Abonne-toi à un média',
  descriptionUnlocked: 'Tu t’es abonné à ton premier média',
  illustrationLocked: SimpleAchievementIllustrations.FirstNewsBookingLocked,
  illustrationUnlocked: SimpleAchievementIllustrations.FirstNewsBookingUnlocked,
  illustrationUnlockedDetailed: DetailedAchievementIllustrations.FirstNewsBookingUnlockedDetailed,
  illustrationLockedDetailed: DetailedAchievementIllustrations.FirstNewsBookingLockedDetailed,
  category: AchievementCategory.FIRST_BOOKINGS,
}

export const firstInstrumentBooking = {
  id: AchievementId.FIRST_INSTRUMENT_BOOKING,
  name: 'Artiste en devenir',
  descriptionLocked: 'Réserve du matériel créatif',
  descriptionUnlocked: 'Tu as réservé du matériel créatif',
  illustrationLocked: SimpleAchievementIllustrations.FirstInstrumentBookingLocked,
  illustrationUnlocked: SimpleAchievementIllustrations.FirstInstrumentBookingUnlocked,
  illustrationUnlockedDetailed:
    DetailedAchievementIllustrations.FirstInstrumentBookingUnlockedDetailed,
  illustrationLockedDetailed: DetailedAchievementIllustrations.FirstInstrumentBookingLockedDetailed,
  category: AchievementCategory.FIRST_BOOKINGS,
}

export const firstArtLessonBooking = {
  id: AchievementId.FIRST_ART_LESSON_BOOKING,
  name: 'Se mettre à la pratique',
  descriptionLocked: 'Réserve ton premier atelier ou cours artistique',
  descriptionUnlocked: 'Tu as réservé ton premier atelier ou cours artistique',
  illustrationLocked: SimpleAchievementIllustrations.FirstArtLessonBookingLocked,
  illustrationUnlocked: SimpleAchievementIllustrations.FirstArtLessonBookingUnlocked,
  illustrationUnlockedDetailed:
    DetailedAchievementIllustrations.FirstArtLessonBookingUnlockedDetailed,
  illustrationLockedDetailed: DetailedAchievementIllustrations.FirstArtLessonBookingLockedDetailed,
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
  completedAt: new Date('2024-12-01'),
}

export const userCompletedBookBooking = {
  id: AchievementId.FIRST_BOOK_BOOKING,
  completedAt: new Date('2024-12-02'),
}

export const userCompletedArtLessonBooking = {
  id: AchievementId.FIRST_ART_LESSON_BOOKING,
  completedAt: new Date('2024-12-03'),
}

export const mockCompletedAchievements: UserAchievement[] = [
  userCompletedMovieBooking,
  userCompletedBookBooking,
  userCompletedArtLessonBooking,
]

export const achievementCategoryDisplayNames: Record<AchievementCategory, string> = {
  [AchievementCategory.FIRST_BOOKINGS]: 'Premières réservations',
}
