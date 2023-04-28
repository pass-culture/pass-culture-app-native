import React from 'react'
import styled from 'styled-components/native'

import { useDeviceInfos } from 'features/profile/helpers/TrustedDevices/useDeviceInfos'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { Spacer, Typo } from 'ui/theme'

export const TrustedDevice = () => {
  const { deviceId, deviceModel, deviceOS } = useDeviceInfos()

  return (
    <React.Fragment>
      <PageHeaderSecondary title="Spike appareil de confiance" />
      <Spacer.Column numberOfSpaces={6} />
      <Container>
        <Typo.Title3>useDeviceInfos()</Typo.Title3>
        <Spacer.Column numberOfSpaces={2} />
        <Data title="Device ID" data={deviceId} />
        <Data title="Device Model" data={deviceModel} />
        <Data title="Device OS" data={deviceOS} />
      </Container>
    </React.Fragment>
  )
}

const Container = styled.View(({ theme }) => ({
  paddingHorizontal: theme.contentPage.marginHorizontal,
}))

type DataProps = {
  title: string
  data: string
}

const Data = ({ title, data }: DataProps) => (
  <React.Fragment>
    <Spacer.Column numberOfSpaces={2} />
    <Typo.ButtonText>{title} </Typo.ButtonText>
    <Typo.ButtonTextPrimary>{data}</Typo.ButtonTextPrimary>
    <Spacer.Column numberOfSpaces={2} />
  </React.Fragment>
)
