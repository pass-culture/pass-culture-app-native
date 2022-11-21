import { number, object, string } from 'yup'

// It already exists in `LocationModal.tsx` but when I import it, it's `undefined`...
enum RadioButtonLocation {
  EVERYWHERE = 'Partout',
  AROUND_ME = 'Autour de moi',
  CHOOSE_PLACE_OR_VENUE = 'Choisir un lieu',
}

export const locationSchema = object().shape({
  locationChoice: string()
    .oneOf(Object.values(RadioButtonLocation))
    .required('La méthode de localisation est obligatoire.'),
  aroundRadius: number()
    .min(0)
    .max(100)
    .when('locationChoice', {
      is: (locationChoice: RadioButtonLocation) => locationChoice === RadioButtonLocation.AROUND_ME,
      then: (schema) => schema.required('Le rayon est obligatoire'),
      otherwise: (schema) => schema.optional(),
    }),
  selectedPlaceOrVenue: object().when('locationChoice', {
    is: (locationChoice: RadioButtonLocation) =>
      locationChoice === RadioButtonLocation.CHOOSE_PLACE_OR_VENUE,
    then: (schema) => schema.required('Vous devez sélectionner une adresse ou un lieu.'),
    otherwise: (schema) => schema.optional(),
  }),
})
