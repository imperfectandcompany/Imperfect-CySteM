<p align="center">
  <img src="https://cdn.imperfectgamers.org/inc/assets/img/icon/isometric_ig_circle.png" width="100" />
</p>
<p align="center">
    <h1 align="center">IMPERFECT CySteM</h1>
</p>

<p align="center">
	    <em>Perfect Support for Imperfect.</em>
	Validated through Imperfect Gamers utility.
    <em>https://support.imperfectgamers.org/</em>
</p>

<p align="center">
	<img src="https://img.shields.io/github/last-commit/imperfectandcompany/Imperfect-Gamers-Site-Support?style=flat&logo=git&logoColor=white&color=0080ff" alt="last-commit">
<p>


Latest screenshots (August 9th):
<img width="1128" alt="image" src="https://github.com/user-attachments/assets/49d67b00-450e-4bbb-ab85-a8fce3ddf7ea">
<img width="993" alt="image" src="https://github.com/user-attachments/assets/5eb99c73-5c26-480f-812f-f41f55c60996">
<img width="993" alt="image" src="https://github.com/user-attachments/assets/997e1cc0-fb31-44fc-9ef6-69efdde5a886">
<img width="924" alt="image" src="https://github.com/user-attachments/assets/e6411378-47a7-4648-a3be-9794c25ed746">
<img width="924" alt="image" src="https://github.com/user-attachments/assets/70dd4a8a-19ea-4d32-bd0d-5350e32a1f4c">
These screenshots do not include the refinements that were made to the other aspects. just significant intro to new feature.

# New Feature Update: Imperfect Editor Module

## Overview
The Imperfect Editor Module is a flexible and robust content editor designed for managing a wide range of content types within the Imperfect Gamers ecosystem. This module has been tailored to support dynamic content creation with an emphasis on scalability, user experience, and long-term maintainability.

## Features 

### Dynamic Content Management
- **Flexible Content Updates:** The `updateContent` function allows for dynamic content updates, whether it's a single string or an array of strings. This flexibility is essential for managing various elements, such as paragraphs, lists, and images.
- **Dynamic Property Handling:** The `updateElementProperties` function is particularly powerful, as it dynamically updates element properties based on new content, ensuring consistent handling across all content types.

### Custom Components and Interactive Elements
- **Custom Content Handling:** The handling of `CustomComponentElement` and `InteractiveElement` types is well-structured, offering a way to manage complex content types involving arrays of strings or specialized rendering logic.

### Extensive Support for Content Types
- **Wide Range of Content:** The module supports a broad array of content types, from basic text elements to more complex structures like tables, code blocks, and custom interactive elements, ensuring comprehensive coverage for content creation needs.

### Editable Components
- **Inline Editing:** Components like `EditableComponent`, `EditableImage`, `EditableList`, and `EditableTable` provide inline editing capabilities, enabling users to modify content directly within the interface for real-time updates and immediate feedback.
- **Seamless Transition:** The `renderEditableElement` function efficiently renders the appropriate editing interface based on the element type, providing a seamless transition between view and edit modes.

### Syntax Generation and Modal Handling
- **Custom Syntax:** The ability to generate custom syntax for elements and display it in a modal is a valuable feature, particularly for advanced users. The `generateElementSyntax` function, coupled with the modal system, offers transparency into how content is structured.
- **Integrated Modal System:** The modal system is well-integrated, featuring smooth transitions and user-friendly interactions, including a copy functionality for syntax.

### Responsive and Interactive UI
- **Responsive Design Preview:** The implementation of responsive design views (mobile, tablet, desktop) ensures that users can preview how their content will appear across different devices.
- **Design Tools:** The inclusion of tools like a dimension ruler and layout zoom further enhances the editor’s capability, making it a powerful tool for content creators.

## Latest Change Log

### 1. **Content Editor Components Enhancements**
   - **Dynamic Property Handling:** Enhanced `updateElementProperties` to manage both single and multiple property updates dynamically, enabling more flexible content editing.
   - **Component Refinements:**
     - Simplified `EditableComponent` for streamlined content rendering.
     - Improved `EditableTable` with better row and column management for more intuitive content editing.
     - Removed `onRemove` from `EditableList` for a cleaner list editing process.
   - **Content Rendering:** Consolidated content rendering logic for consistent handling of all elements within the editor.
   - **Header Flexibility:** Updated `renderHeader` for safe handling of header levels.

