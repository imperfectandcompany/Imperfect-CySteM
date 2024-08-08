import { useState } from 'preact/hooks';

interface EditableTableProps {
  content: string;
  onChange: (value: string) => void;
}

export const EditableTable = ({ content, onChange }: EditableTableProps) => {
  const [isEditing, setEditing] = useState(false);
  const [tableContent, setTableContent] = useState(content);

  const rows = tableContent.split(";").map(row => row.split(","));
  const headers = rows[0];
  const dataRows = rows.slice(1);

  const handleCellChange = (rowIdx: number, colIdx: number, value: string) => {
    const updatedRows = rows.map(row => [...row]);
    updatedRows[rowIdx][colIdx] = value;
    setTableContent(updatedRows.map(row => row.join(",")).join(";"));
  };

  return isEditing ? (
    <div className="editable-table">
      {/* Editing logic with inputs for each cell */}
    </div>
  ) : (
    <table onClick={() => setEditing(true)}>
      {/* Static view of the table */}
    </table>
  );
};
