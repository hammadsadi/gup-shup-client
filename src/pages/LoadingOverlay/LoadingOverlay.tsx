import { Loading } from "@/components/modules/Shared/Loading/Loading";

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Loading size="lg" variant="primary" />
          <div className="absolute inset-0 rounded-full bg-blue-500/10 dark:bg-blue-400/10 animate-ping" />
        </div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Loading messages...
        </p>
      </div>
    </div>
  );
}
