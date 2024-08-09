import { useState, useEffect } from 'preact/hooks';

interface EditableImageProps {
  url: string;
  alt: string;
  onChange: (newUrl: string, newAlt: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
}

export const EditableImage = ({ url, alt, onChange, onSave, onCancel, isEditing }: EditableImageProps) => {
  const [imageUrl, setImageUrl] = useState(url);
  const [imageAlt, setImageAlt] = useState(alt);

  // Sync internal state with props if props change (useful when cancel is triggered)
  useEffect(() => {
    setImageUrl(url);
    setImageAlt(alt);
  }, [url, alt]);

  const handleSave = () => {
    if (imageUrl.trim() !== "" && imageAlt.trim() !== "") {
      onChange(imageUrl, imageAlt); // This should update the element
      onSave(); // Finalize the changes
    } else {
      setImageUrl(url); // Revert to original if fields are empty
      setImageAlt(alt);
    }
  };
  console.log("Rendering image:", { url: imageUrl, alt: imageAlt });




  const handleCancel = () => {
    setImageUrl(url);
    setImageAlt(alt);
    onCancel();
  };

  return isEditing ? (
    <div className="flex flex-col">
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl((e.target as HTMLInputElement).value)}
        className="p-2 mb-2 text-base w-full"
        autoFocus
      />
      <input
        type="text"
        value={imageAlt}
        onChange={(e) => setImageAlt((e.target as HTMLInputElement).value)}
        className="p-2 text-base w-full"
      />
      <div className="flex justify-end space-x-2">
        <button
          onClick={handleSave}
          className="p-1 text-xs bg-green-200 border rounded"
        >
          Save
        </button>
        <button
          onClick={handleCancel}
          className="p-1 text-xs bg-red-200 border rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  ) : (
    <img
      src={imageUrl}
      alt={imageAlt}
    />
  );
};
