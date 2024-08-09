import { JSX } from "preact/jsx-runtime";
import { ListElement } from "../Content/contentTypes";
import { EditableList } from "../Editables/EditableList";

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
        onChange={(newItems) => handleListChange(element.id, newItems)}
        onRemove={() => handleListRemove(element.id)}
        onSave={() => console.log(`List ${element.id} saved.`)} // Replace with actual save logic
        onCancel={() => console.log(`Edit cancelled for list ${element.id}.`)} // Replace with actual cancel logic
      />
    );
  }
