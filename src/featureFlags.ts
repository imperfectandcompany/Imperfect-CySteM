  // src/featureFlags.ts

  interface FeatureFlags {
    ContextMenu: boolean;
    // ContentScheduling: boolean;
    // ArticleFeedback: boolean;
    // BulkOperations: boolean;
    // VersionHistoryComparison: boolean;
    // UserAuthentication: boolean;
    // ToastNotifications: boolean;
    // TextDiffViewer: boolean;
    HomeSearch: boolean;
    StaffOnly: boolean; // Feature flag to set an article as staff only
    ArchiveArticle: boolean; // Feature flag to set an article as archived
    CreateCategory: boolean; // Feature flag to create a category
    CreateArticle: boolean; // Feature flag to create an article
    EditArticle: boolean; // Feature flag to edit an article
    DeleteArticle: boolean; // Feature flag to delete an article
    DeleteCategory: boolean; // Feature flag to delete a category
    EditCategory: boolean; // Feature flag to edit a category
    ViewArticleHistoryDiff: boolean; // Feature flag to view article history differences
    ViewArticleHistoryChangelog: boolean; // Feature flag to view article history differences
    ViewChangeLog: boolean; // Feature flag to see the change log for an article while inside the article edit
    ViewAdminLogs: boolean; // Feature flag to view admin logs
    CategoriesPage: boolean; // Feature flag for categories page
    SpecificCategoryPage: boolean; // Feature flag for specific category page that lists associated articles
    BackButtonArticleView: boolean; // Feature flag for a back button when viewing an article
    Breadcrumbs: boolean; // Feature flag for breadcrumbs overall
    AdminDashboard: boolean; // Feature flag for admin login
    PreviewArticle: boolean; // Feature flag for viewing previewing rendered view when editing an article 
    NotificationBanner: boolean; // Feature flag for the little notification / banner at the top of the page
    ViewArticleChangelog: boolean // Feature flag for the article history lineage preview when editing an article
    ViewPotentialArticleChanges: boolean // Feature flag for...
    articleDetailedCharacterLimit: boolean // Feature flag for...
  };

  const featureFlags: FeatureFlags = {
    ContextMenu: false, // Set this to true or false to enable/disable the context menu feature
    // ContentScheduling: false, // Set this to true or false to enable/disable content scheduling
    // ArticleFeedback: false, // Set this to true or false to enable/disable article feedback feature
    // BulkOperations: false, // Set this to true or false to enable/disable bulk operations
    // VersionHistoryComparison: false, // Set this to true or false to enable/disable version history comparison
    // UserAuthentication: false, // Set this to true or false to enable/disable user authentication and authorization
    // ToastNotifications: false, // Set this to true or false to enable/disable toast notifications
    // TextDiffViewer: false, // Set this to true or false to enable/disable text diff viewer
    HomeSearch: false, // Set this to true or false to enable/disable home search
    StaffOnly: true, // Set this to true or false to enable/disable the staff only feature
    ArchiveArticle: false, // Set this to true or false to enable/disable archiving articles
    CreateCategory: false, // Set this to true or false to enable/disable category creation
    CreateArticle: false, // Set this to true or false to enable/disable article creation
    EditArticle: true, // Set this to true or false to enable/disable article editing
    DeleteArticle: false, // Set this to true or false to enable/disable article deletion
    DeleteCategory: false, // Set this to true or false to enable/disable category deletion
    EditCategory: false, // Set this to true or false to enable/disable category editing
    ViewArticleHistoryDiff: false, // Set this to true or false to enable/disable viewing article history
    ViewArticleHistoryChangelog: false, // Set this to true or false to enable/disable viewing article history
    ViewChangeLog: false, // Set this to true or false to enable/disable viewing the change log for an article
    ViewAdminLogs: false, // Set this to true or false to enable/disable viewing admin logs
    CategoriesPage: false, // Set this to true or false to enable/disable the categories page
    SpecificCategoryPage: false, // Set this to true or false to enable/disable the specific category page
    BackButtonArticleView: false, // Set this to true or false to enable/disable the back button when viewing an article
    Breadcrumbs: false, // Set this to true or false to enable/disable breadcrumbs
    AdminDashboard: true, // Set this to true or false to enable/disable admin login
    PreviewArticle: true, // Set this to true or false to enable/disable previewing articles
    NotificationBanner: false, // Feature flag for the little notification / banner at the top of the page
    ViewArticleChangelog: false, // Feature flag for the little notification / banner at the top of the page
    ViewPotentialArticleChanges: false, // Feature flag for the little notification / banner at the top of the page
    articleDetailedCharacterLimit: false // Feature flag for the little notification / banner at the top of the page
  };
    
  export function isFeatureEnabled(flag: keyof FeatureFlags): boolean {
    return featureFlags[flag];
  }