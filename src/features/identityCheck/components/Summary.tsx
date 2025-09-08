import React, { FC } from 'react'
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
      <BodyContainer gap={6}>
        {filteredData.map((item) => (
          <SummaryItem key={item.title} {...item} />
        ))}
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

const BodyContainer = styled(ViewGap)(({ theme }) => ({
  backgroundColor: theme.designSystem.color.background.subtle,
  paddingHorizontal: getSpacing(6),
  paddingVertical: getSpacing(8),
  borderRadius: theme.designSystem.size.borderRadius.m,
}))
