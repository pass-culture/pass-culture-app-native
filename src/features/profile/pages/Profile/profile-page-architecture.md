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
    end

    subgraph components
        contents
        Header
    end

    subgraph contents
        LoggedOutContent
        LoggedInContent
        LoggedInBeneficiaryContent
        LoggedInNonBeneficiaryContent
    end

    subgraph Header
        LoggedOutHeader
    end