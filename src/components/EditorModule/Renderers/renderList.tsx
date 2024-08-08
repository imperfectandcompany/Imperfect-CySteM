import { useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import { ListElement } from "../Content/contentTypes";
import { EditableComponent } from "../Editables/EditableComponent";

interface EditableListProps {
    items: string[];
    ordered: boolean;
    onChange: (newItems: string[]) => void;
    onRemove: () => void;
  }

const EditableList = ({
    items,
    ordered,
    onChange,
    onRemove,
  }: EditableListProps) => {
    const [isEditing, setEditing] = useState(false);
    const [listItems, setListItems] = useState(items);


  
    function handleItemChange(index: number, value: string) {
      const newItems = [...listItems];
      newItems[index] = value;
      setListItems(newItems);
      onChange(newItems);
    }
  
    function handleAddItem() {
      const newItems = [...listItems, "New Item"];
      setListItems(newItems);
      onChange(newItems);
      setEditing(true);
    }
  
    function handleRemoveItem(index: number) {
      const newItems = listItems.filter((_, idx) => idx !== index);
      if (newItems.length === 0) {
        onRemove();
      } else {
        setListItems(newItems);
        onChange(newItems);
      }
    }
  
    return (
      <div className="relative" onDblClick={() => setEditing(true)}>
        {ordered ? (
          <ol className="list-decimal pl-5">
            {listItems.map((item, index) => (
              <li key={index} className="flex items-center">
                <EditableComponent
                  tag="span"
                  children={item}
                  onChange={(value: string) => handleItemChange(index, value)}
                  className="mr-2"
                />
                {isEditing && (
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="ml-2 text-red-500"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
            {isEditing && (
              <button onClick={handleAddItem} className="mt-2 text-blue-500">
                Add Item
              </button>
            )}
          </ol>
        ) : (
          <ul className="list-disc pl-5">
            {listItems.map((item, index) => (
              <li key={index} className="flex items-center">
                <EditableComponent
                  tag="span"
                  children={item}
                  onChange={(value: string) => handleItemChange(index, value)}
                  className="mr-2"
                />
                {isEditing && (
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="ml-2 text-red-500"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
            {isEditing && (
              <button onClick={handleAddItem} className="mt-2 text-blue-500">
                Add Item
              </button>
            )}
          </ul>
        )}
        {isEditing && (
          <button
            onClick={onRemove}
            className="absolute top-0 right-0 text-red-500"
          >
            Remove List
          </button>
        )}
      </div>
    );
  };

export function renderList(
    element: ListElement,
    index: number,
    handleListChange: (id: string, newItems: string[]) => void,
    handleListRemove: (id: string) => void
  ): JSX.Element {
    return (
      <EditableList
        key={index}
        items={element.items}
        ordered={element.ordered}
        onChange={(newItems) => handleListChange(element.id, newItems)}
        onRemove={() => handleListRemove(element.id)}
      />
    );
  }