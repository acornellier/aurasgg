const style = {
  maxWidth: 'fit-content',
  maxHeight: '200px',
}

export const GalleryItem = ({ media }: { media: Aura.Media }) => {
  const { type, src } = media
  if (type === 'video') {
    return <iframe src={src} style={style} />
  } else if (src.endsWith('.webm')) {
    return <video autoPlay loop src={src} style={style} />
  } else {
    return <img src={src} width='100%' style={style} />
  }
}
