import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Product } from '../types/store';
import { ProductArtwork } from './ProductArtwork';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const safeUrl =
    product.url && (product.url.startsWith('http://') || product.url.startsWith('https://'))
      ? product.url
      : `https://${product.url || 'amazon.in'}`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0E0E11] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-white/40 hover:shadow-[0_0_28px_rgba(255,255,255,0.12)]">
      {/* Photo Click System: clicking the product image opens the trusted shopping page */}
      <a
        href={safeUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ${product.title} on ${product.retailer}`}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-[#141417] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
      >
        <ProductArtwork
          imageUrl={product.imageUrl}
          preset={product.artworkPreset}
          category={product.category}
          title={product.title}
        />

        {/* Subtle hover affordance overlay */}
        <div className="pointer-events-none absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/75 via-black/15 to-transparent p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <span className="text-xs font-medium text-white/95">
            Open on {product.retailer || 'Store'}
          </span>
          <ArrowUpRight className="h-4 w-4 text-white" aria-hidden="true" />
        </div>
      </a>

      {/* Product Metadata & Action */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5 truncate">
            <span className="uppercase tracking-wider">{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>{product.retailer || 'Trusted Store'}</span>
          </div>
          {product.featuredTag && (
            <span className="shrink-0 text-xs font-medium text-zinc-300">
              {product.featuredTag}
            </span>
          )}
        </div>

        <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-white">
          {product.title}
        </h3>

        <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-zinc-400">
          {product.description}
        </p>

        <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/[0.08] pt-4">
          <span className="font-mono-tabular text-base font-semibold text-white">
            {product.price}
          </span>

          <a
            href={safeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[40px] shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black transition-all duration-150 hover:bg-zinc-200 hover:shadow-[0_0_18px_rgba(255,255,255,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E11]"
          >
            <span>Buy Now</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
};
