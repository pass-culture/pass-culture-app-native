import { ComponentStory } from '@storybook/react'
import React, { ComponentProps } from 'react'

import { IconsContainer as Illustrations } from 'features/internal/cheatcodes/pages/AppComponents/IconsContainer'
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

export default {
  title: 'Fondations/AchievementIllustrations',
  parameters: {
    axe: {
      // Disabled this rule because we use SvgIdentifier for all Illustration linearGradient id
      disabledRules: ['duplicate-id'],
    },
  },
}

const illustrationSets: ComponentProps<typeof Illustrations>[] = [
  {
    title: 'Simple Illustrations',
    icons: {
      FirstArtLessonBookingLocked,
      FirstArtLessonBookingUnlocked,
      FirstBookBookingLocked,
      FirstBookBookingUnlocked,
      FirstInstrumentBookingLocked,
      FirstInstrumentBookingUnlocked,
      FirstLiveMusicBookingLocked,
      FirstLiveMusicBookingUnlocked,
      FirstMovieBookingLocked,
      FirstMovieBookingUnlocked,
      FirstMuseumBookingLocked,
      FirstMuseumBookingUnlocked,
      FirstNewsBookingLocked,
      FirstNewsBookingUnlocked,
      FirstRecordedMusicBookingLocked,
      FirstRecordedMusicBookingUnlocked,
      FirstShowBookingLocked,
      FirstShowBookingUnlocked,
    },
  },
  {
    title: 'Detailed Illustrations',
    icons: {
      FirstArtLessonBookingLockedDetailed,
      FirstArtLessonBookingUnlockedDetailed,
      FirstBookBookingLockedDetailed,
      FirstBookBookingUnlockedDetailed,
      FirstInstrumentBookingLockedDetailed,
      FirstInstrumentBookingUnlockedDetailed,
      FirstLiveMusicBookingLockedDetailed,
      FirstLiveMusicBookingUnlockedDetailed,
      FirstMovieBookingLockedDetailed,
      FirstMovieBookingUnlockedDetailed,
      FirstMuseumBookingLockedDetailed,
      FirstMuseumBookingUnlockedDetailed,
      FirstNewsBookingLockedDetailed,
      FirstNewsBookingUnlockedDetailed,
      FirstRecordedMusicBookingLockedDetailed,
      FirstRecordedMusicBookingUnlockedDetailed,
      FirstShowBookingLockedDetailed,
      FirstShowBookingUnlockedDetailed,
    },
  },
]

const Template: ComponentStory<typeof Illustrations> = () => (
  <React.Fragment>
    {illustrationSets.map((illustration) => (
      <Illustrations
        key={illustration.title}
        title={illustration.title}
        icons={illustration.icons}
        isIllustration
      />
    ))}
  </React.Fragment>
)

export const AllIllustrations = Template.bind({})
AllIllustrations.storyName = 'AchievementIllustrations'
