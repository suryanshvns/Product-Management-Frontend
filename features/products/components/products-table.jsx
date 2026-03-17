"use client";

import { useState, useEffect, useCallback } from "react";
import DataTable from "react-data-table-component";
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  MoreHorizontal,
  Upload,
  ImagePlus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Modal } from "@/components/shared/modal";
import { ProductForm } from "./product-form";
import { useProducts, useProduct, useCreateProduct, useUpdateProduct } from "../hooks/use-products";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { useDeleteProduct, useBulkDeleteProducts, useBulkUpdateProductStatus, useBulkImportProducts, useUploadProductImages, useDeleteProductImage } from "../hooks/use-products";
import { useToast } from "@/hooks/use-toast";
import { productsApi } from "@/lib/api";
import { getProductImageUrl } from "@/lib/product-images";

const DEBOUNCE_MS = 300;
const statusVariant = { active: "success", draft: "secondary", archived: "outline" };

export function ProductsTable() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [clearSelected, setClearSelected] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [productEditId, setProductEditId] = useState(null);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [bulkImportCsv, setBulkImportCsv] = useState("name,categoryId\nNew Product,<CATEGORY_ID>");

  const params = {
    page,
    limit,
    search: search || undefined,
    categoryId: categoryFilter || undefined,
    status: statusFilter && statusFilter !== "all" ? statusFilter : undefined,
  };

  const { data, isLoading, isError, refetch } = useProducts(params);
  const { data: categoriesList } = useCategories();
  const categories = Array.isArray(categoriesList) ? categoriesList : categoriesList?.data ?? [];

  const { data: editProduct, isLoading: editProductLoading } = useProduct(productEditId ?? "", { enabled: !!productEditId });
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct(productEditId ?? "");

  const deleteProduct = useDeleteProduct();
  const bulkDelete = useBulkDeleteProducts();
  const bulkUpdateStatus = useBulkUpdateProductStatus();
  const bulkImport = useBulkImportProducts();
  const uploadImages = useUploadProductImages(productEditId ?? "");
  const deleteImage = useDeleteProductImage(productEditId ?? "");

  const openNewDialog = () => {
    setProductEditId(null);
    setProductDialogOpen(true);
  };
  const openEditDialog = (id) => {
    setProductEditId(id);
    setProductDialogOpen(true);
  };
  const closeProductDialog = () => {
    setProductDialogOpen(false);
    setProductEditId(null);
  };

  const handleProductSubmit = (values) => {
    const isEdit = !!productEditId;
    const body = {
      name: values.name,
      description: values.description || undefined,
      categoryId: values.categoryId || undefined,
      status: values.status,
    };
    if (isEdit) {
      updateProduct.mutate(body, {
        onSuccess: async () => {
          if (values.stock != null) {
            try {
              await productsApi.updateStock(productEditId, { quantity: Number(values.stock) });
            } catch (_) {}
          }
          toast({ title: "Product updated successfully" });
          closeProductDialog();
          refetch();
        },
        onError: (err) => {
          toast({
            title: "Failed to update product",
            description: err?.response?.data?.message ?? err?.message,
            variant: "destructive",
          });
        },
      });
    } else {
      createProduct.mutate(body, {
        onSuccess: async (res) => {
          const id = res?.id ?? res?.data?.id;
          if (id && values.stock != null && Number(values.stock) > 0) {
            try {
              await productsApi.updateStock(id, { quantity: Number(values.stock) });
            } catch (_) {}
          }
          toast({ title: "Product created successfully" });
          closeProductDialog();
          refetch();
        },
        onError: (err) => {
          toast({
            title: "Failed to create product",
            description: err?.response?.data?.message ?? err?.message,
            variant: "destructive",
          });
        },
      });
    }
  };

  const products = data?.data ?? [];
  const totalRows = data?.total ?? 0;

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handlePageChange = (newPage) => setPage(newPage);
  const handlePerRowsChange = (newLimit, newPage) => {
    setLimit(newLimit);
    setPage(newPage);
  };

  const handleBulkDelete = () => {
    const ids = selectedRows.map((r) => r.id).filter(Boolean);
    if (!ids.length) return;
    if (!confirm(`Delete ${ids.length} product(s)?`)) return;
    bulkDelete.mutate(
      { ids },
      {
        onSuccess: () => {
          toast({ title: "Products deleted" });
          setSelectedRows([]);
          setClearSelected(!clearSelected);
          refetch();
        },
        onError: (err) => {
          toast({
            title: "Bulk delete failed",
            description: err?.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleBulkStatus = (status) => {
    const ids = selectedRows.map((r) => r.id).filter(Boolean);
    if (!ids.length) return;
    bulkUpdateStatus.mutate(
      { ids, status },
      {
        onSuccess: () => {
          toast({ title: `Status updated to ${status}` });
          setSelectedRows([]);
          setClearSelected(!clearSelected);
          refetch();
        },
        onError: (err) => {
          toast({
            title: "Bulk update failed",
            description: err?.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleSingleDelete = (row) => {
    if (!confirm(`Delete "${row.name ?? row.title}"?`)) return;
    deleteProduct.mutate(row.id, {
      onSuccess: () => {
        toast({ title: "Product deleted" });
        refetch();
      },
      onError: (err) => {
        toast({ title: "Delete failed", description: err?.message, variant: "destructive" });
      },
    });
  };

  const columns = [
    {
      name: "Product",
      cell: (row) => {
        const imageUrl = getProductImageUrl(row);
        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <Package className="h-5 w-5" />
                </div>
              )}
            </div>
            <div>
              <p className="font-medium">{row.name ?? row.title ?? "—"}</p>
              {row.sku && <p className="text-xs text-muted-foreground">{row.sku}</p>}
            </div>
          </div>
        );
      },
      sortable: false,
      style: { paddingLeft: "1rem", textAlign: "left" },
      minWidth: "220px",
    },
    {
      name: "Category",
      selector: (row) => row.category?.name ?? row.categoryName ?? "—",
      sortable: false,
    },
    {
      name: "Status",
      cell: (row) => {
        const s = (row.status ?? "draft").toLowerCase();
        return <Badge variant={statusVariant[s] || "secondary"}>{s}</Badge>;
      },
      sortable: false,
    },
    {
      name: "Stock",
      selector: (row) => row.stock ?? row.quantity ?? "—",
      sortable: false,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openEditDialog(row.id)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <span className="sr-only">More</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSingleDelete(row)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      sortable: false,
      right: true,
      style: { paddingRight: "1rem", textAlign: "right" },
      width: "120px",
    },
  ];

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader icon={Package} title="Products" description="Manage your product catalog." />
        <ErrorState onRetry={refetch} />
      </div>
    );
  }

  const hasSelection = selectedRows?.length > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Package}
        title="Products"
        description="Manage your product catalog, status, and inventory."
        action={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => setBulkImportOpen(true)}>
              <Upload className="h-4 w-4" />
              Bulk import
            </Button>
            <Button className="gap-2" onClick={openNewDialog}>
              <Plus className="h-4 w-4" />
              Add product
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All products</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              type="search"
              placeholder="Search by name or description..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="max-w-xs"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="all">All statuses</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Refresh
            </Button>
          </div>
          {hasSelection && (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/30 p-2">
              <span className="text-sm text-muted-foreground">
                {selectedRows.length} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkStatus("active")}
                disabled={bulkUpdateStatus.isPending}
              >
                Set Active
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkStatus("archived")}
                disabled={bulkUpdateStatus.isPending}
              >
                Set Archived
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                disabled={bulkDelete.isPending}
              >
                {bulkDelete.isPending ? "Deleting…" : "Bulk delete"}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setClearSelected(!clearSelected)}>
                Clear
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {isLoading && !products.length ? (
            <TableSkeleton rows={10} cols={5} />
          ) : !products.length ? (
            <EmptyState
              icon={Package}
              title="No products yet"
              description="Add your first product or adjust filters."
              action={
                <Button className="gap-2" onClick={openNewDialog}>
                  <Plus className="h-4 w-4" />
                  Add product
                </Button>
              }
            />
          ) : (
            <DataTable
              key={search}
              columns={columns}
              data={products}
              progressPending={isLoading}
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              paginationDefaultPage={1}
              paginationPerPage={limit}
              paginationRowsPerPageOptions={[10, 20, 50]}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handlePerRowsChange}
              selectableRows
              selectableRowsClearSelectionButton
              clearSelectedRows={clearSelected}
              onSelectedRowsChange={({ selectedRows: next }) => setSelectedRows(next)}
              noDataComponent="No products found."
              fixedHeader
              fixedHeaderScrollHeight="calc(100vh - 240px)"
              customStyles={{
                headRow: { style: { backgroundColor: "hsl(var(--muted))" } },
                headCells: { style: { paddingLeft: "1rem", paddingRight: "1rem" } },
                cells: { style: { paddingLeft: "1rem", paddingRight: "1rem" } },
                table: { style: { width: "100%" } },
              }}
            />
          )}
        </CardContent>
      </Card>

      <Modal
        open={productDialogOpen}
        onOpenChange={(open) => {
          setProductDialogOpen(open);
          if (!open) setProductEditId(null);
        }}
        title={productEditId ? "Edit product" : "New product"}
        description={productEditId ? "Update product details" : "Add a new product to your catalog"}
        footer={null}
        className="max-w-2xl"
      >
        {productEditId && editProductLoading ? (
          <div className="space-y-4">
            <div className="h-10 w-full rounded-md bg-muted animate-shimmer" />
            <div className="h-10 w-full rounded-md bg-muted animate-shimmer" />
            <div className="h-24 w-full rounded-md bg-muted animate-shimmer" />
          </div>
        ) : (
          <>
            <ProductForm
              key={`form-${productEditId ?? "new"}`}
              defaultValues={
                productEditId && editProduct
                  ? {
                      name: editProduct.name ?? "",
                      sku: editProduct.sku ?? "",
                      description: editProduct.description ?? "",
                      status: editProduct.status ?? "draft",
                      categoryId: editProduct.categoryId ?? editProduct.category?.id ?? "",
                      price: editProduct.price != null ? String(editProduct.price) : "",
                      stock: editProduct.stock ?? editProduct.quantity ?? 0,
                    }
                  : undefined
              }
              categories={categories}
              onSubmit={handleProductSubmit}
              onCancel={closeProductDialog}
              isLoading={createProduct.isPending || updateProduct.isPending}
            />
            {productEditId && editProduct && (
              <div className="mt-6 border-t border-border pt-6">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-medium">
                  <ImagePlus className="h-4 w-4" />
                  Product images
                </h3>
                <div className="flex flex-wrap gap-3">
                  {(editProduct.images ?? editProduct.product?.images ?? editProduct.data?.product?.images ?? []).map((img) => {
                    const src = img.imageUrl ?? img.url ?? img.src;
                    return (
                    <div
                      key={img.id}
                      className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted"
                    >
                      {src ? (
                        <img
                          src={src}
                          alt={img.alt ?? "Product"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground">No preview</span>
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-1 top-1 h-6 w-6"
                        aria-label="Remove image"
                        onClick={() => {
                          deleteImage.mutate(img.id, {
                            onSuccess: () => {
                              toast({ title: "Image removed" });
                              refetch();
                            },
                            onError: (err) => {
                              toast({
                                title: "Failed to remove image",
                                description: err?.message,
                                variant: "destructive",
                              });
                            },
                          });
                        }}
                        disabled={deleteImage.isPending}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ); })}
                </div>
                <label className="mt-3 flex cursor-pointer flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Add images (JPG, PNG)</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    className="text-sm file:mr-2 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-primary-foreground"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (!files?.length) return;
                      const formData = new FormData();
                      for (let i = 0; i < files.length; i++) {
                        formData.append("images", files[i]);
                      }
                      formData.append("alt", "Product photo");
                      uploadImages.mutate(formData, {
                        onSuccess: () => {
                          toast({ title: "Images uploaded" });
                          refetch();
                          e.target.value = "";
                        },
                        onError: (err) => {
                          toast({
                            title: "Upload failed",
                            description: err?.response?.data?.message ?? err?.message,
                            variant: "destructive",
                          });
                          e.target.value = "";
                        },
                      });
                    }}
                    disabled={uploadImages.isPending}
                  />
                </label>
              </div>
            )}
          </>
        )}
      </Modal>

      <Modal
        open={bulkImportOpen}
        onOpenChange={setBulkImportOpen}
        title="Bulk import products"
        description="Paste CSV with header: name,categoryId. One row per product."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setBulkImportOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const csv = bulkImportCsv?.trim();
                if (!csv) {
                  toast({ title: "Paste CSV content", variant: "destructive" });
                  return;
                }
                bulkImport.mutate(
                  { csv },
                  {
                    onSuccess: () => {
                      toast({ title: "Products imported" });
                      setBulkImportOpen(false);
                      setBulkImportCsv("name,categoryId\n");
                      refetch();
                    },
                    onError: (err) => {
                      toast({
                        title: "Import failed",
                        description: err?.response?.data?.message ?? err?.message,
                        variant: "destructive",
                      });
                    },
                  }
                );
              }}
              disabled={bulkImport.isPending}
            >
              {bulkImport.isPending ? "Importing…" : "Import"}
            </Button>
          </div>
        }
        className="max-w-2xl"
      >
        <textarea
          className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm"
          placeholder="name,categoryId&#10;Product A,cat-id-1&#10;Product B,cat-id-2"
          value={bulkImportCsv}
          onChange={(e) => setBulkImportCsv(e.target.value)}
          spellCheck={false}
        />
      </Modal>
    </div>
  );
}
