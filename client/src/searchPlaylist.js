import { useEffect, useState } from "react"
import axios from 'axios';
import { UserPlaylist } from "./userPlaylists";
import {ShowOnePlaylist} from './showOnePlaylist'

export const GetUserPlaylists = ({ token }) => {
  const [listOfPlaylists, setListOfPlaylists] = useState([{}]);
  const [playlistTracks, setPlaylistTracks] = useState(null);
  const [playlistName, setPlaylistName] = useState('');

  useEffect(() => {
    axios({
      method: 'get',
      baseURL: 'https://api.spotify.com/v1/me/playlists',
      headers: `Authorization: Bearer ${token}`,
    })
      .then(res => {
        console.log(res.data);
        setListOfPlaylists(res.data.items);
      })
      .catch(err => console.error(err));
  }, [token]);

  return (
    <div>
      {
        !playlistTracks ?
          <UserPlaylist
            listOfPlaylists={listOfPlaylists}
            setPlaylistName={setPlaylistName}
            setPlaylistTracks={setPlaylistTracks}
            token={token} /> : 
          
          <ShowOnePlaylist
            playlistName={playlistName}
            playlistTracks={playlistTracks}/>
      }
    </div>
  )
}