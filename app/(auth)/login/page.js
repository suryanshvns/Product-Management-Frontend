import { LoginView } from "@/components/organisms/auth/LoginView";
import { BRAND_NAME } from "@/utils/constants";

export const metadata = {
  title: `Sign in | ${BRAND_NAME}`,
  description: "Sign in to your account",
};

export default function LoginPage() {
  return <LoginView />;
}
