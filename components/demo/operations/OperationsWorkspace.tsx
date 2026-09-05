"use client";

import { useEffect, useState } from "react";
import { OPERATIONS_ROWS } from "@/lib/demo-data";
import OperationDetailPanel from "./OperationDetailPanel";
import OperationsTable from "./OperationsTable";

export default function OperationsWorkspace() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedId) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedId(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedId]);

  const selectedOperation = OPERATIONS_ROWS.find((row) => row.id === selectedId) ?? null;

  return (
    <div className="flex min-h-0 flex-1 gap-3">
      <OperationsTable selectedId={selectedId} onSelect={setSelectedId} />
      {selectedOperation && <OperationDetailPanel operation={selectedOperation} onClose={() => setSelectedId(null)} />}
    </div>
  );
}
