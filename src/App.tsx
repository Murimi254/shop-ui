import { useLoginMutation } from "./api/exclusive";
import { useAppSelector } from "./hooks/hooks";

function App() {
  const [login, { isSuccess, data }] = useLoginMutation();
  const user = useAppSelector(state => state.auth.user);
  function loginHandler() {
    console.log("Clicked login");
    login({ email: "dennis.nmurimi@gmail.com", password: "Pass@123" });
    if (isSuccess) {
      console.log(data);
      console.log(user);
    }
  }
  return (
    <div>
      <h1 className="text-blue-600 font-bold text-4xl">Hello world</h1>
      <button onClick={loginHandler}>Login Button</button>
    </div>
  );
}

export default App;
