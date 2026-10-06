import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X, Sparkles } from 'lucide-react';
import { AGENTS_DATA } from '../data/agents';
import { CATEGORIES_DATA } from '../data/categories';

export default function ExploreView({ onOpenSandbox, initialSearch = '' }) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedPricing, setSelectedPricing] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter & Sort Logic
  const filteredAgents = useMemo(() => {
    return AGENTS_DATA.filter((agent) => {
      const matchesSearch =
        !searchTerm ||
        agent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.categories.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All Categories' ||
        agent.categories.includes(selectedCategory);

      const matchesPricing =
        selectedPricing === 'All' ||
        agent.pricing_model.toLowerCase() === selectedPricing.toLowerCase();

      return matchesSearch && matchesCategory && matchesPricing;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'alpha') return a.title.localeCompare(b.title);
      return 0; // default featured
    });
  }, [searchTerm, selectedCategory, selectedPricing, sortBy]);

  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage) || 1;
  const paginatedAgents = filteredAgents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#f4f4f4' }}>
      <div className="hm-container" style={{ paddingBottom: '80px' }}>
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <p className="hm-eyebrow hm-grad" style={{ marginBottom: '8px' }}>
            MARKETPLACE CATALOG
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 className="ff-redhat" style={{ fontSize: '34px', fontWeight: 600, margin: '0 0 8px', color: '#0f172a' }}>
                Explore Verified AI Agents
              </h1>
              <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>
                Discover, compare, and test 300+ vetted AI solutions with instant live sandbox capabilities.
              </p>
            </div>

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#fee2e2',
                  color: '#dc2626',
                  border: '1px solid #fca5a5',
                  padding: '6px 14px',
                  borderRadius: '50px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <X size={14} /> Clear Filter "{searchTerm}"
              </button>
            )}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '16px 20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            border: '1px solid #e2e8f0',
            marginBottom: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search Input */}
            <div
              style={{
                flex: '1 1 320px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '50px',
                padding: '0 18px',
                height: '46px'
              }}
            >
              <Search size={18} color="#64748b" />
              <input
                type="text"
                placeholder="Search agents by name, function, workflow..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  width: '100%',
                  fontSize: '14.5px',
                  color: '#0f172a'
                }}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Pricing Pills */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {['All', 'Free', 'Freemium', 'Paid'].map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => {
                    setSelectedPricing(tier);
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '50px',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: selectedPricing === tier ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                    background: selectedPricing === tier ? '#2563eb' : '#ffffff',
                    color: selectedPricing === tier ? '#ffffff' : '#475569',
                    transition: 'all 0.2s'
                  }}
                >
                  {tier}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowUpDown size={16} color="#64748b" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  height: '44px',
                  borderRadius: '50px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  padding: '0 14px',
                  fontSize: '13.5px',
                  color: '#334155',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="featured">Featured First</option>
                <option value="rating">Highest Rated</option>
                <option value="alpha">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Categories Horizontal Scroll Chips */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              overflowX: 'auto',
              paddingBottom: '4px',
              scrollbarWidth: 'none'
            }}
          >
            {CATEGORIES_DATA.map((cat) => {
              const isSelected = selectedCategory === cat.category;
              return (
                <button
                  key={cat.category}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.category);
                    setCurrentPage(1);
                  }}
                  style={{
                    whiteSpace: 'nowrap',
                    padding: '6px 14px',
                    borderRadius: '50px',
                    fontSize: '13px',
                    fontWeight: isSelected ? 600 : 400,
                    cursor: 'pointer',
                    border: isSelected ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                    background: isSelected ? '#eff6ff' : '#f8fafc',
                    color: isSelected ? '#2563eb' : '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{cat.category}</span>
                  <span
                    style={{
                      fontSize: '11px',
                      background: isSelected ? '#2563eb' : '#e2e8f0',
                      color: isSelected ? '#ffffff' : '#64748b',
                      padding: '1px 6px',
                      borderRadius: '10px'
                    }}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Advisor Banner */}
        <div
          style={{
            background: 'linear-gradient(90deg, rgba(37,99,235,0.08) 0%, rgba(255,174,0,0.08) 100%)',
            border: '1px solid rgba(37,99,235,0.22)',
            borderRadius: '18px',
            padding: '16px 20px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>
                Unsure which AI solution fits your stack?
              </h4>
              <p style={{ margin: 0, fontSize: '13.5px', color: '#64748b' }}>
                Try any model in our sandbox or book a consultation with our solutions architect.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="gnav-btn-primary"
            style={{ fontSize: '13px', padding: '8px 20px', background: '#2563eb', color: '#ffffff' }}
            onClick={() => onOpenSandbox(AGENTS_DATA[0])}
          >
            Launch Free Sandbox
          </button>
        </div>

        {/* Cards Grid */}
        {paginatedAgents.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0'
            }}
          >
            <p style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
              No matching agents found
            </p>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
              Try searching for different keywords, resetting filters, or clearing your search.
            </p>
            <button
              type="button"
              className="gnav-btn-primary"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All Categories');
                setSelectedPricing('All');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
              gap: '24px'
            }}
          >
            {paginatedAgents.map((agent) => (
              <div
                key={agent.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '22px',
                  border: '1px solid #e2e8f0',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 14px rgba(15,23,42,0.03)',
                  transition: 'transform 0.25s, box-shadow 0.25s'
                }}
                className="hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Banner & Logo */}
                <div style={{ position: 'relative', marginBottom: '22px' }}>
                  <div
                    className="cb-anim"
                    style={{
                      height: '110px',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      position: 'relative',
                      backgroundImage: agent.bannerGradient || 'linear-gradient(120deg, #4dd0e1 0%, #00acc1 50%, #4dd0e1 100%)'
                    }}
                  >
                    {agent.blobs && (
                      <>
                        <div
                          className="cb-blob"
                          style={{
                            background: agent.blobs[0],
                            opacity: 0.6,
                            animation: 'cbBlobA 11s ease-in-out infinite'
                          }}
                        />
                        <div
                          className="cb-blob"
                          style={{
                            background: agent.blobs[1],
                            opacity: 0.4,
                            animation: 'cbBlobB 14s ease-in-out infinite'
                          }}
                        />
                        <div
                          className="cb-blob"
                          style={{
                            background: agent.blobs[2],
                            animation: 'cbBlobC 17s ease-in-out infinite'
                          }}
                        />
                      </>
                    )}
                  </div>

                  {/* Floating Logo Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '14px',
                      bottom: '-16px',
                      width: '56px',
                      height: '56px',
                      borderRadius: '14px',
                      border: '2.5px solid #ffffff',
                      background: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src={agent.logo_url}
                      alt={agent.title}
                      style={{ width: '38px', height: '38px', objectFit: 'contain' }}
                    />
                  </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#0f172a',
                      margin: '0 0 4px',
                      lineHeight: 1.3
                    }}
                  >
                    {agent.title}
                  </h3>

                  <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 10px', fontWeight: 500 }}>
                    By {agent.provider}
                  </p>

                  <p
                    style={{
                      fontSize: '13px',
                      color: '#475569',
                      lineHeight: 1.5,
                      margin: '0 0 16px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {agent.tagline}
                  </p>

                  {/* Category Pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {agent.categories.slice(0, 2).map((cat) => (
                      <span
                        key={cat}
                        style={{
                          fontSize: '11px',
                          fontWeight: 500,
                          padding: '3px 10px',
                          borderRadius: '50px',
                          background: '#eff6ff',
                          color: '#2563eb',
                          border: '1px solid #dbeafe'
                        }}
                      >
                        {cat}
                      </span>
                    ))}
                    {agent.categories.length > 2 && (
                      <span
                        title={agent.categories.slice(2).join(', ')}
                        style={{
                          fontSize: '11px',
                          fontWeight: 500,
                          padding: '3px 8px',
                          borderRadius: '50px',
                          background: '#f1f5f9',
                          color: '#64748b'
                        }}
                      >
                        +{agent.categories.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Foot: Pricing & View Button */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '12px',
                      marginTop: 'auto',
                      borderTop: '1px solid #f1f5f9'
                    }}
                  >
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
                      {agent.pricing_model}
                    </span>

                    <button
                      type="button"
                      onClick={() => onOpenSandbox(agent)}
                      style={{
                        padding: '7px 18px',
                        borderRadius: '50px',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        border: '1.5px solid #2563eb',
                        background: '#ffffff',
                        color: '#2563eb',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#2563eb';
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#ffffff';
                        e.currentTarget.style.color = '#2563eb';
                      }}
                    >
                      View Solution
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              marginTop: '48px'
            }}
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: currentPage === page ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                  background: currentPage === page ? '#2563eb' : '#ffffff',
                  color: currentPage === page ? '#ffffff' : '#334155',
                  fontWeight: currentPage === page ? 700 : 500,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
