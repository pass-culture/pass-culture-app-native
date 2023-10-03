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
        <Typo.Caption>Appareil utilisé&nbsp;: </Typo.Caption> {osAndSource}
        {LINE_BREAK}
        <Typo.Caption>Lieu&nbsp;: </Typo.Caption> {location}
        {LINE_BREAK}
        <Typo.Caption>Date et heure&nbsp;: </Typo.Caption> {loginDate}
      </CaptionRegular>
    }
    icon={Info}
  />
)

const CaptionRegular = styled(Typo.Caption)(({ theme }) => ({
  fontFamily: theme.fontFamily.regular,
}))
