import React from 'react'
import styled from 'styled-components/native'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { useDeviceInfo } from 'features/trustedDevice/helpers/useDeviceInfo'
import { Spacer, Typo } from 'ui/theme'

export const CheatcodesScreenTrustedDeviceInfos = () => {
  const deviceInfo = useDeviceInfo()

  return (
    <CheatcodesTemplateScreen title="Trusted device debug infos" flexDirection="column">
      <Typo.Title3>Informations du device actuel</Typo.Title3>
      <Spacer.Column numberOfSpaces={2} />
      <Data title="Device ID" data={deviceInfo?.deviceId} />
      <Data title="Device Model ou Browser" data={deviceInfo?.source} />
      <Data title="Device OS" data={deviceInfo?.os} />
    </CheatcodesTemplateScreen>
  )
}

type DataProps = {
  title: string
  data?: string | null
}

const Data = ({ title, data }: DataProps) => (
  <React.Fragment>
    <Spacer.Column numberOfSpaces={2} />
    <Typo.Button>{title}</Typo.Button>
    {data ? (
      <ButtonTextSecondary>{data}</ButtonTextSecondary>
    ) : (
      <ButtonTextPrimary>Information non disponible</ButtonTextPrimary>
    )}
    <Spacer.Column numberOfSpaces={2} />
  </React.Fragment>
)

const ButtonTextPrimary = styled(Typo.Button)(({ theme }) => ({
  color: theme.colors.primary,
}))

const ButtonTextSecondary = styled(Typo.Button)(({ theme }) => ({
  color: theme.colors.secondary,
}))
