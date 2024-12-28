## Auth
Ok so I absolutely did not want to have to run a server to get the callbacks for auth working.
Thus auth is done...semi manually

What do you have to do? 

We'll provide you a url, you copy / paste that into your browser, do the auth step, and then copy / paste back _everything_ after 'access token' (including 'access token') in the resulting url. 


## What env vars do you need?
This is largely related to actual provided by spotify values:
https://developer.spotify.com/documentation/web-api/tutorials/getting-started

```
CLIENT_ID=<from spotify>
REDIRECT_URI=<you have to input this into spotify. I don't think the value _really_ matters>
USER_ID=<your spotify user id>
```