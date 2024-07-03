/** src/utils.ts **/

import { Card, CardVersion, Section, content } from "./content";

export function generateSlug(title: string): string {
  return title.toLowerCase().replace(/ /g, "-");
}

// This function now fetches the latest version of the card based on the slug.
export function findCardBySlug(slug: string): Card | null {
  for (const section of Object.values(content.sections)) {
    const card = section.cards.find(
      (card) =>
        generateSlug(card.versions[card.versions.length - 1].title) === slug
    );
    if (card) {
      return card;
    }
  }
  return null;
}

export function editCard(
  cardId: number,
  updatedFields: Partial<
    Card & {
      description?: string;
      title?: string;
      detailedDescription?: string;
    }
  >
): void {
  const card = findCardById(cardId);
  if (!card) return;

  const latestVersion = card.versions[card.versions.length - 1];
  const newVersion: CardVersion = {
    ...latestVersion,
    versionId: latestVersion.versionId + 1,
    editDate: new Date().toISOString(),
    changes: [],
  };

  if (updatedFields.title && updatedFields.title !== latestVersion.title) {
    newVersion.changes?.push(
      `Title changed from "${latestVersion.title}" to "${updatedFields.title}"`
    );
    newVersion.title = updatedFields.title;
  }

  if (
    updatedFields.description &&
    updatedFields.description !== latestVersion.description
  ) {
    newVersion.changes?.push(`Description changed`);
    newVersion.description = updatedFields.description;
  }

  if (
    updatedFields.detailedDescription &&
    updatedFields.detailedDescription !== latestVersion.detailedDescription
  ) {
    newVersion.changes?.push(`Detailed description changed`);
    newVersion.detailedDescription = updatedFields.detailedDescription;
  }

  if (updatedFields.category && updatedFields.category !== card.category) {
    newVersion.changes?.push(
      `Moved from category "${card.category}" to "${updatedFields.category}"`
    );
    card.category = updatedFields.category;
  }

  card.versions.push(newVersion);
}

// Checks if a category already exists based on title
export const checkCategoryExists = async (title: string): Promise<boolean> => {
  const normalizedTitle = title.trim().toLowerCase();
  return Object.values(content.sections).some((section) => {
    const latestVersionTitle =
      section.versions[section.versions.length - 1].title.toLowerCase();
    return latestVersionTitle === normalizedTitle;
  });
};

// Adds a new category if it does not already exist
export const addNewCategory = async ({
  title,
}: {
  title: string;
}): Promise<{ success: boolean }> => {
  try {
    if (await checkCategoryExists(title)) {
      console.error("Category already exists");
      return { success: false };
    }

    const newId = Object.keys(content.sections).length + 1; // Generate the next ID based on the current content length
    const newVersionId = 1; // As this is a new category, it starts with versionId 1
    content.sections[newId] = {
      // Use newId to directly set the section
      versions: [
        {
          versionId: newVersionId,
          title: title,
          diffs: "",
          editedBy: 1, // Assuming a logged-in user ID
          editDate: new Date().toISOString(),
        },
      ],
      cards: [], // No cards initially
    };

    return { success: true };
  } catch (error) {
    console.error("Failed to create new category:", error);
    return { success: false };
  }
};

// Assuming each section can be uniquely identified by a key
export const findCategoryById = (id: number): Section | null => {
  // Directly return the section if it exists, or null if it does not
  return content.sections[id] || null;
};

