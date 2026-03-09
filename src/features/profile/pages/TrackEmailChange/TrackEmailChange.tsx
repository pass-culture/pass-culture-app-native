import React from 'react'

import { TrackEmailChangeContent } from 'features/profile/pages/TrackEmailChange/TrackEmailChangeContent'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const TrackEmailChange = () => (
  <PageWithHeader
    title="Modifier mon e-mail"
    scrollChildren={
      <React.Fragment>
        <Typo.Title3 {...getHeadingAttrs(2)}>Suivi de ton changement d’e-mail</Typo.Title3>
        <TrackEmailChangeContent />
      </React.Fragment>
    }
  />
)
