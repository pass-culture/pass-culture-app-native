import mockDate from 'mockdate'
import React from 'react'

import { ThematicHighlightModule } from 'features/home/components/modules/ThematicHighlightModule'
import { formattedThematicHighlightModule } from 'features/home/fixtures/homepage.fixture'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render, screen } from 'tests/utils'

const CURRENT_DATE = new Date('2020-12-01T00:00:00.000Z')
const PASSED_DATE = new Date('2020-11-30T00:00:00.000Z')
mockDate.set(CURRENT_DATE)

describe('ThematicHighlightModule', () => {
  it('should render if the ending date is not passed', () => {
    render(
      <ThematicHighlightModule
        {...formattedThematicHighlightModule}
        beginningDate={CURRENT_DATE}
        endingDate={CURRENT_DATE}
      />
    )
    expect(screen.queryByText(formattedThematicHighlightModule.title)).toBeTruthy()
  })

  it('should not render if the ending date is passed', () => {
    render(
      <ThematicHighlightModule
        {...formattedThematicHighlightModule}
        beginningDate={PASSED_DATE}
        endingDate={PASSED_DATE}
      />
    )
    expect(screen.queryByText(formattedThematicHighlightModule.title)).toBeNull()
  })

  it('should log HighlightBlockClicked event when pressing', () => {
    render(<ThematicHighlightModule {...formattedThematicHighlightModule} />)
    const thematicHighlightModule = screen.getByText(formattedThematicHighlightModule.title)

    fireEvent.press(thematicHighlightModule)

    expect(analytics.logHighlightBlockClicked).toHaveBeenCalledTimes(1)
  })
})
