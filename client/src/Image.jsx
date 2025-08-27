export default function Image({ src, alt, ...props }) {
  let backend;
  if (window.location.hostname === 'localhost') {
    backend = 'http://localhost:4000';
  } else {
  backend = 'https://new-booking-app.onrender.com';
  }
  let safeSrc = src ? encodeURI(src) : "";
  if (safeSrc && safeSrc.startsWith('/uploads/')) {
    safeSrc = backend + safeSrc;
  }
  return <img src={safeSrc} alt={alt || 'Photo'} {...props} />;
}
