import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRef, type FormEvent } from "react";

export function SearchBar() {
  const queryRef = useRef<HTMLInputElement>(null);
  function submitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Extract the value
    const enteredQuery = queryRef.current?.value;
    // Send this value to the backend and request for all the items containing that query
    console.log(enteredQuery);
  }

  return (
    <form
      onSubmit={submitHandler}
      className="flex items-center gap-2 rounded-2xl bg-[#f5f5f5] px-3 py-2 focus-within:ring-2 focus-within:ring-black/10 transition"
    >
      <Button type="submit" className="cursor-pointer bg-transparent hover:bg-transparent">
        <Search className="h-4 w-4 text-gray-500" />
      </Button>
      <Input
        type="search"
        placeholder="Type to search..."
        ref={queryRef}
        className="text-sm border-none shadow-none p-0 h-6 bg-transparent focus-visible:ring-0"
      />
    </form>
  );
}
