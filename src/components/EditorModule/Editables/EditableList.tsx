import { useState } from 'preact/hooks';

interface EditableListProps {
  items: string[];
  onChange: (newItems: string[]) => void;
  onRemove: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export const EditableList = ({ items, onChange, onRemove, onSave, onCancel }: EditableListProps) => {
  const [editingItems, setEditingItems] = useState(items);

  const handleItemChange = (index: number, value: string) => {
    const updatedItems = [...editingItems];
    updatedItems[index] = value;
    setEditingItems(updatedItems);
  };

  const handleAddItem = () => {
    setEditingItems([...editingItems, ""]);
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = editingItems.filter((_, i) => i !== index);
    setEditingItems(updatedItems);
  };

  const handleSave = () => {
    onChange(editingItems);
    onSave();
  };

  const handleCancel = () => {
    setEditingItems(items);
    onCancel();
  };

  return (
    <div className="flex flex-col space-y-2">
      {editingItems.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <input
            type="text"
            value={item}
            onChange={(e) => handleItemChange(index, (e.target as HTMLInputElement).value)}
            className="p-2 text-base w-full"
            placeholder="Enter list item"
          />
          <button
            onClick={() => handleRemoveItem(index)}
            className="p-1 text-xs bg-red-200 border rounded"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={handleAddItem}
        className="p-1 text-xs bg-blue-200 border rounded"
      >
        Add Item
      </button>
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
      <div className="flex justify-end">
        <button
          onClick={onRemove}
          className="p-1 text-xs bg-red-400 border rounded"
        >
          Remove Entire List
        </button>
      </div>
    </div>
  );
};
