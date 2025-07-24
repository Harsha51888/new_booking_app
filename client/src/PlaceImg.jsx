import Image from "./Image.jsx";

export default function PlaceImg({ place }) {
  if (!place || (!place.photos && !place.addedPhotos)) {
    return <div className="bg-gray-300 w-full h-full flex items-center justify-center text-gray-500">No image</div>;
  }
  // Use 'photos' if present, else fallback to 'addedPhotos'
  const photosArr = place.photos && place.photos.length > 0 ? place.photos : (place.addedPhotos || []);
  if (!photosArr || photosArr.length === 0) {
    return <div className="bg-gray-300 w-full h-full flex items-center justify-center text-gray-500">No image</div>;
  }
  // Use Image.jsx for proper backend path handling
  return (
    <Image
      src={photosArr[0]}
      alt={place.title || "Place"}
      className="w-full h-full object-cover rounded-lg"
      style={{ aspectRatio: '1/1', minHeight: 0, minWidth: 0 }}
    />
  );
}
