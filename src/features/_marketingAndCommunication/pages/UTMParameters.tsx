import React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { useUtmParams } from 'libs/utm'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { getSpacing, Spacer } from 'ui/theme'

export const UTMParameters = () => {
  const { campaign, source, medium, campaignDate } = useUtmParams()

  return (
    <React.Fragment>
      <PageHeader title="UTM parameters" />
      <Spacer.TopScreen />
      <Spacer.Column numberOfSpaces={15} />
      <Container>
        <AlignedText>
          <Text>traffic_campaign: {campaign}</Text>
        </AlignedText>
        <Spacer.Column numberOfSpaces={2} />
        <AlignedText>
          <Text>traffic_medium: {medium}</Text>
        </AlignedText>
        <Spacer.Column numberOfSpaces={2} />
        <AlignedText>
          <Text>traffic_source: {source}</Text>
        </AlignedText>
        <Spacer.Column numberOfSpaces={2} />
        <AlignedText>
          <Text>campaign_date: {campaignDate?.toLocaleString()}</Text>
        </AlignedText>
      </Container>
    </React.Fragment>
  )
}

const Container = styled.View({
  paddingHorizontal: getSpacing(5),
})

const AlignedText = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})
