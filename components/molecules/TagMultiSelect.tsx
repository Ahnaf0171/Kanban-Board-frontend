"use client";

import { Badge } from "@/components/atoms/Badge";
import { useTags } from "@/hooks/useTags";
import { Spinner } from "@/components/atoms/Spinner";
import { cn } from "@/lib/utils";

export function TagMultiSelect({
  value,
  onChange,
}: {
  value: string[];
  onChange: (ids: string[]) => void;
}) {
  const { data: tags, isLoading } = useTags();

  if (isLoading) return <Spinner className="size-4" />;
  if (!tags?.results.length) return null;

  const toggle = (id: string) =>
    onChange(
      value.includes(id) ? value.filter((v) => v !== id) : [...value, id],
    );

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.results.map((tag) => {
        const active = value.includes(String(tag.id));
        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => toggle(String(tag.id))}
          >
            <Badge
              variant={active ? "default" : "outline"}
              className={cn("cursor-pointer", active && "ring-1 ring-offset-1")}
              style={active ? { backgroundColor: tag.color } : undefined}
            >
              {tag.name}
            </Badge>
          </button>
        );
      })}
    </div>
  );
}
