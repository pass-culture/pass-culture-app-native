useLoginAndRedirect
 AppsFlyer events
- should log event when account creation is completed
- should log af_underage_user event when user is underage
- should not log af_underage_user event when user is not underage


 useLoginAndRedirect
- should login user
- should redirect to DisableActivation when disableActivation is true
- should redirect to AccountCreated when isEligibleForBeneficiaryUpgrade is false
- should redirect to Verify Eligibility when isEligibleForBeneficiaryUpgrade and user is 18 yo
- should redirect to AccountCreated when not isEligibleForBeneficiaryUpgrade and user is not future eligible
- should redirect to NotYetUnderageEligibility when not isEligibleForBeneficiaryUpgrade and user is future eligible
- should redirect to AccountCreated on error

