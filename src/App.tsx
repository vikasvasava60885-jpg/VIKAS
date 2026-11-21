/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { AdminModal } from './components/AdminModal';
import { ContactSection } from './components/ContactSection';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_PRODUCTS,
  DEFAULT_SETTINGS,
} from './data/defaultCatalog';
import { ContactInquiry, Product, StoreSettings } from './types/store';

const STORAGE_KEYS = {
  products: 'vv_store_products_v1',
  categories: 'vv_store_categories_v1',
  settings: 'vv_store_settings_v1',
  inquiries: 'vv_store_inquiries_v1',
} as const;

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [products, setProducts] = useState<Product[]>(() =>
    readStorage<Product[]>(STORAGE_KEYS.products, DEFAULT_PRODUCTS)
  );
  const [categories, setCategories] = useState<string[]>(() =>
    readStorage<string[]>(STORAGE_KEYS.categories, DEFAULT_CATEGORIES)
  );
  const [settings, setSettings] = useState<StoreSettings>(() =>
    readStorage<StoreSettings>(STORAGE_KEYS.settings, DEFAULT_SETTINGS)
  );
  const [inquiries, setInquiries] = useState<ContactInquiry[]>(() =>
    readStorage<ContactInquiry[]>(STORAGE_KEYS.inquiries, [])
  );

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
    } catch {
      // Ignore storage quota errors gracefully
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(categories));
    } catch {
      // Ignore storage quota errors gracefully
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
    } catch {
      // Ignore storage quota errors gracefully
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.inquiries, JSON.stringify(inquiries));
    } catch {
      // Ignore storage quota errors gracefully
    }
  }, [inquiries]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesQuery =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.retailer.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleAuthenticate = (password: string): boolean => {
    if (password === settings.adminPassword) {
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleSaveProduct = (
    productData: Omit<Product, 'id'>,
    existingId?: string
  ) => {
    if (existingId) {
      setProducts((prev) =>
        prev.map((p) => (p.id === existingId ? { ...productData, id: existingId } : p))
      );
    } else {
      const id = `vv-${Date.now()}`;
      setProducts((prev) => [{ ...productData, id }, ...prev]);
    }
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddCategory = (name: string): boolean => {
    const exists = categories.some(
      (c) => c.toLowerCase() === name.toLowerCase()
    );
    if (exists) return false;
    setCategories((prev) => [...prev, name]);
    return true;
  };

  const handleRenameCategory = (oldName: string, newName: string): boolean => {
    const exists = categories.some(
      (c) => c.toLowerCase() === newName.toLowerCase() && c !== oldName
    );
    if (exists) return false;
    setCategories((prev) => prev.map((c) => (c === oldName ? newName : c)));
    setProducts((prev) =>
      prev.map((p) => (p.category === oldName ? { ...p, category: newName } : p))
    );
    if (selectedCategory === oldName) {
      setSelectedCategory(newName);
    }
    return true;
  };

  const handleDeleteCategory = (name: string) => {
    if (categories.length <= 1) return;
    const remaining = categories.filter((c) => c !== name);
    const fallbackCategory = remaining[0];
    setCategories(remaining);
    setProducts((prev) =>
      prev.map((p) =>
        p.category === name ? { ...p, category: fallbackCategory } : p
      )
    );
    if (selectedCategory === name) {
      setSelectedCategory('All');
    }
  };

  const handleAddInquiry = (
    inquiry: Omit<ContactInquiry, 'id' | 'createdAt'>
  ) => {
    const entry: ContactInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setInquiries((prev) => [entry, ...prev]);
  };

  const handleDeleteInquiry = (id: string) => {
    setInquiries((prev) => prev.filter((i) => i.id !== id));
  };

  const handleResetDefaults = () => {
    setProducts(DEFAULT_PRODUCTS);
    setCategories(DEFAULT_CATEGORIES);
    setSelectedCategory('All');
    setSearchQuery('');
  };

  return (
    <div id="top" className="relative min-h-screen bg-[#050505] text-white">
      {/* Subtle Monochrome Animated Background */}
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 0%, #18181B 0%, #050505 68%)',
          }}
        />
        <div className="ambient-orb absolute -left-24 -top-28 h-[380px] w-[380px] rounded-full bg-white/[0.11] blur-[110px]" />
        <div className="ambient-orb-delayed absolute -bottom-24 -right-20 h-[340px] w-[340px] rounded-full bg-white/[0.08] blur-[110px]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header
          storeName={settings.storeName}
          isAdminAuthenticated={isAdminAuthenticated}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="mx-auto max-w-4xl px-4 pb-8 pt-14 text-center sm:px-6 sm:pt-20 lg:px-8">
            <h1 className="font-display text-balance bg-gradient-to-b from-white via-white to-zinc-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
              Curated Tech &amp; Smart Gear
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              Mobile, Headphones, Smartwatches, Laptops &amp; Accessories — ek hi
              jagah. Photo ya Buy Now par click karein aur seedha trusted
              shopping page par pahunchein.
            </p>

            {/* Search Bar */}
            <div className="mx-auto mt-8 max-w-md">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, brands, or stores..."
                  aria-label="Search products"
                  className="min-h-[46px] w-full rounded-xl border border-white/15 bg-white/[0.04] py-2.5 pl-11 pr-10 text-sm text-white placeholder-zinc-500 transition-all duration-150 focus:border-white/60 focus:bg-[#0C0C0F] focus:shadow-[0_0_24px_rgba(255,255,255,0.12)] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-zinc-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Interactive Category Filter Controls */}
          <section
            id="categories"
            aria-label="Product categories"
            className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-8"
          >
            <div className="flex flex-wrap items-center justify-center gap-2">
              {['All', ...categories].map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`min-h-[40px] whitespace-nowrap rounded-lg border px-4 py-2 text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                      isActive
                        ? 'border-white bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.22)]'
                        : 'border-white/10 bg-[#0E0E11] text-zinc-400 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Product Catalog Grid */}
          <section
            id="products"
            aria-label="Product catalog"
            className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8"
          >
            {filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[#0E0E11] p-12 text-center">
                <p className="font-display text-lg font-semibold text-white">
                  No matching products found
                </p>
                <p className="mt-1.5 text-sm text-zinc-400">
                  Try clearing your search filter or switching to another category.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="mt-5 inline-flex min-h-[40px] items-center rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-zinc-200"
                >
                  Show All Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>

          {/* Owner Contact & WhatsApp Business Section */}
          <ContactSection settings={settings} onAddInquiry={handleAddInquiry} />
        </main>

        {/* Clean Footer */}
        <footer className="border-t border-white/10 bg-[#050505] py-6 text-center text-xs text-zinc-500">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            &copy; 2026 {settings.storeName} — {settings.ownerName}. All Rights Reserved.
          </div>
        </footer>
      </div>

      {/* Admin Login & Management Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        isAuthenticated={isAdminAuthenticated}
        products={products}
        categories={categories}
        settings={settings}
        inquiries={inquiries}
        onClose={() => setIsAdminOpen(false)}
        onAuthenticate={handleAuthenticate}
        onLogout={() => setIsAdminAuthenticated(false)}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        onAddCategory={handleAddCategory}
        onRenameCategory={handleRenameCategory}
        onDeleteCategory={handleDeleteCategory}
        onUpdateSettings={setSettings}
        onDeleteInquiry={handleDeleteInquiry}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}
