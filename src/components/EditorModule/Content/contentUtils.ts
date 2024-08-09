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
function updateElementProperties(element: ContentElement, newContent: string): ContentElement {
  const propertiesToUpdate = Object.keys(element).filter(key => key !== 'id' && key !== 'type');

  // Split newContent if multiple properties need updating
  const contentParts = newContent.split('|');

  const updatedElement: any = { ...element };
  
  propertiesToUpdate.forEach((property, index) => {
    updatedElement[property] = contentParts[index] || updatedElement[property];
  });

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
