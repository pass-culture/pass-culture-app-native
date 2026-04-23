import React, { FC } from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { StyledSectionRow } from 'features/profile/components/SectionRowWithPaddingVertical/SectionRowWithPaddingVertical'
import { buildZendeskUrlForDebug } from 'features/profile/helpers/buildZendeskUrl'
import { useDeviceInfo } from 'features/trustedDevice/helpers/useDeviceInfo'
import { useVersion } from 'ui/hooks/useVersion'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'

export const BugReportButton: FC = () => {
  const deviceInfo = useDeviceInfo()
  const { user } = useAuthContext()
  const version = useVersion()

  const url = buildZendeskUrlForDebug({ user, deviceInfo, version })

  return (
    <StyledSectionRow
      key="BugReportButton"
      title="Signaler un bug"
      type="clickable"
      externalNav={{ url }}
      icon={ExternalSite}
    />
  )
}
