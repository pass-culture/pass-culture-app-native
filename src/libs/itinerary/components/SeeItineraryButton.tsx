import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { TouchableLinkProps } from 'ui/components/touchableLink/types'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'

interface Props {
  externalNav?: TouchableLinkProps['externalNav']
  onPress?: () => void
}

export function SeeItineraryButton(props: Props) {
  return (
    <Container>
      <TouchableLink
        as={ButtonTertiaryBlack}
        inline
        externalNav={props.externalNav}
        wording={t`Voir l'itinéraire`}
        onPress={props.onPress}
        icon={Icon}
      />
    </Container>
  )
}

const Icon = styled(LocationPointer).attrs(({ theme }) => ({
  color: theme.colors.black,
  accessibilityLabel: t`Nouvelle fenêtre`,
}))``

const Container = styled.View({
  alignItems: 'flex-start',
})
