import mockDate from 'mockdate'
import React from 'react'

import { ThematicHighlightModule } from 'features/home/components/modules/ThematicHighlightModule'
import { formattedThematicHighlightModule } from 'features/home/fixtures/homepage.fixture'
import { render } from 'tests/utils'

const CURRENT_DATE = new Date('2020-12-01T00:00:00.000Z')
const PASSED_DATE = new Date('2020-11-30T00:00:00.000Z')
mockDate.set(CURRENT_DATE)

describe('ThematicHighlightModule', () => {
  it('should render if the ending date is not passed', () => {
    const { queryAllByText } = render(
      <ThematicHighlightModule
        {...formattedThematicHighlightModule}
        beginningDate={CURRENT_DATE}
        endingDate={CURRENT_DATE}
      />
    )
    expect(queryAllByText(formattedThematicHighlightModule.title)).toBeTruthy()
  })

  it('should not render if the ending date is passed', () => {
    const { queryByText } = render(
      <ThematicHighlightModule
        {...formattedThematicHighlightModule}
        beginningDate={PASSED_DATE}
        endingDate={PASSED_DATE}
      />
    )
    expect(queryByText(formattedThematicHighlightModule.title)).toBeNull()
  })
})
