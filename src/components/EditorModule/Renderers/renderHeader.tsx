import { JSX } from "preact/jsx-runtime";
import { HeaderElement } from "../Content/contentTypes";

export function renderHeader(element: HeaderElement, index: number): JSX.Element {
    const Tag = `h${element.level}` as keyof JSX.IntrinsicElements;
    return (
      <Tag key={index} className="font-semibold text-xl md:text-2xl lg:text-3xl">
        {element.content}
      </Tag>
    );
  }