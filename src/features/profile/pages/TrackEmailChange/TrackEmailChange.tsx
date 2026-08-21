import React from 'react'

import { TrackEmailChangeContent } from 'features/profile/pages/TrackEmailChange/TrackEmailChangeContent'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Typo } from 'ui/theme'
import { setTextSemantic } from 'ui/theme/typographyAttrs/setTextSemantic'

export const TrackEmailChange = () => (
  <PageWithHeader
    shouldLimitWidth
    title="Modifier mon e-mail"
    scrollChildren={
      <React.Fragment>
        <Typo.Title3 {...setTextSemantic('h2')}>Suivi de ton changement d’e-mail</Typo.Title3>
        <TrackEmailChangeContent />
      </React.Fragment>
    }
  />
)
