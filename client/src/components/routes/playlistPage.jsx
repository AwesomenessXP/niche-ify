import { GetUserPlaylists } from './searchPlaylist';
import { logout } from '../auth/spotify';
import { useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

/**
 * 
 * @param {string} token is used for accessing spotify endpoints
 * @returns component that displays after auth
 */
export const PlaylistPage = ({ token }) => {
  return (
    <div>
      <Routes>
        <Route path='*' element={<GetUserPlaylists token={token}
        />} />
      </Routes>
      <button onClick ={logout}>Log Out</button>
    </div>
  )
}