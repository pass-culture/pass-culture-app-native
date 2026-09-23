import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useEffect } from 'react'

import { AccountState } from 'api/gen'
import { useLogoutRoutine } from 'features/auth/helpers/useLogoutRoutine'
import { FraudulentSuspendedAccount } from 'features/auth/pages/suspendedAccount/FraudulentSuspendedAccount/FraudulentSuspendedAccount'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { useCurrentRoute } from 'features/navigation/helpers/useCurrentRoute'
import { DeleteProfileSuccess } from 'features/profile/pages/DeleteProfile/DeleteProfileSuccess'
import { SuspiciousLoginSuspendedAccount } from 'features/trustedDevice/pages/SuspiciousLoginSuspendedAccount'
import { LoadingPage } from 'ui/pages/LoadingPage'

export const AccountStatusScreenHandler = () => {}
