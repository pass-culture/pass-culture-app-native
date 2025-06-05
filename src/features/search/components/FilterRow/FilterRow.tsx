import React from 'react'
import styled from 'styled-components/native'

import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ArrowNext as DefaultArrowNext } from 'ui/svg/icons/ArrowNext'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Typo, getSpacing } from 'ui/theme'

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
    <TouchableRow testID="FilterRow" onPress={onPress} accessibilityDescribedBy={captionId}>
      {StyledIcon ? (
        <IconContainer>
          <StyledIcon />
        </IconContainer>
      ) : null}
      <TextContainer>
        <TitleAndComplement>
          <Title numberOfLines={2}>{title}</Title>
          {complement ? (
            <ComplementContainer>
              <ComplementLabel numberOfLines={1}>{complement}</ComplementLabel>
            </ComplementContainer>
          ) : null}
        </TitleAndComplement>
        {description ? <Description numberOfLines={1}>{description}</Description> : null}
      </TextContainer>
      <ArrowNext accessibilityLabel="Affiner la recherche" />
    </TouchableRow>
  )
}

const TouchableRow = styledButton(Touchable)({
  flexDirection: 'row',
  alignItems: 'center',
})

const IconContainer = styled.View({
  marginRight: getSpacing(4),
})

const TitleAndComplement = styled.View({
  flexDirection: 'row',
})

const Title = styled(Typo.BodyAccent)({
  flexShrink: 1,
})

const Description = styled(Typo.BodyAccentXs)(({ theme }) => ({
  flexShrink: 1,
  color: theme.colors.greyDark,
}))

const ArrowNext = styled(DefaultArrowNext).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``

const TextContainer = styled.View({
  flex: 1,
  alignItems: 'flex-start',
  marginRight: getSpacing(4),
})

const ComplementContainer = styled.View({
  flexShrink: 0,
  justifyContent: 'center',
  marginLeft: getSpacing(1),
})

const ComplementLabel = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
