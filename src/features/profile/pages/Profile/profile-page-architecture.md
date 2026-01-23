# Architecture de la page Profile

```mermaid
graph TD
    Profile --> ProfileV1
    Profile --> ProfileV2
    ProfileV2 --> ProfileOnline
    ProfileV2 --> ProfileOffline
    ProfileOnline --> ProfileLoggedOut
    ProfileOnline --> ProfileLoggedIn

    subgraph pages
        Profile
        ProfileV1
        ProfileV2
    end

    subgraph containers
        ProfileOnline
        ProfileOffline
        ProfileLoggedOut
        ProfileLoggedIn
    end
