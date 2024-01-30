import { useState, useEffect } from 'react';

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);

    handleResize();

    // Nettoyer l'écouteur d'événement lors du démontage du composant
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}
