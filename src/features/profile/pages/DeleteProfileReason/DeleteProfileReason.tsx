import React from 'react'
import styled from 'styled-components/native'

import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { BicolorSadFace } from 'ui/svg/icons/BicolorSadFace'
import { getSpacing, Typo } from 'ui/theme'

export function DeleteProfileReason() {
  return (
    <GenericInfoPageWhite
      headerGoBack
      goBackParams={getTabNavConfig('Profile')}
      separateIconFromTitle={false}
      icon={BicolorSadFace}
      titleComponent={Typo.Title2}
      title="Pourquoi&nbsp;?">
      <Content>
        <Typo.ButtonText>Triste de te voir partir&nbsp;!</Typo.ButtonText>
      </Content>
    </GenericInfoPageWhite>
  )
}

const Content = styled.View({
  marginTop: getSpacing(2),
})
