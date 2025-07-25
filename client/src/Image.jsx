export default function Image({ src, alt, ...props }) {
  const backend = 'https://mybookingapp-backend.onrender.com';
  let safeSrc = src ? encodeURI(src) : "";
  if (safeSrc && safeSrc.startsWith('/uploads/')) {
    safeSrc = backend + safeSrc;
  }
  return <img src={safeSrc} alt={alt || 'Photo'} {...props} />;
}
