import { useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import { renderList } from "./renderList";
import { renderCodeBlock } from "./renderCodeblock";
import { renderHeader } from "./renderHeader";
import { renderCustomComponent } from "./renderCustomComponent";
import { renderErrorElement } from "./renderErrorElement";
import { renderInteractiveElement } from "./renderInteractiveElement";
import { ContentElement, HeaderElement, ParagraphElement, ImageElement, ListElement, CodeBlockElement, CustomComponentElement, InteractiveElement, ErrorElement, TableElement } from "../Content/contentTypes";
import { EditableTable } from "./renderTable";
import { EditableImage } from "../Editables/EditableImage";
import { EditableComponent } from "../Editables/EditableComponent";



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
      if (editingElement && editingElement !== id) {
        handleSave();  // Save any previous editing element before switching
      }
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
              content: newContent,
            }
          : element
      );
      setElements(updatedElements as ContentElement[]);
    };
  
    const handleSave = () => {
      if (editingElement !== null) {
        handleContentChange(editingElement, modalContent);
        setEditingElement(null);
        setModalContent("");
      }
    };
  
    const handleCancel = () => {
      setEditingElement(null);
      setModalContent("");
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
            <div className="flex flex-col space-y-2">
              <textarea
                value={modalContent}
                onInput={(e) =>
                  setModalContent((e.target as HTMLTextAreaElement).value)
                }
                className="w-full h-full p-2 border rounded"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleSave}
                  className="p-1 text-xs bg-green-200 border rounded"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="p-1 text-xs bg-red-200 border rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
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
          {element.type !== "image" && element.type !== "list" && !isEditing && (
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
              Edit
            </button>
          )}
        </div>
      );
    });
  }

