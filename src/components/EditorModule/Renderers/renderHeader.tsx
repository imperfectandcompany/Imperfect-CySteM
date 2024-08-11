import { JSX } from "preact/jsx-runtime";
import { HeaderElement } from "../Content/contentTypes";

export function renderHeader(element: HeaderElement, index: number): JSX.Element {
    const level = Math.min(Math.max(element.level || 1, 1), 6);
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;

    console.log("Rendering header:", element.content);

    return (
      <Tag key={index} className={`font-semibold text-xl md:text-2xl lg:text-3xl ${element.style}`}
      dangerouslySetInnerHTML={{ __html: element.content }}
      >
        {element.content}
      </Tag>
    );
}
