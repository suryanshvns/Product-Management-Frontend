"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/shared/form-input";
import { SelectDropdown } from "@/components/shared/select-dropdown";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["draft", "active", "archived"]),
  categoryId: z.string().optional(),
  price: z.string().optional(),
  stock: z.coerce.number().min(0).optional(),
});

export function ProductForm({
  defaultValues,
  categories = [],
  onSubmit: onSubmitProp,
  onCancel,
  isLoading,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      sku: "",
      description: "",
      status: "draft",
      categoryId: "",
      price: "",
      stock: 0,
      ...defaultValues,
    },
  });

  const categoryOptions = [
    { value: "__none__", label: "Select category" },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <form onSubmit={handleSubmit(onSubmitProp)} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <FormInput
          label="Product name"
          name="name"
          register={register}
          error={errors.name}
          placeholder="e.g. Wireless Headphones"
        />
        <FormInput
          label="SKU"
          name="sku"
          register={register}
          error={errors.sku}
          placeholder="Optional"
        />
      </div>
      <FormInput
        label="Description"
        name="description"
        register={register}
        error={errors.description}
        placeholder="Brief description"
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <SelectDropdown
          label="Category"
          value={watch("categoryId") || "__none__"}
          onValueChange={(v) => setValue("categoryId", v === "__none__" ? "" : v)}
          options={categoryOptions}
          error={errors.categoryId}
        />
        <SelectDropdown
          label="Status"
          value={watch("status")}
          onValueChange={(v) => setValue("status", v)}
          options={[
            { value: "draft", label: "Draft" },
            { value: "active", label: "Active" },
            { value: "archived", label: "Archived" },
          ]}
          error={errors.status}
        />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <FormInput
          label="Price"
          name="price"
          type="text"
          register={register}
          error={errors.price}
          placeholder="0.00"
        />
        <FormInput
          label="Stock"
          name="stock"
          type="number"
          register={register}
          error={errors.stock}
        />
      </div>
      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save product"}
        </Button>
        <Button type="button" variant="outline" onClick={() => (onCancel ? onCancel() : window.history.back())}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
