import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { useUtmParams } from 'libs/utm'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'

export const UTMParameters = () => {
  const { gen, campaign, content, source, medium, campaignDate } = useUtmParams()

  return (
    <CheatcodesTemplateScreen title="UTM parameters" flexDirection="column">
      <ViewGap gap={2}>
        <Typo.Body>traffic_gen: {gen}</Typo.Body>
        <Typo.Body>traffic_campaign&nbsp;: {campaign}</Typo.Body>
        <Typo.Body>traffic_content&nbsp;: {content}</Typo.Body>
        <Typo.Body>traffic_medium&nbsp;: {medium}</Typo.Body>
        <Typo.Body>traffic_source&nbsp;: {source}</Typo.Body>
        <Typo.Body>campaign_date&nbsp;: {campaignDate?.toLocaleString()}</Typo.Body>
      </ViewGap>
    </CheatcodesTemplateScreen>
  )
}
