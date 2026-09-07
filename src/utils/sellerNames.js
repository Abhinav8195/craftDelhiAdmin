let cachedSellerNames = null;
let pendingRequest = null;

export const getSellerNameMap = async (token) => {
  if (cachedSellerNames) return cachedSellerNames;
  if (pendingRequest) return pendingRequest;

  pendingRequest = fetch(`${process.env.REACT_APP_BASE_URL}admin/seller-view`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(async (response) => {
      const body = await response.json();
      if (!response.ok || !body.success) {
        throw new Error(body.message || 'Failed to load seller names');
      }

      cachedSellerNames = new Map(
        (body.data || []).map((seller) => [
          String(seller.user_id),
          seller.store_name ||
            `${seller.first_name || ''} ${seller.last_name || ''}`.trim() ||
            `Seller ${seller.user_id}`,
        ])
      );
      return cachedSellerNames;
    })
    .finally(() => {
      pendingRequest = null;
    });

  return pendingRequest;
};
