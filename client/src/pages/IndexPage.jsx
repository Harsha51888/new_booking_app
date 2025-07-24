import {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import Image from "../Image.jsx";

export default function IndexPage() {
  const [places,setPlaces] = useState([]);
  useEffect(() => {
    axios.get('/places').then(response => {
      setPlaces(response.data);
    });
  }, []);
  return (
    <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full">
      {places.length > 0 && places.map(place => (
        <Link to={'/place/'+place._id} key={place._id} className="block w-full h-full">
          <div className="bg-gray-200 mb-2 rounded-2xl flex items-center justify-center aspect-square w-full h-64 overflow-hidden">
            {place.photos?.[0] && (
              <Image className="w-full h-full object-cover rounded-2xl transition-transform duration-200 group-hover:scale-105" src={place.photos?.[0]} alt=""/>
            )}
          </div>
          <h2 className="font-bold truncate">{place.address}</h2>
          <h3 className="text-sm text-gray-500 truncate">{place.title}</h3>
          <div className="mt-1">
            <span className="font-bold">${place.price}</span> per night
          </div>
        </Link>
      ))}
    </div>
  );
}
