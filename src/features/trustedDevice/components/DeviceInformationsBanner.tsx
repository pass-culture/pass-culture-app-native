import React from 'react'
import styled from 'styled-components/native'

import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { Info } from 'ui/svg/icons/Info'
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
}) => (
  <InfoBanner
    message={
      <CaptionRegular>
        <Typo.BodyAccentXs>Appareil utilisé&nbsp;: </Typo.BodyAccentXs> {osAndSource}
        {LINE_BREAK}
        <Typo.BodyAccentXs>Lieu&nbsp;: </Typo.BodyAccentXs> {location}
        {LINE_BREAK}
        <Typo.BodyAccentXs>Date et heure&nbsp;: </Typo.BodyAccentXs> {loginDate}
      </CaptionRegular>
    }
    icon={Info}
  />
)

const CaptionRegular = styled(Typo.BodyAccentXs)(({ theme }) => ({
  fontFamily: theme.fontFamily.regular,
}))
