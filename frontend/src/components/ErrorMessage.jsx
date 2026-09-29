import { AlertCircle } from "lucide-react";

export default function ErrorMessage({ message }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-200">
      <AlertCircle className="mt-0.5 h-5 w-5" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}

