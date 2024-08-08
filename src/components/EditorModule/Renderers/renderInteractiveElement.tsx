import { JSX } from "preact/jsx-runtime";
import { InteractiveElement } from "../Content/contentTypes";

export   function renderInteractiveElement(
    element: InteractiveElement,
    index: number
  ): JSX.Element {
    return (
      <div key={index} className={`interactive-element`}>
        {element.content.map((line: string, idx: number) => (
          <p key={idx} className="mb-2">
            {line}
          </p>
        ))}
      </div>
    );
  }
