import { CustomComponentElement, InteractiveElement, ContentElement } from "../../contentTypes";

// Helper type to narrow down the elements that use a string array for content
type CustomContentElement = CustomComponentElement | InteractiveElement;

// Utility function to update content of a general element with proper type handling
export const updateContent = (
    elements: ContentElement[],
    id: string,
    newContent: string | string[]
  ): ContentElement[] => {
    return elements.map(element => {
      if (element.id === id) {
        if (isCustomContentElement(element) && Array.isArray(newContent)) {
          // Handle custom content elements that expect an array of strings
          return { ...element, content: newContent };
        } else if (!isCustomContentElement(element) && typeof newContent === 'string') {
          // Handle other elements expecting a string
          return handleStringContentElement(element, newContent);
        }
      }
      return element;
    });
};


// Helper function to handle elements expecting a string content
function handleStringContentElement(element: ContentElement, newContent: string): ContentElement {
    switch (element.type) {
      case 'header':
      case 'paragraph':
      case 'image':
        return { ...element, content: newContent };
      default:
        return element;
    }
  }

// Type guard to check if an element uses an array of strings for its content
function isCustomContentElement(element: ContentElement): element is CustomContentElement {
  return ['custom', 'interactive'].includes(element.type);
}


// Utility function to remove an element by id
export const removeElementById = (elements: ContentElement[], id: string): ContentElement[] => {
  return elements.filter(element => element.id !== id);
};
