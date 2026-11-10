import React, { useEffect, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { getProducts } from '../api/paymentClient';
import { formatPaise } from '../utils/razorpayCheckout';
import TestModeBanner from './TestModeBanner';
import { cardStyle, linkButtonStyle, primaryButtonStyle } from './paymentStyles';

export default function ProductsPage({ onSelectProduct, onBack }) {
  const [state, setState] = useState({ loading: true, error: null, products: [], paymentsEnabled: false });

  useEffect(() => {
    let active = true;
    getProducts().then((res) => {
      if (!active) return;
      setState(
        res.success
          ? { loading: false, error: null, products: res.data.products, paymentsEnabled: res.data.paymentsEnabled }
          : { loading: false, error: res.message, products: [], paymentsEnabled: false }
      );
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div style={{ paddingTop: '110px', paddingBottom: '70px', minHeight: '100vh', background: '#fdfbf7' }}>
      <div className="hm-container" style={{ maxWidth: '960px', margin: '0 auto' }}>
        <button onClick={onBack} style={linkButtonStyle}>
          <ArrowLeft size={16} /> Back to home
        </button>

        <h1 className="ff-redhat" style={{ fontSize: 'clamp(26px, 3vw, 34px)', fontWeight: 800, color: '#3b0a11', margin: '12px 0 20px' }}>
          Test Checkout Products
        </h1>

        <TestModeBanner />

        {state.loading && (
          <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5e2732' }}>
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Loading products...
          </p>
        )}

        {state.error && <p style={{ color: '#b91c1c' }}>{state.error}</p>}

        {!state.loading && !state.error && !state.paymentsEnabled && (
          <p style={{ color: '#b91c1c' }}>Online payments are not available at the moment.</p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '20px' }}>
          {state.products.map((product) => {
            const canBuy = product.available && state.paymentsEnabled;
            return (
              <div key={product.id} style={cardStyle}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#3b0a11', margin: '0 0 6px' }}>{product.name}</h2>
                <p style={{ fontSize: '14px', color: '#5e2732', margin: '0 0 14px', lineHeight: 1.5 }}>{product.description}</p>
                <p style={{ fontSize: '20px', fontWeight: 800, color: '#D2042D', margin: '0 0 16px' }}>
                  {formatPaise(product.unitPricePaise)}
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#92400e', marginLeft: '8px' }}>dummy price</span>
                </p>
                <button
                  onClick={() => onSelectProduct(product.id)}
                  disabled={!canBuy}
                  style={{ ...primaryButtonStyle, opacity: canBuy ? 1 : 0.5, cursor: canBuy ? 'pointer' : 'not-allowed' }}
                >
                  {product.available ? 'Select' : 'Unavailable'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
