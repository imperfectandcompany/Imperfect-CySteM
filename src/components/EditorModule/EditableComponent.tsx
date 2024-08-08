import { useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";

interface EditableComponentProps {
  tag: keyof JSX.IntrinsicElements;
  children: string;
  onChange: (value: string) => void;
  [key: string]: any;
}

const EditableComponent = ({
  tag: Tag,
  children,
  onChange,
  ...props
}: EditableComponentProps) => {
  const [isEditing, setEditing] = useState(false);
  const [text, setText] = useState(children);

  function handleDoubleClick() {
    setEditing(true);
  }

  function handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    setText(target.value);
    onChange(target.value);
  }

  function handleBlur() {
    if (text.trim() === "") {
      setText(children);
    }
    setEditing(false);
  }

  if (isEditing) {
    return (
      <input
        type="text"
        value={text}
        onChange={handleChange}
        onBlur={handleBlur}
        className="p-2 text-base w-full"
        autoFocus
      />
    );
  }

  return (
    <Tag onDblClick={handleDoubleClick} {...props}>
      {text}
    </Tag>
  );
};

export default EditableComponent;
