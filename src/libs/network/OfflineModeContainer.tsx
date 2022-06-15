import { t } from '@lingui/macro'
import React, { ReactNode } from 'react'
import styled from 'styled-components/native'

import { useNetInfo } from 'libs/network/useNetInfo'
import { getSpacing, Typo } from 'ui/theme'

export function OfflineModeContainer({ children }: { children: ReactNode }) {
  const netInfo = useNetInfo()
  return (
    <FlexView>
      <FlexView>{children}</FlexView>
      {!netInfo.isConnected && (
        <OfflineModeBanner>
          <OfflineModeBannerText>{t`aucune connexion internet.`}</OfflineModeBannerText>
        </OfflineModeBanner>
      )}
    </FlexView>
  )
}

const FlexView = styled.View({
  flex: 1,
})

const OfflineModeBanner = styled.View(({ theme }) => ({
  backgroundColor: theme.offlineMode.banner.backgroundColor,
  padding: getSpacing(1.5),
  justifyContent: 'center',
  alignItems: 'center',
}))

const OfflineModeBannerText = styled(Typo.Caption)(({ theme }) => ({
  color: theme.offlineMode.banner.textColor,
}))
