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
    end

    subgraph components
        LoggedOutHeader
        LoggedInHeader
    end
