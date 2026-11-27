
export function getMedicationStatus(med, today = new Date()) {
  const [year, month] = med.expiry.split("-").map(Number);
  const lastDayOfMonth = new Date(year, month, 0);

  const sixMonthsLater = new Date(today);
  sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

  if (lastDayOfMonth < today) return "Expired";
  if (lastDayOfMonth <= sixMonthsLater) return "Expiring Soon";

  if (Number(med.quantity) < Number(med.minQuantity ?? 20)) {
    return "Low Stock";
  }

  return "Valid";
}
