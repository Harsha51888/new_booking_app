import {Link, useParams} from "react-router-dom";
import AccountNav from "../AccountNav";
import {useEffect, useState} from "react";
import axios from "axios";
import PlaceImg from "../PlaceImg";
export default function PlacesPage() {
  const [places,setPlaces] = useState([]);
  useEffect(() => {
    axios.get('/user-places').then(({data}) => {
      setPlaces(data);
    });
  }, []);
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
      <AccountNav />
        <div className="text-center">
          <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
            </svg>
            Add new place
          </Link>
        </div>
        <div className="mt-4 flex flex-col gap-6">
          {places.length > 0 && places.map(place => (
            <div key={place._id} className="flex items-center bg-gray-100 p-6 rounded-2xl shadow hover:shadow-lg transition-all duration-200 group">
              <Link to={'/account/places/'+place._id} className="flex items-center flex-1 min-w-0">
                <div className="w-24 h-24 bg-gray-300 rounded-lg flex items-center justify-center overflow-hidden mr-6">
                  <PlaceImg place={place} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold mb-1 truncate">{place.title}</h2>
                  <p className="text-sm text-gray-700 break-words">{place.description}</p>
                </div>
              </Link>
              <button
                onClick={() => handleDelete(place._id)}
                className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-all duration-150 opacity-80 group-hover:opacity-100"
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