// Updates a category given its ID and new data
export const updateCategory = async (
  id: number,
  data: { title: string }
): Promise<{ success: boolean }> => {
  try {
    const category = findCategoryById(id);
    if (category) {
      const latestVersion = category.versions[category.versions.length - 1];
      const newVersion = {
        ...latestVersion,
        versionId: latestVersion.versionId + 1,
        title: data.title,
        editDate: new Date().toISOString(),
        editedBy: 1, // Assuming a user ID here
        diffs: "", // Assuming diffs handling logic is elsewhere
      };
      category.versions.push(newVersion);
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    console.error("Update failed:", error);
    return { success: false };
  }
};

// Function to find the next available ID
const getNextId = () => {
  const allCards = Object.values(content.sections).flatMap(
    (section) => section.cards
  );
  const highestId = allCards.reduce(
    (maxId, card) => Math.max(maxId, card.id),
    0
  );
  return highestId + 1;
};

// WARNING - ADDS CATEGORY TO SECTION THAT DOES NOT EXIST -> THIS IS FOR FUTURE SUPPORT FOR CREATING NEW SECTION WHEN ADDING ARTICLE (NOT PRIORITY NOW)
export const addNewArticle = async ({
  title,
  description,
  detailedDescription,
  category,
  imgSrc,
}: {
  title: string;
  description: string;
  detailedDescription: string;
  category: number;
  imgSrc: string;
}): Promise<{ success: boolean }> => {
  try {
    const newId = getNextId(); // Generate the next ID based on current content
    const newArticle: Card = {
      id: newId,
      imgSrc: imgSrc,
      versions: [
        {
          versionId: 1,
          title,
          description,
          detailedDescription,
          editedBy: 1, // Assuming a logged-in user ID
          editDate: new Date().toISOString(),
          changes: ["Initial creation"],
        },
      ],
      archived: false,
      staffOnly: false,
      category: category, // Set category, now a number
      slug: title.toLowerCase().replace(/ /g, "-"),
      matches: {
        title: false,
        description: false,
        detailedDescription: false,
      },
    };

    // Ensure the category exists in the sections or create it
    if (!content.sections[category]) {
      content.sections[category] = { versions: [], cards: [] }; // Initialize if not present
    }
    content.sections[category].cards.push(newArticle);

    return { success: true };
  } catch (error) {
    console.error("Failed to create new article:", error);
    return { success: false };
  }
};

// Function to check if an article with the same title already exists
export const checkArticleExists = async (title: string): Promise<boolean> => {
  const normalizedTitle = title.trim().toLowerCase();

  for (const section of Object.values(content.sections)) {
    for (const card of section.cards) {
      const latestTitle =
        card.versions[card.versions.length - 1].title.toLowerCase();
      if (latestTitle === normalizedTitle) {
        return true; // Found an article with the same title
      }
    }
  }
  return false; // No article with the same title found
};

// Function to get all categories with their latest titles
export const getAllCategories = async (): Promise<
  { id: number; title: string }[]
> => {
  return Object.entries(content.sections).map(([id, section]) => {
    const latestVersion = section.versions.slice(-1)[0]; // Get the latest version
    return {
      id: parseInt(id), // Convert key to a number
      title: latestVersion.title,
    };
  });
};

// set the token cookies for the user
export const setUserToken = (token: string) => {
  const d = new Date();
  d.setTime(d.getTime() + 7 * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie =
    "IGSUPPORT=" + token + ";" + expires + ";path=/";
  document.cookie = "IGSUPPORT_=1;" + expires + ";path=/";
}

 // return the token from the session storage
 export const getToken = () => {
  const getCookieValue = (name: string) =>
  document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || "";
  if(getCookieValue('IGSUPPORT_') === "1"){
    if(getCookieValue('IGSUPPORT') !== "1"){
      return getCookieValue('IGSUPPORT');
    } else{
      return false;
    }
  } else {
    return false;
  }
}

  // remove the token and user from the session storage
  export const removeUserToken = async () => {
    //update and or create cookies
    let expires = "expires=expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie =
      "IGSUPPORT=1;" +
      expires +
      ";path=/";
    document.cookie = "IGSUPPORT_=1;" + expires + ";path=/";
    const token = getToken();
    if(!token){
      console.log('Removed Token from frontend');
      return true;
    } else {
      console.log('Could not remove token from frontend (removeUserToken() in utils.ts)');
      return true;
    }
  }  
  

export const removeLoginSession = async (): Promise<boolean> => {
  try {
    const backendRemoved = await deleteToken();
    if (!backendRemoved) {
      throw new Error("Failed to remove backend session.");
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const deleteToken = async (): Promise<boolean> => {
  const token = getToken();
  if (!token) {
    console.error("Token does not exist in frontend! Cannot delete token in backend.");
    return false;
  }

  try {
    const response = await fetch("https://api.imperfectgamers.org/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": `${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to logout from backend.");
    }

    return true;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return false;
  }
};

export function findCardById(id: number): Card | null {
  for (const section of Object.values(content.sections)) {
    const card = section.cards.find((card) => card.id === id);
    if (card) {
      return card;
    }
  }
  return null;
}

export function highlightText(text: string, query: string): string {
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts
    .map((part) =>
      part.toLowerCase() === query.toLowerCase()
        ? `<span class="highlight">${part}</span>`
        : part
    )
    .join("");
}

export const getElementPosition = (
  element: HTMLElement
): { x: number; y: number } => {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + window.scrollX,
    y: rect.top + window.scrollY,
  };
};
