import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import {
  addCategory,
  updateCategory,
  deleteCategory,
} from '../../../store/slices/categoriesSlice';
import CategoryImageInput from '../components/CategoryImageInput';

interface AdminCategoriesProps {
  currentLang: string;
  showToast: any;
  translate: any;
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({
  currentLang,
  showToast,
  translate,
}) => {
  const dispatch = useDispatch();
  const reduxCategories = useSelector(
    (state: RootState) => state.categories.items,
  );
  const products = useSelector((state: RootState) => state.parts.listings);
  const [showCategoryModal, setShowCategoryModal] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<any | null>(
    null,
  );

  const [newCategoryName, setNewCategoryName] = React.useState('');
  const [editCategoryName, setEditCategoryName] = React.useState('');
  const [newCategoryImage, setNewCategoryImage] = React.useState<string | null>(
    null,
  );
  const [categoryErrorMessage, setCategoryErrorMessage] = React.useState<
    string | null
  >(null);

  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setEditCategoryName('');
    setCategoryErrorMessage(null);
    setNewCategoryName('');
    setNewCategoryImage(null);
    setShowCategoryModal(true);
  };

  const openEditCategoryModal = (cat: any) => {
    setEditingCategory(cat);
    setEditCategoryName(cat.name);
    setNewCategoryImage(cat.imageUri || null);
    setCategoryErrorMessage(null);
    setShowCategoryModal(true);
  };

