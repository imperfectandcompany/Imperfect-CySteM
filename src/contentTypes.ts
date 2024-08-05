// src/contentTypes.ts

export interface HeaderElement {
  type: 'header';
  level: number;
  content: string;
}

export interface ParagraphElement {
  type: 'paragraph';
  content: string;
}

export interface ImageElement {
  type: 'image';
  url: string;
  alt: string;
}

export interface ListElement {
  type: 'list';
  ordered: boolean;
  items: string[];
  indent?: number; // for nested lists
}

export interface CodeBlockElement {
  type: 'codeBlock';
  language: string;
  content: string;
}

export interface CustomComponentElement {
  type: 'custom';
  directive: string;
  args: string;
  content: string[];
}

export interface InteractiveElement {
  type: 'interactive';
  args: string;
  content: string[];
}

export interface ErrorElement {
  type: 'error';
  message: string;
  content: string;
}
export interface AccordionElement {
  type: 'accordion';
  content: string;
  style: string;
}

export interface TabElement {
  type: 'tab';
  content: string;
  style: string;
}

export interface GalleryElement {
  type: 'gallery';
  content: string;
  style: string;
}

export interface CarouselElement {
  type: 'carousel';
  content: string;
  style: string;
}

export interface CodeElement {
  type: 'code';
  content: string;
  style: string;
}

export interface TestimonialElement {
  type: 'testimonial';
  content: string;
  style: string;
}

export interface CountdownElement {
  type: 'countdown';
  content: string;
  style: string;
}

export interface AlertElement {
  type: 'alert';
  content: string;
  style: string;
}

export interface TableElement {
  type: 'table';
  content: string;
  style: string;
}

export interface CardElement {
  type: 'card';
  content: string;
  style: string;
}

export interface ModalElement {
  type: 'modal';
  content: string;
  style: string;
}

export interface ProgressElement {
  type: 'progress';
  content: string;
  style: string;
}

export interface LeaderboardElement {
  type: 'leaderboard';
  content: string;
  style: string;
}

export interface YoutubeElement {
  type: 'youtube';
  url: string;
  style: string;
}

export interface FeatureElement {
  type: 'feature';
  content: string;
  style: string;
}

export interface ChangelogElement {
  type: 'changelog';
  content: string;
  style: string;
}

export interface StatsElement {
  type: 'stats';
  content: string;
  style: string;
}

export interface FaqElement {
  type: 'faq';
  content: string;
  style: string;
}

export interface DataVisualizationElement {
  type: 'data-visualization';
  content: string;
  style: string;
}

export interface InfoCardElement {
  type: 'info-card';
  content: string;
  style: string;
}

export interface ServerInfoElement {
  type: 'server-info';
  content: string;
  style: string;
}

export interface AdminCommandElement {
  type: 'admin-command';
  content: string;
  style: string;
}

export interface EventLogElement {
  type: 'event-log';
  content: string;
  style: string;
}

export interface PatchNotesElement {
  type: 'patch-notes';
  content: string;
  style: string;
}

export interface ServerRulesElement {
  type: 'server-rules';
  content: string;
  style: string;
}

export interface CommunitySpotlightElement {
  type: 'community-spotlight';
  content: string;
  style: string;
}

export interface WarningAlertElement {
  type: 'warning-alert';
  content: string;
  style: string;
}

export interface NeutralAlertElement {
  type: 'neutral-alert';
  content: string;
  style: string;
}

export interface SteamProfileElement {
  type: 'steam-profile';
  content: string;
  style: string;
}

export interface PlayerCommandElement {
  type: 'player-command';
  content: string;
  style: string;
}

export interface BugTrackerElement {
  type: 'bug-tracker';
  content: string;
  style: string;
}

export interface AchievementElement {
  type: 'achievement';
  content: string;
  style: string;
}

export interface ServerScheduleElement {
  type: 'server-schedule';
  content: string;
  style: string;
}

export interface NewMapElement {
  type: 'new-map';
  content: string;
  style: string;
}

export interface ServerPerformanceElement {
  type: 'server-performance';
  content: string;
  style: string;
}

export interface ModerationActionsElement {
  type: 'moderation-actions';
  content: string;
  style: string;
}

export interface MediaGalleryElement {
  type: 'media-gallery';
  content: string;
  style: string;
}

export interface CustomCommandsElement {
  type: 'custom-commands';
  content: string;
  style: string;
}

export interface AchievementUnlocksElement {
  type: 'achievement-unlocks';
  content: string;
  style: string;
}

export interface RankingSystemElement {
  type: 'ranking-system';
  content: string;
  style: string;
}

export interface RankingPointsElement {
  type: 'ranking-points';
  content: string;
  style: string;
}

export interface TextStyleElement {
  type: 'textstyle';
  content: string;
  style: string;
}

export interface SpacingElement {
  type: 'spacing';
  content: string;
  style: string;
}

export type ContentElement =
  | HeaderElement
  | ParagraphElement
  | ImageElement
  | ListElement
  | CodeBlockElement
  | CustomComponentElement
  | InteractiveElement
  | ErrorElement
  | AccordionElement
  | TabElement
  | GalleryElement
  | CarouselElement
  | CodeElement
  | TestimonialElement
  | CountdownElement
  | AlertElement
  | TableElement
  | CardElement
  | ModalElement
  | ProgressElement
  | LeaderboardElement
  | YoutubeElement
  | FeatureElement
  | ChangelogElement
  | StatsElement
  | FaqElement
  | DataVisualizationElement
  | InfoCardElement
  | ServerInfoElement
  | AdminCommandElement
  | EventLogElement
  | PatchNotesElement
  | ServerRulesElement
  | CommunitySpotlightElement
  | WarningAlertElement
  | NeutralAlertElement
  | SteamProfileElement
  | PlayerCommandElement
  | BugTrackerElement
  | AchievementElement
  | ServerScheduleElement
  | NewMapElement
  | ServerPerformanceElement
  | ModerationActionsElement
  | MediaGalleryElement
  | CustomCommandsElement
  | AchievementUnlocksElement
  | RankingSystemElement
  | RankingPointsElement
  | TextStyleElement
  | SpacingElement;
