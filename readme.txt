start server using 
-> npm run dev
-----------------------------------------------
sync / update trending songs using 
-> node scripts/syncTrendingSongs.js
-----------------------------------------------
search debugsession details
-> http://localhost:3000/debugsession
-----------------------------------------------
itunes rss json reponse 
-> {
    "feed": {
        "author": {},
        "entry": {},
        "updated": {},
        "rights": {},
        "title": {},
        "icon": {},
        "link": [],
        "id": {}
        }
    }
-----------------------------------------------
manage thunder client using
login to test user
-> POST http://localhost:3000/auth/login
    body (form encode)
    email test@gmail.com
    password 123
create a playlist
-> POST http://localhost:3000/api/playlists
    body (json)
    {
        "name": "Favorites1"
    }
add song to playlist
-> POST http://localhost:3000/api/playlists/pl_1770469477280/add/song_itunes_1822015144
    must contain playlistid and song id 
-----------------------------------------------