import { 
    ContentElement, 
    HeaderElement, 
    ParagraphElement, 
    ImageElement, 
    ListElement, 
    CodeBlockElement, 
    AccordionElement, 
    AchievementElement, 
    AchievementUnlocksElement, 
    AdminCommandElement, 
    AlertElement, 
    BugTrackerElement, 
    CardElement, 
    CarouselElement, 
    ChangelogElement, 
    CodeElement, 
    CommunitySpotlightElement, 
    CountdownElement, 
    CustomCommandsElement, 
    DataVisualizationElement, 
    EventLogElement, 
    FaqElement, 
    FeatureElement, 
    GalleryElement, 
    InfoCardElement, 
    LeaderboardElement, 
    MediaGalleryElement, 
    ModalElement, 
    ModerationActionsElement, 
    NeutralAlertElement, 
    NewMapElement, 
    PatchNotesElement, 
    PlayerCommandElement, 
    ProgressElement, 
    RankingPointsElement, 
    RankingSystemElement, 
    ServerInfoElement, 
    ServerPerformanceElement, 
    ServerRulesElement, 
    ServerScheduleElement, 
    SpacingElement, 
    StatsElement, 
    SteamProfileElement, 
    TabElement, 
    TableElement, 
    TestimonialElement, 
    TextStyleElement, 
    WarningAlertElement, 
    YoutubeElement 
  } from './contentTypes';
  
  export function parseContent(rawContent: string): ContentElement[] {
    const elements: ContentElement[] = [];
    const lines = rawContent.split('\n').filter(line => line.trim() !== '');
  
    let currentList: ListElement | null = null;
    let currentCodeBlock: CodeBlockElement | null = null;
  
    const handleInlineFormatting = (text: string): string => {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/``(.*?)``/g, '<code>$1</code>') // Inline Code
        .replace(/\^\^(.*?)\^\^/g, '<mark>$1</mark>'); // Highlight
    };
  
    lines.forEach((line, index) => {
      line = handleInlineFormatting(line);
  
      const parts = line.split('|');
      const type = parts[0].trim();
      const content = parts[1] ? parts[1].trim() : '';
      const style = parts[2] ? parts[2].trim() : '';
  
      switch (type) {
        case 'header':
          elements.push({ type: 'header', level: 1, content, style, id: `header-${index}` } as HeaderElement);
          break;
        case 'paragraph':
          elements.push({ type: 'paragraph', content, style, id: `paragraph-${index}` } as ParagraphElement);
          break;
        case 'image':
          const [url, alt] = [content, style]; // Direct mapping for image elements
          elements.push({ type: 'image', url, alt, id: `image-${index}` } as ImageElement);
          break;
        case 'list':
          elements.push({ type: 'list', items: content.split(';'), style, id: `list-${index}`, ordered: false } as unknown as ListElement);
          break;
        case 'accordion':
          elements.push({ type: 'accordion', content, style, id: `accordion-${index}` } as unknown as AccordionElement);
          break;
        case 'tab':
          elements.push({ type: 'tab', content, style, id: `tab-${index}` } as TabElement);
          break;
        case 'gallery':
          elements.push({ type: 'gallery', content, style, id: `gallery-${index}` } as GalleryElement);
          break;
        case 'carousel':
          elements.push({ type: 'carousel', content, style, id: `carousel-${index}` } as CarouselElement);
          break;
        case 'code':
          elements.push({ type: 'code', content, style, id: `code-${index}` } as CodeElement);
          break;
        case 'testimonial':
          elements.push({ type: 'testimonial', content, style, id: `testimonial-${index}` } as TestimonialElement);
          break;
        case 'countdown':
          elements.push({ type: 'countdown', content, style, id: `countdown-${index}` } as CountdownElement);
          break;
        case 'alert':
          elements.push({ type: 'alert', content, style, id: `alert-${index}` } as AlertElement);
          break;
        case 'table':
          elements.push({ type: 'table', content, style, id: `table-${index}` } as TableElement);
          break;
        case 'card':
          elements.push({ type: 'card', content, style, id: `card-${index}` } as CardElement);
          break;
        case 'modal':
          elements.push({ type: 'modal', content, style, id: `modal-${index}` } as ModalElement);
          break;
        case 'progress':
          elements.push({ type: 'progress', content, style, id: `progress-${index}` } as ProgressElement);
          break;
        case 'leaderboard':
          elements.push({ type: 'leaderboard', content, style, id: `leaderboard-${index}` } as LeaderboardElement);
          break;
        case 'youtube':
          elements.push({ type: 'youtube', url: content, style, id: `youtube-${index}` } as YoutubeElement);
          break;
        case 'feature':
          elements.push({ type: 'feature', content, style, id: `feature-${index}` } as FeatureElement);
          break;
        case 'changelog':
          elements.push({ type: 'changelog', content, style, id: `changelog-${index}` } as ChangelogElement);
          break;
        case 'stats':
          elements.push({ type: 'stats', content, style, id: `stats-${index}` } as StatsElement);
          break;
        case 'faq':
          elements.push({ type: 'faq', content, style, id: `faq-${index}` } as FaqElement);
          break;
        case 'data-visualization':
          elements.push({ type: 'data-visualization', content, style, id: `data-visualization-${index}` } as DataVisualizationElement);
          break;
        case 'info-card':
          elements.push({ type: 'info-card', content, style, id: `info-card-${index}` } as InfoCardElement);
          break;
        case 'server-info':
          elements.push({ type: 'server-info', content, style, id: `server-info-${index}` } as ServerInfoElement);
          break;
        case 'admin-command':
          elements.push({ type: 'admin-command', content, style, id: `admin-command-${index}` } as AdminCommandElement);
          break;
        case 'event-log':
          elements.push({ type: 'event-log', content, style, id: `event-log-${index}` } as EventLogElement);
          break;
        case 'patch-notes':
          elements.push({ type: 'patch-notes', content, style, id: `patch-notes-${index}` } as PatchNotesElement);
          break;
        case 'server-rules':
          elements.push({ type: 'server-rules', content, style, id: `server-rules-${index}` } as ServerRulesElement);
          break;
        case 'community-spotlight':
          elements.push({ type: 'community-spotlight', content, style, id: `community-spotlight-${index}` } as CommunitySpotlightElement);
          break;
        case 'warning-alert':
          elements.push({ type: 'warning-alert', content, style, id: `warning-alert-${index}` } as WarningAlertElement);
          break;
        case 'neutral-alert':
          elements.push({ type: 'neutral-alert', content, style, id: `neutral-alert-${index}` } as NeutralAlertElement);
          break;
        case 'steam-profile':
          elements.push({ type: 'steam-profile', content, style, id: `steam-profile-${index}` } as SteamProfileElement);
          break;
        case 'player-command':
          elements.push({ type: 'player-command', content, style, id: `player-command-${index}` } as PlayerCommandElement);
          break;
        case 'bug-tracker':
          elements.push({ type: 'bug-tracker', content, style, id: `bug-tracker-${index}` } as BugTrackerElement);
          break;
        case 'achievement':
          elements.push({ type: 'achievement', content, style, id: `achievement-${index}` } as AchievementElement);
          break;
        case 'server-schedule':
          elements.push({ type: 'server-schedule', content, style, id: `server-schedule-${index}` } as ServerScheduleElement);
          break;
        case 'new-map':
          elements.push({ type: 'new-map', content, style, id: `new-map-${index}` } as NewMapElement);
          break;
        case 'server-performance':
          elements.push({ type: 'server-performance', content, style, id: `server-performance-${index}` } as ServerPerformanceElement);
          break;
        case 'moderation-actions':
          elements.push({ type: 'moderation-actions', content, style, id: `moderation-actions-${index}` } as ModerationActionsElement);
          break;
        case 'media-gallery':
          elements.push({ type: 'media-gallery', content, style, id: `media-gallery-${index}` } as MediaGalleryElement);
          break;
        case 'custom-commands':
          elements.push({ type: 'custom-commands', content, style, id: `custom-commands-${index}` } as CustomCommandsElement);
          break;
        case 'achievement-unlocks':
          elements.push({ type: 'achievement-unlocks', content, style, id: `achievement-unlocks-${index}` } as AchievementUnlocksElement);
          break;
        case 'ranking-system':
          elements.push({ type: 'ranking-system', content, style, id: `ranking-system-${index}` } as RankingSystemElement);
          break;
        case 'ranking-points':
          elements.push({ type: 'ranking-points', content, style, id: `ranking-points-${index}` } as RankingPointsElement);
          break;
        case 'textstyle':
          elements.push({ type: 'textstyle', content, style, id: `textstyle-${index}` } as TextStyleElement);
          break;
        case 'spacing':
          elements.push({ type: 'spacing', content, style, id: `spacing-${index}` } as SpacingElement);
          break;
        default:
          elements.push({ type: 'text', content, style, id: `text-${index}` } as unknown as ContentElement);
          break;
      }
  
      if (currentList) {
        elements.push(currentList);
        currentList = null;
      }
      if (currentCodeBlock) {
        elements.push(currentCodeBlock);
        currentCodeBlock = null;
      }
    });
  
    if (currentList) {
      elements.push(currentList);
    }
    if (currentCodeBlock) {
      elements.push(currentCodeBlock);
    }
  
    return elements;
  }
  