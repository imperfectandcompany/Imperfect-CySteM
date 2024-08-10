import { CustomComponentElement, InteractiveElement, ContentElement } from "./contentTypes";

// Helper type to narrow down the elements that use a string array for content
type CustomContentElement = CustomComponentElement | InteractiveElement;

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
      } else if (typeof newContent === 'string') {
        // Dynamically update properties based on element type
        return updateElementProperties(element, newContent);
      }
    }
    return element;
  });
};

// Dynamic property updater
export function updateElementProperties(element: ContentElement, newContent: string | string[]): ContentElement {
  const updatedElement = { ...element } as any;

  if (Array.isArray(newContent)) {
    // If newContent is an array, treat it as a list of items
    updatedElement.items = newContent;
  } else {
    // If newContent is a string, split it by `|` and map it to properties
    const contentParts = newContent.split('|');
    const propertiesToUpdate = Object.keys(element).filter(key => key !== 'id' && key !== 'type');

    propertiesToUpdate.forEach((property, index) => {
      if (index < contentParts.length && contentParts[index] !== undefined && contentParts[index] !== '') {
        updatedElement[property] = contentParts[index];
      }
    });
  }

  return updatedElement as ContentElement;
}





// Type guard to check if an element uses an array of strings for its content
function isCustomContentElement(element: ContentElement): element is CustomContentElement {
  return ['custom', 'interactive'].includes(element.type);
}

// Utility function to remove an element by id
export const removeElementById = (elements: ContentElement[], id: string): ContentElement[] => {
  return elements.filter(element => element.id !== id);
};
