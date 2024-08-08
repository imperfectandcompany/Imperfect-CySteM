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
  
    function handleDoubleClick() {
      setEditing(true);
    }
  
    function handleBlur() {
      if (imageUrl.trim() === "") {
        setImageUrl(url);
      }
      if (imageAlt.trim() === "") {
        setImageAlt(alt);
      }
      setEditing(false);
      onChange(imageUrl, imageAlt);
    }
  
    if (isEditing) {
      return (
        <div className="flex flex-col">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl((e.target as HTMLInputElement).value)}
            onBlur={handleBlur}
            className="p-2 mb-2 text-base w-full"
            autoFocus
          />
          <input
            type="text"
            value={imageAlt}
            onChange={(e) => setImageAlt((e.target as HTMLInputElement).value)}
            onBlur={handleBlur}
            className="p-2 text-base w-full"
          />
        </div>
      );
    }
  
    return (
      <img
        src={imageUrl}
        alt={imageAlt}
        onDblClick={handleDoubleClick}
        className="cursor-pointer"
      />
    );
  };