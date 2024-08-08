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

interface EditableImageProps {
  url: string;
  alt: string;
  onChange: (newUrl: string, newAlt: string) => void;
}

const EditableImage = ({ url, alt, onChange }: EditableImageProps) => {
  const [isEditing, setEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState(url);
  const [imageAlt, setImageAlt] = useState(alt);

  function handleDoubleClick() {
    setEditing(true);
  }

  function handleBlur() {
    if (imageUrl.trim() === "") {
      setImageUrl(url);
    }
    if (imageAlt.trim() === "") {
      setImageAlt(alt);
    }
    setEditing(false);
    onChange(imageUrl, imageAlt);
  }

  if (isEditing) {
    return (
      <div className="flex flex-col">
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl((e.target as HTMLInputElement).value)}
          onBlur={handleBlur}
          className="p-2 mb-2 text-base w-full"
          autoFocus
        />
        <input
          type="text"
          value={imageAlt}
          onChange={(e) => setImageAlt((e.target as HTMLInputElement).value)}
          onBlur={handleBlur}
          className="p-2 text-base w-full"
        />
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={imageAlt}
      onDblClick={handleDoubleClick}
      className="cursor-pointer"
    />
  );
};

interface EditableListProps {
  items: string[];
  ordered: boolean;
  onChange: (newItems: string[]) => void;
  onRemove: () => void;
}

const EditableList = ({
  items,
  ordered,
  onChange,
  onRemove,
}: EditableListProps) => {
  const [isEditing, setEditing] = useState(false);
  const [listItems, setListItems] = useState(items);

  function handleItemChange(index: number, value: string) {
    const newItems = [...listItems];
    newItems[index] = value;
    setListItems(newItems);
    onChange(newItems);
  }

  function handleAddItem() {
    const newItems = [...listItems, "New Item"];
    setListItems(newItems);
    onChange(newItems);
    setEditing(true);
  }

  function handleRemoveItem(index: number) {
    const newItems = listItems.filter((_, idx) => idx !== index);
    if (newItems.length === 0) {
      onRemove();
    } else {
      setListItems(newItems);
      onChange(newItems);
    }
  }

  return (
    <div className="relative" onDblClick={() => setEditing(true)}>
      {ordered ? (
        <ol className="list-decimal pl-5">
          {listItems.map((item, index) => (
            <li key={index} className="flex items-center">
              <EditableComponent
                tag="span"
                children={item}
                onChange={(value) => handleItemChange(index, value)}
                className="mr-2"
              />
              {isEditing && (
                <button
                  onClick={() => handleRemoveItem(index)}
                  className="ml-2 text-red-500"
                >
                  Remove
                </button>
              )}
            </li>
          ))}
          {isEditing && (
            <button onClick={handleAddItem} className="mt-2 text-blue-500">
              Add Item
            </button>
          )}
        </ol>
      ) : (
        <ul className="list-disc pl-5">
          {listItems.map((item, index) => (
            <li key={index} className="flex items-center">
              <EditableComponent
                tag="span"
                children={item}
                onChange={(value) => handleItemChange(index, value)}
                className="mr-2"
              />
              {isEditing && (
                <button
                  onClick={() => handleRemoveItem(index)}
                  className="ml-2 text-red-500"
                >
                  Remove
                </button>
              )}
            </li>
          ))}
          {isEditing && (
            <button onClick={handleAddItem} className="mt-2 text-blue-500">
              Add Item
            </button>
          )}
        </ul>
      )}
      {isEditing && (
        <button
          onClick={onRemove}
          className="absolute top-0 right-0 text-red-500"
        >
          Remove List
        </button>
      )}
    </div>
  );
};

const Modal = ({
  children,
  onClose,
  onSave,
}: {
  children: JSX.Element;
  onClose: () => void;
  onSave: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300 ease-in-out transform scale-95">
      <div className="bg-white p-6 rounded-lg relative w-11/12 md:w-3/4 lg:w-1/2">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl font-bold"
        >
          &times;
        </button>
        {children}
        <button
          onClick={onSave}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export function renderContent(
  elements: ContentElement[],
  setElements: (newElements: ContentElement[]) => void
): (JSX.Element | null)[] {
  const [editingElement, setEditingElement] = useState<string | null>(null);
  const [modalContent, setModalContent] = useState<string>("");

  const handleImageChange = (id: string, newUrl: string, newAlt: string) => {
    const updatedElements = elements.map((element) =>
      element.id === id
        ? {
            ...element,
            url: newUrl,
            alt: newAlt,
          }
        : element
    );
    setElements(updatedElements as ContentElement[]);
  };

  const handleListChange = (id: string, newItems: string[]) => {
    const updatedElements = elements.map((element) =>
      element.id === id
        ? {
            ...element,
            items: newItems,
          }
        : element
    );
    setElements(updatedElements as ContentElement[]);
  };

  const handleListRemove = (id: string) => {
    const updatedElements = elements.filter((element) => element.id !== id);
    setElements(updatedElements as ContentElement[]);
  };

  const toggleEditing = (id: string, isEditing: boolean, content?: string) => {
    setEditingElement(isEditing ? id : null);
    if (content !== undefined) {
      setModalContent(content);
    }
  };

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

  const handleSave = () => {
    if (editingElement !== null) {
      handleContentChange(editingElement, modalContent);
      setEditingElement(null);
    }
  };

  return elements.map((element, index) => {
    const isEditing = editingElement === element.id;
    element.isEditing = isEditing;
    element.setEditing = toggleEditing;

    return (
      <div
        key={index}
        className="relative p-4 border rounded my-2 md:my-4 lg:my-6"
      >
        {isEditing ? (
          <Modal
            onClose={() => toggleEditing(element.id, false)}
            onSave={handleSave}
          >
            <textarea
              value={modalContent}
              onInput={(e) =>
                setModalContent((e.target as HTMLTextAreaElement).value)
              }
              className="w-full p-2 border rounded"
            />
          </Modal>
        ) : (
          renderElement(
            element,
            index,
            handleContentChange,
            handleImageChange,
            handleListChange,
            handleListRemove
          )
        )}
        {element.type !== "image" && element.type !== "list" && (
          <button
            onClick={() =>
              toggleEditing(
                element.id,
                !isEditing,
                Array.isArray(element.content)
                  ? element.content.join(", ")
                  : element.content
              )
            }
            className="absolute top-0 right-0 p-1 text-xs bg-gray-200 border rounded"
          >
            {isEditing ? "Save" : "Edit"}
          </button>
        )}
      </div>
    );
  });
}

function renderHeader(element: HeaderElement, index: number): JSX.Element {
  const Tag = `h${element.level}` as keyof JSX.IntrinsicElements;
  return (
    <Tag key={index} className="font-semibold text-xl md:text-2xl lg:text-3xl">
      {element.content}
    </Tag>
  );
}

function renderList(
  element: ListElement,
  index: number,
  handleListChange: (id: string, newItems: string[]) => void,
  handleListRemove: (id: string) => void
): JSX.Element {
  return (
    <EditableList
      key={index}
      items={element.items}
      ordered={element.ordered}
      onChange={(newItems) => handleListChange(element.id, newItems)}
      onRemove={() => handleListRemove(element.id)}
    />
  );
}

function renderCodeBlock(
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

function renderCustomComponent(
  element: CustomComponentElement,
  index: number
): JSX.Element {
  return (
    <div key={index} className={`custom-component custom-${element.directive}`}>
      {element.content.map((line, idx) => (
        <p key={idx} className="mb-2">
          {line}
        </p>
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
        <p key={idx} className="mb-2">
          {line}
        </p>
      ))}
    </div>
  );
}

function renderErrorElement(element: ErrorElement, index: number): JSX.Element {
  return (
    <div key={index} className="error-element p-4 bg-red-100 border border-red-400 rounded">
      <strong>Error:</strong> {element.message}
      <pre>{element.content}</pre>
    </div>
  );
}

function renderElement(
  element: ContentElement,
  index: number,
  handleContentChange: (id: string, newContent: string) => void,
  handleImageChange: (id: string, newUrl: string, newAlt: string) => void,
  handleListChange: (id: string, newItems: string[]) => void,
  handleListRemove: (id: string) => void
): JSX.Element | null {
  switch (element.type) {
    case "header":
      return renderHeader(element as HeaderElement, index);
    case "paragraph":
      return (
        <EditableComponent
          key={index}
          tag="p"
          children={(element as ParagraphElement).content}
          onChange={(value) => handleContentChange(element.id, value)}
          className="text-base md:text-lg lg:text-xl"
        />
      );
    case "image":
      return (
        <EditableImage
          key={index}
          url={(element as ImageElement).url}
          alt={(element as ImageElement).alt}
          onChange={(newUrl, newAlt) =>
            handleImageChange(element.id, newUrl, newAlt)
          }
        />
      );
    case "list":
      return renderList(
        element as ListElement,
        index,
        handleListChange,
        handleListRemove
      );
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
