import { JSX } from 'preact';
import { ImageElement } from '../Content/contentTypes'; // Adjust this import based on your project structure
import ImageWithLightbox from '../../ImageWithLightBox';

export function renderImage(element: ImageElement, index: number): JSX.Element | null {
  if (element.type !== 'image') return null;

  return (
    <ImageWithLightbox
      key={index}
      url={element.url}
      alt={element.alt}
      title={element.title || ''}
      subtitle={element.subtitle || ''}
    />
  );
}
