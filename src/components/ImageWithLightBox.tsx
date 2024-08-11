import { FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';

interface ImageWithLightboxProps {
  url: string;
  alt: string;
  title: string;
  subtitle: string;
}

const ImageWithLightbox: FunctionalComponent<ImageWithLightboxProps> = ({ url, alt, title, subtitle }) => {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState<string>(title);
  const [lightboxSubtitle, setLightboxSubtitle] = useState<string>(subtitle);
  const [lightboxAlt, setLightboxAlt] = useState<string>(alt);

  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, index * 200);
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightboxImage) {
        closeLightbox();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxImage]);

  const openLightbox = (image: string, title: string, artist: string, alt: string) => {
    setLightboxImage(image);
    setLightboxTitle(title);
    setLightboxSubtitle(artist);
    setLightboxAlt(alt);
    setIsClosing(false);
    setTimeout(() => {
      document.querySelector('.lightbox-title')?.classList.add('visible');
      document.querySelector('.lightbox-artist')?.classList.add('visible');
      document.querySelector('.lightbox-alt')?.classList.add('visible');
    }, 100);
  };

  const closeLightbox = () => {
    setIsClosing(true);
    document.querySelector('.lightbox-title')?.classList.remove('visible');
    document.querySelector('.lightbox-artist')?.classList.remove('visible');
    document.querySelector('.lightbox-alt')?.classList.remove('visible');
    setTimeout(() => {
      setLightboxImage(null);
    }, 300); // Match the duration of the fadeOut animation
  };

  return (
    <main className="mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-end">
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 rounded-lg lg:ml-auto">
        <div className={`event__item max-w-md relative fade-in`}>
          <figure className=" relative transition-transform duration-400 transform-origin-top overflow-hidden rounded-md cursor-pointer" onClick={() => openLightbox(url, title, subtitle, alt)}>
            <img src={url} alt={alt} className="h-48 w-96 object-cover  rounded-md no-select" />
          </figure>
          <div className="event__info flex flex-col justify-end items-start relative">
            <div className="event__title cursor-default">
              <h1 className="text-xs font-normal mb-1 text-white text-left">{title}</h1>
              <h2 className="text-xs text-gray-400 text-left no-select">{subtitle}</h2>
            </div>
          </div>
        </div>
      </section>
      {lightboxImage && (
        <div className={`lightbox ${isClosing ? 'lightbox-animation-out' : 'visible'}`} onClick={closeLightbox} aria-hidden={!lightboxImage}>
          <span className={`lightbox-close ${isClosing ? '' : 'visible'}`} onClick={closeLightbox} style={{ animation: 'fadeIn 0.3s ease-out forwards' }}>&times;</span>
          <div className="text-left w-full px-5 md:px-8 mb-4">
            <h1 className="text-lg md:text-xl font-bold text-white lightbox-title">{lightboxTitle}</h1>
            <h2 className="text-md md:text-lg text-gray-400 no-select lightbox-artist">{lightboxSubtitle}</h2>
          </div>
          <img src={lightboxImage} alt="Enlarged view" className={`lightbox-animation ${isClosing ? 'lightbox-animation-out' : ''} no-select`} onClick={(e) => e.stopPropagation()} onDragStart={(e) => e.preventDefault()} />
          <div className="text-left w-full px-5 md:px-8 mt-4">
            <p className="text-xs md:text-sm text-gray-500 no-select lightbox-alt">{lightboxAlt}</p>
          </div>
        </div>
      )}
    </main>
  );
};

export default ImageWithLightbox;
