import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import readlineSync from 'readline-sync';

const userId = 'lglof';
// durations in millis on spotify end
const breakLength = 5 * 60 * 1000;
const focusLength = 25 * 60 * 1000;
const totalSessions = 4;

console.log("Searching Spotify for Lars' playlists...");

const spotify = SpotifyApi.withClientCredentials(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
);

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

console.log(uris)


// make playlist here
const playlistTitle = readlineSync.question('Please name your playlist');
const playlist = await spotify.playlists.createPlaylist(userId, { name: playlistTitle });
console.log(playlist)

// ideally we want a big list now [ 'spotify:track:<uri>', 'spotify:track:<uri>']
// then we can add items to a playlist in bulk
await spotify.playlists.addItemsToPlaylist(playlist.id, uris.toString());

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