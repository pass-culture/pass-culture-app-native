import React, { memo } from 'react'

import { PageHeader } from 'ui/components/headers/PageHeader'

type Props = {
  titleId: string
  title: string
  onGoBack: () => void
}

export const SearchCustomModalHeader = memo(function SearchCustomModalHeader({
  titleId,
  title,
  onGoBack,
}: Props) {
  return (
    <PageHeader
      titleID={titleId}
      title={title}
      background="primary"
      withGoBackButton
      onGoBack={onGoBack}
      testID="pageHeader"
    />
  )
})
