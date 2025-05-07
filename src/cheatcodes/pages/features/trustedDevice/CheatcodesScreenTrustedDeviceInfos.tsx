import React from 'react'
import styled from 'styled-components/native'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { useDeviceInfo } from 'features/trustedDevice/helpers/useDeviceInfo'
import { Typo, getSpacing } from 'ui/theme'

export const CheatcodesScreenTrustedDeviceInfos = () => {
  const deviceInfo = useDeviceInfo()

  return (
    <CheatcodesTemplateScreen title="Trusted device debug infos" flexDirection="column">
      <StyledTitle3>Informations du device actuel</StyledTitle3>
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
  <DataContainer>
    <Typo.Button>{title}</Typo.Button>
    {data ? (
      <ButtonTextSecondary>{data}</ButtonTextSecondary>
    ) : (
      <ButtonTextPrimary>Information non disponible</ButtonTextPrimary>
    )}
  </DataContainer>
)

const StyledTitle3 = styled(Typo.Title3)({
  marginBottom: getSpacing(2),
})

const DataContainer = styled.View({
  marginVertical: getSpacing(2),
})

const ButtonTextPrimary = styled(Typo.Button)(({ theme }) => ({
  color: theme.colors.primary,
}))

const ButtonTextSecondary = styled(Typo.Button)(({ theme }) => ({
  color: theme.colors.secondary,
}))
