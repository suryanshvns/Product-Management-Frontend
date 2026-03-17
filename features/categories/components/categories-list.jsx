"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, FolderTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategories } from "../hooks/use-categories";
import { useDeleteCategory } from "../hooks/use-categories";
import { CategoryGridShimmer } from "@/components/shared/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Modal } from "@/components/shared/modal";
import { CategoryForm } from "./category-form";
import { useToast } from "@/hooks/use-toast";

export function CategoriesList() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { toast } = useToast();
  const { data, isLoading, isError, refetch } = useCategories();
  const deleteCategory = useDeleteCategory();

  const categories = data?.data ?? data ?? [];

  const handleDelete = (id, name) => {
    if (confirm(`Delete category "${name}"? Products must be reassigned or deleted first.`)) {
      deleteCategory.mutate(id, {
        onSuccess: () => toast({ title: "Category deleted" }),
        onError: (err) =>
          toast({
            title: "Failed to delete",
            description: err?.response?.data?.message ?? err?.message,
            variant: "destructive",
          }),
      });
    }
  };

  if (isLoading) return <CategoryGridShimmer />;
  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={FolderTree}
        title="Categories"
        description="Organize products with categories."
        action={
          <Button onClick={() => { setEditingId(null); setModalOpen(true); }} className="gap-2">
            <Plus className="h-4 w-4" />
            Add category
          </Button>
        }
      />

      {!categories.length ? (
        <EmptyState
          icon={FolderTree}
          title="No categories yet"
          description="Create a category to organize your products."
          action={
            <Button onClick={() => setModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add category
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Card key={cat.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base">{cat.name}</CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      setEditingId(cat.id);
                      setModalOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(cat.id, cat.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              {(cat.description || cat.productCount != null) && (
                <CardContent className="pt-0">
                  {cat.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {cat.description}
                    </p>
                  )}
                  {cat.productCount != null && (
                    <p className="text-xs text-muted-foreground">
                      {cat.productCount} product{cat.productCount !== 1 ? 's' : ''}
                    </p>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onOpenChange={(open) => { if (!open) setEditingId(null); setModalOpen(open); }}
        title={editingId ? "Edit category" : "New category"}
        description={editingId ? "Update category details" : "Add a new category"}
        footer={null}
      >
        <CategoryForm
          key={editingId ?? "new"}
          categoryId={editingId}
          initialValues={editingId ? categories.find((c) => c.id === editingId) : undefined}
          onSuccess={() => {
            setModalOpen(false);
            setEditingId(null);
            refetch();
          }}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
