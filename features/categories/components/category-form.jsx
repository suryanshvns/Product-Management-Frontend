"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/shared/form-input";
import { useCreateCategory, useUpdateCategory, useCategory } from "../hooks/use-categories";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export function CategoryForm({ categoryId, initialValues, onSuccess, onCancel }) {
  const { toast } = useToast();
  const { data: category } = useCategory(categoryId, { enabled: !!categoryId });
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory(categoryId);

  const cat = initialValues ?? category ?? {};
  const defaultValues = {
    name: cat.name ?? "",
    description: cat.description ?? "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const isEdit = !!categoryId;
  const mutation = isEdit ? updateCategory : createCategory;

  const onSubmit = (values) => {
    mutation.mutate(
      { name: values.name, description: values.description || undefined },
      {
        onSuccess: () => {
          toast({ title: isEdit ? "Category updated" : "Category created" });
          onSuccess?.();
        },
        onError: () => {
          toast({
            title: "Something went wrong",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormInput
        label="Name"
        name="name"
        register={register}
        error={errors.name}
        placeholder="Category name"
      />
      <FormInput
        label="Description"
        name="description"
        register={register}
        error={errors.description}
        placeholder="Optional description"
      />
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : isEdit ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
