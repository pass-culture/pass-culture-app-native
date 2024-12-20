import { AchievementEnum, AchievementResponse } from 'api/gen'
import {
  DetailedAchievementIllustrations,
  SimpleAchievementIllustrations,
} from 'features/internal/cheatcodes/pages/AppComponents/illustrationsExports'
import { AccessibleIcon } from 'ui/svg/icons/types'

export type Achievement = {
  name: AchievementEnum
  title: string
  descriptionLocked: string
  descriptionUnlocked: string
  illustrationUnlocked: React.FC<AccessibleIcon>
  illustrationLocked: React.FC<AccessibleIcon>
  illustrationUnlockedDetailed: React.FC<AccessibleIcon>
  illustrationLockedDetailed: React.FC<AccessibleIcon>
  category: AchievementCategory
}

export enum AchievementCategory {
  FIRST_BOOKINGS = 'FIRST_BOOKINGS',
}

export const firstMovieBooking = {
  name: AchievementEnum.FIRST_MOVIE_BOOKING,
  title: 'Mangeur de popcorns',
  descriptionLocked: 'Réserve ta première place de cinéma',
  descriptionUnlocked: 'Tu as réservé ta première séance de cinéma',
  illustrationLocked: SimpleAchievementIllustrations.FirstMovieBookingLocked,
  illustrationUnlocked: SimpleAchievementIllustrations.FirstMovieBookingUnlocked,
  illustrationUnlockedDetailed: DetailedAchievementIllustrations.FirstMovieBookingUnlockedDetailed,
  illustrationLockedDetailed: DetailedAchievementIllustrations.FirstMovieBookingLockedDetailed,
  category: AchievementCategory.FIRST_BOOKINGS,
}

export const firstBookBooking = {
  name: AchievementEnum.FIRST_BOOK_BOOKING,
  title: 'Rat de bibliothèque',
  descriptionLocked: 'Réserve ton premier livre',
  descriptionUnlocked: 'Tu as réservé ton premier livre',
  illustrationLocked: SimpleAchievementIllustrations.FirstBookBookingLocked,
  illustrationUnlocked: SimpleAchievementIllustrations.FirstBookBookingUnlocked,
  illustrationUnlockedDetailed: DetailedAchievementIllustrations.FirstBookBookingUnlockedDetailed,
  illustrationLockedDetailed: DetailedAchievementIllustrations.FirstBookBookingLockedDetailed,
  category: AchievementCategory.FIRST_BOOKINGS,
}

const firstRecordedMusicBooking = {
  name: AchievementEnum.FIRST_RECORDED_MUSIC_BOOKING,
  title: 'DJ de salon',
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
  name: AchievementEnum.FIRST_SHOW_BOOKING,
  title: 'Molière, c’est toi\u00a0?',
  descriptionLocked: 'Réserve ton premier spectacle',
  descriptionUnlocked: 'Tu as réservé ton premier spectacle',
  illustrationLocked: SimpleAchievementIllustrations.FirstShowBookingLocked,
  illustrationUnlocked: SimpleAchievementIllustrations.FirstShowBookingUnlocked,
  illustrationUnlockedDetailed: DetailedAchievementIllustrations.FirstShowBookingUnlockedDetailed,
  illustrationLockedDetailed: DetailedAchievementIllustrations.FirstShowBookingLockedDetailed,
  category: AchievementCategory.FIRST_BOOKINGS,
}

const firstMuseumBooking = {
  name: AchievementEnum.FIRST_MUSEUM_BOOKING,
  title: 'Visiteur curieux',
  descriptionLocked: 'Réserve ta première visite',
  descriptionUnlocked: 'Tu as réservé ta première visite ',
  illustrationLocked: SimpleAchievementIllustrations.FirstMuseumBookingLocked,
  illustrationUnlocked: SimpleAchievementIllustrations.FirstMuseumBookingUnlocked,
  illustrationUnlockedDetailed: DetailedAchievementIllustrations.FirstMuseumBookingUnlockedDetailed,
  illustrationLockedDetailed: DetailedAchievementIllustrations.FirstMuseumBookingLockedDetailed,
  category: AchievementCategory.FIRST_BOOKINGS,
}

const firstLiveMusicBooking = {
  name: AchievementEnum.FIRST_LIVE_MUSIC_BOOKING,
  title: 'Pro du pogo',
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
  name: AchievementEnum.FIRST_NEWS_BOOKING,
  title: 'Futur Hugo Décrypte',
  descriptionLocked: 'Abonne-toi à un média',
  descriptionUnlocked: 'Tu t’es abonné à ton premier média',
  illustrationLocked: SimpleAchievementIllustrations.FirstNewsBookingLocked,
  illustrationUnlocked: SimpleAchievementIllustrations.FirstNewsBookingUnlocked,
  illustrationUnlockedDetailed: DetailedAchievementIllustrations.FirstNewsBookingUnlockedDetailed,
  illustrationLockedDetailed: DetailedAchievementIllustrations.FirstNewsBookingLockedDetailed,
  category: AchievementCategory.FIRST_BOOKINGS,
}

export const firstInstrumentBooking = {
  name: AchievementEnum.FIRST_INSTRUMENT_BOOKING,
  title: 'Van Gogh en devenir',
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
  name: AchievementEnum.FIRST_ART_LESSON_BOOKING,
  title: 'Apprenti artiste',
  descriptionLocked: 'Réserve ton premier atelier ou cours artistique',
  descriptionUnlocked: 'Tu as réservé ton premier atelier ou cours artistique',
  illustrationLocked: SimpleAchievementIllustrations.FirstArtLessonBookingLocked,
  illustrationUnlocked: SimpleAchievementIllustrations.FirstArtLessonBookingUnlocked,
  illustrationUnlockedDetailed:
    DetailedAchievementIllustrations.FirstArtLessonBookingUnlockedDetailed,
  illustrationLockedDetailed: DetailedAchievementIllustrations.FirstArtLessonBookingLockedDetailed,
  category: AchievementCategory.FIRST_BOOKINGS,
}

export const achievementData: Achievement[] = [
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
  id: 1,
  name: AchievementEnum.FIRST_MOVIE_BOOKING,
  unlockedDate: new Date('2024-12-01').toLocaleDateString('fr-FR'),
}

export const userCompletedBookBooking = {
  id: 2,
  name: AchievementEnum.FIRST_BOOK_BOOKING,
  unlockedDate: new Date('2024-12-02').toLocaleDateString('fr-FR'),
}

export const userCompletedArtLessonBooking = {
  id: 3,
  name: AchievementEnum.FIRST_ART_LESSON_BOOKING,
  unlockedDate: new Date('2024-12-03').toLocaleDateString('fr-FR'),
}

export const mockCompletedAchievements: AchievementResponse[] = [
  userCompletedMovieBooking,
  userCompletedBookBooking,
  userCompletedArtLessonBooking,
]

export const achievementCategoryDisplayTitles: Record<AchievementCategory, string> = {
  [AchievementCategory.FIRST_BOOKINGS]: 'Premières réservations',
}
