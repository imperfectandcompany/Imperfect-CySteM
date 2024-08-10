// renderList.tsx
import { JSX } from "preact/jsx-runtime";
import { ListElement } from "../Content/contentTypes";
import { EditableList } from "../Editables/EditableList";

export function renderList(
  element: ListElement,
  index: number,
  handleListChange: (id: string, newItems: string[]) => void,
  isEditing: boolean = false
): JSX.Element {
  return (
    <EditableList
      key={index}
      items={Array.isArray(element.items) ? element.items : []}
      onChange={(newItems) => handleListChange(element.id, newItems)}
      onSave={() => console.log(`List ${element.id} saved.`)}
      onCancel={() => console.log(`Edit cancelled for list ${element.id}.`)}
      isEditing={isEditing}
    />
  );
}