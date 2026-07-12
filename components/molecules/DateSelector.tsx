"use client";

import { useTaskUIStore } from "@/store/taskUIStore";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";

export function DateSelector() {
  const { selectedDate, setSelectedDate } = useTaskUIStore();
  return (
    <div className="flex items-center gap-2">
      <Input
        type="date"
        value={selectedDate ?? ""}
        onChange={(e) => setSelectedDate(e.target.value || null)}
        className="w-40"
      />
      {selectedDate && (
        <Button variant="ghost" size="sm" onClick={() => setSelectedDate(null)}>
          Show all
        </Button>
      )}
    </div>
  );
}
