import { FC } from 'react'

import { LiveRegionProps } from 'ui/components/accessibility/liveRegion.types'

// On native, status messages are announced imperatively with
// AccessibilityInfo.announceForAccessibility. Rendering a live region here would
// make TalkBack announce the same message twice.
export const LiveRegion: FC<LiveRegionProps> = () => null
