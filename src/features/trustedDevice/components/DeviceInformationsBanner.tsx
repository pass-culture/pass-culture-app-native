import React from 'react'
import styled from 'styled-components/native'

import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { Info } from 'ui/svg/icons/Info'
import { TypoDS } from 'ui/theme'
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
        <TypoDS.BodyAccentXs>Appareil utilisé&nbsp;: </TypoDS.BodyAccentXs> {osAndSource}
        {LINE_BREAK}
        <TypoDS.BodyAccentXs>Lieu&nbsp;: </TypoDS.BodyAccentXs> {location}
        {LINE_BREAK}
        <TypoDS.BodyAccentXs>Date et heure&nbsp;: </TypoDS.BodyAccentXs> {loginDate}
      </CaptionRegular>
    }
    icon={Info}
  />
)

const CaptionRegular = styled(TypoDS.BodyAccentXs)(({ theme }) => ({
  fontFamily: theme.fontFamily.regular,
}))
