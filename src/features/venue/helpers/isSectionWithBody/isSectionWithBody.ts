import { ReactNode } from 'react'

import { PracticalInformationSection } from 'features/venue/types'

export const isSectionWithBody = (
  section: PracticalInformationSection
): section is PracticalInformationSection & { body: ReactNode } => {
  return section.shouldBeDisplayed && section.body !== null
}
