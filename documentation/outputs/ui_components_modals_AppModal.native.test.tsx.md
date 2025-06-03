AppModal
 with long title
- on 2 lines by default
- on 1 line


 with scroll
- enabled by default
- explicitly enabled
- disabled


 with backdrop
- enabled by default
- explicitly enabled
- disabled


 with left icon
- render
- should call the callback when clicking on left icon


 with right icon
- render
- should call the callback when clicking on right icon


 backdrop callback
- should be the given prop by default
- should be the left icon callback prop when no given backdrop press
- should be the right icon callback prop when no given backdrop press nor left icon callback
- should do nothing when no given backdrop press nor left nor right icon callback


 should adapt when virtual keyboard is
- displayed
- hidden


 adapt modal's height
- should have a default height
- should adapt to the content's height
- should adapt to the header's height
- should display a custom modal header if specified
- should display a fixed modal bottom if specified


 Spacer between header and content
- should display it
- should not display it


 <AppModal />
- with minimal props
- should hide the modal when set to hidden
- without children
- without title
- on big screen
- on small screen
- should display fullscreen modal scroll view when isFullscreen = true and scrollEnabled = true
- should not display fullscreen modal scroll view when isFullscreen = true and scrollEnabled = false
- should display fullscreen modal view when isFullscreen = true and scrollEnabled = false
- should not display fullscreen modal view when isFullscreen = true and scrollEnabled = true

