import { useState, useEffect } from 'preact/hooks';
import { content } from '../content';
import { findCardById } from '../utils';
import { TextDiffViewer } from './TextDiffViewer';
import Breadcrumb from './Breadcrumb';
import { useAuth } from '../contexts/AuthContext';

/** A component that displays a log of all changes across the articles with detailed interaction */
export function AdminLogs() {
    const [logs, setLogs] = useState<{ title: any; versionId: any; description: any; detailedDescription: any; diffs: any; editDate: any; changes: any; editor: any; }[]>([]);
    const [filter, setFilter] = useState('');
    const [sortDirection, setSortDirection] = useState('desc'); // 'asc' or 'desc'
    const { getUsernameById } = useAuth();

    useEffect(() => {
        assembleLogs();
    }, []);

    const assembleLogs = async () => {
      let compiledLogs = [];
      for (const section of Object.values(content.sections)) {
          for (const card of section.cards) {
              for (const version of card.versions) {
                  const editorName = await getUsernameById(version.editedBy);
                  compiledLogs.push({
                      title: card.versions[0].title,
                      versionId: version.versionId,
                      description: version.description,
                      detailedDescription: version.detailedDescription,
                      diffs: version.diffs,
                      editDate: version.editDate,
                      changes: version.changes,
                      editor: editorName || "Unknown Editor"
                  });
              }
          }
      }
        // Optionally sort by editDate
        compiledLogs.sort((a, b) => sortDirection === 'desc' ? 
            new Date(b.editDate).getTime() - new Date(a.editDate).getTime() : 
            new Date(a.editDate).getTime() - new Date(b.editDate).getTime());

        setLogs(compiledLogs);
    };

    const handleSearchChange: React.ChangeEventHandler<HTMLInputElement> = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;
        setFilter(target.value.toLowerCase());
    };

    const toggleSortDirection = () => {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        assembleLogs();  // Re-assemble logs with new sort order
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
            <button onClick={toggleSortDirection} className="text-indigo-500 hover:text-indigo-600 transitionfont-bold py-2 px-4 rounded mb-4">
                Sort by Date ({sortDirection})
            </button>
            {filteredLogs.map((log, index) => (
                <ChangeLogEntry key={index} log={log} />
            ))}
        </div>
    );
}

/** Component to display individual log entries with detailed descriptions and changes */
function ChangeLogEntry({ log }: { log: any }) {
  const [expanded, setExpanded] = useState(false);

  // Fetch the previous version's text within the same card
  
  const previousVersion = log.versionId > 1 ? findPreviousVersionText(log.cardId, log.versionId) : '';
  const newText = log.detailedDescription;
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
                    <p className="text-gray-700">{newText}</p>
                    {previousVersion && <TextDiffViewer oldText={previousVersion} newText={newText} />}
                </div>
            )}
        </div>
    );

    /** Finds the detailed description of the previous version within the same card */
interface Card {
  versions: Version[];
}

interface Version {
  versionId: number;
  detailedDescription: string;
}

function findPreviousVersionText(cardId: number, versionId: number): string {
  const card: Card | null = findCardById(cardId);
  if (card === null) {
    return '';
  }
  // Find the index of the current version
  const currentVersionIndex: number = card.versions.findIndex(v => v.versionId === versionId);
  // Calculate the index of the previous version
  const previousVersionIndex: number = currentVersionIndex - 1;
  // Return the detailed description of the previous version if it exists
  return previousVersionIndex >= 0 ? card.versions[previousVersionIndex].detailedDescription : '';
}
}

