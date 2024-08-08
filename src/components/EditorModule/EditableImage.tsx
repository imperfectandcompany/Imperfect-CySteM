import { useState } from 'preact/hooks';

interface EditableImageProps {
  url: string;
  alt: string;
  onChange: (newUrl: string, newAlt: string) => void;
}

export const EditableImage = ({ url, alt, onChange }: EditableImageProps) => {
  const [isEditing, setEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState(url);
  const [imageAlt, setImageAlt] = useState(alt);

  return isEditing ? (
    <div className="editable-image">
      {/* Editing inputs for URL and alt text */}
    </div>
  ) : (
    <img src={imageUrl} alt={imageAlt} onClick={() => setEditing(true)} />
  );
};
