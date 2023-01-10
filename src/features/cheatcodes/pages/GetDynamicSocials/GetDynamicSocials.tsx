import React, { FunctionComponent, useState } from 'react'
import { Linking } from 'react-native'
import styled from 'styled-components/native'

import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { getSpacing, Spacer, Typo } from 'ui/theme'

interface Props {
  children?: never
}

export const GetDynamicSocials: FunctionComponent<Props> = () => {
  const [instagramText, setInstagramText] = useState('Does not have Instagram')
  const [snapchatText, setSnapchatText] = useState('Does not have Snapchat')
  const [tiktokText, setTiktokText] = useState('Does not have Tiktok')
  const [whatsappText, setWhatsappText] = useState('Does not have Whatsapp')
  Linking.canOpenURL('instagram://user?username=passcultureofficiel')
    .then((supported) => {
      if (supported) {
        setInstagramText('Has instagram')
      }
    })
    .catch((error) => {
      throw new Error(error)
    })
  Linking.canOpenURL('snapchat://')
    .then((supported) => {
      if (supported) {
        setWhatsappText('Has Snapchat')
      }
    })
    .catch((error) => {
      throw new Error(error)
    })
  Linking.canOpenURL('tiktok://')
    .then((supported) => {
      if (supported) {
        setSnapchatText('Has Tiktok')
      }
    })
    .catch((error) => {
      throw new Error(error)
    })
  Linking.canOpenURL('whatsapp://')
    .then((supported) => {
      if (supported) {
        setTiktokText('Has Whatsapp')
      }
    })
    .catch((error) => {
      throw new Error(error)
    })

  return (
    <React.Fragment>
      <PageHeaderSecondary title="Spike réseaux sociaux dynamiques" />
      <Container>
        <Typo.Title2>{instagramText}</Typo.Title2>
        <Spacer.Column numberOfSpaces={2} />
        <Typo.Title2>{snapchatText}</Typo.Title2>
        <Spacer.Column numberOfSpaces={2} />
        <Typo.Title2>{tiktokText}</Typo.Title2>
        <Spacer.Column numberOfSpaces={2} />
        <Typo.Title2>{whatsappText}</Typo.Title2>
      </Container>
    </React.Fragment>
  )
}

const Container = styled.View({
  padding: getSpacing(2),
})
