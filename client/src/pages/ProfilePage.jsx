import { useContext, useState } from 'react';
import { UserContext } from '../UserContext.jsx';
import { Link, Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AccountNav from '../AccountNav.jsx';
import PlacesPage from './PlacesPage.jsx';

export default function ProfilePage() {
  const [redirect, setRedirect] = useState(null);
  const { ready, user, setUser } = useContext(UserContext);
  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = 'my profile';
  }

  async function logout() {
    await axios.post('/logout');
    setUser(null);
    setRedirect('/');
  }

  if (!ready) {
    return 'Loading...';
  }
  if (redirect) {
    return <Navigate to={redirect} />;
  }
  if (ready && !user) {
    return <Navigate to={'/login'} />;
  }



  return (
    <div>
      <AccountNav />
      {(subpage === 'my profile') && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name} ({user.email})<br />
          <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
        </div>
      )}
      {subpage === 'places' && (
        <PlacesPage />
      )}
          
    </div>
  );
}