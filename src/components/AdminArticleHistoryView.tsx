import { FunctionalComponent } from "preact";
import { useContext, useMemo, useState } from "preact/hooks";
import { ContentContext, ActionLog, ArticleVersion } from "../contexts/ContentContext";

interface AdminArticleHistoryViewProps {
  versions: ArticleVersion[];
}

export const AdminArticleHistoryView: FunctionalComponent<AdminArticleHistoryViewProps> = ({ versions }) => {
  const { actionLogs, loading } = useContext(ContentContext);

  // Assuming versions is always an array (even if empty)
  const articleId = versions.length > 0 ? versions[0].ArticleID : null;

  // useEffect(() => {
  //   //Fetch action logs if articleId is available
  //   if (articleId) {
  //     fetchArticleActionLogs(articleId);
  //   }
  // }, [articleId]); // Ensure that the effect runs when articleId changes



  function getActionStyles(actionTypes: string[]) {
    return actionTypes.map((actionType) => {
      switch (actionType) {
        case 'article_created':
          return { icon: '🆕', color: 'text-green-500', tooltip: 'Article created' };
        case 'article_deleted':
          return { icon: '🗑️', color: 'text-red-500', tooltip: 'Article deleted' };
        case 'article_archived':
          return { icon: '📦', color: 'text-yellow-500', tooltip: 'Article archived' };
        case 'article_unarchived':
          return { icon: '📤', color: 'text-yellow-500', tooltip: 'Article unarchived' };
        case 'article_category_moved':
          return { icon: '🔀', color: 'text-purple-500', tooltip: 'Article moved to another category' };
        case 'article_title_changed':
          return { icon: '✏️', color: 'text-blue-500', tooltip: 'Article title changed' };
        case 'article_description_changed':
          return { icon: '✏️', color: 'text-blue-500', tooltip: 'Article description changed' };
        case 'article_detailed_description_changed':
          return { icon: '✏️', color: 'text-green-500', tooltip: 'Detailed description updated' };
        case 'article_img_src_changed':
          return { icon: '🖼️', color: 'text-indigo-500', tooltip: 'Article image source changed' };
        case 'article_set_staff_only':
          return { icon: '🔒', color: 'text-blue-500', tooltip: 'Article set to staff-only' };
        case 'article_set_public':
          return { icon: '🔓', color: 'text-blue-500', tooltip: 'Article set to public' };
        case 'article_restored':
          return { icon: '♻️', color: 'text-green-500', tooltip: 'Article restored' };
        case 'article_content_update_failed':
          return { icon: '⚠️', color: 'text-red-500', tooltip: 'Article update failed' };
        default:
          return { icon: '❓', color: 'text-gray-500', tooltip: 'Unknown action' };
      }
    });
  }
  



const [expandedVersion, setExpandedVersion] = useState<number | null>(null);

const toggleVersionDetail = (versionId: number) => {
  setExpandedVersion(expandedVersion === versionId ? null : versionId);
};


const SkeletonVersionLog: FunctionalComponent = () => {
  return (
    <div className="space-y-4">
      <div className="h-6 bg-gray-300 rounded"></div> {/* Version title */}
      <div className="h-4 bg-gray-300 rounded w-3/4"></div> {/* Date */}
      <div className="h-4 bg-gray-300 rounded w-1/2"></div> {/* Action type */}
    </div>
  );
};


// useEffect(() => {
//   if (articleId) {
//     fetchArticleActionLogs(articleId)
//   }
// }, [articleId]);

if (loading) {
  return (
    <div className="animate-pulse">
      <SkeletonVersionLog />
      <SkeletonVersionLog />
      <SkeletonVersionLog />
      <SkeletonVersionLog />
      <SkeletonVersionLog /> {/* Render multiple skeletons based on your preference */}
    </div>
  );
}




  return (
    <div className="xl mx-auto p-5 bg-yellow-50/25 rounded-sm shadow mt-12">
      <h2 className="text-xl font-bold mb-4">Change History ({versions.length})</h2>
      {versions.map((version, index) => {
        const isActive = expandedVersion === version.VersionID;
        const logsForVersion = actionLogs[articleId].filter((log: ActionLog) => log.VersionID === version.VersionID) || [];

        const groupedLogs = useMemo(() => {
          const groups = new Map();
          logsForVersion.forEach((log:ActionLog) => {
            const groupKey = `${log.VersionID}-${log.CreatedAt}`;
            if (!groups.has(groupKey)) {
              groups.set(groupKey, {
                versionID: log.VersionID,
                createdAt: log.CreatedAt,
                username: log.Username,
                userID: log.UserID,
                actions: []
              });
            }
            const group = groups.get(groupKey);
            group.actions.push(...JSON.parse(log.ActionType));
          });
          return Array.from(groups.values());
        }, [logsForVersion]);

        return (
          <div key={version.VersionID} className="mb-4 p-4 bg-stone-50/25 rounded shadow-sm">
            <button onClick={() => toggleVersionDetail(version.VersionID)} className="flex justify-between items-center w-full text-left">
              <p className="font-semibold text-gray-800">
                [Version {versions.length - index}] Article {versions.length - index === 1 ? 'created' : 'edited'} on {new Date(version.CreatedAt).toLocaleString()}
              </p>
              <span className={`transform transition-transform duration-300 text-indigo-500 ${isActive ? "rotate-180" : "rotate-0"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
            <div className={`transition-max-height duration-500 ease-in-out overflow-hidden ${isActive ? "max-h-screen" : "max-h-0"}`}>
            {groupedLogs.map(group => (
      <div key={`${group.versionID}-${group.createdAt}`} className="mb-4">
        <div className="text-sm font-medium">
          by <a href={`https://imperfectgamers.org/profile/${group.userID}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
            {group.username}
            <svg xmlns="http://www.w3.org/2000/svg" className="inline ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a> (User {group.userID})
        </div>
        <div className="py-1 flex flex-wrap items-center">
          {getActionStyles(group.actions).map((style, index) => (
            <span key={index} className={`${style.color} tooltip mr-2`} title={style.tooltip}>
              {style.icon} {style.tooltip}
            </span>
          ))}
        </div>
      </div>
    ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};