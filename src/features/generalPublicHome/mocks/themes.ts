import { Theme } from 'features/generalPublicHome/types'
import { Cinema } from 'ui/svg/icons/venueAndCategories/Cinema'
import { Festival } from 'ui/svg/icons/venueAndCategories/Festival'
import { Museum } from 'ui/svg/icons/venueAndCategories/Museum'
import { Theater } from 'ui/svg/icons/venueAndCategories/Theater'

// Hardcoded until themes get their own data source
export const THEMES: Theme[] = [
  { id: 'shows', label: 'Spectacles', Icon: Theater, categories: ['Spectacles'] },
  {
    id: 'outings',
    label: 'Sorties',
    Icon: Festival,
    categories: ['Concerts et festivals', 'Conférences et rencontres', 'Arts et loisirs créatifs'],
  },
  { id: 'visits', label: 'Visites', Icon: Museum, categories: ['Musées et visites'] },
  { id: 'cinema', label: 'Cinéma', Icon: Cinema, categories: ['Cinéma'] },
]
