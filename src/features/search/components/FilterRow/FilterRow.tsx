import React from 'react'
import styled from 'styled-components/native'

import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ArrowNext as DefaultArrowNext } from 'ui/svg/icons/ArrowNext'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Typo, Spacer } from 'ui/theme'

interface Props {
  icon?: React.FunctionComponent<AccessibleIcon>
  title: string
  description?: string
  captionId?: string
  onPress: VoidFunction
  shouldColorIcon?: boolean
}

export const FilterRow = ({
  icon: Icon,
  title,
  description,
  captionId,
  onPress,
  shouldColorIcon,
}: Props) => {
  const StyledIcon = Icon
    ? styled(Icon).attrs(({ theme }) => ({
        color: shouldColorIcon ? theme.colors.primary : theme.colors.black,
        color2: shouldColorIcon ? theme.colors.secondary : theme.colors.black,
        size: theme.icons.sizes.small,
      }))``
    : undefined

  return (
    <LocationContentContainer
      testID="FilterRow"
      onPress={onPress}
      accessibilityDescribedBy={captionId}>
      {!!StyledIcon && (
        <React.Fragment>
          <StyledIcon />
          <Spacer.Row numberOfSpaces={2} />
        </React.Fragment>
      )}
      <TextContainer>
        <Title numberOfLines={1}>{title}</Title>
        {!!description && <Description numberOfLines={1}>{description}</Description>}
      </TextContainer>
      <Spacer.Flex />

      <ArrowNext accessibilityLabel="Affiner la recherche" />
    </LocationContentContainer>
  )
}

const LocationContentContainer = styledButton(Touchable)({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const TextContainer = styled.View({
  flexDirection: 'column',
  alignItems: 'flex-start',
})

const Title = styled(Typo.ButtonText)({
  flexShrink: 1,
})

const Description = styled(Typo.CaptionNeutralInfo)({
  flexShrink: 1,
})

const ArrowNext = styled(DefaultArrowNext).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
