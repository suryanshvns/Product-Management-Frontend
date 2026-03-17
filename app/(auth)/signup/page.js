import { SignupView } from "@/components/organisms/auth/SignupView";
import { BRAND_NAME } from "@/utils/constants";

export const metadata = {
  title: `Sign up | ${BRAND_NAME}`,
  description: "Create your account",
};

export default function SignupPage() {
  return <SignupView />;
}
