import { FirstArtLessonBookingLockedDetailed } from 'ui/svg/icons/achievements/Detailed/FirstArtLessonBookingLockedDetailed'
import { FirstArtLessonBookingUnlockedDetailed } from 'ui/svg/icons/achievements/Detailed/FirstArtLessonBookingUnlockedDetailed'
import { FirstBookBookingLockedDetailed } from 'ui/svg/icons/achievements/Detailed/FirstBookBookingLockedDetailed'
import { FirstBookBookingUnlockedDetailed } from 'ui/svg/icons/achievements/Detailed/FirstBookBookingUnlockedDetailed'
import { FirstInstrumentBookingLockedDetailed } from 'ui/svg/icons/achievements/Detailed/FirstInstrumentBookingLockedDetailed'
import { FirstInstrumentBookingUnlockedDetailed } from 'ui/svg/icons/achievements/Detailed/FirstInstrumentBookingUnlockedDetailed'
import { FirstLiveMusicBookingLockedDetailed } from 'ui/svg/icons/achievements/Detailed/FirstLiveMusicBookingLockedDetailed'
import { FirstLiveMusicBookingUnlockedDetailed } from 'ui/svg/icons/achievements/Detailed/FirstLiveMusicBookingUnlockedDetailed'
import { FirstMovieBookingLockedDetailed } from 'ui/svg/icons/achievements/Detailed/FirstMovieBookingLockedDetailed'
import { FirstMovieBookingUnlockedDetailed } from 'ui/svg/icons/achievements/Detailed/FirstMovieBookingUnlockedDetailed'
import { FirstMuseumBookingLockedDetailed } from 'ui/svg/icons/achievements/Detailed/FirstMuseumBookingLockedDetailed'
import { FirstMuseumBookingUnlockedDetailed } from 'ui/svg/icons/achievements/Detailed/FirstMuseumBookingUnlockedDetailed'
import { FirstNewsBookingLockedDetailed } from 'ui/svg/icons/achievements/Detailed/FirstNewsBookingLockedDetailed'
import { FirstNewsBookingUnlockedDetailed } from 'ui/svg/icons/achievements/Detailed/FirstNewsBookingUnlockedDetailed'
import { FirstRecordedMusicBookingLockedDetailed } from 'ui/svg/icons/achievements/Detailed/FirstRecordedMusicBookingLockedDetailed'
import { FirstRecordedMusicBookingUnlockedDetailed } from 'ui/svg/icons/achievements/Detailed/FirstRecordedMusicBookingUnlockedDetailed'
import { FirstShowBookingLockedDetailed } from 'ui/svg/icons/achievements/Detailed/FirstShowBookingLockedDetailed'
import { FirstShowBookingUnlockedDetailed } from 'ui/svg/icons/achievements/Detailed/FirstShowBookingUnlockedDetailed'
import { FirstArtLessonBookingLocked } from 'ui/svg/icons/achievements/Simple/FirstArtLessonBookingLocked'
import { FirstArtLessonBookingUnlocked } from 'ui/svg/icons/achievements/Simple/FirstArtLessonBookingUnlocked'
import { FirstBookBookingLocked } from 'ui/svg/icons/achievements/Simple/FirstBookBookingLocked'
import { FirstBookBookingUnlocked } from 'ui/svg/icons/achievements/Simple/FirstBookBookingUnlocked'
import { FirstInstrumentBookingLocked } from 'ui/svg/icons/achievements/Simple/FirstInstrumentBookingLocked'
import { FirstInstrumentBookingUnlocked } from 'ui/svg/icons/achievements/Simple/FirstInstrumentBookingUnlocked'
import { FirstLiveMusicBookingLocked } from 'ui/svg/icons/achievements/Simple/FirstLiveMusicBookingLocked'
import { FirstLiveMusicBookingUnlocked } from 'ui/svg/icons/achievements/Simple/FirstLiveMusicBookingUnlocked'
import { FirstMovieBookingLocked } from 'ui/svg/icons/achievements/Simple/FirstMovieBookingLocked'
import { FirstMovieBookingUnlocked } from 'ui/svg/icons/achievements/Simple/FirstMovieBookingUnlocked'
import { FirstMuseumBookingLocked } from 'ui/svg/icons/achievements/Simple/FirstMuseumBookingLocked'
import { FirstMuseumBookingUnlocked } from 'ui/svg/icons/achievements/Simple/FirstMuseumBookingUnlocked'
import { FirstNewsBookingLocked } from 'ui/svg/icons/achievements/Simple/FirstNewsBookingLocked'
import { FirstNewsBookingUnlocked } from 'ui/svg/icons/achievements/Simple/FirstNewsBookingUnlocked'
import { FirstRecordedMusicBookingLocked } from 'ui/svg/icons/achievements/Simple/FirstRecordedMusicBookingLocked'
import { FirstRecordedMusicBookingUnlocked } from 'ui/svg/icons/achievements/Simple/FirstRecordedMusicBookingUnlocked'
import { FirstShowBookingLocked } from 'ui/svg/icons/achievements/Simple/FirstShowBookingLocked'
import { FirstShowBookingUnlocked } from 'ui/svg/icons/achievements/Simple/FirstShowBookingUnlocked'
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
  illustrationLocked: FirstMovieBookingLocked,
  illustrationUnlocked: FirstMovieBookingUnlocked,
  illustrationUnlockedDetailed: FirstMovieBookingUnlockedDetailed,
  illustrationLockedDetailed: FirstMovieBookingLockedDetailed,
  category: AchievementCategory.FIRST_BOOKINGS,
}

