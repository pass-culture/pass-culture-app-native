import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { StatusFlatList } from 'features/identityCheck/pages/profile/StatusFlatList'
import { useSubmitChangeStatus } from 'features/profile/pages/ChangeStatus/useSubmitChangeStatus'
import { BlurHeader } from 'ui/components/headers/BlurHeader'
import {
  PageHeaderWithoutPlaceholder,
  useGetHeaderHeight,
} from 'ui/components/headers/PageHeaderWithoutPlaceholder'

export const ChangeStatus = () => {
  const { isLoading, control, handleSubmit, selectedStatus, submitStatus } = useSubmitChangeStatus()

  const titleID = uuidv4()
  const headerHeight = useGetHeaderHeight()

  return (
    <React.Fragment>
      <PageHeaderWithoutPlaceholder title="Modifier mon statut" />
      <StatusFlatList
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        selectedStatus={selectedStatus}
        submitStatus={submitStatus}
        titleID={titleID}
        control={control}
        headerHeight={headerHeight}
      />
      <BlurHeader height={headerHeight} />
    </React.Fragment>
  )
}
