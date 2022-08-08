import React from 'react'

import { SectionWithSwitch } from 'features/profile/components/SectionWithSwitch/SectionWithSwitch'
import { render } from 'tests/utils'

const title = 'Partager ma position'

describe('<SectionWithSwitch/>', () => {
  it('should display different if isDesktopViewport or with toggleLabel', () => {
    const renderWithDefaultMobileViewport = render(<SectionWithSwitch title={title} />)

    const renderWithDesktopViewport = render(<SectionWithSwitch title={title} />, {
      theme: { isDesktopViewport: true, isMobileViewport: false },
    })

    expect(renderWithDesktopViewport).toMatchDiffSnapshot(renderWithDefaultMobileViewport)

    const renderWithDesktopViewportWithToggleLabel = render(
      <SectionWithSwitch title={title} toggleLabel="Partager ma position" />,
      {
        theme: { isDesktopViewport: true, isMobileViewport: false },
      }
    )

    expect(renderWithDesktopViewport).toMatchDiffSnapshot(renderWithDesktopViewportWithToggleLabel)
  })
})