export const firstBookBooking = {
  id: AchievementId.FIRST_BOOK_BOOKING,
  name: 'Rat de bibliothèque',
  descriptionLocked: 'Réserve ton premier livre',
  descriptionUnlocked: 'Tu as réservé ton premier livre',
  illustrationLocked: FirstBookBookingLocked,
  illustrationUnlocked: FirstBookBookingUnlocked,
  illustrationUnlockedDetailed: FirstBookBookingUnlockedDetailed,
  illustrationLockedDetailed: FirstBookBookingLockedDetailed,
  category: AchievementCategory.FIRST_BOOKINGS,
}

const firstRecordedMusicBooking = {
  id: AchievementId.FIRST_RECORDED_MUSIC_BOOKING,
  name: 'Premier tour de platine',
  descriptionLocked: 'Réserve ton premier CD ou vinyle',
  descriptionUnlocked: 'Tu as réservé ton CD ou vinyle',
  illustrationLocked: FirstRecordedMusicBookingLocked,
  illustrationUnlocked: FirstRecordedMusicBookingUnlocked,
  illustrationUnlockedDetailed: FirstRecordedMusicBookingUnlockedDetailed,
  illustrationLockedDetailed: FirstRecordedMusicBookingLockedDetailed,
  category: AchievementCategory.FIRST_BOOKINGS,
}

const firstShowBooking = {
  id: AchievementId.FIRST_SHOW_BOOKING,
  name: 'Rideau rouge levé',
  descriptionLocked: 'Réserve ton premier spectacle',
  descriptionUnlocked: 'Tu as réservé ton premier spectacle',
  illustrationLocked: FirstShowBookingLocked,
  illustrationUnlocked: FirstShowBookingUnlocked,
  illustrationUnlockedDetailed: FirstShowBookingUnlockedDetailed,
  illustrationLockedDetailed: FirstShowBookingLockedDetailed,
  category: AchievementCategory.FIRST_BOOKINGS,
}

const firstMuseumBooking = {
  id: AchievementId.FIRST_MUSEUM_BOOKING,
  name: 'Explorateur culturel',
  descriptionLocked: 'Réserve ta première visite',
  descriptionUnlocked: 'Tu as réservé ta première visite ',
  illustrationLocked: FirstMuseumBookingLocked,
  illustrationUnlocked: FirstMuseumBookingUnlocked,
  illustrationUnlockedDetailed: FirstMuseumBookingUnlockedDetailed,
  illustrationLockedDetailed: FirstMuseumBookingLockedDetailed,
  category: AchievementCategory.FIRST_BOOKINGS,
}

const firstLiveMusicBooking = {
  id: AchievementId.FIRST_LIVE_MUSIC_BOOKING,
  name: 'Premier Beat',
  descriptionLocked: 'Réserve ton premier concert ou festival',
  descriptionUnlocked: 'Tu as réservé ton premier concert ou festival',
  illustrationLocked: FirstLiveMusicBookingLocked,
  illustrationUnlocked: FirstLiveMusicBookingUnlocked,
  illustrationUnlockedDetailed: FirstLiveMusicBookingUnlockedDetailed,
  illustrationLockedDetailed: FirstLiveMusicBookingLockedDetailed,
  category: AchievementCategory.FIRST_BOOKINGS,
}

export const firstNewsBooking = {
  id: AchievementId.FIRST_NEWS_BOOKING,
  name: 'Futur Hugo Décrypte',
  descriptionLocked: 'Abonne-toi à un média',
  descriptionUnlocked: 'Tu t’es abonné à ton premier média',
  illustrationLocked: FirstNewsBookingLocked,
  illustrationUnlocked: FirstNewsBookingUnlocked,
  illustrationUnlockedDetailed: FirstNewsBookingUnlockedDetailed,
  illustrationLockedDetailed: FirstNewsBookingLockedDetailed,
  category: AchievementCategory.FIRST_BOOKINGS,
}

export const firstInstrumentBooking = {
  id: AchievementId.FIRST_INSTRUMENT_BOOKING,
  name: 'Artiste en devenir',
  descriptionLocked: 'Réserve du matériel créatif',
  descriptionUnlocked: 'Tu as réservé du matériel créatif',
  illustrationLocked: FirstInstrumentBookingLocked,
  illustrationUnlocked: FirstInstrumentBookingUnlocked,
  illustrationUnlockedDetailed: FirstInstrumentBookingUnlockedDetailed,
  illustrationLockedDetailed: FirstInstrumentBookingLockedDetailed,
  category: AchievementCategory.FIRST_BOOKINGS,
}

export const firstArtLessonBooking = {
  id: AchievementId.FIRST_ART_LESSON_BOOKING,
  name: 'Se mettre à la pratique',
  descriptionLocked: 'Réserve ton premier atelier ou cours artistique',
  descriptionUnlocked: 'Tu as réservé ton premier atelier ou cours artistique',
  illustrationLocked: FirstArtLessonBookingLocked,
  illustrationUnlocked: FirstArtLessonBookingUnlocked,
  illustrationUnlockedDetailed: FirstArtLessonBookingUnlockedDetailed,
  illustrationLockedDetailed: FirstArtLessonBookingLockedDetailed,
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
