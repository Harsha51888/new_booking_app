import Image from "./Image.jsx";
import { useState } from "react";

export default function PlaceGallery({ place }) {
  const [showAll, setShowAll] = useState(false);
  if (!place || !place.photos || place.photos.length === 0) {
    return <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center">No images available</div>;
  }

  if (showAll) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-8 overflow-auto">
        <button
          onClick={() => setShowAll(false)}
          className="mb-4 px-6 py-2 bg-white rounded-lg shadow text-black font-semibold hover:bg-gray-200"
        >
          Close photos
        </button>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full max-w-5xl">
          {place.photos.map((photo, idx) => (
            <Image
              key={photo + '-' + idx}
              src={photo}
              alt={place.title || `Photo ${idx+1}`}
              className="object-cover w-full rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  // Show up to 3 images in the main view
  const previewPhotos = place.photos.slice(0, 3);

  return (
    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-2 rounded-xl overflow-hidden mb-4">
      {previewPhotos.map((photo, idx) => (
        <div key={photo + '-' + idx} className="aspect-[4/3] w-full overflow-hidden flex items-center justify-center bg-gray-100 rounded-lg">
          <Image
            src={photo}
            alt={place.title || `Photo ${idx+1}`}
            className="object-cover w-full h-full rounded-lg"
            style={{aspectRatio:'4/3', width:'100%', height:'100%', objectFit:'cover'}}
          />
        </div>
      ))}
      {place.photos.length > 3 && (
        <button
          onClick={() => setShowAll(true)}
          className="absolute bottom-4 right-4 px-4 py-2 bg-white bg-opacity-90 rounded-lg shadow text-black font-semibold hover:bg-gray-200"
        >
          Show more photos
        </button>
      )}
    </div>
  );
}
