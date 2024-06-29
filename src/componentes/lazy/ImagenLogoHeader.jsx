import React, { useState, useEffect } from "react";
import { logos } from '../LOGO';

const imageExists = (url, callback) => {
    const image = new Image();
    image.onload = () => callback(true);
    image.onerror = () => callback(false);
    image.src = url;
};

function ImagenLogoHeader() {
    const [imageSource, setImageSource] = useState(null);

    useEffect(() => {
        logos.some((logo) => imageExists(logo, (exists) => {
            if (exists) {
                setImageSource(logo);
                return true; // Detiene la iteración
            }
            return false;
        }));
    }, []);

    return (
        imageSource ? <img src={imageSource} className="topMenuImg"/> : null
    );
}

export default ImagenLogoHeader;
