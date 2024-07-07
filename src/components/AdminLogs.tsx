import React, { useState, useEffect, useContext } from 'react';
import { TextDiffViewer } from './TextDiffViewer';
import Breadcrumb from './Breadcrumb';
import { useAuth } from '../contexts/AuthContext';
import { ContentContext } from '../contexts/ContentContext';

interface Log {
  title: string;
  versionId: number;
  description: string;
  detailedDescription: string;
  diffs: any;
  editDate: string;
  changes: any;
  editor: string;
  actionLogs: any[];
}

export function AdminLogs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [filter, setFilter] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { getUsernameById } = useAuth();



  const { categories, fetchArticleVersions, selectCategory, fetchArticleActionLogs } = useContext(ContentContext);
  
  useEffect(() => {
    assembleLogs();
  }, [categories]);

  const assembleLogs = async () => {
    const compiledLogs: Log[] = [];
    for (const category of categories) {
      const articlesResponse = await selectCategory(category.CategoryID.toString());
      for (const article of articlesResponse.articles) {
        const versionsResponse = await fetchArticleVersions(article.ArticleID);
        for (const version of versionsResponse.versions) {
          try {
            const actionLogsResponse = await fetchArticleActionLogs(version.VersionID);
            if (actionLogsResponse && Array.isArray(actionLogsResponse.logs)) {
              const editorName = await getUsernameById(version.editedBy);
              compiledLogs.push({
                title: article.Title,
                versionId: version.VersionID,
                description: article.Description,
                detailedDescription: version.DetailedDescription,
                diffs: version.Diffs,
                editDate: version.CreatedAt,
                changes: version.Changes,
                editor: editorName || "Unknown Editor",
                actionLogs: actionLogsResponse.logs
              });
            }
          } catch (error) {
            console.error(`Error fetching action logs for version ID ${version.VersionID}:`, error);
          }
        }
      }
    }
    sortLogs(compiledLogs);
    setLogs(compiledLogs);
  };

  const sortLogs = (logsToSort: Log[]) => {
    logsToSort.sort((a, b) => 
      sortDirection === 'desc' 
        ? new Date(b.editDate).getTime() - new Date(a.editDate).getTime()
        : new Date(a.editDate).getTime() - new Date(b.editDate).getTime()
    );
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value.toLowerCase());
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    const newLogs = [...logs];
    sortLogs(newLogs);
    setLogs(newLogs);
  };

  const filteredLogs = logs.filter(log =>
    log.title.toLowerCase().includes(filter) ||
    log.description.toLowerCase().includes(filter) ||
    (log.detailedDescription && log.detailedDescription.toLowerCase().includes(filter))
  );

  return (
    <div className="container mx-auto p-4">
      <Breadcrumb path="/admin/logs" />
      <h1 className="text-2xl font-bold mb-4">Admin Logs</h1>
      <input
        type="text"
        placeholder="Search by title or content..."
        onChange={handleSearchChange}
        className="border p-2 w-full mb-4"
      />
      <button 
        onClick={toggleSortDirection} 
        className="text-indigo-500 hover:text-indigo-600 transition font-bold py-2 px-4 rounded mb-4"
      >
        Sort by Date ({sortDirection})
      </button>
      {filteredLogs.map((log, index) => (
        <ChangeLogEntry key={index} log={log} />
      ))}
    </div>
  );
}

interface ChangeLogEntryProps {
  log: Log;
}

function ChangeLogEntry({ log }: ChangeLogEntryProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border p-4 rounded mb-2">
      <h2 className="text-lg font-semibold cursor-pointer" onClick={() => setExpanded(!expanded)}>
        {log.title} - Version {log.versionId} ({log.versionId === 1 ? "Created" : "Edited"}) by {log.editor} - Click to {expanded ? 'collapse' : 'expand'}
      </h2>
      <p>{log.description}</p>
      <p className="text-sm text-gray-500">Edited on: {new Date(log.editDate).toLocaleDateString()}</p>
      {expanded && (
        <div>
          <h3 className="text-md font-bold mt-2">Detailed Changes:</h3>
          <p className="text-gray-700">{log.detailedDescription}</p>
          {log.diffs && <TextDiffViewer oldText={log.diffs.oldText} newText={log.diffs.newText} />}
        </div>
      )}
    </div>
  );
}