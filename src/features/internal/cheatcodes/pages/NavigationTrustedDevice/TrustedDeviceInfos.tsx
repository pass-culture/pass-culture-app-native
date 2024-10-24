import React from 'react'
import styled from 'styled-components/native'

import { CheatcodesHeader } from 'features/internal/cheatcodes/components/CheatcodesHeader'
import { useDeviceInfo } from 'features/trustedDevice/helpers/useDeviceInfo'
import { Spacer, Typo, TypoDS } from 'ui/theme'

export const TrustedDeviceInfos = () => {
  const deviceInfo = useDeviceInfo()

  return (
    <React.Fragment>
      <CheatcodesHeader title="Trusted device infos" />
      <Spacer.Column numberOfSpaces={6} />
      <Container>
        <TypoDS.Title3>Informations du device actuel</TypoDS.Title3>
        <Spacer.Column numberOfSpaces={2} />
        <Data title="Device ID" data={deviceInfo?.deviceId} />
        <Data title="Device Model ou Browser" data={deviceInfo?.source} />
        <Data title="Device OS" data={deviceInfo?.os} />
      </Container>
    </React.Fragment>
  )
}

const Container = styled.View(({ theme }) => ({
  paddingHorizontal: theme.contentPage.marginHorizontal,
}))

type DataProps = {
  title: string
  data?: string | null
}

const Data = ({ title, data }: DataProps) => (
  <React.Fragment>
    <Spacer.Column numberOfSpaces={2} />
    <Typo.ButtonText>{title}</Typo.ButtonText>
    {data ? (
      <Typo.ButtonTextSecondary>{data}</Typo.ButtonTextSecondary>
    ) : (
      <Typo.ButtonTextPrimary>Information non disponible</Typo.ButtonTextPrimary>
    )}
    <Spacer.Column numberOfSpaces={2} />
  </React.Fragment>
)
