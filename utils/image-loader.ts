const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/explorando' : '';

export default function imageLoader({ src }: { src: string }) {
  // If the src already starts with http, don't change it
  if (src.startsWith('http')) return src;
  
  // Prepend the basePath to the source
  return `${basePath}${src}`;
}