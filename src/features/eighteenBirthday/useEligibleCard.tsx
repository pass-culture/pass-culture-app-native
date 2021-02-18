import { useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'

import { useUserProfileInfo } from 'features/home/api'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { storage } from 'libs/storage'

export const useEligibleCard = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { data: profile } = useUserProfileInfo()

  useEffect(() => {
    if (!profile) {
      return
    }
    storage.readObject('has_seen_eligible_card').then((hasSeenEligibleCard) => {
      if (hasSeenEligibleCard) {
        return
      }
      if (profile.showEligibleCard) {
        storage.saveObject('has_seen_eligible_card', true)
        navigate('EighteenBirthday')
      }
    })
  }, [profile?.showEligibleCard])
}
