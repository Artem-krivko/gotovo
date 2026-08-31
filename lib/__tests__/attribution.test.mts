import assert from "node:assert/strict"
import test from "node:test"
import { normalizeAttribution } from "../attribution.ts"

test("normalizeAttribution keeps campaign fields and drops unknown data", () => {
  assert.deepEqual(normalizeAttribution({
    utmSource: "google",
    gclid: "abc-123",
    phone: "+375291234567",
    utmCampaign: "a".repeat(300),
  }), {
    utmSource: "google",
    gclid: "abc-123",
    utmCampaign: "a".repeat(200),
  })
})

test("normalizeAttribution never serializes personal contact fields", () => {
  assert.deepEqual(normalizeAttribution({
    email: "client@example.com",
    name: "Client",
    message: "Build a site",
  }), {})
})
