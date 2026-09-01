import assert from "node:assert/strict"
import test from "node:test"
import { mergeAttribution, normalizeAttribution } from "../attribution.ts"

test("normalizeAttribution keeps campaign fields and drops unknown data", () => {
  assert.deepEqual(normalizeAttribution({
    utmSource: "google",
    gclid: "abc-123",
    phone: "+375291234567",
    utmCampaign: "a".repeat(300),
  }), {
    firstTouch: { utmSource: "google", gclid: "abc-123", utmCampaign: "a".repeat(200) },
    lastTouch: { utmSource: "google", gclid: "abc-123", utmCampaign: "a".repeat(200) },
  })
})

test("mergeAttribution preserves paid last touch on a later direct visit", () => {
  const paid = { landingPath: "/services", utmSource: "google", gclid: "g-1" }
  assert.deepEqual(mergeAttribution({ firstTouch: paid, lastTouch: paid }, { landingPath: "/contacts" }, "2026-09-01T00:00:00.000Z"), {
    firstTouch: paid,
    lastTouch: paid,
  })
})

test("normalizeAttribution never serializes personal contact fields", () => {
  assert.deepEqual(normalizeAttribution({
    email: "client@example.com",
    name: "Client",
    message: "Build a site",
  }), {})
})
