import {Link , useLocation, useParams} from 'react-router-dom';
import { useContext } from 'react';
export default function AccountNav() {
    const {pathname} = useLocation();
    let subpage = pathname.split('/')?.[2];
    if (subpage === undefined) {
        subpage = 'my profile';
    }
      function linkclasses(type = null) {
        const isActive = pathname === '/account/' && type === 'my profile';
    let classes = 'inline-flex gap-1 py-2 px-6  rounded-full';
    if (type === subpage) {
      classes += ' bg-blue-400 text-white';
    }
    else{
      classes += ' bg-gray-200 text-white';
    }
    return classes;
  }
    return (
      <nav className="w-full flex justify-center gap-4 mb-8 mt-4">
        <Link className={linkclasses('my profile')} to={'/account/'}>My Profile</Link>
        <Link className={linkclasses('places')} to={'/account/places'}>My Accommodations</Link>
        <Link className={linkclasses('bookings')} to={'/account/bookings'}>My Bookings</Link>
      </nav>
    );
}