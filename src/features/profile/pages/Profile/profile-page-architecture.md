# Architecture de la page Profile

```mermaid
graph TD
    Profile --> ProfileV1
    Profile --> ProfileV2

    ProfileV2 --> ProfileOnline
    ProfileV2 --> ProfileOffline

    ProfileOnline --> ProfileLoggedOut
    ProfileOnline --> ProfileLoggedIn

    ProfileLoggedIn --> LoggedInContent
    ProfileLoggedIn --> LoggedInHeader

    LoggedInHeader --> LoggedInExBeneficiaryHeader
    LoggedInHeader --> LoggedInGeneralPublicHeader
    LoggedInHeader --> LoggedInEligibleHeader
    LoggedInHeader --> LoggedInBeneficiaryHeader

    LoggedInEligibleHeader === EligibleFreeHeader
    EligibleFreeHeader === EligibleHeader

    LoggedInBeneficiaryHeader === BeneficiaryFreeHeader
    BeneficiaryFreeHeader === BeneficiaryHeader
    BeneficiaryHeader === BeneficiaryEmptyHeader

    LoggedInContent --> LoggedInBeneficiaryContent
    LoggedInContent --> LoggedInNonBeneficiaryContent

    ProfileLoggedOut --> LoggedOutHeader
    ProfileLoggedOut --> LoggedOutContent

    subgraph pages
        Profile
        ProfileV1
        ProfileV2
    end

    subgraph containers
        ProfileOnline
        ProfileOffline
        ProfileLoggedIn
        ProfileLoggedOut
        LoggedOutContent
        LoggedInContent
        LoggedInBeneficiaryContent
        LoggedInNonBeneficiaryContent
        LoggedOutHeader
        LoggedInHeader
        LoggedInGeneralPublicHeader
        LoggedInEligibleHeader
        LoggedInBeneficiaryHeader
        LoggedInExBeneficiaryHeader
        EligibleHeader
        EligibleFreeHeader
        BeneficiaryEmptyHeader
        BeneficiaryHeader
        BeneficiaryFreeHeader
    end
