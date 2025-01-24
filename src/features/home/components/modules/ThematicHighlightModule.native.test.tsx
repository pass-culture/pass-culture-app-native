import mockDate from 'mockdate'
import React from 'react'

import {
  ThematicHighlightModule,
  ThematicHighlightModuleProps,
} from 'features/home/components/modules/ThematicHighlightModule'
import { formattedThematicHighlightModule } from 'features/home/fixtures/homepage.fixture'
import { analytics } from 'libs/analytics'
import { render, screen, userEvent } from 'tests/utils'

jest.useFakeTimers()
const CURRENT_DATE = new Date('2020-12-01T00:00:00.000Z')
mockDate.set(CURRENT_DATE)

const baseThematicHighlightModule = {
  ...formattedThematicHighlightModule,
  homeEntryId: '6nVZ7vaaOM8qOO7wqduuo1',
}

describe('ThematicHighlightModule', () => {
  const { id, toThematicHomeEntryId, homeEntryId } = baseThematicHighlightModule

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

const renderThematicHighlightModule = (props: ThematicHighlightModuleProps) => {
  return render(<ThematicHighlightModule {...props} />)
}
