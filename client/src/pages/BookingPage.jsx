import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../BookingDates";

export default function BookingPage() {
  const {id} = useParams();
  const [booking,setBooking] = useState(null);
  useEffect(() => {
    if (id) {
      axios.get('/bookings').then(response => {
        const foundBooking = response.data.find(({_id}) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);

  if (!booking) {
    return '';
  }

  return (
    <div className="my-10 max-w-6xl mx-auto px-4">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">{booking.place.title}</h1>
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left: Gallery */}
        <div className="lg:w-1/2 w-full flex flex-col">
          <div className="w-full">
            <PlaceGallery place={booking.place} className="aspect-[4/3] object-cover rounded-2xl w-full h-auto max-h-[340px]" style={{objectFit:'cover', aspectRatio:'4/3', borderRadius:'1rem', width:'100%', height:'auto', maxHeight:'340px'}} />
          </div>
          {/* Extra Info Section Below Images */}
          <div className="mt-6 bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row gap-8 items-center justify-between border border-gray-100">
            <div className="flex flex-col items-center">
              <span className="text-lg font-semibold text-gray-700 mb-1">Guests</span>
              <span className="text-2xl font-bold text-primary">{booking.place.maxGuests || booking.guests || 1}</span>
            </div>
            <div className="flex flex-col items-center">
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
            {/* You can add more info blocks here if needed */}
          </div>
        </div>
        {/* Right: Description, Address, Booking Info */}
        <div className="lg:w-1/2 w-full flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <AddressLink className="block text-lg text-primary font-medium mb-2" style={{textDecoration:'underline'}}>{booking.place.address}</AddressLink>
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">Description</h2>
            <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line mb-2">{booking.place.description}</div>
          </div>
          <div className="bg-gradient-to-br from-primary to-pink-400 p-8 rounded-3xl flex flex-col items-center shadow-lg border border-gray-100">
            <h2 className="text-2xl mb-4 font-semibold text-white drop-shadow">Your booking information</h2>
            <BookingDates booking={booking} />
            <div className="bg-white p-6 rounded-2xl mt-8 w-full text-center shadow">
              <div className="text-gray-600 font-medium">Total price</div>
              <div className="text-3xl font-bold text-primary">${booking.price}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}