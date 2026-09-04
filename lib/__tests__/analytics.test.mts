import assert from "node:assert/strict"
import test from "node:test"
import { platformEventName } from "../analytics.ts"

test("maps conversion events to separate platform namespaces", () => {
  assert.equal(platformEventName("direct_lead_submitted", "google"), "ga_lead_submitted")
  assert.equal(platformEventName("direct_lead_submitted", "yandex"), "yd_lead_submitted")
  assert.equal(platformEventName("generator_lead_submitted", "google"), "ga_generator_lead_submitted")
  assert.equal(platformEventName("generator_lead_submitted", "yandex"), "yd_generator_lead_submitted")
  assert.equal(platformEventName("generation_succeeded", "google"), "ga_generation_succeeded")
  assert.equal(platformEventName("generation_succeeded", "yandex"), "yd_generation_succeeded")
})

test("keeps diagnostic events unchanged", () => {
  assert.equal(platformEventName("generation_failed", "google"), "generation_failed")
  assert.equal(platformEventName("generation_failed", "yandex"), "generation_failed")
})
