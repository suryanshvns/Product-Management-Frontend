import { RequireRole } from "@/components/shared/require-role";
import { UsersList } from "@/features/users/components/users-list";

export default function UsersPage() {
  return (
    <RequireRole role={["superadmin", "admin"]}>
      <UsersList />
    </RequireRole>
  );
}
