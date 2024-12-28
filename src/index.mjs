import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import readlineSync from 'readline-sync';
import { getAuthUrl, formatToken } from "./getAuth.js";

const userId = process.env.USER_ID;
// durations in millis on spotify end
const breakLength = 5 * 60 * 1000;
const focusLength = 25 * 60 * 1000;
const totalSessions = 4;

const authUrl = getAuthUrl();

console.log(`Auth url will be: ${authUrl}`);
const rawToken = readlineSync.question('paste in the query params for the resulting url: ');

const formattedToken = formatToken(rawToken);

const spotify = SpotifyApi.withAccessToken(process.env.CLIENT_ID, formattedToken)

const {items: playlists} = await spotify.playlists.getUsersPlaylists(userId);

const focusListIndex = readlineSync.keyInSelect(playlists.map(i => i.name), 'Choose your focus playlist')

const breakListIndex = readlineSync.keyInSelect(playlists.map(i => i.name), 'And your break playlist')

console.log(`focus playlist is "${playlists[focusListIndex].name}", and break playlist "${playlists[breakListIndex].name}"`)

const {items: focusListItems} = await spotify.playlists.getPlaylistItems(playlists[focusListIndex].id);
const {items: breakListItems} = await spotify.playlists.getPlaylistItems(playlists[breakListIndex].id);

let uris = [];

for (let session = 0; session < totalSessions; session++) {
    // making focus set
    let focusSet = createPlaylistChunk(focusListItems, focusLength);
    uris.push(...focusSet);

    // making break set
    let breakSet = createPlaylistChunk(breakListItems, breakLength);
    uris.push(...breakSet);
}

// make playlist here
const playlistTitle = readlineSync.question('Please name your playlist');
const playlist = await spotify.playlists.createPlaylist(userId, { name: playlistTitle });

await spotify.playlists.addItemsToPlaylist(playlist.id, uris);

process.exit(0);

function createPlaylistChunk(tracks, duration) {
    let chunkDuration = 0;
    let chunkTracks = [];

    do {
        let {track} = tracks[Math.floor(Math.random() * tracks.length)];
        chunkDuration += track.duration_ms;
        chunkTracks.push(`${track.uri}`)
    } while(chunkDuration < duration)
    return chunkTracks;
}