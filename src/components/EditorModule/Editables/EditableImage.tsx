import { useState, useEffect } from "preact/hooks";

interface EditableImageProps {
    url: string;
    alt: string;
    title?: string;
    subtitle?: string;
    onChange: (newUrl: string, newAlt: string, newTitle?: string, newSubtitle?: string) => void;
    onSave: () => void;
    onCancel: () => void;
    isEditing: boolean;
}

export const EditableImage = ({
  url,
  alt,
  title = '',
  subtitle = '',
  onChange,
  onSave,
  onCancel,
  isEditing
}: EditableImageProps) => {
  const [imageUrl, setImageUrl] = useState(url);
  const [imageAlt, setImageAlt] = useState(alt);
  const [imageTitle, setImageTitle] = useState(title);
  const [imageSubtitle, setImageSubtitle] = useState(subtitle);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSubtitleWarning, setShowSubtitleWarning] = useState(false);
  const [showUrlWarning, setShowUrlWarning] = useState(false);

  // Sync internal state with props if props change (useful when cancel is triggered)
  useEffect(() => {
    setImageUrl(url);
    setImageAlt(alt);
    setImageTitle(title);
    setImageSubtitle(subtitle);
    setHasChanges(false); // Reset changes tracker when values reset
    setShowSubtitleWarning(false); // Reset warning
    setShowUrlWarning(false); // Reset URL warning
  }, [url, alt, title, subtitle]);

  // Track changes
  useEffect(() => {
    if (
      imageUrl !== url ||
      imageAlt !== alt ||
      imageTitle !== title ||
      imageSubtitle !== subtitle
    ) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }

    // Show warning if subtitle is filled but title is empty
    if (!imageTitle && imageSubtitle) {
      setShowSubtitleWarning(true);
    } else {
      setShowSubtitleWarning(false);
    }

    // Hide URL warning if the URL is not empty
    if (imageUrl.trim() !== "") {
      setShowUrlWarning(false);
    }
  }, [imageUrl, imageAlt, imageTitle, imageSubtitle, url, alt, title, subtitle]);

const handleSave = () => {
  if (imageUrl.trim() === "") {
    setShowUrlWarning(true);
    return; // Do not allow saving if imageUrl is empty
  }

  // Explicitly pass empty strings if fields are empty
  const finalTitle = imageTitle;
  const finalSubtitle = imageTitle === "" ? "" : imageSubtitle;

  onChange(imageUrl, imageAlt, finalTitle, finalSubtitle);
  onSave();
};


  const handleCancel = () => {
    setImageUrl(url);
    setImageAlt(alt);
    setImageTitle(title);
    setImageSubtitle(subtitle);
    onCancel();
  };

  return isEditing ? (
    <div className="flex flex-col">
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl((e.target as HTMLInputElement).value)}
        className="p-2 mb-2 text-base w-full"
        placeholder="Image URL"
        autoFocus
      />
      {showUrlWarning && (
        <div className="text-xs text-red-500 mt-2">
          Image URL is required to save.
        </div>
      )}
      <input
        type="text"
        value={imageAlt}
        onChange={(e) => setImageAlt((e.target as HTMLInputElement).value)}
        className="p-2 text-base w-full"
        placeholder="Alt text (optional)"
      />
      <input
        type="text"
        value={imageTitle}
        onChange={(e) => setImageTitle((e.target as HTMLInputElement).value)}
        className="p-2 text-base w-full"
        placeholder="Title (optional)"
      />
      <input
        type="text"
        value={imageSubtitle}
        onChange={(e) => setImageSubtitle((e.target as HTMLInputElement).value)}
        className={`p-2 text-base w-full ${!imageTitle ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : ''}`}
        placeholder="Subtitle (optional)"
        disabled={!imageTitle} // Disable subtitle input if no title
      />
      {showSubtitleWarning && (
        <div className="text-xs text-red-500 mt-2">
          Subtitle will be cleared since no title is provided.
        </div>
      )}
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={handleSave}
          className={`p-1 text-xs border rounded ${
            hasChanges && imageUrl.trim() !== ""
              ? "bg-green-200 hover:bg-green-300"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          disabled={!hasChanges || imageUrl.trim() === ""}
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
    <img src={imageUrl} alt={imageAlt} />
  );
};
