import React, { memo } from 'react'

import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'

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
    <PageHeaderSecondary titleID={titleId} title={title} onGoBack={onGoBack} testID="pageHeader" />
  )
})
