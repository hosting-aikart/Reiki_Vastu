import React, { useState, useEffect } from 'react';
import {
  listEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  addEnquiryNote,
  setFollowUpDate
} from '../../api/adminClient';
import {
  Search,
  Phone,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  Send,
  Loader2
} from 'lucide-react';

const STATUS_COLORS = {
  new: { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
  in_progress: { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd' },
  contacted: { bg: '#ede9fe', text: '#6d28d9', border: '#ddd6fe' },
  confirmed: { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0' },
  completed: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  cancelled: { bg: '#f3f4f6', text: '#4b5563', border: '#e5e7eb' },
  spam: { bg: '#fee2e2', text: '#b91c1c', border: '#fecaca' }
};

export default function AdminEnquiries({ initialStatus = 'all', preselectedId = null, onClearPreselected }) {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  // Selected Detail Modal / Drawer
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [followUpInput, setFollowUpInput] = useState('');

  const fetchEnquiries = async (page = 1) => {
    setLoading(true);
    try {
      const res = await listEnquiries({
        page,
        limit: pagination.limit,
        status: statusFilter,
        type: typeFilter,
        location: locationFilter,
        search
      });

      if (res.success) {
        setEnquiries(res.data.enquiries || []);
        setPagination(res.data.pagination);
      }
    } catch {
      // handled gracefully
    } finally {
      setLoading(false);
    }
  };

  const openDetail = async (id) => {
    try {
      const res = await getEnquiryById(id);
      if (res.success) {
        setSelectedEnquiry(res.data.enquiry);
        setFollowUpInput(
          res.data.enquiry.followUpDate
            ? new Date(res.data.enquiry.followUpDate).toISOString().slice(0, 10)
            : ''
        );
      }
    } catch {
      // handled
    }
  };

  useEffect(() => {
    fetchEnquiries(1);
  }, [statusFilter, typeFilter, locationFilter]);

  // Open preselected enquiry from overview if passed
  useEffect(() => {
    if (preselectedId) {
      openDetail(preselectedId);
      if (onClearPreselected) onClearPreselected();
    }
  }, [preselectedId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEnquiries(1);
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedEnquiry) return;
    setUpdatingStatus(true);
    try {
      const res = await updateEnquiryStatus(selectedEnquiry._id, newStatus);
      if (res.success) {
        setSelectedEnquiry(res.data.enquiry);
        // Refresh item in list
        setEnquiries((prev) =>
          prev.map((item) => (item._id === res.data.enquiry._id ? res.data.enquiry : item))
        );
      }
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedEnquiry) return;

    setAddingNote(true);
    try {
      const res = await addEnquiryNote(selectedEnquiry._id, newNote.trim());
      if (res.success) {
        setSelectedEnquiry(res.data.enquiry);
        setNewNote('');
        setEnquiries((prev) =>
          prev.map((item) => (item._id === res.data.enquiry._id ? res.data.enquiry : item))
        );
      }
    } finally {
      setAddingNote(false);
    }
  };

  const handleFollowUpSave = async () => {
    if (!selectedEnquiry) return;
    try {
      const res = await setFollowUpDate(selectedEnquiry._id, followUpInput || null);
      if (res.success) {
        setSelectedEnquiry(res.data.enquiry);
        setEnquiries((prev) =>
          prev.map((item) => (item._id === res.data.enquiry._id ? res.data.enquiry : item))
        );
      }
    } catch {
      // handled
    }
  };

  const cleanPhoneForWhatsApp = (phone) => {
    if (!phone) return '';
    let digits = phone.replace(/\D/g, '');
    if (digits.length === 10) digits = `91${digits}`;
    return digits;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Title & Filter Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: 700, color: '#111827' }}>
            Enquiries & Leads Management
          </h1>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>
            Track client requests, update consultation statuses, and maintain internal follow-up notes.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', minWidth: '280px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={16}
              color="#9ca3af"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, ref..."
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '9px 14px',
              background: '#1f2937',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Search
          </button>
        </form>
      </div>

      {/* Filter Badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['all', 'new', 'in_progress', 'contacted', 'confirmed', 'completed', 'cancelled', 'spam'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '5px 12px',
                borderRadius: '999px',
                border: statusFilter === st ? '1px solid #111827' : '1px solid #e5e7eb',
                background: statusFilter === st ? '#111827' : '#ffffff',
                color: statusFilter === st ? '#ffffff' : '#4b5563',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'capitalize',
                cursor: 'pointer'
              }}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '12px',
              color: '#374151',
              background: '#fff'
            }}
          >
            <option value="all">All Types</option>
            <option value="consultation">Consultation</option>
            <option value="course">Course</option>
            <option value="contact">Contact Query</option>
          </select>

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '12px',
              color: '#374151',
              background: '#fff'
            }}
          >
            <option value="all">All Locations</option>
            <option value="amravati">Amravati Center</option>
            <option value="nagpur">Nagpur Center</option>
            <option value="online">Online</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          overflowX: 'auto'
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#4b5563' }}>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Reference</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Client Details</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Type & Service</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Location & Slot</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                  <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 8px' }} />
                  <p style={{ margin: 0 }}>Fetching enquiries...</p>
                </td>
              </tr>
            ) : enquiries.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>
                  No enquiries matching this criteria.
                </td>
              </tr>
            ) : (
              enquiries.map((item) => {
                const badge = STATUS_COLORS[item.status] || STATUS_COLORS.new;
                return (
                  <tr
                    key={item._id}
                    style={{ borderBottom: '1px solid #f3f4f6', transition: 'background 0.1s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#fcfcfd')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
                  >
                    {/* Reference & Date */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 700, color: '#111827' }}>{item.reference}</div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                        {new Date(item.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>

                    {/* Client Name & Phone */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, color: '#1f2937' }}>{item.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                        <a
                          href={`tel:${item.phone}`}
                          style={{
                            fontSize: '12px',
                            color: '#0284c7',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                        >
                          <Phone size={11} /> {item.phone}
                        </a>
                        <a
                          href={`https://wa.me/${cleanPhoneForWhatsApp(item.phone)}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            fontSize: '11px',
                            color: '#16a34a',
                            fontWeight: 600,
                            textDecoration: 'none',
                            background: '#dcfce7',
                            padding: '1px 5px',
                            borderRadius: '3px'
                          }}
                        >
                          WhatsApp
                        </a>
                      </div>
                    </td>

                    {/* Type & Service */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, color: '#374151', textTransform: 'capitalize' }}>
                        {item.type}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                        {item.serviceKey ? item.serviceKey.replace(/_/g, ' ') : item.courseId || 'General Inquiry'}
                      </div>
                    </td>

                    {/* Location & Slot */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#4b5563', textTransform: 'capitalize' }}>
                        <MapPin size={12} /> {item.location}
                      </div>
                      {item.preferredDate && (
                        <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                          📅 {item.preferredDate} ({item.preferredSlot || 'Anytime'})
                        </div>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.3px',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: badge.bg,
                          color: badge.text,
                          border: `1px solid ${badge.border}`
                        }}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Action */}
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <button
                        onClick={() => openDetail(item._id)}
                        style={{
                          padding: '6px 12px',
                          background: '#f3f4f6',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#1f2937',
                          cursor: 'pointer'
                        }}
                      >
                        View & Manage
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination Bar */}
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '13px',
            color: '#6b7280'
          }}
        >
          <span>
            Showing {enquiries.length} of {pagination.total} enquiries
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchEnquiries(pagination.page - 1)}
              style={{
                padding: '5px 10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                background: '#fff',
                cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer',
                opacity: pagination.page <= 1 ? 0.5 : 1
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ display: 'flex', alignItems: 'center', padding: '0 8px' }}>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchEnquiries(pagination.page + 1)}
              style={{
                padding: '5px 10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                background: '#fff',
                cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer',
                opacity: pagination.page >= pagination.totalPages ? 0.5 : 1
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Slide-out / Modal Detail Drawer */}
      {selectedEnquiry && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            maxWidth: '560px',
            background: '#ffffff',
            boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'inherit'
          }}
        >
          {/* Drawer Header */}
          <div
            style={{
              padding: '20px 24px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f9fafb'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>
                  {selectedEnquiry.reference}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: STATUS_COLORS[selectedEnquiry.status]?.bg || '#f3f4f6',
                    color: STATUS_COLORS[selectedEnquiry.status]?.text || '#374151'
                  }}
                >
                  {selectedEnquiry.status}
                </span>
              </div>
              <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#6b7280' }}>
                Submitted on {new Date(selectedEnquiry.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
              </p>
            </div>
            <button
              onClick={() => setSelectedEnquiry(null)}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px',
                cursor: 'pointer',
                color: '#6b7280',
                borderRadius: '6px'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Drawer Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Client Info Card */}
            <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '16px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 700, color: '#111827' }}>
                Client Contact Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                <div>
                  <span style={{ color: '#6b7280', fontSize: '12px' }}>Name:</span>
                  <div style={{ fontWeight: 600, color: '#111827' }}>{selectedEnquiry.name}</div>
                </div>
                <div>
                  <span style={{ color: '#6b7280', fontSize: '12px' }}>Location / Mode:</span>
                  <div style={{ fontWeight: 600, color: '#111827', textTransform: 'capitalize' }}>
                    {selectedEnquiry.location} Center
                  </div>
                </div>
                <div>
                  <span style={{ color: '#6b7280', fontSize: '12px' }}>Phone:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <a href={`tel:${selectedEnquiry.phone}`} style={{ fontWeight: 600, color: '#0284c7' }}>
                      {selectedEnquiry.phone}
                    </a>
                    <a
                      href={`https://wa.me/${cleanPhoneForWhatsApp(selectedEnquiry.phone)}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: '#22c55e',
                        color: '#fff',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        textDecoration: 'none',
                        fontWeight: 700
                      }}
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
                <div>
                  <span style={{ color: '#6b7280', fontSize: '12px' }}>Email:</span>
                  <div style={{ fontWeight: 600, color: '#111827' }}>
                    {selectedEnquiry.email || 'Not provided'}
                  </div>
                </div>
              </div>
            </div>

            {/* Requested Booking Details */}
            <div>
              <h3 style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 700, color: '#111827' }}>
                Requested Consultation / Course
              </h3>
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '14px', fontSize: '13px', background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#6b7280' }}>Category:</span>
                  <span style={{ fontWeight: 700, textTransform: 'capitalize' }}>{selectedEnquiry.type}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#6b7280' }}>Selected Subject:</span>
                  <span style={{ fontWeight: 600 }}>
                    {selectedEnquiry.serviceKey
                      ? selectedEnquiry.serviceKey.replace(/_/g, ' ')
                      : selectedEnquiry.courseId || 'General Inquiry'}
                  </span>
                </div>
                {selectedEnquiry.preferredDate && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#6b7280' }}>Preferred Date:</span>
                    <span style={{ fontWeight: 600 }}>📅 {selectedEnquiry.preferredDate}</span>
                  </div>
                )}
                {selectedEnquiry.preferredSlot && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#6b7280' }}>Time Slot:</span>
                    <span style={{ fontWeight: 600 }}>⏰ {selectedEnquiry.preferredSlot} (IST)</span>
                  </div>
                )}
                {selectedEnquiry.message && (
                  <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #f3f4f6' }}>
                    <span style={{ color: '#6b7280', display: 'block', marginBottom: '4px' }}>Client Message:</span>
                    <p style={{ margin: 0, fontStyle: 'italic', color: '#374151', lineHeight: '1.4' }}>
                      "{selectedEnquiry.message}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Workflow Management: Status & Follow-up */}
            <div style={{ border: '1px solid #fde68a', background: '#fefce8', borderRadius: '10px', padding: '16px' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 700, color: '#92400e' }}>
                Operational Workflow
              </h3>

              {/* Status Selector */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#78350f', marginBottom: '6px' }}>
                  Update Lead Status
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {['new', 'in_progress', 'contacted', 'confirmed', 'completed', 'cancelled', 'spam'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={updatingStatus}
                      onClick={() => handleStatusChange(st)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: selectedEnquiry.status === st ? '2px solid #92400e' : '1px solid #d1d5db',
                        background: selectedEnquiry.status === st ? '#92400e' : '#fff',
                        color: selectedEnquiry.status === st ? '#fff' : '#374151',
                        fontSize: '12px',
                        fontWeight: 600,
                        textTransform: 'capitalize',
                        cursor: 'pointer'
                      }}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Follow-up Reminder */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#78350f', marginBottom: '6px' }}>
                  Scheduled Follow-up Date
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="date"
                    value={followUpInput}
                    onChange={(e) => setFollowUpInput(e.target.value)}
                    style={{
                      padding: '7px 10px',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                      fontSize: '13px',
                      outline: 'none',
                      background: '#fff'
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleFollowUpSave}
                    style={{
                      padding: '7px 12px',
                      background: '#92400e',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Save Date
                  </button>
                  {followUpInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setFollowUpInput('');
                        setFollowUpDate(selectedEnquiry._id, null).then((r) => {
                          if (r.success) setSelectedEnquiry(r.data.enquiry);
                        });
                      }}
                      style={{
                        padding: '7px 10px',
                        background: 'transparent',
                        color: '#b91c1c',
                        border: 'none',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Internal Staff Notes Thread */}
            <div>
              <h3 style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 700, color: '#111827' }}>
                Internal Staff Notes ({selectedEnquiry.notes?.length || 0})
              </h3>

              {/* Notes Timeline */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  marginBottom: '16px',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}
              >
                {(!selectedEnquiry.notes || selectedEnquiry.notes.length === 0) ? (
                  <p style={{ margin: 0, color: '#9ca3af', fontSize: '13px', fontStyle: 'italic' }}>
                    No internal notes recorded yet. Add call outcomes or coordinator updates below.
                  </p>
                ) : (
                  selectedEnquiry.notes.map((note, nIdx) => (
                    <div
                      key={note._id || nIdx}
                      style={{
                        background: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        fontSize: '13px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600, color: '#111827' }}>{note.authorName}</span>
                        <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                          {new Date(note.createdAt).toLocaleString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p style={{ margin: 0, color: '#4b5563', lineHeight: '1.4' }}>{note.content}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Record coordinator note (e.g. 'Called, slot confirmed for Monday')..."
                  disabled={addingNote}
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  disabled={addingNote || !newNote.trim()}
                  style={{
                    padding: '9px 16px',
                    background: '#111827',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: addingNote || !newNote.trim() ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Send size={14} /> Add
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
