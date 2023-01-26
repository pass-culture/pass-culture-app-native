import React, { memo } from 'react'

import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'

type Props = {
  titleId: string
  title: string
  onGoBack: () => void
  shouldDisplayBackButton?: boolean
  shouldDisplayCloseButton?: boolean
  onClose?: () => void
}

export const SearchCustomModalHeader = memo(function SearchCustomModalHeader({
  titleId,
  title,
  onGoBack,
  onClose,
  shouldDisplayBackButton,
  shouldDisplayCloseButton,
}: Props) {
  return (
    <PageHeaderSecondary
      titleID={titleId}
      title={title}
      onGoBack={onGoBack}
      testID="pageHeader"
      shouldDisplayBackButton={shouldDisplayBackButton}
      shouldDisplayCloseButton={shouldDisplayCloseButton}
      onClose={onClose}
    />
  )
})
