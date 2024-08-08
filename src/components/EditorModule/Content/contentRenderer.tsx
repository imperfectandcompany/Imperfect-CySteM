    import { useState } from "preact/hooks";
    import { JSX } from "preact/jsx-runtime";
import { ContentElement } from "./contentTypes";
import { renderElement } from "../Renderers";


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



    const FullScreenModal = ({
        children,
        onClose,
        onSave,
    }: {
        children: JSX.Element;
        onClose: () => void;
        onSave: () => void;
    }) => {
        return (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50 transition-all duration-300 ease-in-out transform scale-100">
            <div className="relative w-full h-full p-6">
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-2xl font-bold"
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
            <FullScreenModal
                onClose={() => toggleEditing(element.id, false)}
                onSave={handleSave}
            >
                <textarea
                value={modalContent}
                onInput={(e) =>
                    setModalContent((e.target as HTMLTextAreaElement).value)
                }
                className="w-full h-full p-2 border rounded"
                />
            </FullScreenModal>
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