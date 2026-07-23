import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useEditProductMutation,
  useGetAdminCategoriesQuery,
  useGetAdminProductsQuery,
} from "@/api/exclusive";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ApiProduct } from "@/types/types";
import { getApiErrorMessage } from "@/utils/api-error";
import { formatPrice } from "@/utils/utility-functions";
import { Edit2, Plus, Trash2, X } from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";

type ProductFormState = {
  _id?: string;
  name: string;
  description: string;
  price: string;
  quantity: string;
  category: string;
  file: File | null;
};

const EMPTY_FORM: ProductFormState = {
  name: "",
  description: "",
  price: "",
  quantity: "",
  category: "",
  file: null,
};

export function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM);
  const [feedback, setFeedback] = useState("");
  const productsQuery = useGetAdminProductsQuery({ limit: 100, search: search.trim() || undefined });
  const categoriesQuery = useGetAdminCategoriesQuery();
  const [createProduct, createState] = useCreateProductMutation();
  const [editProduct, editState] = useEditProductMutation();
  const [deleteProduct, deleteState] = useDeleteProductMutation();

  const products = productsQuery.data?.products ?? [];
  const categoryNames = useMemo(() => categoriesQuery.data?.map(category => category.name) ?? [], [categoriesQuery.data]);
  const isEditing = Boolean(form._id);
  const mutationError = createState.error || editState.error || deleteState.error;

  function updateForm(field: keyof ProductFormState, value: string | File | null) {
    setForm(current => ({ ...current, [field]: value }));
  }

  function startEdit(product: ApiProduct) {
    setFeedback("");
    setForm({
      _id: product._id,
      name: product.name,
      description: product.description,
      price: String(product.price),
      quantity: String(product.quantity),
      category: product.category,
      file: null,
    });
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setFeedback("");
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFeedback("");

    if (!isEditing && !form.file) {
      setFeedback("Choose a product image before creating a product.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      quantity: Number(form.quantity),
      category: form.category,
    };

    try {
      if (isEditing && form._id) {
        await editProduct({ ...payload, _id: form._id, file: form.file ?? undefined }).unwrap();
        setFeedback("Product updated.");
      } else if (form.file) {
        await createProduct({ ...payload, file: form.file }).unwrap();
        setFeedback("Product created.");
      }
      setForm(EMPTY_FORM);
    } catch {
      // The rendered mutation error gives the component feedback.
    }
  }

  async function handleDelete(productId: string) {
    setFeedback("");
    await deleteProduct({ modelId: productId })
      .unwrap()
      .then(response => setFeedback(response.message))
      .catch(() => undefined);
  }

  return (
    <AdminLayout
      title="Products"
      description="Create products, update stock and pricing, replace product images, and remove unavailable items."
      actions={
        <Button variant="outline" onClick={resetForm}>
          <Plus className="h-4 w-4" />
          New product
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[360px,1fr]">
        <section className="h-fit rounded-md border border-gray-200 bg-white p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold">{isEditing ? "Edit product" : "Create product"}</h2>
              <p className="mt-1 text-sm text-gray-600">{isEditing ? "Image replacement is optional." : "A product image is required."}</p>
            </div>
            {isEditing && (
              <button type="button" onClick={resetForm} className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-black" aria-label="Cancel edit">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {(feedback || mutationError) && (
            <div className="mb-4 rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
              {mutationError ? getApiErrorMessage(mutationError, "Could not save this product.") : feedback}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Name">
              <Input value={form.name} onChange={event => updateForm("name", event.target.value)} required />
            </FormField>
            <FormField label="Description">
              <textarea
                value={form.description}
                onChange={event => updateForm("description", event.target.value)}
                required
                rows={4}
                className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Price">
                <Input type="number" min="1" value={form.price} onChange={event => updateForm("price", event.target.value)} required />
              </FormField>
              <FormField label="Quantity">
                <Input type="number" min="1" value={form.quantity} onChange={event => updateForm("quantity", event.target.value)} required />
              </FormField>
            </div>
            <FormField label="Category">
              <select
                value={form.category}
                onChange={event => updateForm("category", event.target.value)}
                required
                className="h-9 w-full rounded-md border border-input bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <option value="">Select category</option>
                {categoryNames.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label={isEditing ? "Replace image" : "Image"}>
              <Input type="file" accept="image/*" onChange={event => updateForm("file", event.target.files?.[0] ?? null)} required={!isEditing} />
            </FormField>
            <Button type="submit" className="w-full" disabled={createState.isLoading || editState.isLoading || categoryNames.length === 0}>
              {isEditing ? "Save product" : "Create product"}
            </Button>
          </form>
        </section>

        <section className="min-w-0 rounded-md border border-gray-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold">Catalog</h2>
              <p className="text-sm text-gray-600">{productsQuery.data?.productsCount ?? 0} products in backend catalog</p>
            </div>
            <Input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search products" className="sm:max-w-64" />
          </div>

          {productsQuery.isLoading && <p className="p-4 text-sm text-gray-600">Loading products...</p>}
          {productsQuery.error && <p className="p-4 text-sm text-[#db4444]">{getApiErrorMessage(productsQuery.error, "Could not load products.")}</p>}
          {!productsQuery.isLoading && products.length === 0 && <p className="p-4 text-sm text-gray-600">No products found.</p>}

          {products.length > 0 && (
            <div className="divide-y divide-gray-100">
              {products.map(product => (
                <article key={product._id} className="grid grid-cols-[72px,1fr] gap-4 p-4 lg:grid-cols-[72px,1fr,auto] lg:items-center">
                  <img src={product.imageUrl} alt={product.name} className="h-16 w-16 rounded bg-gray-100 object-cover" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-medium">{product.name}</h3>
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">{product.category}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">{product.description}</p>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm">
                      <span className="font-semibold">{formatPrice(product.price)}</span>
                      <span className="text-gray-600">{product.quantity} in stock</span>
                    </div>
                  </div>
                  <div className="col-span-2 flex gap-2 lg:col-span-1">
                    <Button variant="outline" size="sm" onClick={() => startEdit(product)}>
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(product._id)} disabled={deleteState.isLoading}>
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}

function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
