import React, { FunctionComponent } from 'react'
import { styled } from 'styled-components/native'

import { GenericBanner } from 'ui/components/ModuleBanner/GenericBanner'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { AISearch } from 'ui/svg/icons/AISearch'
import { Typo } from 'ui/theme'

type Props = {
  onPress: () => void
}

export const AIFakeDoorBanner: FunctionComponent<Props> = ({ onPress }) => {
  return (
    <Touchable
      accessibilityLabel="Accéder au questionnaire sur l’IA pass Culture"
      onPress={onPress}>
      <GenericBanner LeftIcon={<AISearch />}>
        <ViewGap gap={1}>
          <Typo.BodyAccent>Besoin d’inspiration&nbsp;?</Typo.BodyAccent>
          <SubtitleText>Utilise notre IA pass Culture</SubtitleText>
        </ViewGap>
      </GenericBanner>
    </Touchable>
  )
}

const SubtitleText = styled(Typo.BodyS)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
