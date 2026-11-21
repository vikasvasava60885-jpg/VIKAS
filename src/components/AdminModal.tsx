import React, { useEffect, useRef, useState } from 'react';
import {
  Check,
  ExternalLink,
  Eye,
  EyeOff,
  LogOut,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import {
  AdminTab,
  ArtworkPreset,
  ContactInquiry,
  Product,
  StoreSettings,
} from '../types/store';
import { ProductArtwork } from './ProductArtwork';

interface AdminModalProps {
  isOpen: boolean;
  isAuthenticated: boolean;
  products: Product[];
  categories: string[];
  settings: StoreSettings;
  inquiries: ContactInquiry[];
  onClose: () => void;
  onAuthenticate: (password: string) => boolean;
  onLogout: () => void;
  onSaveProduct: (product: Omit<Product, 'id'>, existingId?: string) => void;
  onDeleteProduct: (id: string) => void;
  onAddCategory: (name: string) => boolean;
  onRenameCategory: (oldName: string, newName: string) => boolean;
  onDeleteCategory: (name: string) => void;
  onUpdateSettings: (next: StoreSettings) => void;
  onDeleteInquiry: (id: string) => void;
  onResetDefaults: () => void;
}

function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image file'));
      img.onload = () => {
        const maxWidth = 800;
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(String(reader.result));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  isAuthenticated,
  products,
  categories,
  settings,
  inquiries,
  onClose,
  onAuthenticate,
  onLogout,
  onSaveProduct,
  onDeleteProduct,
  onAddCategory,
  onRenameCategory,
  onDeleteCategory,
  onUpdateSettings,
  onDeleteInquiry,
  onResetDefaults,
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('products');

  // Product Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0] || 'Mobile');
  const [retailer, setRetailer] = useState('Amazon');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [artworkPreset, setArtworkPreset] = useState<ArtworkPreset>('phone');
  const [featuredTag, setFeaturedTag] = useState('');
  const [formNotice, setFormNotice] = useState('');
  const [confirmDeleteProductId, setConfirmDeleteProductId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Category Management State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [renamingCategory, setRenamingCategory] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  // Settings Form State
  const [ownerNameInput, setOwnerNameInput] = useState(settings.ownerName);
  const [storeNameInput, setStoreNameInput] = useState(settings.storeName);
  const [whatsappInput, setWhatsappInput] = useState(settings.whatsappNumber);
  const [newAdminPass, setNewAdminPass] = useState(settings.adminPassword);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    setOwnerNameInput(settings.ownerName);
    setStoreNameInput(settings.storeName);
    setWhatsappInput(settings.whatsappNumber);
    setNewAdminPass(settings.adminPassword);
  }, [settings]);

  useEffect(() => {
    if (!categories.includes(category) && categories.length > 0) {
      setCategory(categories[0]);
    }
  }, [categories, category]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const resetProductForm = () => {
    setEditingId(null);
    setTitle('');
    setCategory(categories[0] || 'Mobile');
    setRetailer('Amazon');
    setPrice('');
    setDescription('');
    setUrl('');
    setImageUrl('');
    setArtworkPreset('generic');
    setFeaturedTag('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startEditProduct = (product: Product) => {
    setEditingId(product.id);
    setTitle(product.title);
    setCategory(product.category);
    setRetailer(product.retailer || 'Amazon');
    setPrice(product.price);
    setDescription(product.description);
    setUrl(product.url);
    setImageUrl(product.imageUrl || '');
    setArtworkPreset(product.artworkPreset || 'generic');
    setFeaturedTag(product.featuredTag || '');
    setFormNotice('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onAuthenticate(passwordInput);
    if (ok) {
      setPasswordInput('');
      setLoginError('');
    } else {
      setLoginError('Incorrect password. Please try again.');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file);
      setImageUrl(compressed);
      setFormNotice('Photo uploaded and ready.');
    } catch {
      setFormNotice('Could not process that image file. Try a JPEG or PNG.');
    }
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price.trim() || !url.trim()) return;

    const normalizedUrl =
      url.trim().startsWith('http://') || url.trim().startsWith('https://')
        ? url.trim()
        : `https://${url.trim()}`;

    onSaveProduct(
      {
        title: title.trim(),
        category,
        retailer: retailer.trim() || 'Amazon',
        price: price.trim(),
        description: description.trim(),
        url: normalizedUrl,
        imageUrl: imageUrl.trim(),
        artworkPreset,
        featuredTag: featuredTag.trim() || undefined,
      },
      editingId || undefined
    );

    setFormNotice(editingId ? 'Product updated.' : 'Product added to store.');
    resetProductForm();
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    if (trimmed.toLowerCase() === 'all') {
      setCategoryError('"All" is reserved automatically.');
      return;
    }
    const added = onAddCategory(trimmed);
    if (!added) {
      setCategoryError('Category already exists.');
      return;
    }
    setCategoryError('');
    setNewCategoryName('');
  };

  const handleRenameSubmit = (oldName: string) => {
    const trimmed = renameValue.trim();
    if (!trimmed || trimmed === oldName) {
      setRenamingCategory(null);
      return;
    }
    const ok = onRenameCategory(oldName, trimmed);
    if (!ok) {
      setCategoryError('Category name already exists or is invalid.');
      return;
    }
    setCategoryError('');
    setRenamingCategory(null);
  };

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ownerName: ownerNameInput.trim() || 'Vikas Vasava',
      storeName: storeNameInput.trim() || 'VV STORE',
      whatsappNumber: whatsappInput.replace(/\D/g, '') || '919999999999',
      adminPassword: newAdminPass.trim() || settings.adminPassword,
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={isAuthenticated ? 'Admin Panel' : 'Admin Login'}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {!isAuthenticated ? (
        <div className="relative w-full max-w-sm rounded-2xl border border-white/15 bg-[#0C0C0F] p-6 shadow-2xl">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close login modal"
            className="absolute right-4 top-4 rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          <h2 className="font-display text-xl font-bold text-white">
            Admin Login
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            Enter your admin password to manage products, links, and categories.
          </p>

          <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="admin-password-input"
                className="mb-1.5 block text-xs font-medium text-zinc-300"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password-input"
                  type={showPassword ? 'text' : 'password'}
                  autoFocus
                  required
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (loginError) setLoginError('');
                  }}
                  placeholder="Enter admin password"
                  className="min-h-[42px] w-full rounded-lg border border-white/15 bg-[#050505] py-2.5 pl-3.5 pr-10 text-sm text-white placeholder-zinc-500 focus:border-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {loginError && (
                <p className="mt-2 text-xs text-red-400">{loginError}</p>
              )}
            </div>

            <button
              type="submit"
              className="min-h-[42px] w-full rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
            >
              Sign In
            </button>
          </form>
        </div>
      ) : (
        <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0C0C0F] shadow-2xl">
          {/* Modal Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
            <div>
              <h2 className="font-display text-lg font-bold text-white sm:text-xl">
                Admin Panel
              </h2>
              <p className="text-xs text-zinc-400">
                Manage products, affiliate URLs, photos, categories &amp; settings
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-red-400/50 hover:text-red-300"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Logout</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close admin panel"
                className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Segmented Tabs */}
          <div className="border-b border-white/10 bg-[#08080A] px-6 py-3">
            <div className="inline-flex rounded-lg border border-white/10 bg-[#050505] p-1">
              {(
                [
                  { id: 'products', label: `Products (${products.length})` },
                  { id: 'categories', label: `Categories (${categories.length})` },
                  { id: 'settings', label: `Settings & Inbox (${inquiries.length})` },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'products' && (
              <div className="space-y-8">
                {/* Add / Edit Product Form */}
                <form
                  onSubmit={handleProductSubmit}
                  className="rounded-xl border border-white/10 bg-[#08080A] p-5"
                >
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <h3 className="font-display text-base font-semibold text-white">
                      {editingId ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    {editingId && (
                      <button
                        type="button"
                        onClick={resetProductForm}
                        className="text-xs font-medium text-zinc-400 underline hover:text-white"
                      >
                        Cancel Editing
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                    <div className="space-y-4 lg:col-span-8">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-zinc-300">
                            Product Title *
                          </label>
                          <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Sony WH-1000XM5"
                            className="min-h-[40px] w-full rounded-lg border border-white/15 bg-[#050505] px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-zinc-300">
                            Price *
                          </label>
                          <input
                            type="text"
                            required
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="e.g. ₹24,990"
                            className="min-h-[40px] w-full rounded-lg border border-white/15 bg-[#050505] px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-zinc-300">
                            Category *
                          </label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="min-h-[40px] w-full rounded-lg border border-white/15 bg-[#050505] px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                          >
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-zinc-300">
                            Retailer Label
                          </label>
                          <input
                            type="text"
                            value={retailer}
                            onChange={(e) => setRetailer(e.target.value)}
                            placeholder="Amazon / Flipkart"
                            className="min-h-[40px] w-full rounded-lg border border-white/15 bg-[#050505] px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-zinc-300">
                            Optional Tag
                          </label>
                          <input
                            type="text"
                            value={featuredTag}
                            onChange={(e) => setFeaturedTag(e.target.value)}
                            placeholder="e.g. Best Seller"
                            className="min-h-[40px] w-full rounded-lg border border-white/15 bg-[#050505] px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-zinc-300">
                          Redirect Shopping URL (Amazon / Flipkart) *
                        </label>
                        <input
                          type="text"
                          required
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="https://www.amazon.in/dp/..."
                          className="min-h-[40px] w-full rounded-lg border border-white/15 bg-[#050505] px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-zinc-300">
                          Short Description
                        </label>
                        <textarea
                          rows={2}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Key specs or highlights..."
                          className="w-full rounded-lg border border-white/15 bg-[#050505] px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Photo Upload & Live Preview */}
                    <div className="flex flex-col gap-3 lg:col-span-4">
                      <label className="block text-xs font-medium text-zinc-300">
                        Product Photo
                      </label>
                      <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-[#141417]">
                        <ProductArtwork
                          imageUrl={imageUrl}
                          preset={artworkPreset}
                          category={category}
                          title={title || 'Preview'}
                        />
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex min-h-[38px] w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white hover:text-black"
                      >
                        <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Upload Photo from Device</span>
                      </button>

                      <input
                        type="text"
                        value={imageUrl.startsWith('data:') ? '' : imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Or paste Image URL..."
                        className="min-h-[36px] w-full rounded-lg border border-white/15 bg-[#050505] px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-white focus:outline-none"
                      />

                      {imageUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setImageUrl('');
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="text-left text-xs text-zinc-400 hover:text-white"
                        >
                          Remove uploaded photo (use studio render)
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                    <span className="text-xs text-zinc-400">
                      {formNotice || 'Clicking a product photo or Buy Now opens the URL above.'}
                    </span>
                    <button
                      type="submit"
                      className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-white px-5 py-2 text-xs font-semibold text-black transition-colors hover:bg-zinc-200"
                    >
                      {editingId ? (
                        <>
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Update Product</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Add Product</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Existing Products List */}
                <div>
                  <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-zinc-400">
                    Active Catalog ({products.length})
                  </h3>

                  {products.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-white/15 p-8 text-center text-sm text-zinc-400">
                      No products in catalog yet. Add your first product above.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {products.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#08080A] p-3"
                        >
                          <div className="flex min-w-0 flex-1 items-center gap-3.5">
                            <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-[#141417]">
                              <ProductArtwork
                                imageUrl={item.imageUrl}
                                preset={item.artworkPreset}
                                category={item.category}
                                title={item.title}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-display text-sm font-semibold text-white">
                                {item.title}
                              </p>
                              <p className="truncate text-xs text-zinc-400">
                                {item.category} · {item.retailer} ·{' '}
                                <span className="font-mono-tabular text-zinc-200">
                                  {item.price}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-2">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Test link for ${item.title}`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 text-zinc-300 transition-colors hover:border-white hover:text-white"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                            <button
                              type="button"
                              onClick={() => startEditProduct(item)}
                              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/15 px-3 text-xs font-medium text-zinc-200 transition-colors hover:border-white hover:bg-white hover:text-black"
                            >
                              <Pencil className="h-3 w-3" aria-hidden="true" />
                              <span>Edit</span>
                            </button>

                            {confirmDeleteProductId === item.id ? (
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    onDeleteProduct(item.id);
                                    setConfirmDeleteProductId(null);
                                    if (editingId === item.id) resetProductForm();
                                  }}
                                  className="h-8 rounded-lg bg-red-500 px-2.5 text-xs font-semibold text-white hover:bg-red-600"
                                >
                                  Confirm
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteProductId(null)}
                                  className="h-8 rounded-lg border border-white/15 px-2.5 text-xs text-zinc-300 hover:text-white"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteProductId(item.id)}
                                aria-label={`Delete ${item.title}`}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/30 text-red-400 transition-colors hover:bg-red-500/15"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'categories' && (
              <div className="space-y-6">
                <form
                  onSubmit={handleAddCategorySubmit}
                  className="flex flex-wrap items-end gap-3 rounded-xl border border-white/10 bg-[#08080A] p-5"
                >
                  <div className="min-w-[200px] flex-1">
                    <label
                      htmlFor="new-category-input"
                      className="mb-1.5 block text-xs font-medium text-zinc-300"
                    >
                      Add New Category
                    </label>
                    <input
                      id="new-category-input"
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => {
                        setNewCategoryName(e.target.value);
                        if (categoryError) setCategoryError('');
                      }}
                      placeholder="e.g. Gaming, Keyboards, Speakers"
                      className="min-h-[40px] w-full rounded-lg border border-white/15 bg-[#050505] px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:border-white focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-zinc-200"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Add Category</span>
                  </button>
                  {categoryError && (
                    <p className="w-full text-xs text-red-400">{categoryError}</p>
                  )}
                </form>

                <div className="space-y-2.5">
                  {categories.map((cat) => {
                    const count = products.filter((p) => p.category === cat).length;
                    const isRenaming = renamingCategory === cat;

                    return (
                      <div
                        key={cat}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#08080A] px-4 py-3"
                      >
                        {isRenaming ? (
                          <div className="flex flex-1 items-center gap-2">
                            <input
                              type="text"
                              value={renameValue}
                              onChange={(e) => setRenameValue(e.target.value)}
                              className="min-h-[36px] flex-1 rounded-lg border border-white/25 bg-[#050505] px-3 py-1.5 text-sm text-white focus:outline-none"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleRenameSubmit(cat)}
                              className="h-9 rounded-lg bg-white px-3 text-xs font-semibold text-black"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setRenamingCategory(null)}
                              className="h-9 rounded-lg border border-white/15 px-3 text-xs text-zinc-300"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-3">
                              <span className="font-display text-sm font-semibold text-white">
                                {cat}
                              </span>
                              <span className="font-mono-tabular text-xs text-zinc-400">
                                {count} {count === 1 ? 'product' : 'products'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setRenamingCategory(cat);
                                  setRenameValue(cat);
                                  setCategoryError('');
                                }}
                                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/15 px-3 text-xs font-medium text-zinc-200 transition-colors hover:border-white hover:bg-white hover:text-black"
                              >
                                <Pencil className="h-3 w-3" aria-hidden="true" />
                                <span>Rename</span>
                              </button>
                              <button
                                type="button"
                                disabled={categories.length <= 1}
                                onClick={() => onDeleteCategory(cat)}
                                title={
                                  categories.length <= 1
                                    ? 'Keep at least one category'
                                    : `Delete ${cat}`
                                }
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/30 text-red-400 transition-colors hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-35"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-8">
                <form
                  onSubmit={handleSettingsSubmit}
                  className="space-y-4 rounded-xl border border-white/10 bg-[#08080A] p-5"
                >
                  <h3 className="font-display text-base font-semibold text-white">
                    Store &amp; WhatsApp Business Settings
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-zinc-300">
                        Store Name
                      </label>
                      <input
                        type="text"
                        value={storeNameInput}
                        onChange={(e) => setStoreNameInput(e.target.value)}
                        className="min-h-[40px] w-full rounded-lg border border-white/15 bg-[#050505] px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-zinc-300">
                        Owner Name
                      </label>
                      <input
                        type="text"
                        value={ownerNameInput}
                        onChange={(e) => setOwnerNameInput(e.target.value)}
                        className="min-h-[40px] w-full rounded-lg border border-white/15 bg-[#050505] px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-zinc-300">
                        WhatsApp Business Number (with country code)
                      </label>
                      <input
                        type="text"
                        value={whatsappInput}
                        onChange={(e) => setWhatsappInput(e.target.value)}
                        placeholder="919999999999"
                        className="min-h-[40px] w-full rounded-lg border border-white/15 bg-[#050505] px-3 py-2 font-mono-tabular text-sm text-white focus:border-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-zinc-300">
                        Admin Login Password
                      </label>
                      <input
                        type="text"
                        value={newAdminPass}
                        onChange={(e) => setNewAdminPass(e.target.value)}
                        className="min-h-[40px] w-full rounded-lg border border-white/15 bg-[#050505] px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <span className="text-xs text-zinc-400">
                      {settingsSaved ? 'Settings saved.' : 'Changes apply immediately across the store.'}
                    </span>
                    <button
                      type="submit"
                      className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-white px-5 py-2 text-xs font-semibold text-black transition-colors hover:bg-zinc-200"
                    >
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Save Settings</span>
                    </button>
                  </div>
                </form>

                {/* Inquiries Inbox */}
                <div className="space-y-3">
                  <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-zinc-400">
                    Contact Messages ({inquiries.length})
                  </h3>

                  {inquiries.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-white/15 p-6 text-center text-xs text-zinc-400">
                      No contact form inquiries received yet.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {inquiries.map((msg) => (
                        <div
                          key={msg.id}
                          className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-[#08080A] p-4"
                        >
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-white">
                              {msg.name}{' '}
                              <span className="font-normal text-zinc-400">
                                · {msg.email}
                              </span>
                            </p>
                            <p className="text-xs leading-relaxed text-zinc-300">
                              {msg.message}
                            </p>
                            <p className="font-mono-tabular text-[11px] text-zinc-500">
                              {new Date(msg.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onDeleteInquiry(msg.id)}
                            aria-label={`Delete message from ${msg.name}`}
                            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-zinc-400 hover:border-red-500/40 hover:text-red-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reset Catalog */}
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#08080A] p-5">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Restore Default Catalog
                    </p>
                    <p className="text-xs text-zinc-400">
                      Reset sample products and default categories back to initial setup.
                    </p>
                  </div>

                  {confirmReset ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onResetDefaults();
                          setConfirmReset(false);
                        }}
                        className="min-h-[36px] rounded-lg bg-red-500 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
                      >
                        Confirm Reset
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmReset(false)}
                        className="min-h-[36px] rounded-lg border border-white/15 px-3.5 py-1.5 text-xs text-zinc-300 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmReset(true)}
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-white/20 px-4 py-2 text-xs font-medium text-zinc-200 transition-colors hover:border-white hover:text-white"
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Reset Defaults</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
