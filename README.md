# niche-ify
Niche-ify your spotify playlists by replacing all your mainstream artists with niche, underground artists in the same genre.

## Authenticating Spotify app

##### 12/20/22
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
        - check if token is valid (use difference between now and timestamp)
        - if access token is valid, use that
        - if access token is expired, use refresh token -> fetch new token from "return_token" in the server -> send token in response -> store token in localStorage


