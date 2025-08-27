import AccountNav from "../AccountNav";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import PlaceImg from "../PlaceImg";
import { Link, useNavigate } from "react-router-dom";
import BookingDates from "../BookingDates";
import { UserContext } from "../UserContext";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const { user, ready } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (ready) {
      if (!user) {
        navigate('/login');
      } else {
        axios.get('/bookings').then(response => {
          setBookings(response.data);
        });
      }
    }
  }, [ready, user, navigate]);
  return (
  <div className="w-full min-h-screen bg-gray-100 pb-10 px-2 sm:px-4 md:px-8">
  <div className="max-w-5xl mx-auto mt-6 grid grid-cols-1 sm:grid-cols-2 gap-8 px-0 sm:px-2">
        {bookings?.length > 0 && bookings.filter(booking => booking.place).map(booking => (
          <Link
            to={`/account/bookings/${booking._id}`}
            className="flex flex-col md:flex-row bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-200 overflow-hidden group border border-gray-200"
            key={booking._id}
          >
            <div className="md:w-48 w-full h-48 md:h-auto flex-shrink-0">
              <PlaceImg place={booking.place} />
            </div>
            <div className="flex-1 flex flex-col justify-between p-6 min-w-0">
              <div>
                <h2 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-blue-500 transition-colors break-words line-clamp-2 min-h-[2.5rem]">
                  {booking.place ? booking.place.title : 'No place info'}
                </h2>
                <BookingDates booking={booking} className="mb-2 mt-2 text-gray-500" />
              </div>
              <div className="flex items-center gap-2 mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-blue-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
                <span className="text-lg font-semibold text-gray-700">
                  Total price: <span className="text-2xl text-blue-500 font-bold">${booking.price}</span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}