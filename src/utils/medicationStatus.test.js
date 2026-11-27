
import { getMedicationStatus } from "./medicationStatus";

const today = new Date(2026, 10, 27);

test("expired when the month has passed", () => {
  expect(
    getMedicationStatus(
      { expiry: "2026-10", quantity: 50 },
      today
    )
  ).toBe("Expired");
});

test("expiring soon within 6 months", () => {
  expect(
    getMedicationStatus(
      { expiry: "2027-04", quantity: 50 },
      today
    )
  ).toBe("Expiring Soon");
});

test("low stock when below the minimum", () => {
  expect(
    getMedicationStatus(
      { expiry: "2028-01", quantity: 3, minQuantity: 10 },
      today
    )
  ).toBe("Low Stock");
});

test("valid otherwise", () => {
  expect(
    getMedicationStatus(
      { expiry: "2028-01", quantity: 50, minQuantity: 10 },
      today
    )
  ).toBe("Valid");
});