### 2. **Improved Saving and Scalability**
   - Fixed saving for content types that omit content from `BaseContentElement`.
   - Updated utility functions to eliminate hardcoding, setting the stage for future scalability (CMS for CMS).
   - Integrated a save button for better user control over content saving.

### 3. **Editor Module Refactor**
   - **AdminCreateArticle Component:**
     - Commented out unnecessary raw text areas for better UI clarity.
   - **EditorModule Component:**
     - Introduced `isActualMobileDevice` prop to tailor features based on device type.
     - Improved dropdown menu behavior with better scroll and click-away handling.
     - Added modal animations and copy-to-clipboard functionality for generated syntax.
   - **Responsive UI Enhancements:** Adjusted `MenuBar`, `ViewToolbar`, and other UI elements for improved responsiveness.

### 4. **Feature Additions**
   - **Editing Support:** Added further editing support for individual items within elements like lists, with options to add or remove items.
   - **Custom Editor Module:** Introduced a custom build of the Imperfect Editor Module (WIP) for use across our software suite.

### 5. **Content Parsing and New Content Types**
   - Extended `parseContent` and `contentRenderer` to support new content types, including accordion, tab, gallery, carousel, and more.
   - Updated CSS with improved styles and animations for a better visual experience.

### 6. **UI and UX Improvements**
   - **ProgressBar Component:** Added a `color` prop for customizable progress bar colors.
   - **Categories and Breadcrumbs:** Improved loading indicators and navigation for a more intuitive user experience.
   - **Error Handling:** Enhanced error handling and loading states across components for better user feedback.

### 7. **Admin and Support Components Refactor**
   - Refactored `AdminCreateArticle`, `AdminEditArticle`, and other admin components for improved loading states, error handling, and UX.
   - Updated routing logic, form handling, and UI feedback across various components to enhance navigation, maintainability, and user experience.

### 8. **Optimized Cache Management and UI Consistency**
   - Implemented cache updates for items when categories are updated, ensuring immediate reflection across the UI.
   - Enhanced optimistic UI logic to promptly reflect article modifications and category movements.

### 9. **Improved Error Handling and Restoration Logic**
   - Enhanced the logic for deletion and restoration workflows, ensuring accurate state synchronization and UI updates.

## Future Plans
- Continued refactoring to support future scalability and maintainability.
- Integration of more advanced content types and features as development progresses.
- Ongoing improvements to the admin dashboard, with better handling of category and article management.





### New Support Request Management Feature

We have introduced a comprehensive support request management feature that includes the following components:

- **AdminSupportForm**: Admin interface for managing support requests, issues, inputs, and action logs.
- **SupportForm**: User interface for submitting support requests by selecting issue categories, sub-issues, and filling in details.
- **IssueCategories**: Manage issue categories and subcategories.
- **Inputs**: Manage various types of inputs related to issues.
- **Issues**: Display and manage issues.
- **ActionLogs**: Display logs of actions taken.
- **SupportRequestList**: List support requests.
- **SupportRequestDetails**: Detailed view of support requests.

### Backend Communication

Ensure the following backend API endpoints are working as expected:
- `/support/requests`
- `/support/requests/populate`
- `/support/requests/inputs`
- `/support/requests/issues`
- `/support/requests/logs`
- `/support/requests/submit`

### Fetching and Managing Data

The components are designed to interact with these endpoints. Ensure headers, tokens, and request bodies align with our backend expectations.

### Components Interaction

- **Tabs**: Renders and handles tab click events.
- **AccordionItem**: Single accordion item used in lists.
- **Breadcrumb**: Breadcrumb component for navigation.

### Future Enhancements

- Adding authentication checks and redirects for admin pages.
- Expanding input types and validation logic.
- Improving mobile responsiveness with Tailwind CSS.
- Implementing caching mechanisms for repeated data fetches.
- Adding tests using frameworks like Jest for component testing.


