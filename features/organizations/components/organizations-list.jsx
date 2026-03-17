"use client";

import { useState } from "react";
import DataTable from "react-data-table-component";
import { Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Modal } from "@/components/shared/modal";
import { useOrganizations, useCreateOrganization } from "../hooks/use-organizations";
import { useToast } from "@/hooks/use-toast";

export function OrganizationsList() {
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");

  const { data: organizations, isLoading, isError, refetch } = useOrganizations();
  const createOrg = useCreateOrganization();

  const list = Array.isArray(organizations) ? organizations : [];

  const handleCreate = () => {
    const trimmed = name?.trim?.();
    if (!trimmed) {
      toast({ title: "Enter a name", variant: "destructive" });
      return;
    }
    createOrg.mutate(
      { name: trimmed },
      {
        onSuccess: () => {
          toast({ title: "Organization created" });
          setCreateOpen(false);
          setName("");
          refetch();
        },
        onError: (err) => {
          toast({
            title: "Failed to create organization",
            description: err?.response?.data?.message ?? err?.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader icon={Building2} title="Organizations" description="Manage organizations." />
        <ErrorState onRetry={refetch} />
      </div>
    );
  }

  const columns = [
    { name: "ID", selector: (row) => row.id ?? "—", sortable: false, width: "100px", style: { paddingLeft: "1rem" } },
    { name: "Name", selector: (row) => row.name ?? "—", sortable: false },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Building2}
        title="Organizations"
        description="Manage organizations."
        action={
          <Button className="gap-2" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Add organization
          </Button>
        }
      />

      <div className="rounded-xl border border-border bg-card">
        {isLoading && !list.length ? (
          <div className="p-6">
            <TableSkeleton rows={8} cols={3} />
          </div>
        ) : !list.length ? (
          <EmptyState
            icon={Building2}
            title="No organizations"
            description="Create your first organization."
            action={
              <Button className="gap-2" onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4" />
                Add organization
              </Button>
            }
          />
        ) : (
          <DataTable
            columns={columns}
            data={list}
            progressPending={isLoading}
            pagination
            paginationRowsPerPageOptions={[10, 20, 50]}
            noDataComponent="No organizations found."
            customStyles={{
              headRow: { style: { backgroundColor: "hsl(var(--muted))" } },
              headCells: { style: { paddingLeft: "1rem", paddingRight: "1rem" } },
              cells: { style: { paddingLeft: "1rem", paddingRight: "1rem" } },
            }}
          />
        )}
      </div>

      <Modal
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="New organization"
        description="Enter organization name."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={createOrg.isPending}>
              {createOrg.isPending ? "Creating…" : "Create"}
            </Button>
          </div>
        }
      >
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
        />
      </Modal>
    </div>
  );
}
