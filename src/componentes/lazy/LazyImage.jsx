import React, { useEffect, useState } from 'react';

function LazyImage({ src, alt }) {
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setImageSrc(src);
  }, [src]);

  return (
    <>{imageSrc ? <img src={imageSrc} alt={alt} /> : <div className='divCargando'>Cargando...</div>}</>
  );
}

export default LazyImage;