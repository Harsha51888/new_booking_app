import { useEffect, useState } from "react";
import axios from "axios";

export default function OwnerBookingsPage() {
  const [activeTab, setActiveTab] = useState('accepted');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("/owner/bookings").then(res => {
      setBookings(res.data);
      setLoading(false);
    }).catch(e => {
      setError("Failed to load bookings");
      setLoading(false);
    });
  }, []);

  const handleStatusChange = (id, status) => {
    axios.post(`/owner/bookings/${id}/status`, { status }).then(res => {
      setBookings(bookings.map(b => b._id === id ? res.data : b));
    });
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
  <div className="max-w-4xl mx-auto p-4 sm:p-8 w-full">
  <h1 className="text-3xl font-bold mb-6">Guest Reservations</h1>
      <div className="flex gap-2 mb-8 justify-center">
        <button
          className={`px-6 py-2 rounded-full font-semibold border transition-colors ${activeTab === 'accepted' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('accepted')}
        >Accepted</button>
        <button
          className={`px-6 py-2 rounded-full font-semibold border transition-colors ${activeTab === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('pending')}
        >Pending</button>
        <button
          className={`px-6 py-2 rounded-full font-semibold border transition-colors ${activeTab === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('rejected')}
        >Rejected</button>
      </div>
      {bookings.length === 0 ? (
        <div className="text-gray-500">No bookings found.</div>
      ) : (
        <div className="space-y-4 w-full">
          {bookings.filter(b => b.status === activeTab).length === 0 ? (
            <div className="text-gray-400 mb-4">No {activeTab} reservations.</div>
          ) : (
            bookings.filter(b => b.status === activeTab).map(booking => (
              <div key={booking._id} className="bg-white rounded-xl shadow p-4 sm:p-6 border w-full">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
                  <div>
                    <div className="font-semibold text-lg">{booking.place?.title || "Unknown Place"}</div>
                    <div className="text-gray-600">Guest: {booking.user?.name || booking.name}</div>
                    <div className="text-gray-600">Phone: {booking.phone || "N/A"}</div>
                    <div className="text-gray-600">Number of guests: {booking.numberOfGuests || 1}</div>
                    <div className="text-gray-600">Check-in: {new Date(booking.checkIn).toLocaleDateString()}</div>
                    <div className="text-gray-600">Check-out: {new Date(booking.checkOut).toLocaleDateString()}</div>
                    <div className="text-gray-600">Amount to be paid: <span className="font-bold text-blue-600">${booking.price || 0}</span></div>
                  </div>
                  {activeTab === 'pending' && (
                    <div className="flex gap-2 mt-4 md:mt-0">
                      <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={() => handleStatusChange(booking._id, "accepted")}>Accept</button>
                      <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={() => handleStatusChange(booking._id, "rejected")}>Reject</button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
