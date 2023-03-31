import mockDate from 'mockdate'
import React from 'react'

import { ThematicHighlightModule } from 'features/home/components/modules/ThematicHighlightModule'
import { formattedThematicHighlightModule } from 'features/home/fixtures/homepage.fixture'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render, screen } from 'tests/utils'

const CURRENT_DATE = new Date('2020-12-01T00:00:00.000Z')
const PASSED_DATE = new Date('2020-11-30T00:00:00.000Z')
mockDate.set(CURRENT_DATE)

const baseThematicHighlightModule = {
  ...formattedThematicHighlightModule,
  homeEntryId: 'homeEntryId',
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
    expect(screen.queryByText(formattedThematicHighlightModule.title)).toBeTruthy()
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
    expect(screen.queryByText(formattedThematicHighlightModule.title)).toBeNull()
  })

  it('should log ModuleDisplayedOnHomePage event when seeing the module', () => {
    render(<ThematicHighlightModule index={0} {...baseThematicHighlightModule} />)

    expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenNthCalledWith(
      1,
      '5Z1FGtRGbE3d1Q5oqHMfe9',
      'thematicHighlight',
      0,
      '6DCThxvbPFKAo04SVRZtwY'
    )
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
      entryId: 'homeEntryId',
      toEntryId: '6DCThxvbPFKAo04SVRZtwY',
    })
  })
})
