import { useEffect, useState } from "react"
import axios from 'axios';

export const GetUserPlaylists = ({ token }) => {
  const [listOfPlaylists, setListOfPlaylists] = useState([{}]);
  const [playlistTracks, setPlaylistTracks] = useState(null);

  useEffect(() => {
    axios({
      method: 'get',
      baseURL: 'https://api.spotify.com/v1/me/playlists',
      headers: `Authorization: Bearer ${token}`,
      // params: { limit: 20, offset: 5 },
    })
      .then(response => {
        console.log(response.data.items);
        setListOfPlaylists(response.data.items);
      })
      .catch(err => console.error(err));
  }, []);

  const getPlaylistTracks = (playlistID) => {
    axios({
      method: 'get',
      baseURL: `https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
      headers: `Authorization: Bearer ${token}`,
    })
    .then(response => {
      console.log(response);
    })
    .catch(err => console.error(err));
  }

  return (
    <div>
      <h1>Choose a playlist to niche-ify:</h1>
      {
        listOfPlaylists.map(playlist => {
          return (
            <>
              <div>
                <label key={playlist.id}>{playlist.name}</label>
                <button onClick={() => getPlaylistTracks(playlist.id)}>Pick</button>
                <hr/>
              </div>
            </>
          )
        })
      }
    </div>
  )
}