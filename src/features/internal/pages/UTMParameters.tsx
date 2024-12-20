import React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { useUtmParams } from 'libs/utm'
import { Spacer } from 'ui/theme'

export const UTMParameters = () => {
  const { gen, campaign, content, source, medium, campaignDate } = useUtmParams()

  return (
    <CheatcodesTemplateScreen title="UTM parameters" flexDirection="column">
      <AlignedText>
        <Text>traffic_gen: {gen}</Text>
      </AlignedText>
      <Spacer.Column numberOfSpaces={2} />
      <AlignedText>
        <Text>traffic_campaign: {campaign}</Text>
      </AlignedText>
      <Spacer.Column numberOfSpaces={2} />
      <AlignedText>
        <Text>traffic_content: {content}</Text>
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
    </CheatcodesTemplateScreen>
  )
}

const AlignedText = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})
