import React, { FC, useState } from 'react'
import { createPortal } from 'react-dom'

import { LiveRegionProps } from 'ui/components/accessibility/liveRegion.types'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'

type Buffers = [string, string]

type State = { buffers: Buffers; announcedId?: string }

const DEFAULT_STATE: State = { buffers: ['', ''] }

// Screen readers only announce a live region that already exists in the DOM when
// its content changes, and they ignore a new content identical to the previous
// one. Alternating between two buffers guarantees every announcement is read,
// including two consecutive identical messages.
export const LiveRegion: FC<LiveRegionProps> = ({ announcement, politeness = 'polite' }) => {
  const [{ buffers, announcedId }, setState] = useState<State>(DEFAULT_STATE)

  // Adjusting state while rendering, as recommended by React when state derives
  // from a prop change: https://react.dev/reference/react/useState
  if (announcement?.message && announcement.id !== announcedId) {
    const { id, message } = announcement
    setState((previousState) => ({
      announcedId: id,
      buffers: previousState.buffers[0] === '' ? [message, ''] : ['', message],
    }))
  }

  const role = politeness === 'assertive' ? 'alert' : 'status'

  // Rendered at the document root so the region is never nested in a subtree
  // that a modal could hide from assistive technologies.
  return createPortal(
    <React.Fragment>
      {buffers.map((buffer, index) => (
        <HiddenAccessibleText
          key={index}
          displayBlock
          role={role}
          accessibilityLiveRegion={politeness}
          accessibilityAtomic>
          {buffer}
        </HiddenAccessibleText>
      ))}
    </React.Fragment>,
    document.body
  )
}
