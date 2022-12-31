import { PlaylistTrack } from './playlistTrack';
import { Outlet } from 'react-router-dom';

/**
 * Get user playlists after redirecting from auth
 * @param {string} playlistID 
 * @param {string} playlistName
 * @returns 
 */
export const UserPlaylist = ({
  listOfPlaylists,
  token
  }) => {
  
  return (
    <div>
      <h1>Choose a playlist to niche-ify:</h1>
      {/* display all of the user's playlists */}
      {listOfPlaylists.map(playlist => {
        return ( 
          <div key={playlist.id}>
            <PlaylistTrack
              playlist={playlist}
              token={token}
            />
          </div>
        )
      })}
      <Outlet/>
    </div>
  )
}