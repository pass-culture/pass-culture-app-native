import React, { FunctionComponent } from 'react'
import { styled } from 'styled-components/native'

import { InfoCounter } from 'features/offer/components/InfoCounter/InfoCounter'
import { AdvicesStatus } from 'features/offer/types'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'

type Props = {
  testID: string
  publishedText: string
  unpublishedText: string
  icon: React.ReactNode
  advicesStatus: AdvicesStatus
  onPress: () => void
}

export const OfferAdvicesCounter: FunctionComponent<Props> = ({
  advicesStatus,
  publishedText,
  unpublishedText,
  icon,
  testID,
  onPress,
}) => {
  if (advicesStatus.hasPublished) {
    return (
      <TouchableOpacity onPress={onPress} testID={testID}>
        <AdvicesInfoCounter text={publishedText} icon={icon} />
      </TouchableOpacity>
    )
  }

  if (advicesStatus.hasUnpublished) {
    return <AdvicesInfoCounter text={unpublishedText} icon={icon} />
  }

  return null
}

const AdvicesInfoCounter = styled(InfoCounter).attrs<{ icon: React.ReactNode }>(({ icon }) => ({
  icon,
}))``