screenshots july 23:
![image](https://github.com/user-attachments/assets/000384b3-efe1-4783-bcc6-19b9571386ad)
![image](https://github.com/user-attachments/assets/3d331560-7057-4c1e-a2f1-50b587b24d62)
![image](https://github.com/user-attachments/assets/de69cde9-0693-4d3b-a798-a22cbcf15f35)
![image](https://github.com/user-attachments/assets/5e436b97-fa1a-46e9-bb98-966c2c93bae6)
![image](https://github.com/user-attachments/assets/27b13968-0bb6-43c2-9fe4-f8632ed90fe2)
![image](https://github.com/user-attachments/assets/80d1424d-1447-4648-a810-e7b2138469ea)
![image](https://github.com/user-attachments/assets/df0c053b-e51d-4134-b21f-2bf1517f508e)

future design ideas for after july 23:
![image](https://github.com/user-attachments/assets/957419ef-412d-46f9-a349-5ef5d80790bb)
![image](https://github.com/user-attachments/assets/16c2c40c-691e-4f67-830d-0ff66ce70388)

july12:
![image](https://github.com/user-attachments/assets/bc659f6a-2797-4e02-957f-a02eb3dcbbfe)
![image](https://github.com/user-attachments/assets/39f817ff-5eef-4794-8a10-780007224980)
![image](https://github.com/user-attachments/assets/47722024-7dca-48f3-bd26-b2ea9a961b3b)
![image](https://github.com/user-attachments/assets/fe6f9cc6-c8dd-4d55-bff3-cc8145fff77c)
![image](https://github.com/user-attachments/assets/6854b1b8-197e-4b7f-b17c-fe076369716b)
![image](https://github.com/user-attachments/assets/5aa22383-e122-482d-855c-842fc48658db)
![image](https://github.com/user-attachments/assets/ccb18080-cac0-4195-9d43-b284162537a9)
![image](https://github.com/user-attachments/assets/68992858-7e57-4e2a-9e53-163d06dd78f9)
plan is to decouple crud functions from our 2due software: https://github.com/imperfectandcompany/Imperfect-and-Company-Internal-2DUE and turn the kanban style into a support lead pipeline putting user that submitted in backlog and allowing us to move them down the pipeline kanban style for tracking and followup.
move category support within edit article update
![image](https://github.com/user-attachments/assets/1df93dfe-ae71-4b31-b7c7-dd7665e9c1e6)




Screenshots (july 9):
<img width="1453" alt="image" src="https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/assets/3193289/8a80493a-b8c4-4f00-946d-3cf404c18fdf">
<img width="1453" alt="image" src="https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/assets/3193289/65c1e04e-b876-43c6-b44c-6a90635e68ce">
<img width="1453" alt="image" src="https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/assets/3193289/9c4a5300-cae0-41f7-9ede-3c17a48d6976">
<img width="1453" alt="image" src="https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/assets/3193289/7c8d898e-be22-4201-9794-5cab6334b640">
<img width="1453" alt="image" src="https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/assets/3193289/b4928f62-528a-4560-a5d0-31a98ac05329">
<img width="1453" alt="image" src="https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/assets/3193289/69e91e0d-c07e-47bc-8bd5-b87185c4697e">
<img width="1453" alt="image" src="https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/assets/3193289/ca8a557f-2f96-4dfa-8661-0b21c0fd3ecd">
<img width="1453" alt="image" src="https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/assets/3193289/f59b412f-9d02-41ea-839b-bafc0025f53a">
<img width="1453" alt="image" src="https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/assets/3193289/78e6e755-fdca-441d-ad8a-7aae20fec0d1">
<img width="1453" alt="image" src="https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/assets/3193289/0b109ef2-f488-4ef5-82c9-a7430df4f659">
<img width="1453" alt="image" src="https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/assets/3193289/a8cfce92-1191-4886-94f1-0d83ddea6258">
<img width="1453" alt="image" src="https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/assets/3193289/def3f502-784e-47ce-96e7-ee9f227a4cd8">
<img width="1453" alt="image" src="https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/assets/3193289/4aba0d5b-c6d4-4a39-876f-68b3e73110a3">
<img width="1453" alt="image" src="https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/assets/3193289/06117b85-d21e-41be-9cd5-901fa9964625">
<img width="1453" alt="image" src="https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/assets/3193289/3677ad44-543f-4d12-87d8-48286ca6e7c5">

---

## 📍 Overview

The Imperfect Gamers Site Support project is a Preact-based web application serving as a content management and administration platform for our community. It features a user-friendly interface with admin tools for article and category management, user access control, and CRUD operations. Additionally, it boasts an interactive UI with search functionality, dynamic content presentation, breadcrumb navigation, and a robust notification system. The use of Tailwind CSS for styling, TypeScript for type safety, and an organized component structure underline its modern development approach, making it efficient and scalable. Emphasizing this modular design, it leverages TypeScript, integrates automated testing, and ensures a streamlined development process with tools like Vite and PostCSS. As stated, the Imperfect Gamers Site Support application serves as a centralized hub for addressing support needs within the Imperfect Gamers community, enhancing user experience and operational productivity. This platform aims to streamline content administration and enhance user experience, consolidating support resources for the Imperfect Gamers community. 

---

## Current State of the Application

Our application is in a dynamic state of growth and improvement. We are constantly working on enhancing existing features and adding new functionalities to provide a seamless experience for both our administrators and users.

### What's Working:

- **Content Management for Admins**: Administrators have full control over the content, including creating, editing, and deleting articles and categories. This is facilitated through intuitive UI components such as `AdminDashboard`, `AdminCreateArticle`, and `AdminEditArticle`.
  - **Admin Dashboard**: A comprehensive overview for administrators to manage articles and categories. Features include toggling articles' archive and staff-only status, and deleting articles or categories optimistically from the UI.
    
  - **Creating and Editing Articles**: Admins can create new articles and edit existing ones, with features like toggling between raw and rendered views, and adjusting text area height dynamically.
    
- **Viewing Experience for Users**: Our platform offers a rich viewing experience for both staff and regular users, with features tailored to each group's needs.
  - **Feature-Rich Articles**: Users can view articles, with staff members having access to additional content marked as staff-only.
  - **Interactive UI Components**: Users interact with articles through a well-designed UI, featuring components like `FeatureCard` and `Article`, enhancing the browsing experience.

### What's in Progress:

- **Notification Banner**: A feature designed to communicate important updates to users effectively. This is a work in progress aimed at enhancing user engagement.
  
- **Enhanced Search Functionality**: We are in the process of refining our search functionality to offer more accurate and relevant search results to our users.

## How to Navigate the UI

- **For Administrators**: The admin dashboard is your central hub. Here, you can manage articles, view logs, access the recycle bin, and create new content. Navigation is straightforward, with clear labels and intuitive design.
- **For Users**: The user interface is designed for ease of use. You can browse articles, search for specific topics, and access different categories from the homepage. Staff members have additional access privileges, which are seamlessly integrated into their viewing experience.

## Features

### For Administrators:

- **Comprehensive Content Management**: Create, edit, and manage articles and categories directly from the admin dashboard.
- **Recycle Bin**: Deleted articles and categories can be restored, ensuring that no content is lost accidentally.
  
### For Users (Staff + Regular):

- **Engaging Content Viewing**: Access a wide range of articles, with special content available exclusively to staff.

---

##  Repository Structure

```sh
└── Imperfect-Gamers-Site-Support/
    ├── aggregateFiles.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.js
    ├── public
    │   └── vite.svg
    ├── src
    │   ├── api.ts
    │   ├── app.tsx
    │   ├── assets
    │   │   └── preact.svg
    │   ├── components
    │   │   ├── AccessRestricted.tsx
    │   │   ├── Admin.tsx
    │   │   ├── AdminArticleHistoryView.tsx
    │   │   ├── AdminCreateArticle.tsx
    │   │   ├── AdminCreateCategory.tsx
    │   │   ├── AdminDashboard.tsx
    │   │   ├── AdminEditArticle.tsx
    │   │   ├── AdminEditCategory.tsx
    │   │   ├── AdminError.tsx
    │   │   ├── AdminLogs.tsx
    │   │   ├── AdminRecycleBin.tsx
    │   │   ├── Article.tsx
    │   │   ├── ArticleView.tsx
    │   │   ├── Breadcrumb.tsx
    │   │   ├── Categories.tsx
    │   │   ├── CategoryItems.tsx
    │   │   ├── ContextMenu.tsx
    │   │   ├── ErrorBoundary.tsx
    │   │   ├── FeatureCard.tsx
    │   │   ├── Footer.tsx
    │   │   ├── Header.tsx
    │   │   ├── Home.tsx
    │   │   ├── MainContent.tsx
    │   │   ├── NotFound.tsx
    │   │   ├── Section.tsx
    │   │   ├── SkeletonLoader.tsx
    │   │   ├── TextDiffViewer.tsx
    │   │   ├── Toast.tsx
    │   │   ├── ToastContainer.tsx
    │   │   ├── models
    │   │   │   └── userModel.ts
    │   │   └── toastContext.tsx
    │   ├── content.ts
    │   ├── contentParser.ts
    │   ├── contentRenderer.tsx
    │   ├── contentTypes.ts
    │   ├── contexts
    │   │   ├── AuthContext.tsx
    │   │   └── ContentContext.tsx
    │   ├── featureFlags.ts
    │   ├── index.css
    │   ├── main.tsx
    │   ├── tests
    │   │   ├── App.test.tsx
    │   │   ├── components
    │   │   │   ├── Article.test.tsx
    │   │   │   ├── Categories.test.tsx
    │   │   │   ├── FeatureCard.test.tsx
    │   │   │   ├── Footer.test.tsx
    │   │   │   ├── Header.test.tsx
    │   │   │   ├── Home.test.tsx
    │   │   │   ├── MainContent.test.tsx
    │   │   │   └── __snapshots__
    │   │   │       └── Header.test.tsx.snap
    │   │   ├── reducer.test.ts
    │   │   └── vitest.setup.ts
    │   ├── utils.ts
    │   └── vite-env.d.ts
    ├── tailwind.config.js
    ├── tsconfig.json
    ├── tsconfig.node.json
    └── vite.config.ts
```

---

##  Modules

<details closed><summary>.</summary>

| File                                                                                                                      | Summary                                                                                                                                                                            |
| ---                                                                                                                       | ---                                                                                                                                                                                |
| [tsconfig.json](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/tsconfig.json)           | Configures TypeScript for Preact in web-dev-focused repo, emphasizing type safety and module consistency.                                                                          |
| [index.html](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/index.html)                 | The `index.html` serves as the entry point, integrating external styles and loading the main Preact application.                                                                   |
| [postcss.config.js](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/postcss.config.js)   | postcss.config.js` configures PostCSS for Tailwind CSS integration and vendor prefixing, enhancing the project's CSS workflow.                                                     |
| [vite.config.ts](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/vite.config.ts)         | The `vite.config.ts` orchestrates module bundling and test setup, integrating Preact and enforcing CSS module scope within the web app architecture.                               |
| [package.json](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/package.json)             | WILL BE UPDATED IN FUTURE.                             |
| [aggregateFiles.js](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/aggregateFiles.js)   | This script is made to 'support' codebase ingestion for AI; aggregates data files, manages dependencies, builds UI components. |
| [tsconfig.node.json](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/tsconfig.node.json) | The `tsconfig.node.json` configures TypeScript for Node.js specific files in the project, ensuring correct type support and module resolution.                                     |
| [tailwind.config.js](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/tailwind.config.js) | The `tailwind.config.js` configures Tailwind CSS for UI styling, specifying content paths and theme extensions in the web application's frontend architecture.                     |
| [package-lock.json](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/package-lock.json)   | WILL BE UPDATED IN FUTURE.                                                                    |

</details>

<details closed><summary>src</summary>

| File                                                                                                                            | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---                                                                                                                             | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| [utils.ts](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/utils.ts)                       | THIS FILE WILL BE REMOVED IN THE FUTURE. WE USED THIS WHEN WE HAD THE APPLICATION MOCKED WHILE VALIDATING DATA STRUCTURE                                                                                                                                    |
| [app.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/app.tsx)                         | THIS SECTION WILL BE UPDATED IN THE FUTURE..                                                                                                                                                                                                                                                                       |
| [main.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/main.tsx)                       | Entry point initializes web app by rendering the top-level `App` component, integrating styles from `index.css`.                                                                                                                                                                                                                                                                                                                                        |
| [contentRenderer.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/contentRenderer.tsx) | This codebase manages dynamic rendering of structured content, translating various element types like headers, paragraphs, and lists into corresponding JSX components within our content management feature of the wider web app.                                                                                                                                                                                                                          |
| [vite-env.d.ts](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/vite-env.d.ts)             | The vite-env.d.ts file provides TypeScript type definitions for Vite, supporting efficient development within a Vite-based project.                                                                                                                                                                                                                                                                                                                     |
| [contentParser.ts](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/contentParser.ts)       | Content parser transforms raw text into structured elements, enriching the our rendering pipeline.                                                                                                                                                                                                                                                                                                                                                   |
| [content.ts](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/content.ts)                   | The code provides admin-focused data structure for a website's CMS, handling article and category management. WILL BE REMOVED IN THE FUTURE AS WE MOVE AWAY FROM MOCKED PROTOTYPE AND FURTHER INTEGRATE OUR BACKEND.                                                                                                                                                                                                                                                                                                     |
| [api.ts](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/api.ts)                           | THIS INFORMATION WILL BE UPDATED IN THE FUTURE.                                                                                                                                                                                                      |
| [featureFlags.ts](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/featureFlags.ts)         | The provided code snippet likely pertains to the front-end part of a web-based platform, designed for Imperfect Gamers. Key components include administrative tools (dashboard, article/category management, logs, recycle bin), content viewing (articles, categories), and UI elements (context menu, error handling). The `src/components` directory is indicative of a React or Preact web application highlighting a component-based architecture. |
| [index.css](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/index.css)                     | The code snippet's function within the wider Imperfect-Gamers-Site-Support architecture is to manage administrative tasks like article and category creation, editing, and history viewing, as part of a basic Content Management System for gaming-related content.                                                                                                                                                                                    |
| [contentTypes.ts](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/contentTypes.ts)         | Defines content model interfaces for our content management system, enabling structured rich text representation for front-end rendering.                                                                                                                                                                                                                                                                                                                 |

</details>

<details closed><summary>src.components</summary>

| File                                                                                                                                                       | Summary                                                                                                                                                                                                                                                                                                                                                        |
| ---                                                                                                                                                        | ---                                                                                                                                                                                                                                                                                                                                                            |
| [AdminArticleHistoryView.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/components/AdminArticleHistoryView.tsx) | AdminArticleHistoryView visualizes an article's edit history within the content management system, aiding in moderation and content oversight.                                                                                                                                                                                                                   |
| [AdminEditCategory.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/components/AdminEditCategory.tsx)             | This JavaScript-based module, aggregateFiles.js, combines multiple files for the Imperfect Gamers Site, supporting ingestion for AI.                                                                                           |
| [AdminError.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/components/AdminError.tsx)                           | Provides an admin-specific error boundary component that displays a message and a link back to the admin dashboard.                                                                                                                                                                                                                                                     |
| [ToastContainer.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/components/ToastContainer.tsx)                   | Manages toast notifications by rendering and dismissing them in a UI overlay component.                                                                                                                                                                                                                                                                        |
| [ErrorBoundary.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/components/ErrorBoundary.tsx)                     | Default ErrorBoundary component encapsulates child components, providing a fallback UI and capturing JavaScript errors anywhere in their child component tree.                                                                                                                                                                                                         |
| [ArticleView.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/components/ArticleView.tsx)                         | Displays detailed view of an article, with navigation and dynamic content rendering in the web application.                                                                                                                                                                                                                                                      |
| [Article.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/components/Article.tsx)                                 | Article component: Manages article visibility and lifecycle, provides navigation via breadcrumb, and accesses content context for rendering articles.                                                                                                                                                                                                          |
| [Header.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/components/Header.tsx)                                   | The `Header.tsx` component provides navigation and search functionality, dynamically rendering feature-specific links based on feature flags.                                                                                                                                                                                                                  |
| [AdminLogs.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/components/AdminLogs.tsx)                             | The `AdminLogs.tsx` component handles the admin view of change logs, with functionality to fetch, filter, sort, and display article edit history and details within the imperfect gamers support site's admin panel.                                                                                                                                                         |
| [CategoryItems.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/components/CategoryItems.tsx)                     | Displays filtered articles by category with navigational breadcrumbs in a web support application.                                                                                                                                                                                                                                                             |
| [Toast.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/components/Toast.tsx)                                     | The Toast.tsx component manages user notification messages, displaying them briefly within the UI architecture, currently unused within the application until more immediate tasks are complete.                                                                                                                                                                                                                                                |
| [Footer.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/components/Footer.tsx)                                   | The code defines a stylized `Footer` component for our CMS, dynamically rendering copyrights and navigation links from a content model.                                                                                                                                                                                                                      |
| [MainContent.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/components/MainContent.tsx)                         | THIS WILL BE UPDATED IN THE FUTURE.                                                                                                                                                                                                              |
| [TextDiffViewer.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/components/TextDiffViewer.tsx)                   | TextDiffViewer.tsx` is a UI component for visualizing text differences, used within the admin-related features of the site support admin portal.                                                                                                                                                                                                                     |
| [AdminCreateArticle.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/components/AdminCreateArticle.tsx)           | THIS WILL BE UPDATED IN THE FUTURE. |
| [AccessRestricted.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/components/AccessRestricted.tsx)               | This AccessRestricted.tsx component displays a message for unauthorized access within a web application's UI layer.                                                                                                                                                                                                                                            |
| [Breadcrumb.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/components/Breadcrumb.tsx)                           | THIS WILL BE UPDATED IN THE FUTURE.                                                                                     |
| [Section.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/components/Section.tsx)                                 | The `Section.tsx` component dynamically generates a part of the UI with multiple `FeatureCard`s, filtering them based on a search query.                                                                                                                                                                                                                       |
| [AdminRecycleBin.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/components/AdminRecycleBin.tsx)                 | THIS WILL BE UPDATED IN THE FUTURE.     |
| [SkeletonLoader.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/components/SkeletonLoader.tsx)                   | The component `SkeletonLoader.tsx` provides a UI placeholder during async data loading in the site's content sections.                                                                                                                                                                                                                                         |
| [Admin.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/components/Admin.tsx)                                     | Admin.tsx provides an admin login interface leveraging the AuthContext for authentication within the management console.                                                                                                                                                                                                                                |
| [NotFound.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/components/NotFound.tsx)                               | The NotFound.tsx component provides a user-friendly 404 error page within the Preact application, offering redirection to the home page.                                                                                                                                                                                                                       |
| [AdminDashboard.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/components/AdminDashboard.tsx)                   | This is part the authenticated view for admin, providing a content management interface for administrators, with components for article and category management, history tracking, and more.                                                                                                  |
| [FeatureCard.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/components/FeatureCard.tsx)                         | THIS SECTION WILL BE UPDATED IN THE FUTURE.                                                                                                                                                                                                                        |
| [toastContext.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/components/toastContext.tsx)                       | Implements toast notifications system; manages messages and lifecycle within the site's UI context.                                                                                                                                                                                                                                                            |
| [ContextMenu.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/components/ContextMenu.tsx)                         | This `ContextMenu.tsx` component provides an interactive context menu with customizable options, auto-focus, and click-away-to-close functionality, essential for user interfaces in our app's architecture.                                                                                                                                                   |
| [AdminCreateCategory.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/components/AdminCreateCategory.tsx)         | This component allows administrators to create new categories within the site, ensuring that the chosen name is unique before submission and updating the global ContentContext upon successful creation.                                                                                                                                                      |
| [Categories.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/components/Categories.tsx)                           | The Categories.tsx component handles rendering category sections from the context in a navigable list, utilizing breadcrumbs for site navigation.                                                                                                                                                                                                              |
| [AdminEditArticle.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/components/AdminEditArticle.tsx)               | THIS SECTION WILL BE UPDATED IN THE FUTURE.      |
| [Home.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/components/Home.tsx)                                       | The `Home.tsx` component serves as the entry point to the user's help center, displaying category cards that link to their respective content, styled with a responsive gradient UI.                                                                                                                                                                           |

</details>

<details closed><summary>src.components.models</summary>

| File                                                                                                                                | Summary                                                                                                                               |
| ---                                                                                                                                 | ---                                                                                                                                   |
| [userModel.ts](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/components/models/userModel.ts) | The code represents a mock authentication model in a web app's architecture, defining user roles and simulating login/logout actions. This will be removed in the future as we move forward with our backend integration. |

</details>

<details closed><summary>src.contexts</summary>

| File                                                                                                                                   | Summary                                                                                                                                 |
| ---                                                                                                                                    | ---                                                                                                                                     |
| [AuthContext.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/contexts/AuthContext.tsx)       | Provides user authentication management for the site via context, enabling login, logout, token verification, and user status tracking. |
| [ContentContext.tsx](https://github.com/imperfectandcompany/Imperfect-Gamers-Site-Support/blob/master/src/contexts/ContentContext.tsx) | Core Post-Authentication component of our Preact-based web application, providing admin interfaces for content management and user access control.            |

</details>

---

##  Acknowledgments

- Our team that holds it down and inspires... alongside the community and users that make it all possible.
 
