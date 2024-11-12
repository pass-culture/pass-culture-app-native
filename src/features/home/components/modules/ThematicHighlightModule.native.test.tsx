import mockDate from 'mockdate'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { ThematicHighlightModule } from 'features/home/components/modules/ThematicHighlightModule'
import { formattedThematicHighlightModule } from 'features/home/fixtures/homepage.fixture'
import { analytics } from 'libs/analytics'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { act, fireEvent, render, screen } from 'tests/utils'

const CURRENT_DATE = new Date('2020-12-01T00:00:00.000Z')
const PASSED_DATE = new Date('2020-11-30T00:00:00.000Z')
mockDate.set(CURRENT_DATE)

const mockUseFeatureFlag = jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

const baseThematicHighlightModule = {
  ...formattedThematicHighlightModule,
  homeEntryId: '6nVZ7vaaOM8qOO7wqduuo1',
}

describe('ThematicHighlightModule', () => {
  it('should render if the ending date is not passed', () => {
    render(
      <ThematicHighlightModule
        index={0}
        {...baseThematicHighlightModule}
        beginningDate={CURRENT_DATE}
        endingDate={CURRENT_DATE}
      />
    )

    expect(screen.getByText(formattedThematicHighlightModule.title)).toBeOnTheScreen()
  })

  it('should not render if the ending date is passed', () => {
    render(
      <ThematicHighlightModule
        index={0}
        {...baseThematicHighlightModule}
        beginningDate={PASSED_DATE}
        endingDate={PASSED_DATE}
      />
    )

    expect(screen.queryByText(formattedThematicHighlightModule.title)).not.toBeOnTheScreen()
  })

  it('should log ModuleDisplayedOnHomePage event when seeing the module', () => {
    render(<ThematicHighlightModule index={0} {...baseThematicHighlightModule} />)

    expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenNthCalledWith(1, {
      moduleId: '5Z1FGtRGbE3d1Q5oqHMfe9',
      moduleType: 'thematicHighlight',
      index: 0,
      homeEntryId: '6nVZ7vaaOM8qOO7wqduuo1',
    })
  })

  it('should not log ModuleDisplayedOnHomePage event when the module is passed (so not displayed)', () => {
    render(
      <ThematicHighlightModule
        index={0}
        {...baseThematicHighlightModule}
        beginningDate={PASSED_DATE}
        endingDate={PASSED_DATE}
      />
    )

    expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenCalledTimes(0)
  })

  it('should log HighlightBlockClicked event when pressing', () => {
    render(<ThematicHighlightModule index={0} {...baseThematicHighlightModule} />)
    const thematicHighlightModule = screen.getByText(formattedThematicHighlightModule.title)

    fireEvent.press(thematicHighlightModule)

    expect(analytics.logHighlightBlockClicked).toHaveBeenNthCalledWith(1, {
      moduleId: '5Z1FGtRGbE3d1Q5oqHMfe9',
      entryId: '6nVZ7vaaOM8qOO7wqduuo1',
      toEntryId: '6DCThxvbPFKAo04SVRZtwY',
    })
  })

  it('should navigate when pressing', async () => {
    render(<ThematicHighlightModule index={0} {...baseThematicHighlightModule} />)
    const thematicHighlightModule = screen.getByText(formattedThematicHighlightModule.title)

    await act(async () => {
      fireEvent.press(thematicHighlightModule)
    })

    expect(navigate).toHaveBeenNthCalledWith(1, 'ThematicHome', {
      homeId: '6DCThxvbPFKAo04SVRZtwY',
      from: 'highlight_thematic_block',
      moduleId: '5Z1FGtRGbE3d1Q5oqHMfe9',
    })
  })

  it('should not display new version when feature flag is active', async () => {
    mockUseFeatureFlag.mockReturnValueOnce(true)
    render(<ThematicHighlightModule index={0} {...baseThematicHighlightModule} />)

    expect(screen.getByTestId('new-highlight-module-container')).toBeOnTheScreen()
  })

  it('should not display new version when feature flag is not active', async () => {
    render(<ThematicHighlightModule index={0} {...baseThematicHighlightModule} />)

    expect(screen.queryByTestId('new-highlight-module-container')).not.toBeOnTheScreen()
  })
})
