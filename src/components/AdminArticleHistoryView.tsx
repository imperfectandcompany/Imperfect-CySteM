// src/components/AdminArticleHistoryView.tsx

import { FunctionalComponent } from "preact";
import { Card } from "../content";
import { useEffect, useState } from "preact/hooks";
import { useAuth } from "../contexts/AuthContext";

interface AdminArticleHistoryViewProps {
  card: Card;
}

export const AdminArticleHistoryView: FunctionalComponent<AdminArticleHistoryViewProps> = ({ card }) => {
  const [usernames, setUsernames] = useState<{ [key: number]: string }>({});
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsernames = async () => {
      const uniqueUserIds = [
        ...new Set(card.versions.map((version) => version.editedBy)),
      ];

      const usernamePromises = uniqueUserIds.map(async (userId) => {
        const username = await user.username
        return { userId, username };
      });

      const usernameResults = await Promise.all(usernamePromises);
      const usernameMap = usernameResults.reduce((acc, { userId, username }) => {
        acc[userId] = username;
        return acc;
      }, {} as { [key: number]: string });

      setUsernames(usernameMap);
    };

    fetchUsernames();
  }, [card.versions]);

  return (
    <div>
      <h2>Change History</h2>
      {card.versions.map((version) => (
        <div key={version.versionId}>
          <p>
            Version {version.versionId} ({version.versionId === 1 ? "Created" : "Edited"} by {usernames[version.editedBy] || "Loading..."} on {new Date(version.editDate).toLocaleString()})
          </p>
          {version.changes && (
            <ul>
              {version.changes.map((change, index) => (
                <li key={index}>{change}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};
