# HumIt 🎵
A music discovery web app with:
- Trending songs from iTunes RSS
- User authentication
- Likes & playlists
- MongoDB backend
- Express + Node.js
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
-----------------------------------------------
most of the sources were aquired from sites and research papers
-> https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
-> https://hajim.rochester.edu/ece/sites/zduan/teaching/ece472/projects/2019/AudioFingerprinting.pdf
etc
-----------------------------------------------
"dependencies": {
 "bcryptjs": "^3.0.3",         for encryption
 "dotenv": "^17.2.4",          for security of private keys
 "ejs": "^4.0.1",              for dynamic html
 "express": "^5.2.1",          for server
 "express-session": "^1.19.0", for session handling
 "ffmpeg-static": "^5.3.0",    for audio library
 "fft-js": "^0.0.12",          for fast-fourier transforms
 "fluent-ffmpeg": "^2.1.3",    for wrapping ffmpeg
 "mongoose": "^9.1.6",         for mongodb 
 "multer": "^2.0.2",           for multiple audio tracks
 "node-fetch": "^3.3.2",       to fetch 
 "node-wav": "^0.0.2"          to handle .wav files
},
"devDependencies": {
 "nodemon": "^3.1.11"          to keep the server always active while making changes
}
-----------------------------------------------
start server using 
-> npm run dev
stop server using
-> Ctrl+C
-----------------------------------------------
test account details
-> email:test@gmail.com
-> pass: 123456
sync / update trending songs using 
-> node scripts/syncTrendingSongs.js
-----------------------------------------------
to upload songs to be hashed
-> add mp3 songs into the songs folder
-> update seed songs
-> run generateFingerprints script to generate hashes for the songs in the db
-----------------------------------------------
uploads is a temporary folder that holds the audio recorded in a 
recognition session will be cleared automatically

views holds all the html and ejs files to be displayed

scripts hold the .js files to handle important and sensitive tasks

routes holds the api and route details

public holds the css and js along with assets

models hold the schemas of the Db

middleware holds some script that can be used on demand

.env is a file that holds sensitive info like private keys

server.js is the server itself
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