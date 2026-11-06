import React, { PropsWithChildren, useId } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { useSearchSuggestionsListbox } from 'features/search/components/SearchSuggestionsListbox/SearchSuggestionsListbox'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { VerticalUl } from 'ui/components/Ul'
import { Typo } from 'ui/theme'
import { setTextSemantic } from 'ui/theme/typographyAttrs/setTextSemantic'

type GroupProps = PropsWithChildren<{ title: string }>

export function SearchSuggestionsGroup({ title, children }: GroupProps) {
  const listbox = useSearchSuggestionsListbox()
  const titleId = useId()

  if (!listbox) {
    return (
      <React.Fragment>
        <Title {...setTextSemantic('h2')}>{title}</Title>
        <StyledVerticalUl accessibilityLabel={title}>{children}</StyledVerticalUl>
      </React.Fragment>
    )
  }

  return (
    <View accessibilityRole={AccessibilityRole.GROUP} aria-labelledby={titleId}>
      <Title id={titleId} role={AccessibilityRole.NONE}>
        {title}
      </Title>
      <Items>{children}</Items>
    </View>
  )
}

type GroupItemProps = PropsWithChildren<{ style?: StyleProp<ViewStyle>; testID?: string }>

export function SearchSuggestionsGroupItem({ style, testID, children }: GroupItemProps) {
  const listbox = useSearchSuggestionsListbox()

  return (
    <View
      style={style}
      testID={testID}
      accessibilityRole={listbox ? undefined : AccessibilityRole.LISTITEM}>
      {children}
    </View>
  )
}

const Title = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const StyledVerticalUl = styled(VerticalUl)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
  overflow: 'visible',
}))

const Items = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))
