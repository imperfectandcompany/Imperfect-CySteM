import { JSX } from "preact/jsx-runtime";
import { CodeBlockElement } from "../Content/contentTypes";

export function renderCodeBlock(
    element: CodeBlockElement,
    index: number
  ): JSX.Element {
    return (
      <pre key={index} className="bg-gray-100 p-4 rounded-md">
        <code
          className={`language-${element.language}`}
          dangerouslySetInnerHTML={{ __html: element.content }}
        />
      </pre>
    );
  }