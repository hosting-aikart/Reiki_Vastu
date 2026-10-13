import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, X, Sparkles, Star, CheckCircle2, Compass } from 'lucide-react';
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
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#fdfbf7' }}>
      <div className="hm-container" style={{ paddingBottom: '80px' }}>
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <p className="hm-eyebrow hm-grad" style={{ marginBottom: '8px' }}>
            SACRED REIKI &amp; VAASTU CATALOG
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 className="ff-redhat" style={{ fontSize: '34px', fontWeight: 700, margin: '0 0 8px', color: '#3b0a11' }}>
                Explore Courses, Products &amp; Therapies
              </h1>
              <p style={{ color: '#784450', fontSize: '15px', margin: 0, maxWidth: '680px' }}>
                Discover certified courses, authentic energized Rudrakshas, non-destructive Vaastu consultations, and holistic energy therapies taught by Dr. Naresh Chhabdiya since 1995.
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
                  background: '#fef2f2',
                  color: '#dc2626',
                  border: '1.5px solid #fca5a5',
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
            borderRadius: '24px',
            padding: '18px 22px',
            boxShadow: '0 6px 24px rgba(180,83,9,0.06)',
            border: '1.5px solid rgba(212,175,55,0.4)',
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
                background: '#fffdf9',
                border: '1.5px solid #d4af37',
                borderRadius: '50px',
                padding: '0 18px',
                height: '46px'
              }}
            >
              <Search size={18} color="#dc2626" />
              <input
                type="text"
                placeholder="Search by course, Rudraksha, Vastu, crystal, therapy..."
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
                  color: '#3b0a11',
                  fontWeight: 500
                }}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Type Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              {[
                { label: 'All Offerings', value: 'All' },
                { label: 'Courses', value: 'Certified Course' },
                { label: 'Products', value: 'Energized Product' },
                { label: 'Therapies', value: 'Healing Therapy' },
                { label: 'Consultations', value: 'Consultation' }
              ].map((tier) => (
                <button
                  key={tier.value}
                  type="button"
                  onClick={() => {
                    setSelectedPricing(tier.value);
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '50px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: selectedPricing === tier.value ? '1.5px solid #f59e0b' : '1px solid rgba(212,175,55,0.4)',
                    background: selectedPricing === tier.value ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' : '#ffffff',
                    color: selectedPricing === tier.value ? '#ffffff' : '#3b0a11',
                    boxShadow: selectedPricing === tier.value ? '0 3px 12px rgba(220,38,38,0.25)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  {tier.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowUpDown size={16} color="#dc2626" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  height: '44px',
                  borderRadius: '50px',
                  border: '1.5px solid rgba(212,175,55,0.5)',
                  background: '#ffffff',
                  padding: '0 14px',
                  fontSize: '13.5px',
                  color: '#3b0a11',
                  fontWeight: 600,
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
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    border: isSelected ? '1.5px solid #dc2626' : '1px solid rgba(212,175,55,0.3)',
                    background: isSelected ? '#fef2f2' : '#ffffff',
                    color: isSelected ? '#dc2626' : '#4a1923',
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
                      background: isSelected ? '#dc2626' : 'rgba(212,175,55,0.2)',
                      color: isSelected ? '#ffffff' : '#b45309',
                      padding: '1px 6px',
                      borderRadius: '10px',
                      fontWeight: 700
                    }}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cosmic Energy & Vastu Scanner Banner */}
        <div
          style={{
            background: 'linear-gradient(90deg, rgba(220,38,38,0.1) 0%, rgba(212,175,55,0.14) 50%, rgba(124,58,237,0.1) 100%)',
            border: '1.5px solid rgba(212,175,55,0.45)',
            borderRadius: '20px',
            padding: '18px 24px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                border: '1px solid #f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}
            >
              <Compass size={22} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#3b0a11' }}>
                Need Personal Energy or Directional Diagnosis?
              </h4>
              <p style={{ margin: 0, fontSize: '13.5px', color: '#784450' }}>
                Test your space or chakra alignment in our interactive Aura &amp; Vastu Simulator before booking.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="gnav-btn-primary"
            style={{ fontSize: '13.5px', padding: '10px 22px' }}
            onClick={() => onOpenSandbox(AGENTS_DATA[0])}
          >
            Launch Cosmic Energy Simulator
          </button>
        </div>

        {/* Cards Grid */}
        {paginatedAgents.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: '#ffffff',
              borderRadius: '22px',
              border: '1.5px solid rgba(212,175,55,0.3)'
            }}
          >
            <p style={{ fontSize: '18px', fontWeight: 700, color: '#3b0a11', marginBottom: '8px' }}>
              No matching offerings found
            </p>
            <p style={{ color: '#784450', fontSize: '14px', marginBottom: '20px' }}>
              Try searching with different keywords (e.g. Reiki, Vastu, Rudraksha, Crystal) or resetting filters.
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
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px'
            }}
          >
            {paginatedAgents.map((agent) => (
              <div
                key={agent.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '24px',
                  border: '1.5px solid rgba(212,175,55,0.35)',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 18px rgba(180,83,9,0.06)',
                  transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.25s'
                }}
                className="hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Banner & Logo */}
                <div style={{ position: 'relative', marginBottom: '22px' }}>
                  <div
                    className="cb-anim"
                    style={{
                      height: '115px',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      position: 'relative',
                      backgroundImage: agent.bannerGradient || 'linear-gradient(135deg, #dc2626 0%, #d4af37 50%, #7c3aed 100%)'
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
                            opacity: 0.45,
                            animation: 'cbBlobB 14s ease-in-out infinite'
                          }}
                        />
                        <div
                          className="cb-blob"
                          style={{
                            background: agent.blobs[2],
                            opacity: 0.35,
                            animation: 'cbBlobC 17s ease-in-out infinite'
                          }}
                        />
                      </>
                    )}

                    {/* Badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '12px',
                        background: 'rgba(255,255,255,0.92)',
                        border: '1px solid #f59e0b',
                        borderRadius: '50px',
                        padding: '3px 10px',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#881337',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em'
                      }}
                    >
                      {agent.badge}
                    </div>
                  </div>

                  {/* Sacred Mandala Mark */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '14px',
                      bottom: '-16px',
                      width: '54px',
                      height: '54px',
                      borderRadius: '16px',
                      border: '2.5px solid #d4af37',
                      background: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 14px rgba(220,38,38,0.18)',
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src="/logo/reiki-vastu-mark.png"
                      alt={agent.title}
                      style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                    />
                  </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={14} color="#f59e0b" fill="#f59e0b" />
                      <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#3b0a11' }}>
                        {agent.rating}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#7c3aed',
                        background: '#f5f3ff',
                        padding: '2px 8px',
                        borderRadius: '50px',
                        border: '1px solid #ddd6fe'
                      }}
                    >
                      {agent.pricing_model}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: '16.5px',
                      fontWeight: 700,
                      color: '#3b0a11',
                      margin: '0 0 4px',
                      lineHeight: 1.35
                    }}
                  >
                    {agent.title}
                  </h3>

                  <p style={{ fontSize: '12px', color: '#b45309', margin: '0 0 10px', fontWeight: 600 }}>
                    Guided by {agent.provider}
                  </p>

                  <p
                    style={{
                      fontSize: '13px',
                      color: '#5e2732',
                      lineHeight: 1.5,
                      margin: '0 0 16px',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {agent.tagline}
                  </p>

                  {/* Highlights Bullet List */}
                  {agent.highlights && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '16px' }}>
                      {agent.highlights.slice(0, 2).map((hl, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '12px', color: '#784450' }}>
                          <CheckCircle2 size={13} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div style={{ paddingTop: '14px', borderTop: '1px solid rgba(212,175,55,0.25)', display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    style={{
                      flex: 1,
                      padding: '9px 12px',
                      borderRadius: '50px',
                      border: '1.5px solid #d4af37',
                      background: '#fffdf9',
                      color: '#881337',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => onOpenSandbox(agent)}
                  >
                    <Compass size={14} color="#d4af37" />
                    <span>Energy Test</span>
                  </button>

                  <button
                    type="button"
                    style={{
                      flex: 1,
                      padding: '9px 12px',
                      borderRadius: '50px',
                      border: '1px solid #f59e0b',
                      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                      color: '#ffffff',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      boxShadow: '0 3px 10px rgba(220,38,38,0.3)',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => onOpenSandbox(agent)}
                  >
                    <span>View &amp; Enroll</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '40px' }}>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              style={{
                padding: '8px 18px',
                borderRadius: '50px',
                border: '1.5px solid rgba(212,175,55,0.4)',
                background: '#ffffff',
                color: '#3b0a11',
                fontWeight: 600,
                fontSize: '13px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.4 : 1
              }}
            >
              Previous
            </button>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#3b0a11' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              style={{
                padding: '8px 18px',
                borderRadius: '50px',
                border: '1.5px solid rgba(212,175,55,0.4)',
                background: '#ffffff',
                color: '#3b0a11',
                fontWeight: 600,
                fontSize: '13px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.4 : 1
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
