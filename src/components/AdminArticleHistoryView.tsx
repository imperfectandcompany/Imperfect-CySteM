import { FunctionalComponent } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { ContentContext, ActionLog, ArticleVersion } from "../contexts/ContentContext";

interface AdminArticleHistoryViewProps {
  versions: ArticleVersion[];
}

export const AdminArticleHistoryView: FunctionalComponent<AdminArticleHistoryViewProps> = ({ versions }) => {
  const { actionLogs, fetchArticleActionLogs } = useContext(ContentContext);

  // Assuming versions is always an array (even if empty)
  const articleId = versions.length > 0 ? versions[0].ArticleID : null;

  useEffect(() => {
    // Fetch action logs if articleId is available
    if (articleId) {
      fetchArticleActionLogs(articleId);
    }
  }, [articleId]); // Ensure that the effect runs when articleId changes




  // Sort versions by CreatedAt in descending order
  const sortedVersions = versions.slice().sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime());

  function getActionStyle(actionType: string) {
    switch (actionType) {
      case 'toggle_staff_only':
        return { icon: '🔒', color: 'text-blue-500', tooltip: 'Toggled staff-only access' };
      case 'archive_enabled':
        return { icon: '📦', color: 'text-gray-500', tooltip: 'Archived this version' };
      case 'updated_detailed_description':
        return { icon: '✏️', color: 'text-green-500', tooltip: 'Updated detailed description' };
      default:
        return { icon: '', color: '', tooltip: '' };
    }
  }
  

const [expandedVersion, setExpandedVersion] = useState<number | null>(null);

const toggleVersionDetail = (versionId: number) => {
  setExpandedVersion(expandedVersion === versionId ? null : versionId);
};


  const [loading, setLoading] = useState(true); // State to track loading status



const SkeletonVersionLog: FunctionalComponent = () => {
  return (
    <div className="space-y-4">
      <div className="h-6 bg-gray-300 rounded"></div> {/* Version title */}
      <div className="h-4 bg-gray-300 rounded w-3/4"></div> {/* Date */}
      <div className="h-4 bg-gray-300 rounded w-1/2"></div> {/* Action type */}
    </div>
  );
};


useEffect(() => {
  if (articleId) {
    fetchArticleActionLogs(articleId)
      .then(() => setLoading(false))
      .catch(() => setLoading(false)); // Ensure loading is set to false after fetch
  }
}, [articleId]);

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
    <div className="xl mx-auto p-5 bg-gray-100 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Change History ({versions.length})</h2>
      {versions.map((version, index) => {
        const isActive = expandedVersion === version.VersionID;
        const logsForVersion = actionLogs[articleId].filter((log: ActionLog) => log.VersionID === version.VersionID) || [];
        return (
          <div key={version.VersionID} className="mb-4 p-4 bg-white rounded shadow-sm">
            <button onClick={() => toggleVersionDetail(version.VersionID)} className="flex justify-between items-center w-full text-left">
              <p className="font-semibold text-gray-800">
                Version {versions.length - index} edited on {new Date(version.CreatedAt).toLocaleString()}
              </p>
              <span className={`transform transition-transform duration-300 text-indigo-500 ${isActive ? "rotate-180" : "rotate-0"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
            <div className={`transition-max-height duration-500 ease-in-out overflow-hidden ${isActive ? "max-h-screen" : "max-h-0"}`}>
              {logsForVersion.map((log: ActionLog) => {
                const { icon, color, tooltip } = getActionStyle(log.ActionType);
                return (
                  <div key={log.LogID} className="py-1 flex items-center">
                    <span className={`${color} tooltip`} title={tooltip}>
                      {icon} {log.ActionType} by {log.Username} (User {log.UserID}) at {new Date(log.CreatedAt).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};