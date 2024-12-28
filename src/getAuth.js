var client_id = process.env.CLIENT_ID;
var redirect_uri = process.env.REDIRECT_URI;

var scope = 'playlist-read-private playlist-modify-public';

export function getAuthUrl() {
    var url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(client_id);
    url += '&scope=' + encodeURIComponent(scope);
    url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
    
    return url
}

export function formatToken(token) {
    const urlParams = new URLSearchParams(token);
    const params = Object.fromEntries(urlParams);
    return params;
}