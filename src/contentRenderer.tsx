import { useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import {
  ContentElement,
  HeaderElement,
  ParagraphElement,
  ImageElement,
  ListElement,
  CodeBlockElement,
  CustomComponentElement,
  InteractiveElement,
  ErrorElement,
} from "./contentTypes";

export function renderContent(
  elements: ContentElement[],
  setElements: (newElements: ContentElement[]) => void
): (JSX.Element | null)[] {
  const [editingElement, setEditingElement] = useState<string | null>(null);

  const handleContentChange = (id: string, newContent: string) => {
    const updatedElements = elements.map((element) =>
      element.id === id
        ? {
            ...element,
            content: Array.isArray(element.content)
              ? [...element.content, newContent]
              : newContent,
          }
          : element
        );
    setElements(updatedElements as ContentElement[]);
  };

  const toggleEditing = (id: string, isEditing: boolean) => {
    setEditingElement(isEditing ? id : null);
  };

  return elements.map((element, index) => {
    const isEditing = editingElement === element.id;
    element.isEditing = isEditing;
    element.setEditing = toggleEditing;

    return (
      <div key={index} className="relative">
        {isEditing ? (
          <textarea
            value={element.content}
            onInput={(e) =>
              handleContentChange(
                element.id,
                (e.target as HTMLTextAreaElement).value
              )
            }
            className="w-full p-2 border rounded"
          />
        ) : (
          renderElement(element, index)
        )}
        <button
          onClick={() => toggleEditing(element.id, !isEditing)}
          className="absolute top-0 right-0 p-1 text-xs bg-gray-200 border rounded"
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>
    );
  });
}

function renderHeader(element: HeaderElement, index: number): JSX.Element {
    const Tag = `h${element.level}` as keyof JSX.IntrinsicElements;
    return (
      <Tag key={index} dangerouslySetInnerHTML={{ __html: element.content }} />
    );
  }
  
  function renderList(element: ListElement, index: number): JSX.Element {
    return element.ordered ? (
      <ol key={index}>
        {element.items.map((item, idx) => (
          <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </ol>
    ) : (
      <ul key={index}>
        {element.items.map((item, idx) => (
          <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </ul>
    );
  }


function renderCodeBlock(
    element: CodeBlockElement,
    index: number
  ): JSX.Element {
    return (
      <pre key={index}>
        <code
          className={`language-${element.language}`}
          dangerouslySetInnerHTML={{ __html: element.content }}
        />
      </pre>
    );
  }
  
  function renderCustomComponent(
    element: CustomComponentElement,
    index: number
  ): JSX.Element {
    return (
      <div key={index} className={`custom-component custom-${element.directive}`}>
        {element.content.map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </div>
    );
  }
  
  function renderInteractiveElement(
    element: InteractiveElement,
    index: number
  ): JSX.Element {
    return (
      <div key={index} className={`interactive-element`}>
        {element.content.map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </div>
    );
  }
  
  function renderErrorElement(element: ErrorElement, index: number): JSX.Element {
    return (
      <div key={index} className="error-element">
        <strong>Error:</strong> {element.message}
        <pre>{element.content}</pre>
      </div>
    );
  }

function renderElement(
  element: ContentElement,
  index: number
): JSX.Element | null {
  switch (element.type) {
    case "header":
      return renderHeader(element as HeaderElement, index);
    case "paragraph":
      return (
        <p
          key={index}
          dangerouslySetInnerHTML={{
            __html: (element as ParagraphElement).content,
          }}
        />
      );
    case "image":
      return (
        <img
          key={index}
          src={(element as ImageElement).url}
          alt={(element as ImageElement).alt}
        />
      );
    case "list":
      return renderList(element as ListElement, index);
    case "codeBlock":
      return renderCodeBlock(element as CodeBlockElement, index);
    case "custom":
      return renderCustomComponent(element as CustomComponentElement, index);
    case "interactive":
      return renderInteractiveElement(element as InteractiveElement, index);
    case "error":
      return renderErrorElement(element as ErrorElement, index);
    case "accordion":
      return (
        <details key={index} className={element.style}>
          <summary>Accordion Title</summary>
          <p>{element.content}</p>
        </details>
      );
    case "tab":
      return (
        <div key={index} className={element.style}>
          <p>{element.content}</p>
        </div>
      );
    case "gallery":
      return (
        <div key={index} className={element.style}>
          {element.content.split(";").map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`Gallery image ${idx}`}
              className="w-32 h-32"
            />
          ))}
        </div>
      );
    case "carousel":
      return (
        <div key={index} className={element.style}>
          {element.content.split(";").map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`Carousel image ${idx}`}
              className="w-32 h-32"
            />
          ))}
        </div>
      );
    case "code":
      return (
        <pre key={index} className={element.style}>
          <code>{element.content}</code>
        </pre>
      );
    case "testimonial":
      return (
        <div
          key={index}
          className={`p-4 shadow-lg rounded-lg ${element.style}`}
        >
          <p>{element.content}</p>
        </div>
      );
    case "countdown":
      return (
        <div key={index} className={element.style}>
          <p>Countdown to: {element.content}</p>
        </div>
      );
    case "alert":
      return (
        <div
          key={index}
          className={`p-4 shadow-lg rounded-lg ${element.style}`}
        >
          <p>{element.content}</p>
        </div>
      );
    case "table":
      return (
        <table key={index} className={`table-auto w-full ${element.style}`}>
          <thead>
            <tr>
              {element.content
                .split(";")[0]
                .split(",")
                .map((header, idx) => (
                  <th key={idx} className="px-4 py-2">
                    {header}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {element.content
              .split(";")
              .slice(1)
              .map((row, idx) => (
                <tr key={idx}>
                  {row.split(",").map((cell, idx) => (
                    <td key={idx} className="border px-4 py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      );
    case "card":
      return (
        <div
          key={index}
          className={`p-4 shadow-lg rounded-lg ${element.style}`}
        >
          <h3>{element.content.split(";")[0].split(":")[1]}</h3>
          <p>{element.content.split(";")[1].split(":")[1]}</p>
        </div>
      );
    case "progress":
      return (
        <div
          key={index}
          className="w-full bg-gray-200 rounded-full dark:bg-gray-700"
        >
          <div
            className={`bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full ${element.style}`}
            style={{ width: `${element.content}%` }}
          >
            {element.content}%
          </div>
        </div>
      );
    case "leaderboard":
      return (
        <ol key={index} className={`list-decimal pl-5 ${element.style}`}>
          {element.content.split(";").map((item, idx) => (
            <li key={idx}>
              {item.split(":")[0]}: {item.split(":")[1]}
            </li>
          ))}
        </ol>
      );
    case "youtube":
      return (
        <iframe
          key={index}
          src={element.url}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={`w-full h-64 ${element.style}`}
        ></iframe>
      );
    // case "feature":
    //   return (
    //     <div
    //       key={index}
    //       className={`p-4 shadow-lg rounded-lg ${element.style}`}
    //     >
    //       <i className="fas fa-star text-yellow-500"></i>
    //       <p>{element.content}</p>
    //     </div>
    //   );
    case "changelog":
      return (
        <div
          key={index}
          className={`p-4 shadow-lg rounded-lg ${element.style}`}
        >
          <h3 className="font-bold">Changelog</h3>
          <p>{element.content}</p>
        </div>
      );
    case "stats":
      return (
        <div
          key={index}
          className={`p-4 shadow-lg rounded-lg ${element.style}`}
        >
          <h3 className="font-bold">Stats</h3>
          {element.content.split(";").map((stat, idx) => (
            <p key={idx}>{stat}</p>
          ))}
        </div>
      );
    case "faq":
      return (
        <details key={index} className={`p-4 ${element.style}`}>
          <summary className="font-bold">FAQ</summary>
          {element.content.split(";").map((faq, idx) => {
            const parts = faq.split(":");
            return (
              <p key={idx}>
                <strong>{parts[0]}</strong>: {parts[1]}
              </p>
            );
          })}
        </details>
      );
    case "data-visualization":
      return (
        <div
          key={index}
          className={`p-4 shadow-lg rounded-lg ${element.style}`}
        >
          <h3 className="font-bold">Data Visualization</h3>
          <p>{element.content}</p>
          {/* Placeholder for actual data visualization component */}
        </div>
      );
    case "info-card":
      const cardParts = element.content.split(";");
      const linkTarget =
        cardParts[2].split(":")[1].trim() === "true" ? "_blank" : "_self";
      return (
        <div
          key={index}
          className={`p-4 shadow-lg rounded-lg ${element.style}`}
        >
          <h3>{cardParts[0].split(":")[1]}</h3>
          <p>{cardParts[1].split(":")[1]}</p>
          <a
            href={cardParts[1].split(":")[1]}
            target={linkTarget}
            className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Visit
          </a>
        </div>
      );
    case "server-info":
      const serverParts = element.content.split(";");
      const ip = serverParts[1].split(":")[1].trim();
      return (
        <div
          key={index}
          className={`p-4 shadow-lg rounded-lg ${element.style}`}
        >
          <h3>{serverParts[0].split(":")[1]}</h3>
          <p>
            Server IP: <span>{ip}</span>{" "}
            <button
              onClick={() => navigator.clipboard.writeText(ip)}
              className="ml-2 text-blue-500 underline"
            >
              Copy
            </button>
          </p>
          <a
            href={serverParts[2].split(":")[1].trim()}
            className="mt-2 inline-block bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Quick Join
          </a>
        </div>
      );
    case "admin-command":
      return (
        <div
          key={index}
          className={`p-4 shadow-lg rounded-lg ${element.style}`}
        >
          <h3>Admin Command</h3>
          <p>{element.content}</p>
        </div>
      );
    case "event-log":
      return (
        <div
          key={index}
          className={`p-4 shadow-lg rounded-lg ${element.style}`}
        >
          <h3>Event Log</h3>
          <p>{element.content}</p>
        </div>
      );
    case "patch-notes":
      return (
        <div
          key={index}
          className={`p-4 shadow-lg rounded-lg ${element.style}`}
        >
          <h3>Patch Notes</h3>
          <p>{element.content}</p>
        </div>
      );
    case "server-rules":
      return (
        <div
          key={index}
          className={`p-4 shadow-lg rounded-lg ${element.style}`}
        >
          <h3>Server Rules</h3>
          <p>{element.content}</p>
        </div>
      );
    case "community-spotlight":
      return (
        <div
          key={index}
          className={`p-4 shadow-lg rounded-lg ${element.style}`}
        >
          <h3>Community Spotlight</h3>
          <p>{element.content}</p>
        </div>
      );
    case "warning-alert":
      return (
        <div
          key={index}
          className={`p-4 shadow-lg rounded-lg ${element.style}`}
        >
          <h3>Warning Alert</h3>
          <p>{element.content}</p>
        </div>
      );
    case "neutral-alert":
      return (
        <div
          key={index}
          className={`p-4 shadow-lg rounded-lg ${element.style}`}
        >
          <h3>Neutral Alert</h3>
          <p>{element.content}</p>
        </div>
      );
    case "steam-profile":
      return (
        <div
          key={index}
          className={`p-4 shadow-lg rounded-lg ${element.style}`}
        >
          <h3>Steam Profile</h3>
          <p>{element.content}</p>
        </div>
      );
    case "player-command":
      return (
        <div
          key={index}
          className={`p-4 shadow-lg rounded-lg ${element.style}`}
        >
          <h3>Player Command</h3>
          <p>{element.content}</p>
        </div>
      );
    case "bug-tracker":
      return (
        <div
          key={index}
          className={`p-4 shadow-lg rounded-lg ${element.style}`}
        >
          <h3>Bug Tracker</h3>
          <p>{element.content}</p>
        </div>
      );
    case "achievement":
      return (
        <div
          key={index}
          className={`p-4 shadow-lg rounded-lg ${element.style}`}
        >
          <h3>Achievement</h3>
          <p>{element.content}</p>
        </div>
      );
    case "server-schedule":
      return (
        <div
          key={index}
          className={`p-4 shadow-lg rounded-lg ${element.style}`}
        >
          <h3>Server Schedule</h3>
          <p>{element.content}</p>
        </div>
      );
    case "new-map":
      return (
        <div
          key={index}
          className={`p-4 shadow-lg rounded-lg ${element.style}`}
        >
          <h3>New Map</h3>
          <p>{element.content}</p>
        </div>
      );
    case "server-performance":
      return (
        <div
          key={index}
          className={`p-4 shadow-lg rounded-lg ${element.style}`}
        >
          <h3>Server Performance</h3>
          <p>{element.content}</p>
        </div>
      );
    case "moderation-actions":
      return (
        <div
          key={index}
          className={`p-4 shadow-lg rounded-lg ${element.style}`}
        >
          <h3>Moderation Actions</h3>
          <p>{element.content}</p>
        </div>
      );
    case "media-gallery":
      return (
        <div
          key={index}
          className={`p-4 shadow-lg rounded-lg ${element.style}`}
        >
          <h3>Media Gallery</h3>
          <p>{element.content}</p>
        </div>
      );
    case "custom-commands":
      return (
        <div
          key={index}
          className={`p-4 shadow-lg rounded-lg ${element.style}`}
        >
          <h3>Custom Commands</h3>
          <p>{element.content}</p>
        </div>
      );
    case "achievement-unlocks":
      return (
        <div
          key={index}
          className={`p-4 shadow-lg rounded-lg ${element.style}`}
        >
          <h3>Achievement Unlocks</h3>
          <p>{element.content}</p>
        </div>
      );
    case "ranking-system":
      return (
        <div
          key={index}
          className={`p-4 shadow-lg rounded-lg ${element.style}`}
        >
          <h3>Ranking System</h3>
          <p>{element.content}</p>
        </div>
      );
    case "ranking-points":
      return (
        <div
          key={index}
          className={`p-4 shadow-lg rounded-lg ${element.style}`}
        >
          <h3>Ranking Points Calculation</h3>
          <p>{element.content}</p>
        </div>
      );
    case "textstyle":
      return (
        <p key={index} className={element.style}>
          {element.content}
        </p>
      );
    case "spacing":
      return (
        <div key={index} className={element.style}>
          {element.content}
        </div>
      );
    default:
      return null;
  }
}
