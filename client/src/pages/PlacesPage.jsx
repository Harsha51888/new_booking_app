import { Link } from "react-router-dom";
import AccountNav from "../AccountNav";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import PlaceImg from "../PlaceImg";
import { UserContext } from "../UserContext";

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);
  const { user, ready } = useContext(UserContext);

  useEffect(() => {
    if (ready && user) {
      axios.get('/user-places').then(({ data }) => {
        setPlaces(data);
      });
    }
  }, [ready, user]);
  // Delete handler
  const handleDelete = async (placeId) => {
    if (!window.confirm('Are you sure you want to delete this accommodation?')) return;
    try {
      await axios.delete(`/places/${placeId}`);
      setPlaces(places => places.filter(p => p._id !== placeId));
    } catch (e) {
      alert('Failed to delete.');
    }
  };
  return (
    <div>
        <div className="text-center mt-8">
          <Link className="inline-flex gap-1 bg-blue-400 text-white py-2 px-6 rounded-full hover:bg-blue-500 transition-colors" to={'/account/places/new'}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
            </svg>
            Add new place
          </Link>
        </div>
  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full px-2 sm:px-4 md:px-8">
          {places.length > 0 && places.map(place => (
            <div key={place._id} className="flex flex-col bg-gray-100 p-4 rounded-2xl shadow hover:shadow-lg transition-all duration-200 group w-full h-full">
              <Link to={'/account/places/'+place._id} className="flex flex-col flex-1 min-w-0 w-full h-full">
                <div className="w-full h-48 bg-gray-300 rounded-lg flex items-center justify-center overflow-hidden mb-4">
                  <PlaceImg place={place} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold mb-1 truncate">{place.title}</h2>
                  <p className="text-sm text-gray-700 break-words">{place.description}</p>
                </div>
              </Link>
              <button
                onClick={() => handleDelete(place._id)}
                className="mt-2 px-4 py-2 bg-blue-400 text-white rounded-lg shadow hover:bg-blue-500 transition-all duration-150 opacity-80 group-hover:opacity-100"
                title="Delete accommodation"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
    </div>
  );
}