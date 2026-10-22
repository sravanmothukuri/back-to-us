export const photo = (file) => `${import.meta.env.BASE_URL}photos/${file}`;

// Resolve a stored photo reference: uploaded data URLs and full URLs pass
// through, bare file names point into public/photos.
export const photoSrc = (src) =>
  /^(data:|https?:|\/)/.test(src) ? src : photo(src);
