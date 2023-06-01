import React from 'react'
import styled from 'styled-components/native'

import { useDeviceInfo } from 'features/trustedDevice/helpers/useDeviceInfo'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { Spacer, Typo } from 'ui/theme'

export const TrustedDevice = () => {
  const deviceInfo = useDeviceInfo()

  return (
    <React.Fragment>
      <PageHeaderSecondary title="Appareil de confiance" />
      <Spacer.Column numberOfSpaces={6} />
      <Container>
        <Typo.Title3>Informations du device actuel</Typo.Title3>
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
