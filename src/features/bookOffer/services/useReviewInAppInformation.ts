import { useEffect, useState } from 'react'

import {
  getFirstTimeReviewHasBeenRequestedDate,
  getTimesReviewHasBeenRequested,
} from 'features/bookOffer/services/utils'
import { storage } from 'libs/storage'

export const useReviewInAppInformation = () => {
  // on stocke dans des states les valeurs récupérées de l'async storage car sinon on a un hook asynchrone
  const [
    firstTimeReviewHasBeenRequestedDateString,
    setFirstTimeReviewHasBeenRequestedDateString,
  ] = useState<string>('')
  const [timesReviewHasBeenRequested, setTimesReviewHasBeenRequested] = useState<number>(0)
  const [shouldReviewBeRequested, setShouldReviewBeRequested] = useState<boolean>(true)

  // Le comportement est KO il faut investiguer pourquoi lorsqu'on arrive une première fois sur la page confirmation
  // timesReviewHasBeenRequested vaut 0 puis 1
  // mais pourquoi lorsqu'on revient une deuxième fois, timesReviewHasBeenRequested vaut de nouveau 0 puis 1
  useEffect(() => {
    // récupérer la valeur du nombre de fois où on a vu la modale et la stocker dans un state
    getTimesReviewHasBeenRequested().then((value) =>
      setTimesReviewHasBeenRequested(value as number)
    )
    // récupérer la valeur de la date où la modale a été affichée la première fois et la stocker dans un state
    getFirstTimeReviewHasBeenRequestedDate().then((value) =>
      setFirstTimeReviewHasBeenRequestedDateString(value as string)
    )

    // si on a bien récupérer des données de l'async storage :
    if (firstTimeReviewHasBeenRequestedDateString && timesReviewHasBeenRequested) {
      // convertir la date où la modale a été affichée la première fois de string en Date
      const firstTimeReviewHasBeenRequestedDate = new Date(
        firstTimeReviewHasBeenRequestedDateString
      )
      // Calculer la date où la modale a été affichée la première fois + 1 an après
      const firstTimeReviewHasBeenRequestedDateOneYearLater = new Date()
      firstTimeReviewHasBeenRequestedDateOneYearLater.setDate(
        firstTimeReviewHasBeenRequestedDate.getDate() + 365
      )
      // Comparer cette date avec la date actuelle => si cela vaut true cela veut dire que
      // la modale a été vu la première fois il y a plus d'un an
      const reviewHasBeenRequestedMoreThanOneYearAgo =
        firstTimeReviewHasBeenRequestedDateOneYearLater.getTime() < Date.now()

      // si on a vu la modale il y a plus d'un an alors :
      if (reviewHasBeenRequestedMoreThanOneYearAgo) {
        // on veut reset à 0 le nombre de fois où on a vu la modale
        // on veut reset à aujourd'hui la date de première fois où on a vu la modale (on recommence un cycle)
        setTimesReviewHasBeenRequested(0)
        storage.saveObject('times_review_has_been_requested', 0)
        storage.saveObject('first_time_review_has_been_requested_date', Date.now().toString())
      }

      // on définit la valeur du boolean shouldReviewBeRequested à true si cela fait moins de 4 fois qu'on a vu la modale
      setShouldReviewBeRequested(timesReviewHasBeenRequested < 4)
    }
  }, [])

  // cette fonction a pour but d'incrémenter la valeur du nombre de fois où on a vu la modale
  // et est appelée après l'affichage de la modale
  const updateInformationWhenReviewHasBeenRequested = (hasReviewBeenRequested: boolean) => {
    if (hasReviewBeenRequested)
      storage.saveObject('times_review_has_been_requested', timesReviewHasBeenRequested + 1)
  }

  return { shouldReviewBeRequested, updateInformationWhenReviewHasBeenRequested } || {}
}
