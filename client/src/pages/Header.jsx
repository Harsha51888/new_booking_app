import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../UserContext';

export default function Header() {
    const { user, setUser } = useContext(UserContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    function handleLogout(e) {
        e.stopPropagation();
        let backend;
        if (window.location.hostname === 'localhost') {
            backend = 'http://localhost:4000';
        } else {
            backend = 'https://mybookingapp-backend.onrender.com';
        }
        fetch(backend + '/logout', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(res => {
            if (!res.ok) throw new Error('Logout failed');
            setUser(null);
            setShowDropdown(false);
            navigate('/login');
        })
        .catch(err => {
            alert('Logout failed. Please try again.');
        });
    }
    return(
    <header className="relative flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-blue-600 to-teal-400 py-4 px-4 md:px-8 shadow-lg min-h-[80px] md:min-h-[100px] fixed top-0 left-0 w-full z-50">
            <Link to="/" className="font-extrabold text-4xl text-white tracking-wide hover:underline">StayEZ</Link>
            <nav className="flex flex-wrap gap-2 md:gap-4 items-center justify-center w-full md:w-auto mt-2 md:mt-0">
                <Link to="/account/bookings" className="rounded-full bg-white/80 px-6 py-2 text-lg font-semibold text-gray-800 shadow hover:bg-white/90 transition flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    My Bookings
                </Link>
                <Link to="/account/places" className="rounded-full bg-white/80 px-6 py-2 text-lg font-semibold text-gray-800 shadow hover:bg-white/90 transition flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                    </svg>
                    My Accommodations
                </Link>
                <Link to="/account/owner-bookings" className="rounded-full bg-white/80 px-6 py-2 text-lg font-semibold text-gray-800 shadow hover:bg-white/90 transition flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 6.75h15m-15 4.5h15m-15 4.5h15" />
                    </svg>
                    Guest Reservations
                </Link>
            </nav>
            <div className="relative ml-4">
                <button
                    onClick={() => {
                        if (!user) {
                            navigate('/login');
                        } else {
                            setShowDropdown(v => !v);
                        }
                    }}
                    className="flex items-center gap-2 border-2 border-teal-200 rounded-xl py-2 px-5 bg-white/80 hover:bg-blue-100 transition"
                    style={{ cursor: 'pointer' }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-gray-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                    <div className="bg-gray-200 text-gray-600 rounded-full border border-gray-300 overflow-hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 relative top-1">
                            <path fillRule="evenodd" d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12zm0 1.5c-2.485 0-7.5 1.243-7.5 3.75V21h15v-3.75c0-2.507-5.015-3.75-7.5-3.75z" clipRule="evenodd" />
                        </svg>
                    </div>
                    {!!user && (
                        <span className="text-blue-700 font-bold">
                            {user.name}
                        </span>
                    )}
                </button>
                {showDropdown && user && (
                    <div className="absolute right-0 mt-2 w-36 rounded-xl bg-white border border-gray-200 shadow-xl z-50 p-2 flex flex-col items-stretch">
                        <button
                            onClick={handleLogout}
                            className="block w-full text-center px-4 py-2 rounded-lg font-semibold transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            style={{letterSpacing: '0.02em'}}
                        >
                            Log out
                        </button>
                    </div>
                )}
            </div>
        </header>
    )
}