import { JSX } from "preact/jsx-runtime";

interface EditableComponentProps {
    tag: keyof JSX.IntrinsicElements;
    children: string;
    onChange: (value: string) => void;
    [key: string]: any;
  }
  
export const EditableComponent = ({
    tag: Tag,
    children,
    onChange,
    ...props
  }: EditableComponentProps) => {
  
    return (
      <Tag {...props}>
        {children}
      </Tag>
    );
  };