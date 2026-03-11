start server using 
-> npm run dev
stop server using
-> Ctrl+C
-----------------------------------------------
test account details
-> email:test@gmail.com
-> pass: 123456
-----------------------------------------------
why mongoDB istead of A RDBMS?
1.Array Fields in Playlists
    query as such would access a single collection istead of 2 tables + some joins
2.Inconsitent Song Schema 
    some songs have all data some have incomplete data, mongoDB has optioanl Fields
    to solve this issue rather than leaving nullable columns in RDBMS
3.Nested Objects
    has native support for mongoDB, Instead of creating new tables or making new columns
    or storing as json which would defeat RDBMS purpose
4.Fingerprinting storage
    Sharding is built in, horizontal scaling.
5.Rapid Prototyping
    Schema changes are zero-downtime just add Fields, RDBMS would need migrations
6.Single-Document Queries 
    MongoDB matches my model perfectly. RDBMS would force me to artificially normalize things, 
    adding complexity and losing performance.
-------------------------------------------------------------------------------------------
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
    password 123456
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