import React, { FC } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing, Typo } from 'ui/theme'
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

type InfoListItemProps = {
  title: string
  value?: string | null
  testID?: string
}

export const Summary: FC<{ title: string; data: InfoListItemProps[] }> = ({ data, title }) => {
  const filteredData = data.filter(({ value }) => !!value)

  return (
    <ViewGap gap={5}>
      <AccessibleTitle3>{title}</AccessibleTitle3>
      <BodyContainer>
        <FlatList
          data={filteredData}
          contentContainerStyle={{ gap: getSpacing(6) }}
          renderItem={({ item }) => <SummaryItem {...item} />}
        />
      </BodyContainer>
    </ViewGap>
  )
}

const SummaryItem: FC<InfoListItemProps> = ({ testID, title, value }) => {
  return (
    <ViewGap gap={1}>
      <Typo.BodyXs>{title}</Typo.BodyXs>
      <Typo.BodyAccent testID={testID} {...getNoHeadingAttrs()}>
        {value}
      </Typo.BodyAccent>
    </ViewGap>
  )
}

const AccessibleTitle3 = styled(Typo.Title3).attrs(getNoHeadingAttrs())``

const BodyContainer = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.greyLight,
  paddingHorizontal: getSpacing(6),
  paddingVertical: getSpacing(8),
  borderRadius: theme.borderRadius.radius,
}))
