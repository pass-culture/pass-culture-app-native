import React, { FC } from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { StyledSectionRow } from 'features/profile/components/SectionRowWithPaddingVertical/SectionRowWithPaddingVertical'
import { buildZendeskUrlForDebug } from 'features/profile/helpers/buildZendeskUrl'
import { useDeviceMetrics } from 'features/trustedDevice/helpers/useDeviceMetrics'
import { useVersion } from 'ui/hooks/useVersion'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'

export const BugReportButton: FC = () => {
  const { user } = useAuthContext()
  const version = useVersion()
  const metrics = useDeviceMetrics()
  const url = buildZendeskUrlForDebug({ user, metrics, version })

  return (
    <StyledSectionRow
      key="BugReportButton"
      title="Signaler un bug"
      type="navigable"
      externalNav={{ url }}
      icon={ExternalSite}
    />
  )
}
