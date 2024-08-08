import { JSX } from "preact/jsx-runtime";
import { ErrorElement } from "../Content/contentTypes";

export function renderErrorElement(element: ErrorElement, index: number): JSX.Element {
    return (
      <div key={index} className="error-element p-4 bg-red-100 border border-red-400 rounded">
        <strong>Error:</strong> {element.message}
        <pre>{element.content}</pre>
      </div>
    );
  }