import { JSX } from "preact/jsx-runtime";
import { CustomComponentElement } from "../Content/contentTypes";

export function renderCustomComponent(
    element: CustomComponentElement,
    index: number
  ): JSX.Element {
    return (
      <div key={index} className={`custom-component custom-${element.directive}`}>
        {element.content.map((line: string, idx: number) => (
          <p key={idx} className="mb-2">
            {line}
          </p>
        ))}
      </div>
    );
  }