"use client";

import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { ShoppingCart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Modal } from "@/components/shared/modal";
import { useOrders, useCreateOrder, useUpdateOrderStatus } from "../hooks/use-orders";
import { useProducts } from "@/features/products/hooks/use-products";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";

const statusVariant = { pending: "secondary", confirmed: "default", shipped: "outline", delivered: "success", cancelled: "destructive" };

export function OrdersList() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [createOpen, setCreateOpen] = useState(false);
  const [statusOrderId, setStatusOrderId] = useState(null);
  const [newItems, setNewItems] = useState([{ productId: "", quantity: 1, unitPrice: "" }]);

  const params = { page, limit };
  const { data, isLoading, isError, refetch } = useOrders(params);
  const { data: productsData } = useProducts({ limit: 500 });
  const products = productsData?.data ?? [];
  const createOrder = useCreateOrder();
  const updateStatus = useUpdateOrderStatus(statusOrderId ?? "");

  const orders = data?.data ?? [];
  const totalRows = data?.total ?? 0;

  const addItemRow = () => setNewItems((prev) => [...prev, { productId: "", quantity: 1, unitPrice: "" }]);
  const removeItemRow = (i) => setNewItems((prev) => prev.filter((_, idx) => idx !== i));
  const setItem = (i, field, value) => {
    setNewItems((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  };

  const handleCreateOrder = () => {
    const items = newItems
      .map((row) => ({
        productId: row.productId?.trim?.() || row.productId,
        quantity: Number(row.quantity) || 1,
        unitPrice: Number(row.unitPrice) || 0,
      }))
      .filter((row) => row.productId);
    if (!items.length) {
      toast({ title: "Add at least one item with a product", variant: "destructive" });
      return;
    }
    createOrder.mutate(
      { items },
      {
        onSuccess: () => {
          toast({ title: "Order created" });
          setCreateOpen(false);
          setNewItems([{ productId: "", quantity: 1, unitPrice: "" }]);
          refetch();
        },
        onError: (err) => {
          toast({
            title: "Failed to create order",
            description: err?.response?.data?.message ?? err?.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleStatusChange = (orderId, status) => {
    setStatusOrderId(orderId);
    updateStatus.mutate(
      { status },
      {
        onSuccess: () => {
          toast({ title: "Status updated" });
          setStatusOrderId(null);
          refetch();
        },
        onError: (err) => {
          toast({
            title: "Failed to update status",
            description: err?.response?.data?.message ?? err?.message,
            variant: "destructive",
          });
          setStatusOrderId(null);
        },
      }
    );
  };

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader icon={ShoppingCart} title="Orders" description="View and manage orders." />
        <ErrorState onRetry={refetch} />
      </div>
    );
  }

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id ?? "—",
      sortable: false,
      width: "100px",
      style: { paddingLeft: "1rem" },
    },
    {
      name: "Status",
      cell: (row) => {
        const s = (row.status ?? "pending").toLowerCase();
        return <Badge variant={statusVariant[s] || "secondary"}>{s}</Badge>;
      },
      sortable: false,
    },
    {
      name: "Items",
      selector: (row) => (Array.isArray(row.items) ? row.items.length : row.itemCount ?? "—"),
      sortable: false,
    },
    {
      name: "Created",
      cell: (row) => formatDate(row.createdAt ?? row.created_at) ?? "—",
      sortable: false,
    },
    {
      name: "Actions",
      cell: (row) => (
        <select
          className="h-8 rounded-md border border-input bg-background px-2 text-sm"
          value={row.status ?? ""}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          disabled={statusOrderId === row.id && updateStatus.isPending}
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      ),
      sortable: false,
      right: true,
      style: { paddingRight: "1rem" },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ShoppingCart}
        title="Orders"
        description="View and manage orders."
        action={
          <Button className="gap-2" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            New order
          </Button>
        }
      />

      <div className="rounded-xl border border-border bg-card">
        {isLoading && !orders.length ? (
          <div className="p-6">
            <TableSkeleton rows={10} cols={5} />
          </div>
        ) : !orders.length ? (
          <EmptyState
            icon={ShoppingCart}
            title="No orders yet"
            description="Create your first order."
            action={
              <Button className="gap-2" onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4" />
                New order
              </Button>
            }
          />
        ) : (
          <DataTable
            columns={columns}
            data={orders}
            progressPending={isLoading}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            paginationPerPage={limit}
            paginationRowsPerPageOptions={[10, 20, 50]}
            onChangePage={setPage}
            onChangeRowsPerPage={(newLimit, newPage) => {
              setLimit(newLimit);
              setPage(newPage);
            }}
            noDataComponent="No orders found."
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
        title="Create order"
        description="Add order items (product, quantity, unit price)."
        className="max-w-xl"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateOrder} disabled={createOrder.isPending}>
              {createOrder.isPending ? "Creating…" : "Create order"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {newItems.map((item, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2 rounded-lg border p-3">
              <select
                className="h-9 min-w-[180px] rounded-md border border-input bg-background px-3 text-sm"
                value={item.productId}
                onChange={(e) => setItem(i, "productId", e.target.value)}
              >
                <option value="">Select product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name ?? p.title ?? p.id}
                  </option>
                ))}
              </select>
              <Input
                type="number"
                min={1}
                placeholder="Qty"
                className="w-20"
                value={item.quantity}
                onChange={(e) => setItem(i, "quantity", e.target.value)}
              />
              <Input
                type="number"
                min={0}
                step={0.01}
                placeholder="Unit price"
                className="w-28"
                value={item.unitPrice}
                onChange={(e) => setItem(i, "unitPrice", e.target.value)}
              />
              <Button type="button" variant="ghost" size="sm" onClick={() => removeItemRow(i)} disabled={newItems.length <= 1}>
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addItemRow}>
            Add item
          </Button>
        </div>
      </Modal>
    </div>
  );
}
