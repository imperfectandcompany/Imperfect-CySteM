export interface BaseContentElement {
    type: string;
    content: string;
    style?: string;
    id: string;
    isEditing?: boolean;
    setEditing?: (id: string, isEditing: boolean) => void;
}

export interface HeaderElement extends BaseContentElement {
    type: 'header';
    level: number;
}

export interface ParagraphElement extends BaseContentElement {
    type: 'paragraph';
}

export interface ImageElement extends Omit<BaseContentElement, 'content'> {
    type: 'image';
    url: string;
    alt: string;
    title?: string;
    subtitle?: string;
}

export interface ListElement extends BaseContentElement {
    type: 'list';
    ordered: boolean;
    items: string[];
    indent?: number; // for nested lists
}

export interface CodeBlockElement extends BaseContentElement {
    type: 'codeBlock';
    language: string;
}

export interface CustomComponentElement extends Omit<BaseContentElement, 'content'> {
    type: 'custom';
    directive: string;
    args: string;
    content: string[];
}

export interface InteractiveElement extends Omit<BaseContentElement, 'content'> {
    type: 'interactive';
    args: string;
    content: string[];
}

export interface ErrorElement extends BaseContentElement {
    type: 'error';
    message: string;
}

export interface AccordionElement extends BaseContentElement {
    type: 'accordion';
}

export interface TabElement extends BaseContentElement {
    type: 'tab';
}

export interface GalleryElement extends BaseContentElement {
    type: 'gallery';
}

export interface CarouselElement extends BaseContentElement {
    type: 'carousel';
}

export interface CodeElement extends BaseContentElement {
    type: 'code';
}

export interface TestimonialElement extends BaseContentElement {
    type: 'testimonial';
}

export interface CountdownElement extends BaseContentElement {
    type: 'countdown';
}

export interface AlertElement extends BaseContentElement {
    type: 'alert';
}

export interface TableElement extends BaseContentElement {
    type: 'table';
}

export interface CardElement extends BaseContentElement {
    type: 'card';
}

export interface ModalElement extends BaseContentElement {
    type: 'modal';
}

export interface ProgressElement extends BaseContentElement {
    type: 'progress';
}

export interface LeaderboardElement extends BaseContentElement {
    type: 'leaderboard';
}

export interface YoutubeElement extends BaseContentElement {
    type: 'youtube';
    url: string;
}

export interface FeatureElement extends BaseContentElement {
    type: 'feature';
}

export interface ChangelogElement extends BaseContentElement {
    type: 'changelog';
}

export interface StatsElement extends BaseContentElement {
    type: 'stats';
}

export interface FaqElement extends BaseContentElement {
    type: 'faq';
}

export interface DataVisualizationElement extends BaseContentElement {
    type: 'data-visualization';
}

export interface InfoCardElement extends BaseContentElement {
    type: 'info-card';
}

export interface ServerInfoElement extends BaseContentElement {
    type: 'server-info';
}

export interface AdminCommandElement extends BaseContentElement {
    type: 'admin-command';
}

export interface EventLogElement extends BaseContentElement {
    type: 'event-log';
}

export interface PatchNotesElement extends BaseContentElement {
    type: 'patch-notes';
}

export interface ServerRulesElement extends BaseContentElement {
    type: 'server-rules';
}

export interface CommunitySpotlightElement extends BaseContentElement {
    type: 'community-spotlight';
}

export interface WarningAlertElement extends BaseContentElement {
    type: 'warning-alert';
}

export interface NeutralAlertElement extends BaseContentElement {
    type: 'neutral-alert';
}

export interface SteamProfileElement extends BaseContentElement {
    type: 'steam-profile';
}

export interface PlayerCommandElement extends BaseContentElement {
    type: 'player-command';
}

export interface BugTrackerElement extends BaseContentElement {
    type: 'bug-tracker';
}

export interface AchievementElement extends BaseContentElement {
    type: 'achievement';
}

export interface ServerScheduleElement extends BaseContentElement {
    type: 'server-schedule';
}

export interface NewMapElement extends BaseContentElement {
    type: 'new-map';
}

export interface ServerPerformanceElement extends BaseContentElement {
    type: 'server-performance';
}

export interface ModerationActionsElement extends BaseContentElement {
    type: 'moderation-actions';
}

export interface MediaGalleryElement extends BaseContentElement {
    type: 'media-gallery';
}

export interface CustomCommandsElement extends BaseContentElement {
    type: 'custom-commands';
}

export interface AchievementUnlocksElement extends BaseContentElement {
    type: 'achievement-unlocks';
}

export interface RankingSystemElement extends BaseContentElement {
    type: 'ranking-system';
}

export interface RankingPointsElement extends BaseContentElement {
    type: 'ranking-points';
}

export interface TextStyleElement extends BaseContentElement {
    type: 'textstyle';
}

export interface SpacingElement extends BaseContentElement {
    type: 'spacing';
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
    | SpacingElement
    | FeatureElement;
