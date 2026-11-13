import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Star,
  ShoppingBag,
  Truck
} from 'lucide-react';
import { SACRED_PRODUCTS } from './BusinessNeeds';
import { OrnamentalFlourish } from './TempleHarmonyRedesign';
import { getProducts } from '../api/paymentClient';
import { formatPaise } from '@reiki-vastu/shared/products.js';

export default function ProductDetailPage({
  productId,
  onBack,
  onSelectProduct,
  onOrderProduct,
  onConsultClick
}) {
  const [quantity, setQuantity] = useState(1);
  const [liveCatalog, setLiveCatalog] = useState({});

  const baseProduct =
    SACRED_PRODUCTS.find((p) => p.id === productId) || SACRED_PRODUCTS[0];
  const liveOverride = liveCatalog[baseProduct.id];
  const product = liveOverride
    ? {
        ...baseProduct,
        pricePaise: liveOverride.unitPricePaise,
        price: formatPaise(liveOverride.unitPricePaise),
        originalPrice:
          liveOverride.originalPricePaise != null
            ? formatPaise(liveOverride.originalPricePaise)
            : null,
        available: liveOverride.available
      }
    : baseProduct;

  useEffect(() => {
    setQuantity(1);
  }, [productId]);

  useEffect(() => {
    let active = true;
    getProducts().then((res) => {
      if (!active || !res.success) return;
      const map = {};
      for (const item of res.data?.products || []) {
        map[item.id] = item;
      }
      setLiveCatalog(map);
    });
    return () => {
      active = false;
    };
  }, [productId]);

  const relatedProducts = SACRED_PRODUCTS.filter((p) => p.id !== product.id);

  return (
    <div
      className="product-detail-page"
      style={{
        paddingTop: '108px',
        paddingBottom: '90px',
        minHeight: 'calc(100vh / var(--page-zoom, 1))',
        background: '#faf5ee'
      }}
    >
      <div className="hm-container" style={{ maxWidth: '1180px' }}>
        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            padding: '8px 16px',
            borderRadius: '999px',
            background: '#fffdf9',
            border: '1px solid rgba(184, 137, 58, 0.4)',
            color: '#b5091f',
            fontFamily: 'var(--font-karla)',
            fontSize: '13.5px',
            fontWeight: 750,
            cursor: 'pointer',
            marginBottom: '24px',
            boxShadow: '0 4px 14px rgba(120, 75, 40, 0.06)',
            transition: 'all 0.25s ease'
          }}
        >
          <ArrowLeft size={15} />
          <span>Back to Sacred Products</span>
        </button>

        {/* Main E-Commerce Product Showcase Grid */}
        <div
          className="product-detail-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
            gap: 'clamp(24px, 3.8vw, 44px)',
            alignItems: 'center',
            background: 'linear-gradient(145deg, #fffdf9 0%, #f9f0e2 100%)',
            border: '1px solid rgba(184, 137, 58, 0.32)',
            borderRadius: '28px',
            padding: 'clamp(20px, 3.5vw, 40px)',
            boxShadow: '0 18px 46px rgba(120, 75, 40, 0.08)',
            marginBottom: '56px'
          }}
        >
          {/* Left Column: Product Image */}
          <div>
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '1 / 1',
                borderRadius: '22px',
                overflow: 'hidden',
                background: '#f5ebe0',
                border: '1.5px solid rgba(184, 137, 58, 0.38)',
                boxShadow: '0 12px 32px rgba(92, 46, 16, 0.1)'
              }}
            >
              <img
                src={product.image}
                alt={product.alt}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  background: 'linear-gradient(135deg, #d1132e 0%, #9b0718 100%)',
                  color: '#ffffff',
                  fontFamily: 'var(--font-karla)',
                  fontSize: '11.5px',
                  fontWeight: 750,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  boxShadow: '0 6px 16px rgba(181, 9, 31, 0.32)'
                }}
              >
                ✦ {product.badge || 'Reiki Energized'} ✦
              </span>
            </div>

          </div>

          {/* Right Column: 1. Product Name -> 2. Product Info -> 3. Summarized Price, Quantity & Order Now -> 4. Ratings */}
          <div>
            {/* 1. Name of Product */}
            <p className="th-eyebrow" style={{ marginBottom: '6px' }}>
              <Sparkles size={12} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '6px' }} />
              PRANA ENERGIZED SACRED REMEDY
            </p>

            <h1
              className="th-heading-left"
              style={{
                fontSize: 'clamp(30px, 3.6vw, 44px)',
                margin: '0 0 6px',
                color: '#381812'
              }}
            >
              {product.title}
            </h1>

            <p
              style={{
                fontFamily: 'var(--font-karla)',
                fontSize: '14px',
                fontWeight: 750,
                color: '#9a5b13',
                letterSpacing: '0.04em',
                margin: '0 0 18px',
                paddingBottom: '14px',
                borderBottom: '1px solid rgba(184, 137, 58, 0.22)'
              }}
            >
              {product.subtitle}
            </p>

            {/* 2. Information About That Product */}
            <div style={{ marginBottom: '20px' }}>
              <p className="th-body-p" style={{ marginBottom: '10px', fontWeight: 650, color: '#3b2119' }}>
                {product.description}
              </p>
              <p className="th-body-p" style={{ marginBottom: 0 }}>
                {product.longDescription}
              </p>
            </div>

            {/* 3. Summarized Compact Price + Quantity Button + Order Now */}
            <div
              className="product-detail-purchase-box"
              style={{
                background: 'rgba(255, 253, 249, 0.9)',
                border: '1px solid rgba(184, 137, 58, 0.32)',
                borderRadius: '16px',
                padding: '14px 18px',
                marginBottom: '18px'
              }}
            >
              {/* Summarized Price Line */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px',
                  marginBottom: '14px',
                  paddingBottom: '12px',
                  borderBottom: '1px dashed rgba(184, 137, 58, 0.28)'
                }}
              >
                <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-karla)',
                      fontSize: '12px',
                      fontWeight: 750,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: '#7c5652'
                    }}
                  >
                    Price:
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-cormorant)',
                      fontSize: '28px',
                      fontWeight: 750,
                      color: '#b5091f',
                      lineHeight: 1
                    }}
                  >
                    {product.price}
                  </span>
                  {product.originalPrice && (
                    <span
                      style={{
                        fontFamily: 'var(--font-karla)',
                        fontSize: '13.5px',
                        color: '#8c6d68',
                        textDecoration: 'line-through'
                      }}
                    >
                      {product.originalPrice}
                    </span>
                  )}
                </div>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontFamily: 'var(--font-karla)',
                      fontSize: '11.5px',
                      fontWeight: 750,
                      color: '#15803d',
                      background: 'rgba(21, 128, 61, 0.09)',
                      border: '1px solid rgba(21, 128, 61, 0.25)',
                      padding: '4px 11px',
                      borderRadius: '999px'
                    }}
                  >
                    <Truck size={13} />
                    <span>Free Shipping &middot; Free Delivery Available</span>
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-karla)',
                      fontSize: '11px',
                      fontWeight: 750,
                      color: '#b5091f',
                      background: 'rgba(181, 9, 31, 0.08)',
                      padding: '3px 10px',
                      borderRadius: '999px'
                    }}
                  >
                    Vedic &amp; Reiki Energized
                  </span>
                </div>
              </div>

              {/* Quantity Selector + Order Now + Ask Expert Advice */}
              <div
                className="product-detail-actions-row"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: '#fffdf9',
                    border: '1.5px solid rgba(184, 137, 58, 0.45)',
                    borderRadius: '999px',
                    padding: '3px 6px',
                    height: '44px'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      border: 'none',
                      background: 'transparent',
                      fontSize: '17px',
                      fontWeight: 750,
                      color: '#381812',
                      cursor: 'pointer'
                    }}
                  >
                    &minus;
                  </button>
                  <span
                    style={{
                      minWidth: '30px',
                      textAlign: 'center',
                      fontFamily: 'var(--font-karla)',
                      fontSize: '14.5px',
                      fontWeight: 750,
                      color: '#381812'
                    }}
                  >
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      border: 'none',
                      background: 'transparent',
                      fontSize: '17px',
                      fontWeight: 750,
                      color: '#381812',
                      cursor: 'pointer'
                    }}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="th-btn th-btn--primary"
                  onClick={() =>
                    onOrderProduct &&
                    onOrderProduct({
                      ...product,
                      quantity
                    })
                  }
                  style={{
                    flex: '1 1 165px',
                    minWidth: '155px',
                    padding: '11px 20px',
                    height: '44px'
                  }}
                >
                  <ShoppingBag size={15} />
                  <span>Buy Now</span>
                </button>

                <button
                  type="button"
                  className="th-btn th-btn--outline-dark"
                  onClick={() => onConsultClick && onConsultClick(product)}
                  style={{
                    flex: '1 1 155px',
                    minWidth: '145px',
                    padding: '11px 18px',
                    height: '44px'
                  }}
                >
                  <span>Ask Expert Advice</span>
                </button>
              </div>
            </div>

            {/* 4. Below the Product: Ratings & Availability */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                paddingTop: '4px'
              }}
            >
              {/* Only products with real ratings show the star line */}
              {product.rating && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={15} fill="#d49a3a" color="#d49a3a" />
                ))}
                <span
                  style={{
                    fontFamily: 'var(--font-karla)',
                    fontSize: '13.5px',
                    fontWeight: 750,
                    color: '#381812',
                    marginLeft: '5px'
                  }}
                >
                  {product.rating} ({product.reviewsCount} ratings from past clients)
                </span>
              </div>
              )}

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontFamily: 'var(--font-karla)',
                  fontSize: '12px',
                  fontWeight: 750,
                  color: '#15803d',
                  background: 'rgba(21, 128, 61, 0.09)',
                  border: '1px solid rgba(21, 128, 61, 0.25)',
                  padding: '4px 12px',
                  borderRadius: '999px'
                }}
              >
                <CheckCircle2 size={13} />
                <span>In Stock &middot; Reiki Energized</span>
              </span>
            </div>
          </div>
        </div>

        {/* Explore More Sacred Products */}
        <div>
          <div className="th-section-header" style={{ marginBottom: '32px' }}>
            <p className="th-eyebrow">EXPLORE MORE REMEDIES</p>
            <h2
              className="th-heading-gradient"
              style={{
                fontSize: 'clamp(24px, 3vw, 36px)',
                textTransform: 'none'
              }}
            >
              Explore more
            </h2>
            <OrnamentalFlourish />
          </div>

          <div className="th-products-grid">
            {relatedProducts.map((item) => (
              <article
                key={item.id}
                onClick={() => onSelectProduct && onSelectProduct(item.id)}
                className="th-feature-card"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer'
                }}
              >
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '1 / 1.05',
                    overflow: 'hidden',
                    background: '#f5ebe0'
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.alt}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                </div>
                <div
                  style={{
                    padding: '18px 16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                >
                  <h3 className="th-feature-title" style={{ fontSize: '21px' }}>
                    {item.title}
                  </h3>
                  <div className="th-feature-rule" style={{ margin: '8px auto 10px' }} />
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontFamily: 'var(--font-karla)',
                      fontSize: '12px',
                      fontWeight: 750,
                      color: '#b5091f'
                    }}
                  >
                    <span>View Details</span>
                    <ArrowRight size={12} />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

