import { useState } from "preact/hooks";
import { TableElement } from "../Content/contentTypes";

interface EditableTableProps {
  element: TableElement;
  handleContentChange: (id: string, newContent: string) => void;
}

export const renderTable = ({ element, handleContentChange }: EditableTableProps) => {
  const [isEditing, setEditing] = useState(false);
  const [tableContent, setTableContent] = useState(element.content);

  const rows = tableContent.split(";").map((row) => row.split(","));
  const headers = rows[0];
  const dataRows = rows.slice(1);

  function handleDoubleClick() {
    setEditing(true);
  }

  function handleBlur() {
    if (tableContent.trim() === "") {
      setTableContent(element.content);
    }
    setEditing(false);
    handleContentChange(element.id, tableContent);
  }

  function handleCellChange(rowIdx: number, colIdx: number, value: string) {
    const updatedRows = [...rows];
    updatedRows[rowIdx][colIdx] = value;
    setTableContent(updatedRows.map((row) => row.join(",")).join(";"));
  }

  function handleAddRow() {
    const newRow = new Array(headers.length).fill("New Cell");
    const updatedRows = [...rows, newRow];
    setTableContent(updatedRows.map((row) => row.join(",")).join(";"));
  }

  function handleAddColumn() {
    const updatedRows = rows.map((row) => [...row, "New Column"]);
    setTableContent(updatedRows.map((row) => row.join(",")).join(";"));
  }

  function handleRemoveRow(rowIdx: number) {
    const updatedRows = rows.filter((_, idx) => idx !== rowIdx);
    setTableContent(updatedRows.map((row) => row.join(",")).join(";"));
  }

  function handleRemoveColumn(colIdx: number) {
    const updatedRows = rows.map((row) => row.filter((_, idx) => idx !== colIdx));
    setTableContent(updatedRows.map((row) => row.join(",")).join(";"));
  }

  if (isEditing) {
    return (
      <div className="flex flex-col">
        <table className="w-full border-collapse border">
          <thead>
            <tr>
              {headers.map((header, colIdx) => (
                <th key={colIdx} className="border p-2">
                  <input
                    type="text"
                    value={header}
                    onChange={(e) => handleCellChange(0, colIdx, (e.target as HTMLInputElement).value)}
                    className="w-full p-2"
                  />
                  <button onClick={() => handleRemoveColumn(colIdx)} className="ml-2 text-red-500">
                    Remove
                  </button>
                </th>
              ))}
              <th className="border p-2">
                <button onClick={handleAddColumn} className="text-blue-500">
                  Add Column
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((cell, colIdx) => (
                  <td key={colIdx} className="border p-2">
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => handleCellChange(rowIdx + 1, colIdx, (e.target as HTMLInputElement).value)}
                      className="w-full p-2"
                    />
                  </td>
                ))}
                <td className="border p-2">
                  <button onClick={() => handleRemoveRow(rowIdx + 1)} className="text-red-500">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleAddRow} className="mt-2 text-blue-500">
          Add Row
        </button>
        <button onClick={handleBlur} className="mt-2 text-blue-500">
          Save
        </button>
      </div>
    );
  }

  return (
    <table onDblClick={handleDoubleClick} className="table-auto w-full">
      <thead>
        <tr>
          {headers.map((header, idx) => (
            <th key={idx} className="px-4 py-2">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataRows.map((row, rowIdx) => (
          <tr key={rowIdx}>
            {row.map((cell, colIdx) => (
              <td key={colIdx} className="border px-4 py-2">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
