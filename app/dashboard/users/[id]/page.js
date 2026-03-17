"use client";

import { useParams } from "next/navigation";
import { RequireRole } from "@/components/shared/require-role";
import { UserEdit } from "@/features/users/components/user-edit";

export default function UserEditPage() {
  const params = useParams();
  const id = params?.id;

  if (!id) return null;

  return (
    <RequireRole role={["superadmin", "admin"]}>
      <UserEdit userId={id} />
    </RequireRole>
  );
}
