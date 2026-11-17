const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/** Products, events and courses added or edited in the admin panel. */
export async function getCatalog() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/catalog`);
    const data = await res.json().catch(() => null);
    if (res.ok && data?.success) return { success: true, data: data.data };
    return { success: false, message: data?.error?.message || 'Could not load the catalog.' };
  } catch {
    return { success: false, message: 'Unable to connect to the server.' };
  }
}
