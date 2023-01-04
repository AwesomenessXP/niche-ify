# niche-ify
Niche-ify your spotify playlists by replacing all your mainstream artists with niche, underground artists in the same genre.

## Notes during development

# 12/20/22
- The most challenging part of this project right now is setting up authentication
- I realize I should be more familiar with REST architecture and how to use axios
- API: includes uri, http verb (GET, POST, DELETE), header, body (the data)
- Spotify authentication requires multiple steps:
    - Choose authorization for long running apps (requests are in Node)
    - 1) 
        - ------------ REQUEST USER CODE  --------------------------
        - request user auth in Node
        - create an endpoint (ex: '/login/') with GET request
        - use query params stated in the docs
        - NOTE: "redirect_uri" param will take you the specified page AFTER auth
        - redirect to 'https://accounts.spotify.com/authorize?' with query params following the uri
        - -------------RESPONSE:------------------------------
        - response will have two query params: code (can be exchanged for access token) and state
    - 2) 
        - ------------ REQUEST ACCESS TOKEN --------------------------
        - here, you exchange auth code for access token
        - make endpoint with POST request
        - body must be encoded with "application/x-www-form-urlencoded"
        - -------------RESPONSE:------------------------------
        - in response body (data in axios): 
            - access_token
            - token_type
            - scope
            - expires_in
            - refresh_token
    - 3) 
        - ------------ REQUEST REFRESH TOKEN -------------------------- 
        - when the user logs in again, either refresh token or keep old one
        - refreshing token is how we get persistence after logging in
        - in response body (data in axios): 
            - access_token
            - token_type
            - scope
            - expires_in
            - refresh_token
- After authentication we need 4 things in localStorage: store the refresh token, access token, and expiration of token, and timestamp for persisting data
- Local storage (React app):
    - 0) use localStorage (stores in key/value pairs)
    - 1) first time user logs in: store access token and refresh token from URL query params
    - 2) store a timestamp (using Date().now) in localStoarge bc tokens expire after an hour
    - 3) before using an access token to make a request to API:
        - check if there is timestamp and access token in localStorage
        - check if token is valid (use difference between Date.now() and timestamp)
        - if access token is valid, use that
        - if access token is expired, use refresh token -> fetch new token from "return_token" in the server -> send token in response -> store token in localStorage

# 12/21/22
- I added logic for requesting data from Spotify's endpoints
- I still struggled using axios, but got the hang of it after the first response
    - authenticating with token is inside custom headers param, NOT auth param in axios!!
    - also remember that axios uses "data" for body, "params" for query requests 
- also implemented routing for each page
- one challenge was "onClick" would *initially* invoke the function inside it
    - to fix this: onClick = (() => someFunc)
    - onClick = (() => someFunc) -> someFunc is a CALLBACK function (calls after onClick is finished)
    - ERROR: onClick = (someFunc) RETURNS the value of a function
- the most challenging part was conditionally routing different components -> used "Navigate to" in else statement when specifing an element in Route component

# 12/30/22
- I finally fixed the bug that I've been dealing with all week!!
- Problem: refreshing the page also resets the component
- Cause: states in React DO NOT persist after refreshing!!
- instead of creating new states for the selected playlist and tracks, 
I saved it in localStorage to persist between sessions
- I also did not add an outlet in the parent component, thus the nested component couldnt be rendered

# 1/4/23
##### Algorithm for Niche-ify!
Contraints: number of API requests made in 30s
For each artistID, check if they HAVE any related artists (greater than 0)
if they have related artists:
outer loop: for every artist in array -> fetch array of related artists - O(n)
- COMPARE current artist with related artists -> save smallest artist
nested loop: compare least popular artist with all related artists - O(n)
----- repeat nested loops until criteria met ----------- O(n)
let criteria = 10k followers
```javascript
for (artists in playlist) { O(n)
    smallest_artist = current artist
    while (smallest_artist > criteria) { O(n)
    //fetch related artists - O(1)
    // compare current artist with smallest_artist - O(1) (max # of related artists is 20)
    //save new smallest current artist
    }
    return smallest artist;
}// for
```

(Greedy method): while the number of followers is less than criteria,
                continue fetching related artist data
Summary:
call API to get how many followers each artist have
find the artist with smallest number of followers
check if the artist meets the criteria (lets say <= 10k)
if no artists meet criteria, return the original artist (array.length = 0)

##### Edge cases to consider with this algorithm:
- [ ] All tracks in the playlist have the same artist
    - will only return *one* track from one related artist
    - needs to diversify playlist with other artists

- [ ] Current artist has no related artist array and/or meets the criteria
    - keep the current artist [ ]
    - find another artist from the same genre that has related artists (this will be another algorithm)

- [ ] Current artist and their related artists DON'T match the criteria
    - find another artist from the same genre

- [ ] Related artist is already in the user's playlist!
    - return the next least popular artist in the related artist array