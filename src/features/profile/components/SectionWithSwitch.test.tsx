import React from 'react'

import { SectionWithSwitch } from 'features/profile/components/SectionWithSwitch'
import { render } from 'tests/utils'

const accessibilityLabel = 'Interrupteur de géolocalisation'
const title = 'Partager ma position'

describe('<SectionWithSwitch/>', () => {
  it('should display different if isDesktopViewport or with toggleLabel', () => {
    const renderWithDefaultMobileViewport = render(
      <SectionWithSwitch accessibilityLabel={accessibilityLabel} title={title} />
    )

    const renderWithDesktopViewport = render(
      <SectionWithSwitch accessibilityLabel={accessibilityLabel} title={title} />,
      {
        theme: { isDesktopViewport: true, isMobileViewport: false },
      }
    )

    expect(renderWithDesktopViewport).toMatchDiffSnapshot(renderWithDefaultMobileViewport)

    const renderWithDesktopViewportWithToggleLabel = render(
      <SectionWithSwitch
        accessibilityLabel={accessibilityLabel}
        title={title}
        toggleLabel="Partager ma position"
      />,
      {
        theme: { isDesktopViewport: true, isMobileViewport: false },
      }
    )

    expect(renderWithDesktopViewport).toMatchDiffSnapshot(renderWithDesktopViewportWithToggleLabel)
  })
})
