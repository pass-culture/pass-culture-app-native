import React from 'react'
import styled from 'styled-components/native'

import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ArrowNext as DefaultArrowNext } from 'ui/svg/icons/ArrowNext'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Typo, Spacer, getSpacing } from 'ui/theme'

interface Props {
  icon?: React.FunctionComponent<AccessibleIcon>
  title: string
  description?: string
  captionId?: string
  onPress: VoidFunction
  shouldColorIcon?: boolean
  complement?: string
}

export const FilterRow = ({
  icon: Icon,
  title,
  description,
  captionId,
  onPress,
  shouldColorIcon,
  complement,
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
        <TitleAndDescriptionContainer>
          <Title numberOfLines={1}>{title}</Title>
          {!!description && <Description numberOfLines={1}>{description}</Description>}
        </TitleAndDescriptionContainer>
        {!!complement && (
          <ComplementContainer>
            <ComplementLabel numberOfLines={1}>{complement}</ComplementLabel>
          </ComplementContainer>
        )}
      </TextContainer>

      <ArrowNext accessibilityLabel="Affiner la recherche" />
    </LocationContentContainer>
  )
}

const LocationContentContainer = styledButton(Touchable)({
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
})

const TextContainer = styled.View({
  flexDirection: 'row',
  flex: 1,
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

const TitleAndDescriptionContainer = styled.View(({ theme }) => ({
  flex: theme.isMobileViewport ? 0.7 : undefined,
  alignItems: 'flex-start',
}))

const ComplementContainer = styled.View({
  flex: 0.3,
  justifyContent: 'center',
})

const ComplementLabel = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
  marginLeft: getSpacing(1),
}))
