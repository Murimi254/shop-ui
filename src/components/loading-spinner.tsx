import { Spinner } from "./ui/spinner";

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Spinner className="animate-spin size-16" />
    </div>
  );
}
