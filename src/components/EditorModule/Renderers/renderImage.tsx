import { ImageElement } from "../../../contentTypes";
import { EditableImage } from "../Editables/EditableImage";

export const renderImage = (element: ImageElement, index: number) => {
  return (
    <EditableImage key={index} url={element.url} alt={element.alt} onChange={(url, alt) => {/* handle change */}} />
  );
};
