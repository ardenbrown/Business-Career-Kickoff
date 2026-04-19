import { formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";

type HistoryListProps = {
  items: {
    id: string;
    title: string;
    createdAt: Date;
  }[];
};

export function HistoryList({ items }: HistoryListProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-ink">Recent generated outputs</h3>
        <div className="space-y-3">
          {items.length ? (
            items.map((item) => (
              <div
                className="flex items-center justify-between rounded-2xl border border-border bg-white/80 px-4 py-3"
                key={item.id}
              >
                <div>
                  <p className="text-sm font-medium text-ink">{item.title}</p>
                  <p className="text-xs text-muted">{formatDate(item.createdAt)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted">Generated outputs will appear here after onboarding.</p>
          )}
        </div>
      </div>
    </Card>
  );
}
