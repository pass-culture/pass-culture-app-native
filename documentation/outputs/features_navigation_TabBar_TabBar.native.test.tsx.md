TabBar
 TabBar
- render correctly when FF is enabled
- should display the 5 following tabs with Home selected
- should display the 5 following tabs with Bookings selected
- displays only one selected at a time
- should navigate again to Profil tab on click Profil tab icon when Profil tab is already selected
- should navigate again to Home tab on click Home tab icon when Home tab is already selected
- should reset Search navigation params when clicked on selected Search tab
- should reset Search accessibility navigation params when clicked on selected Search tab
- navigates to Profile on Profile tab click
- should call navigate with searchState params on press "Recherche"
- should not reset locationFilter on press "Recherche"
- should return `SearchLanding` when there is less than 1 route in routes state
- should return last visited route when there is more than 1 route in routes state