  const closeCategoryModal = () => {
    setShowCategoryModal(false);
    setCategoryErrorMessage(null);
    setEditingCategory(null);
    setNewCategoryName('');
    setEditCategoryName('');
    setNewCategoryImage(null);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryErrorMessage(null);

    const categoryName = editingCategory ? editCategoryName : newCategoryName;
    if (!categoryName.trim()) {
      setCategoryErrorMessage(
        translate('web.autoText21', {
          defaultValue:
            currentLang === 'AR'
              ? 'يرجى إدخال اسم الصنف.'
              : 'Veuillez saisir un nom de catégorie.',
        }),
      );
      return;
    }

    const normalized = categoryName.trim();
    const duplicate = reduxCategories.find(
      c =>
        c.name.toLowerCase() === normalized.toLowerCase() &&
        c.id !== editingCategory?.id,
    );
    if (duplicate) {
      setCategoryErrorMessage(
        translate('web.autoText22', {
          defaultValue:
            currentLang === 'AR'
              ? 'هذا الصنف موجود بالفعل'
              : 'Catégorie déjà existante.',
        }),
      );
      return;
    }

    if (editingCategory) {
      const renamed = {
        ...editingCategory,
        name: normalized,
        imageUri: newCategoryImage || editingCategory.imageUri,
        updatedAt: new Date().toISOString(),
      };
      dispatch(updateCategory(renamed));
      showToast(
        translate('web.autoText25', {
          defaultValue:
            currentLang === 'AR'
              ? 'تمت إعادة تسمية الصنف !'
              : 'Catégorie modifiée !',
        }),
        'success',
      );
    } else {
      const newCat = {
        id: 'cat-' + Date.now(),
        name: normalized,
        imageUri: newCategoryImage || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch(addCategory(newCat));
      showToast(
        translate('web.autoText23', {
          defaultValue:
            currentLang === 'AR'
              ? 'تمت إضافة الصنف بنجاح !'
              : 'Catégorie ajoutée avec succès !',
        }),
        'success',
      );
    }

    setEditingCategory(null);
    setNewCategoryName('');
    setEditCategoryName('');
    setNewCategoryImage(null);
    setShowCategoryModal(false);
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (
      window.confirm(
        translate('web.autoText26', {
          defaultValue:
            currentLang === 'AR'
              ? `هل أنت متأكد من حذف صنف "${name}" ؟`
              : `Voulez-vous supprimer la catégorie "${name}" ?`,
        }),
      )
    ) {
      // Clear editing state if deleting the current category being edited
      if (editingCategory?.id === id) {
        setEditingCategory(null);
        setEditCategoryName('');
        setNewCategoryImage(null);
      }
      dispatch(deleteCategory(id));
      showToast(
        translate('web.autoText27', {
          defaultValue:
            currentLang === 'AR' ? 'تم حذف الصنف' : 'Catégorie supprimée !',
        }),
        'info',
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
      <h1 className="text-3xl font-black tracking-tight">
        {currentLang === 'AR'
          ? 'إدارة أصناف المنتجات'
          : 'Gestion des Catégories'}
      </h1>
      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-semibold">
        {currentLang === 'AR'
          ? 'تحكم في القائمة الديناميكية للأصناف المستعملة في الفرز.'
          : 'Ajoutez de nouvelles familles de produits et réorganisez le catalogue.'}
      </p>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm mt-8">
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-450 mb-2">
            {editingCategory
              ? currentLang === 'AR'
                ? 'تعديل الصنف الحالي'
                : 'Modifier la catégorie'
              : currentLang === 'AR'
              ? 'إضافة صنف جديد'
              : 'Créer une nouvelle catégorie'}
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xl">
            {currentLang === 'AR'
              ? 'استخدم الزر لإضافة صنف جديد عبر نافذة منبثقة. يمكنك تعديل أسماء الأصناف من خلال جدول الأصناف أدناه.'
              : 'Ajoutez de nouvelles catégories via la fenêtre modale. Vous pouvez renommer les catégories existantes depuis le tableau ci-dessous.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {editingCategory ? (
            <button
              type="button"
              onClick={() => {
                setEditingCategory(null);
                setEditCategoryName('');
                setNewCategoryImage(null);
                setCategoryErrorMessage(null);
              }}
              className="bg-slate-200 dark:bg-slate-700 text-slate-650 dark:text-slate-250 text-xs font-black px-5 py-3 rounded-xl transition"
            >
              {currentLang === 'AR'
                ? 'إلغاء التعديل'
                : 'Annuler la modification'}
            </button>
          ) : null}
          <button
            type="button"
            onClick={openAddCategoryModal}
            className="bg-[#F97316] hover:bg-[#e0630b] text-white text-xs font-black px-5 py-3 rounded-xl shadow-sm transition"
          >
            {currentLang === 'AR'
              ? '+ إضافة صنف جديد'
              : '+ Ajouter une catégorie'}
          </button>
        </div>
      </div>

      {/* Categories list table */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm overflow-hidden mt-8">
        <table className="w-full text-xs text-left font-semibold">
          <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 uppercase tracking-widest text-[9.5px] text-slate-400">
            <tr>
              <th className="px-6 py-4">Nom de la Catégorie</th>
              <th className="px-6 py-4">Nombre d'Articles</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-750 text-slate-700 dark:text-slate-200">
            {reduxCategories.map(cat => {
              const count = products.filter(
                p => p.category === cat.name,
              ).length;
              return (
                <tr
                  key={cat.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-750/30 transition"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {cat.imageUri ? (
                        <img
                          src={cat.imageUri}
                          alt={cat.name}
                          className="h-10 w-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" />
                      )}
                      <span className="font-black">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                    {count} articles
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openEditCategoryModal(cat)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-black px-3 py-1 rounded-lg transition"
                      >
                        {currentLang === 'AR' ? 'تعديل الاسم' : 'Renommer'}
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-black px-3 py-1 rounded-lg transition"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[28px] max-w-lg w-full shadow-2xl overflow-hidden relative">
            <button
              onClick={closeCategoryModal}
              className="absolute top-4 right-4 z-10 w-8.5 h-8.5 rounded-full bg-slate-100 dark:bg-slate-750 text-slate-500 hover:text-slate-850 dark:hover:text-slate-100 flex items-center justify-center font-bold"
            >
              ✕
            </button>

            <div className="p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-black text-slate-850 dark:text-white">
                {editingCategory
                  ? currentLang === 'AR'
                    ? 'تعديل الصنف'
                    : 'Modifier la catégorie'
                  : currentLang === 'AR'
                  ? 'إضافة صنف جديد'
                  : 'Ajouter une catégorie'}
              </h2>

              {categoryErrorMessage && (
                <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-750">
                  {categoryErrorMessage}
                </div>
              )}

              <form
                onSubmit={handleSaveCategory}
                className="space-y-4 text-xs font-semibold"
              >
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                    {currentLang === 'AR' ? 'اسم الصنف' : 'Nom de la catégorie'}{' '}
                    *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      currentLang === 'AR'
                        ? 'مثال: مضخات مياه'
                        : 'Ex: Pompes et Accessoires'
                    }
                    value={editingCategory ? editCategoryName : newCategoryName}
                    onChange={e =>
                      editingCategory
                        ? setEditCategoryName(e.target.value)
                        : setNewCategoryName(e.target.value)
                    }
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4.5 py-3 text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                    {currentLang === 'AR'
                      ? 'صورة الصنف (اختياري)'
                      : 'Image de catégorie (optionnel)'}
                  </label>
                  <CategoryImageInput
                    imageUri={newCategoryImage || undefined}
                    onImageSelected={setNewCategoryImage}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeCategoryModal}
                    className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-250 text-xs font-black px-5 py-3 rounded-xl transition"
                  >
                    {currentLang === 'AR' ? 'إلغاء' : 'Annuler'}
                  </button>
                  <button
                    type="submit"
                    className="bg-[#F97316] hover:bg-[#e0630b] text-white text-xs font-black px-5 py-3 rounded-xl shadow-sm transition"
                  >
                    {editingCategory
                      ? currentLang === 'AR'
                        ? 'حفظ التعديل'
                        : 'Enregistrer'
                      : currentLang === 'AR'
                      ? 'إضافة'
                      : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminCategories;
