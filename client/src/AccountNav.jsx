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
  return null;
}