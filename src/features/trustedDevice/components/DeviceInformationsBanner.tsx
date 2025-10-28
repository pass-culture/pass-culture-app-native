import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { Typo } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'

type DeviceInformationsBanner = {
  location: string
  osAndSource: string
  loginDate: string
}

export const DeviceInformationsBanner: React.FC<DeviceInformationsBanner> = ({
  osAndSource,
  location,
  loginDate,
}) => {
  const { designSystem, icons } = useTheme()
  return (
    <Container>
      <InfoPlain color={designSystem.color.icon.brandSecondary} size={icons.sizes.small} />
      <CaptionRegular>
        <Typo.BodyAccentS>Appareil utilisé&nbsp;: </Typo.BodyAccentS> {osAndSource}
        {LINE_BREAK}
        <Typo.BodyAccentS>Lieu&nbsp;: </Typo.BodyAccentS> {location}
        {LINE_BREAK}
        <Typo.BodyAccentS>Date et heure&nbsp;: </Typo.BodyAccentS> {loginDate}
      </CaptionRegular>
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  width: '100%',
  flexDirection: 'row',
  backgroundColor: theme.designSystem.color.background.info,
  borderRadius: theme.designSystem.size.borderRadius.m,
  padding: theme.designSystem.size.spacing.l,
  gap: theme.designSystem.size.spacing.s,
}))

const CaptionRegular = styled(Typo.BodyAccentS)(({ theme }) => ({
  fontFamily: theme.fontFamily.regular,
}))
