import { array, ZodError } from "zod";
import { userSchema } from "./types/types";

function App() {
  const parsedData = userSchema.safeParse({ fullName: "deno" });

  if (parsedData.error instanceof ZodError) {
    const errors = parsedData.error?.message;
    console.log(errors);
  }

  return (
    <div>
      <h1 className="text-blue-600 font-bold text-4xl">Hello world</h1>
    </div>
  );
}

export default App;
