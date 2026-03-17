/**
 * Auth template – layout for login, signup, etc.
 * Centered content, max width, background.
 */
export function AuthTemplate({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
