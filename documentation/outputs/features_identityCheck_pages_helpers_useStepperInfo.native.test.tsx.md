useStepperInfo
 identification step
- should default return "SelectIDOrigin"


 phone validation step
- should have firstScreen to "SetPhoneNumberWitoutValidation" when backend feature flag is disabled
- should return "PhoneValidationTooManySMSSent" if no remaining attempts left
- should not include only PhoneValidationTooManySMSSent if remaining attempts left


 confirmation step
- should have firstScreen to "IdentityCheckHonor" when feature flag FF enableCulturalSurveyMandatory is disabled
- should have firstScreen to "IdentityCheckHonor" when feature flag FF enableCulturalSurveyMandatory is enabled but user doesn’t needsToFillCulturalSurvey
- should have firstScreen to "CulturalSurveyIntro" when feature flag FF enableCulturalSurveyMandatory is enabled and user needsToFillCulturalSurvey


 useStepperInfo
- should return title and subtitle
- should return 3 steps if there is no phone validation step
- should return 4 steps when useGetStepperInfo returns 4 steps

