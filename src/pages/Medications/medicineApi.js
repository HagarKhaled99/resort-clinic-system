
const RXNAV_BASE_URL = "https://rxnav.nlm.nih.gov/REST";

export async function searchMedicines(query) {
  const searchTerm = query.trim();

  if (searchTerm.length < 2) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      term: searchTerm,
      maxEntries: "10",
      option: "1",
    });

    const response = await fetch(
      `${RXNAV_BASE_URL}/approximateTerm.json?${params}`
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    const candidates = data.approximateGroup?.candidate ?? [];

    return [
      ...new Set(
        candidates
          .map((item) => item.name)
          .filter(Boolean)
      ),
    ];
  } catch (error) {
    console.error("RxNav search failed:", error);
    return [];
  }
}
