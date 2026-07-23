import { useCreateCategoryMutation, useDeleteCategoryMutation, useEditCategoryMutation, useGetAdminCategoriesQuery } from "@/api/exclusive";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdminCategoriesResponseData } from "@/types/types";
import { getApiErrorMessage } from "@/utils/api-error";
import { Edit2, Plus, Trash2, X } from "lucide-react";
import { useState, type FormEvent } from "react";

type CategoryRecord = AdminCategoriesResponseData[number];

export function AdminCategoriesPage() {
  const categoriesQuery = useGetAdminCategoriesQuery();
  const [createCategory, createState] = useCreateCategoryMutation();
  const [editCategory, editState] = useEditCategoryMutation();
  const [deleteCategory, deleteState] = useDeleteCategoryMutation();
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<CategoryRecord | null>(null);
  const [feedback, setFeedback] = useState("");
  const categories = categoriesQuery.data ?? [];
  const mutationError = createState.error || editState.error || deleteState.error;

  function startEdit(category: CategoryRecord) {
    setEditingCategory(category);
    setCategoryName(category.name);
    setFeedback("");
  }

  function resetForm() {
    setEditingCategory(null);
    setCategoryName("");
    setFeedback("");
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const name = categoryName.trim();
    if (!name) return;
    setFeedback("");

    try {
      if (editingCategory) {
        await editCategory({ _id: editingCategory._id, name }).unwrap();
        setFeedback("Category updated.");
      } else {
        await createCategory({ name }).unwrap();
        setFeedback("Category created.");
      }
      setEditingCategory(null);
      setCategoryName("");
    } catch {
      // The rendered mutation error gives the component feedback.
    }
  }

  async function handleDelete(categoryId: string) {
    setFeedback("");
    await deleteCategory({ modelId: categoryId })
      .unwrap()
      .then(response => setFeedback(response.message))
      .catch(() => undefined);
  }

  return (
    <AdminLayout
      title="Categories"
      description="Manage the category names used by product creation, filtering, and merchandising sections."
      actions={
        <Button variant="outline" onClick={resetForm}>
          <Plus className="h-4 w-4" />
          New category
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px,1fr]">
        <section className="h-fit rounded-md border border-gray-200 bg-white p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold">{editingCategory ? "Edit category" : "Create category"}</h2>
              <p className="mt-1 text-sm text-gray-600">Names are stored lowercase by the backend.</p>
            </div>
            {editingCategory && (
              <button type="button" onClick={resetForm} className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-black" aria-label="Cancel edit">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {(feedback || mutationError) && (
            <div className="mb-4 rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
              {mutationError ? getApiErrorMessage(mutationError, "Could not save this category.") : feedback}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Category name</span>
              <Input value={categoryName} onChange={event => setCategoryName(event.target.value)} placeholder="e.g. electronics" required />
            </label>
            <Button type="submit" className="w-full" disabled={createState.isLoading || editState.isLoading}>
              {editingCategory ? "Save category" : "Create category"}
            </Button>
          </form>
        </section>

        <section className="rounded-md border border-gray-200 bg-white">
          <div className="border-b border-gray-100 p-4">
            <h2 className="font-semibold">Catalog categories</h2>
            <p className="text-sm text-gray-600">{categories.length} active categories</p>
          </div>

          {categoriesQuery.isLoading && <p className="p-4 text-sm text-gray-600">Loading categories...</p>}
          {categoriesQuery.error && <p className="p-4 text-sm text-[#db4444]">{getApiErrorMessage(categoriesQuery.error, "Could not load categories.")}</p>}
          {!categoriesQuery.isLoading && categories.length === 0 && <p className="p-4 text-sm text-gray-600">No categories found.</p>}

          {categories.length > 0 && (
            <div className="divide-y divide-gray-100">
              {categories.map(category => (
                <article key={category._id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="truncate font-medium capitalize">{category.name}</h3>
                    <p className="truncate text-xs text-gray-500">{category._id}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => startEdit(category)}>
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(category._id)} disabled={deleteState.isLoading}>
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
