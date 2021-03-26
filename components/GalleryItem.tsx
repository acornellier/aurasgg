export const GalleryItem = ({ media }: { media: Aura.Media }) => {
  const { type, src } = media
  if (type === 'video') {
    return <video loop src={src} />
  } else if (src.endsWith('.webm')) {
    return <video autoPlay loop src={src} />
  } else {
    return <img src={src} width={500} height={200} />
  }
}
