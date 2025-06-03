useShouldShowCulturalSurveyForBeneficiaryUser
 useShouldShowCulturalSurveyForBeneficiaryUser()
- should return true when feature flag is disabled and user has never seen cultural survey
- should return false when cultural survey feature flag is enabled
- should return false while reading information
- should return false when user has already filled cultural survey
- should return false when user has never seen cultural survey but is not beneficiary
- should return true when user has never seen cultural survey
- should return true when user has seen cultural survey twice
- should return false when user has seen cultural survey more than twice