export function renderElement(
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
            onChange={(value: string) => handleContentChange(element.id, value)}
            className="text-base md:text-lg lg:text-xl"
          />
        );
        case "image":
            return (
              <EditableImage
                key={index}
                url={(element as ImageElement).url}
                alt={(element as ImageElement).alt}
                onChange={(newUrl: string, newAlt: string) =>
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
                case "code":
                    return renderCodeBlock(element as unknown as CodeBlockElement, index);
                  case "accordion":
                    return (
                      <details key={index} className={element.style}>
                        <summary>Accordion Title</summary>
                        <p>{element.content}</p>
                      </details>
                    );                
    // case "codeBlock":
    //   return renderCodeBlock(element as CodeBlockElement, index);
    // case "custom":
    //   return renderCustomComponent(element as CustomComponentElement, index);
    // case "interactive":
    //   return renderInteractiveElement(element as InteractiveElement, index);
    // case "error":
    //   return renderErrorElement(element as ErrorElement, index);
    // case "tab":
    //   return (
    //     <div key={index} className={element.style}>
    //       <p>{element.content}</p>
    //     </div>
    //   );
    //   case "gallery":
    //     return (
    //       <div key={index} className={element.style}>
    //         {element.content.split(";").map((url: string, idx: number) => (
    //           <img key={idx} src={url} alt={`Gallery image ${idx}`} className="w-32 h-32" />
    //         ))}
    //       </div>
    //     );
        // case "carousel":
        //     return (
        //       <div key={index} className={element.style}>
        //         {element.content.split(";").map((url: string, idx: number) => (
        //           <img key={idx} src={url} alt={`Carousel image ${idx}`} className="w-32 h-32" />
        //         ))}
        //       </div>
        //     );
    //   case "code":
    //     return (
    //       <pre key={index} className={element.style}>
    //         <code>{element.content}</code>
    //       </pre>
    //     );
    //   case "testimonial":
    //     return (
    //       <div
    //         key={index}
    //         className={`p-4 shadow-lg rounded-lg ${element.style}`}
    //       >
    //         <p>{element.content}</p>
    //       </div>
    //     );
    //   case "countdown":
    //     return (
    //       <div key={index} className={element.style}>
    //         <p>Countdown to: {element.content}</p>
    //       </div>
    //     );
    //   case "alert":
    //     return (
    //       <div
    //         key={index}
    //         className={`p-4 shadow-lg rounded-lg ${element.style}`}
    //       >
    //         <p>{element.content}</p>
    //       </div>
    //     );
      case "table":
        return (
          <EditableTable
            key={index}
            content={(element as TableElement).content}
            onChange={(newContent) => handleContentChange(element.id, newContent)}
          />
        );
    //   case "card":
    //     return (
    //       <div
    //         key={index}
    //         className={`p-4 shadow-lg rounded-lg ${element.style}`}
    //       >
    //         <h3>{element.content.split(";")[0].split(":")[1]}</h3>
    //         <p>{element.content.split(";")[1].split(":")[1]}</p>
    //       </div>
    //     );
    //   case "progress":
    //     return (
    //       <div
    //         key={index}
    //         className="w-full bg-gray-200 rounded-full dark:bg-gray-700"
    //       >
    //         <div
    //           className={`bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full ${element.style}`}
    //           style={{ width: `${element.content}%` }}
    //         >
    //           {element.content}%
    //         </div>
    //       </div>
    //     );
    //     case "leaderboard":
    //         return (
    //           <ol key={index} className={`list-decimal pl-5 ${element.style}`}>
    //             {element.content.split(";").map((item: string, idx: number) => {
    //               const parts = item.split(":");
    //               return (
    //                 <li key={idx}>
    //                   {parts[0]}: {parts[1]}
    //                 </li>
    //               );
    //             })}
    //           </ol>
    //         );
    //   case "youtube":
    //     return (
    //       <iframe
    //         key={index}
    //         src={element.url}
    //         frameBorder="0"
    //         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    //         allowFullScreen
    //         className={`w-full h-64 ${element.style}`}
    //       ></iframe>
    //     );
    //   case "changelog":
    //     return (
    //       <div
    //         key={index}
    //         className={`p-4 shadow-lg rounded-lg ${element.style}`}
    //       >
    //         <h3 className="font-bold">Changelog</h3>
    //         <p>{element.content}</p>
    //       </div>
    //     );
    //     case "stats":
    //         return (
    //           <div key={index} className={`p-4 shadow-lg rounded-lg ${element.style}`}>
    //             <h3 className="font-bold">Stats</h3>
    //             {element.content.split(";").map((stat: string, idx: number) => (
    //               <p key={idx}>{stat}</p>
    //             ))}
    //           </div>
    //         );
    //         case "faq":
    //             return (
    //               <details key={index} className={`p-4 ${element.style}`}>
    //                 <summary className="font-bold">FAQ</summary>
    //                 {element.content.split(";").map((faq: string, idx: number) => {
    //                   const parts = faq.split(":");
    //                   return (
    //                     <p key={idx}>
    //                       <strong>{parts[0]}</strong>: {parts[1]}
    //                     </p>
    //                   );
    //                 })}
    //               </details>
    //             );
    //   case "data-visualization":
    //     return (
    //       <div
    //         key={index}
    //         className={`p-4 shadow-lg rounded-lg ${element.style}`}
    //       >
    //         <h3 className="font-bold">Data Visualization</h3>
    //         <p>{element.content}</p>
    //         {/* Placeholder for actual data visualization component */}
    //       </div>
    //     );
    //   case "info-card":
    //     const cardParts = element.content.split(";");
    //     const linkTarget =
    //       cardParts[2].split(":")[1].trim() === "true" ? "_blank" : "_self";
    //     return (
    //       <div
    //         key={index}
    //         className={`p-4 shadow-lg rounded-lg ${element.style}`}
    //       >
    //         <h3>{cardParts[0].split(":")[1]}</h3>
    //         <p>{cardParts[1].split(":")[1]}</p>
    //         <a
    //           href={cardParts[1].split(":")[1]}
    //           target={linkTarget}
    //           className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    //         >
    //           Visit
    //         </a>
    //       </div>
    //     );
    //   case "server-info":
    //     const serverParts = element.content.split(";");
    //     const ip = serverParts[1].split(":")[1].trim();
    //     return (
    //       <div
    //         key={index}
    //         className={`p-4 shadow-lg rounded-lg ${element.style}`}
    //       >
    //         <h3>{serverParts[0].split(":")[1]}</h3>
    //         <p>
    //           Server IP: <span>{ip}</span>{" "}
    //           <button
    //             onClick={() => navigator.clipboard.writeText(ip)}
    //             className="ml-2 text-blue-500 underline"
    //           >
    //             Copy
    //           </button>
    //         </p>
    //         <a
    //           href={serverParts[2].split(":")[1].trim()}
    //           className="mt-2 inline-block bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    //         >
    //           Quick Join
    //         </a>
    //       </div>
    //     );
    //   case "admin-command":
    //     return (
    //       <div
    //         key={index}
    //         className={`p-4 shadow-lg rounded-lg ${element.style}`}
    //       >
    //         <h3>Admin Command</h3>
    //         <p>{element.content}</p>
    //       </div>
    //     );
    //   case "event-log":
    //     return (
    //       <div
    //         key={index}
    //         className={`p-4 shadow-lg rounded-lg ${element.style}`}
    //       >
    //         <h3>Event Log</h3>
    //         <p>{element.content}</p>
    //       </div>
    //     );
    //   case "patch-notes":
    //     return (
    //       <div
    //         key={index}
    //         className={`p-4 shadow-lg rounded-lg ${element.style}`}
    //       >
    //         <h3>Patch Notes</h3>
    //         <p>{element.content}</p>
    //       </div>
    //     );
    //   case "server-rules":
    //     return (
    //       <div
    //         key={index}
    //         className={`p-4 shadow-lg rounded-lg ${element.style}`}
    //       >
    //         <h3>Server Rules</h3>
    //         <p>{element.content}</p>
    //       </div>
    //     );
    //   case "community-spotlight":
    //     return (
    //       <div
    //         key={index}
    //         className={`p-4 shadow-lg rounded-lg ${element.style}`}
    //       >
    //         <h3>Community Spotlight</h3>
    //         <p>{element.content}</p>
    //       </div>
    //     );
    //   case "warning-alert":
    //     return (
    //       <div
    //         key={index}
    //         className={`p-4 shadow-lg rounded-lg ${element.style}`}
    //       >
    //         <h3>Warning Alert</h3>
    //         <p>{element.content}</p>
    //       </div>
    //     );
    //   case "neutral-alert":
    //     return (
    //       <div
    //         key={index}
    //         className={`p-4 shadow-lg rounded-lg ${element.style}`}
    //       >
    //         <h3>Neutral Alert</h3>
    //         <p>{element.content}</p>
    //       </div>
    //     );
    //   case "steam-profile":
    //     return (
    //       <div
    //         key={index}
    //         className={`p-4 shadow-lg rounded-lg ${element.style}`}
    //       >
    //         <h3>Steam Profile</h3>
    //         <p>{element.content}</p>
    //       </div>
    //     );
    //   case "player-command":
    //     return (
    //       <div
    //         key={index}
    //         className={`p-4 shadow-lg rounded-lg ${element.style}`}
    //       >
    //         <h3>Player Command</h3>
    //         <p>{element.content}</p>
    //       </div>
    //     );
    //   case "bug-tracker":
    //     return (
    //       <div
    //         key={index}
    //         className={`p-4 shadow-lg rounded-lg ${element.style}`}
    //       >
    //         <h3>Bug Tracker</h3>
    //         <p>{element.content}</p>
    //       </div>
    //     );
    //   case "achievement":
    //     return (
    //       <div
    //         key={index}
    //         className={`p-4 shadow-lg rounded-lg ${element.style}`}
    //       >
    //         <h3>Achievement</h3>
    //         <p>{element.content}</p>
    //       </div>
    //     );
    //   case "server-schedule":
    //     return (
    //       <div
    //         key={index}
    //         className={`p-4 shadow-lg rounded-lg ${element.style}`}
    //       >
    //         <h3>Server Schedule</h3>
    //         <p>{element.content}</p>
    //       </div>
    //     );
    //   case "new-map":
    //     return (
    //       <div
    //         key={index}
    //         className={`p-4 shadow-lg rounded-lg ${element.style}`}
    //       >
    //         <h3>New Map</h3>
    //         <p>{element.content}</p>
    //       </div>
    //     );
    //   case "server-performance":
    //     return (
    //       <div
    //         key={index}
    //         className={`p-4 shadow-lg rounded-lg ${element.style}`}
    //       >
    //         <h3>Server Performance</h3>
    //         <p>{element.content}</p>
    //       </div>
    //     );
    //   case "moderation-actions":
    //     return (
    //       <div
    //         key={index}
    //         className={`p-4 shadow-lg rounded-lg ${element.style}`}
    //       >
    //         <h3>Moderation Actions</h3>
    //         <p>{element.content}</p>
    //       </div>
    //     );
    //   case "media-gallery":
    //     return (
    //       <div
    //         key={index}
    //         className={`p-4 shadow-lg rounded-lg ${element.style}`}
    //       >
    //         <h3>Media Gallery</h3>
    //         <p>{element.content}</p>
    //       </div>
    //     );
    //   case "custom-commands":
    //     return (
    //       <div
    //         key={index}
    //         className={`p-4 shadow-lg rounded-lg ${element.style}`}
    //       >
    //         <h3>Custom Commands</h3>
    //         <p>{element.content}</p>
    //       </div>
    //     );
    //   case "achievement-unlocks":
    //     return (
    //       <div
    //         key={index}
    //         className={`p-4 shadow-lg rounded-lg ${element.style}`}
    //       >
    //         <h3>Achievement Unlocks</h3>
    //         <p>{element.content}</p>
    //       </div>
    //     );
    //   case "ranking-system":
    //     return (
    //       <div
    //         key={index}
    //         className={`p-4 shadow-lg rounded-lg ${element.style}`}
    //       >
    //         <h3>Ranking System</h3>
    //         <p>{element.content}</p>
    //       </div>
    //     );
    //   case "ranking-points":
    //     return (
    //       <div
    //         key={index}
    //         className={`p-4 shadow-lg rounded-lg ${element.style}`}
    //       >
    //         <h3>Ranking Points Calculation</h3>
    //         <p>{element.content}</p>
    //       </div>
    //     );
      default:
        return null;
    }
}
