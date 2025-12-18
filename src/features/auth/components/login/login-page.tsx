import { LoginForm } from "./login-form";
import sideImage from "/images/auth/sideImage.png";
export function LoginPage() {
  return (
    <div className="grid grid-cols-2 grid-rows-1 gap-32 mt-12 mb-16">
      <div>
        <img src={sideImage} alt="A phone and a shopping cart." className="max-w-full h-full object-cover overflow-hidden" />
      </div>
      <div className="justify-self-start self-center">
        <LoginForm />
      </div>
    </div>
  );
}
