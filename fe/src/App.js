import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import { useState, useRef, useEffect } from 'react';

import axios, * as others from 'axios';

function App() {
    const [artists, setArtists] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [lyrics, setLyrics] = useState([])
    const [theme, setTheme] = useState('light');
    const toggleTheme = () => {
        if (theme === 'light') {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    };
    useEffect(() => {
        axios.get("http://127.0.0.1:8000//api/v1/artist")
            .then((resp) => {
                setArtists(resp.data.artists);
                setTracks([])
                setLyrics([])
                document.body.className = theme;

            });
    }, [], [theme]);



    function onClickHandlerTracks(e) {
        e.preventDefault();
        const artistId = e.currentTarget.getAttribute('artist_id');
        axios.get(`http://127.0.0.1:8000/api/v1/artist/${artistId}`)
            .then((resp) => {
                setTracks(resp.data.tracks);
                setLyrics([])
                const allArtists = document.querySelectorAll('.artists-col li');
            allArtists.forEach((artist) => {
                if (artist.querySelector('a').getAttribute('artist_id') === artistId) {
                    artist.classList.add('active');
                } else {
                    artist.classList.remove('active');
                }

            });
        });
    }
    function onClickHandlerLyrics(e) {
        e.preventDefault()
        const trackId = e.currentTarget.getAttribute('track_id')

        axios.get(`http://127.0.0.1:8000/api/v1/song/${trackId}`)
            .then((resp) => {
                setLyrics([resp.data])
                console.log(resp.data)
                const allTracks = document.querySelectorAll('.tracks-col li');
                allTracks.forEach((track) => {
                    if (track.querySelector('a').getAttribute('track_id') === trackId) {
                        track.classList.add('active');
                    } else {
                        track.classList.remove('active');
                    }
                }); 
            })
    }
    const handleInitDB = () => {
        axios.post('http://localhost:8000/api/v1/initdb')
            .then((response) => {
                console.log(response);
                autoReloadPage();
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleCrawl = () => {
        alert("Please wait while we crawl the data. This may take some time.");
        setTimeout(() => {
            window.location.reload();
        }, 80000);
        axios.post('http://localhost:8000/api/v1/crawl')
            .then((response) => {
                console.log(response);
                setArtists(response.data.artists);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    // Function to display alert box with message to wait for 60 seconds and reload the page
    const autoReloadPage = () => {
        
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    };

    return (
        <div className={`App ${theme}`}>
            <div>
                <button onClick={toggleTheme} className="btn-primary">Toggle Theme</button>
                <button onClick={handleInitDB}>Clear Screen</button>
                <button onClick={handleCrawl}>Fetch Data</button>
            </div>
            <div className="row">

                <div className="col artists-col">
                    <h2> Artists </h2>
                    <ul>
                        {artists.map(((artist, idx) => <li key={`artist${artist.id}`}>
                            <a
                                href={`http://127.0.0.1:8000/api/v1/artist/${artist.id}`}
                                onClick={onClickHandlerTracks}
                                artist_id={artist.id}
                            ><h5>{artist.name}</h5>
                            </a>
                        </li>))}
                    </ul>
                </div>
                <div className="col tracks-lyrics-col">
                    <div className="tracks-col">
                        <h2 className='artist_track'> Tracks </h2>
                        <ul>
                            {tracks.map(((track, idx) => <li key={`track${track.id}`}>
                                <a
                                    href={`http://127.0.0.1:8000/api/v1/song/${track.id}`}
                                    onClick={onClickHandlerLyrics}
                                    track_id={track.id}
                                ><h5>{track.name}</h5>
                                </a>
                            </li>))}
                        </ul>
                    </div>
                    <div className="lyrics-col">

                        <h2> Lyrics </h2>
                        {lyrics.map(((lyric, idx) =>
                            <div key={idx}>
                                <div><h2>{lyric.name}</h2></div>
                                <div style={{ whiteSpace: 'pre-line' }}><i>{lyric.lyrics}</i></div>
                            </div>))}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
