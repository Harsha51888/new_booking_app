import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AddressLink from "../AddressLink";
import Image from "../Image";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../BookingDates";

export default function BookingPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  useEffect(() => {
    if (id) {
      axios.get('/bookings').then(response => {
        const foundBooking = response.data.find(({ _id }) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);
  if (!booking || !booking.place) {
    return (
      <div className="my-10 max-w-6xl mx-auto px-4 text-center text-red-500 text-xl font-semibold">
        Accommodation not found. It may have been deleted.
      </div>
    );
  }

  const statusColors = {
    pending: 'text-yellow-500',
    accepted: 'text-green-600',
    rejected: 'text-red-500',
  };

  return (
  <div className="my-10 max-w-6xl mx-auto px-2 sm:px-4">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">{booking.place.title}</h1>
      <div className="mb-6">
        <span className={`inline-block px-4 py-2 rounded-full font-semibold bg-gray-100 border ${statusColors[booking.status]}`}>Status: {booking.status}</span>
      </div>
  <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        {/* Left: Gallery */}
        <div className="lg:w-1/2 w-full flex flex-col">
          {/* Extra Info Section Below Images */}
          <div className="mt-6 bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row gap-8 items-center justify-between border border-gray-100">
            <div className="flex flex-col items-center w-full md:w-1/2">
              <div className="mb-4 w-40 h-40 rounded-xl overflow-hidden flex items-center justify-center bg-gray-100">
                <div className="w-full h-full flex items-center justify-center">
                  {/* Use custom Image component for correct backend URL logic */}
                  <Image
                    src={booking.place.photos && booking.place.photos.length > 0 ? booking.place.photos[0] : ''}
                    alt="Place"
                    className="object-cover w-full h-full rounded-xl"
                  />
                </div>
              </div>
              <div className="mt-2 text-lg font-semibold text-gray-700">Number of People</div>
              <span className="text-3xl font-extrabold text-blue-500 mt-1">{booking.numberOfGuests || booking.place.maxGuests || 1}</span>
            </div>
            <div className="flex flex-col items-center w-full md:w-1/2">
              <span className="text-lg font-semibold text-gray-700 mb-1">Perks</span>
              <ul className="text-gray-600 text-base list-disc list-inside">
                {booking.place.perks && booking.place.perks.length > 0 ? (
                  booking.place.perks.map((perk, idx) => (
                    <li key={idx}>{perk}</li>
                  ))
                ) : (
                  <li>No perks listed</li>
                )}
              </ul>
            </div>
          </div>
        </div>
        {/* Right: Description, Address, Booking Info */}
        <div className="lg:w-1/2 w-full flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <AddressLink className="block text-lg text-blue-500 font-medium mb-2" style={{textDecoration:'underline'}}>{booking.place.address}</AddressLink>
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">Description</h2>
            <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line mb-2">{booking.place.description}</div>
          </div>
          <div className="bg-gradient-to-br from-primary to-pink-400 p-8 rounded-3xl flex flex-col items-center shadow-lg border border-gray-100">
            <h2 className="text-2xl mb-4 font-semibold text-white drop-shadow">Your booking information</h2>
            <BookingDates booking={booking} />
            <div className="bg-white p-6 rounded-2xl mt-8 w-full text-center shadow">
              <div className="text-gray-600 font-medium">Total price</div>
              <div className="text-3xl font-bold text-blue-500">${booking.price}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
