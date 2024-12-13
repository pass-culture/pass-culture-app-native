import mockDate from 'mockdate'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import {
  ThematicHighlightModule,
  ThematicHighlightModuleProps,
} from 'features/home/components/modules/ThematicHighlightModule'
import { formattedThematicHighlightModule } from 'features/home/fixtures/homepage.fixture'
import { analytics } from 'libs/analytics'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, screen, userEvent } from 'tests/utils'

jest.useFakeTimers()
const CURRENT_DATE = new Date('2020-12-01T00:00:00.000Z')
const PASSED_DATE = new Date('2020-11-30T00:00:00.000Z')
mockDate.set(CURRENT_DATE)

const baseThematicHighlightModule = {
  ...formattedThematicHighlightModule,
  homeEntryId: '6nVZ7vaaOM8qOO7wqduuo1',
}

describe('ThematicHighlightModule', () => {
  beforeAll(() => {
    setFeatureFlags()
  })

  describe('old highlight module', () => {
    it('should render if the ending date is not passed', () => {
      renderThematicHighlightModule({
        index: 0,
        ...baseThematicHighlightModule,
        beginningDate: CURRENT_DATE,
        endingDate: CURRENT_DATE,
      })

      expect(screen.getByText(formattedThematicHighlightModule.title)).toBeOnTheScreen()
    })

    it('should not render if the ending date is passed', () => {
      renderThematicHighlightModule({
        index: 0,
        ...baseThematicHighlightModule,
        beginningDate: PASSED_DATE,
        endingDate: PASSED_DATE,
      })

      expect(screen.queryByText(formattedThematicHighlightModule.title)).not.toBeOnTheScreen()
    })

    it('should log ModuleDisplayedOnHomePage event when seeing the module', () => {
      renderThematicHighlightModule({
        index: 0,
        ...baseThematicHighlightModule,
      })

      expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenNthCalledWith(1, {
        moduleId: '5Z1FGtRGbE3d1Q5oqHMfe9',
        moduleType: 'thematicHighlight',
        index: 0,
        homeEntryId: '6nVZ7vaaOM8qOO7wqduuo1',
      })
    })

    it('should not log ModuleDisplayedOnHomePage event when the module is passed (so not displayed)', () => {
      renderThematicHighlightModule({
        index: 0,
        ...baseThematicHighlightModule,
        beginningDate: PASSED_DATE,
        endingDate: PASSED_DATE,
      })

      expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenCalledTimes(0)
    })

    it('should log HighlightBlockClicked event when pressing', async () => {
      renderThematicHighlightModule({ index: 0, ...baseThematicHighlightModule })
      const thematicHighlightModule = screen.getByText(formattedThematicHighlightModule.title)

      await userEvent.press(thematicHighlightModule)

      expect(analytics.logHighlightBlockClicked).toHaveBeenNthCalledWith(1, {
        moduleId: '5Z1FGtRGbE3d1Q5oqHMfe9',
        entryId: '6nVZ7vaaOM8qOO7wqduuo1',
        toEntryId: '6DCThxvbPFKAo04SVRZtwY',
      })
    })

    it('should navigate when pressing', async () => {
      renderThematicHighlightModule({ index: 0, ...baseThematicHighlightModule })
      const thematicHighlightModule = screen.getByText(formattedThematicHighlightModule.title)

      await userEvent.press(thematicHighlightModule)

      expect(navigate).toHaveBeenNthCalledWith(1, 'ThematicHome', {
        homeId: '6DCThxvbPFKAo04SVRZtwY',
        from: 'highlight_thematic_block',
        moduleId: '5Z1FGtRGbE3d1Q5oqHMfe9',
      })
    })

    it('should not display new version when feature flag is not active', async () => {
      renderThematicHighlightModule({ index: 0, ...baseThematicHighlightModule })

      expect(screen.queryByTestId('new-highlight-module-container')).not.toBeOnTheScreen()
    })
  })

  describe('new highlight module', () => {
    const { id, toThematicHomeEntryId, homeEntryId } = baseThematicHighlightModule

    beforeAll(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_NEW_HIGHLIGHT_THEMATIC_MODULE])
    })

    it('should not display new version when feature flag is active', async () => {
      renderThematicHighlightModule({ index: 0, ...baseThematicHighlightModule })

      expect(screen.getByTestId('new-highlight-module-container')).toBeOnTheScreen()
    })

    it('should log HighlightBlockClicked event when pressing', async () => {
      renderThematicHighlightModule({ index: 0, ...baseThematicHighlightModule })
      const thematicHighlightModule = screen.getByText(baseThematicHighlightModule.title)

      await userEvent.press(thematicHighlightModule)

      expect(analytics.logHighlightBlockClicked).toHaveBeenNthCalledWith(1, {
        moduleId: id,
        entryId: homeEntryId,
        toEntryId: toThematicHomeEntryId,
      })
    })
  })
})

const renderThematicHighlightModule = (props: ThematicHighlightModuleProps) => {
  return render(<ThematicHighlightModule {...props} />)
}
