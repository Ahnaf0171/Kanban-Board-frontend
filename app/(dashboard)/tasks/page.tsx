import { DateSelector } from "@/components/molecules/DateSelector";
import { Board } from "@/components/organisms/task/Board";

export const dynamic = "force-dynamic";

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Tasks</h1>
        <DateSelector />
      </div>
      <Board />
    </div>
  );
}
