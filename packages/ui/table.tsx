import React from 'react';

type TableProps = {
  headers: string[];
  rows: (string | number)[][];
};

export const Table = ({ headers, rows }: TableProps) => (
  <table className="min-w-full border border-gray-200 rounded">
    <thead>
      <tr>
        {headers.map((h, i) => (
          <th key={i} className="px-4 py-2 bg-gray-100 border-b text-left">{h}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, i) => (
        <tr key={i} className="even:bg-gray-50">
          {row.map((cell, j) => (
            <td key={j} className="px-4 py-2 border-b">{cell}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);
