export default function Image({ src, alt, ...props }) {
  const backend = 'http://localhost:4000';
  let safeSrc = src ? encodeURI(src) : "";
  if (safeSrc && safeSrc.startsWith('/uploads/')) {
    safeSrc = backend + safeSrc;
  }
  return <img src={safeSrc} alt={alt || 'Photo'} {...props} />;
}
