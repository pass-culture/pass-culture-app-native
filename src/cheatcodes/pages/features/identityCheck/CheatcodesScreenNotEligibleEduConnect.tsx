import React from 'react'

import { NotEligibleEduConnect } from 'features/identityCheck/pages/identification/errors/eduConnect/NotEligibleEduConnect'

export const CheatcodesScreenNotEligibleEduConnect = () => (
  <NotEligibleEduConnect error={new Error('error')} resetErrorBoundary={() => null} />
)
