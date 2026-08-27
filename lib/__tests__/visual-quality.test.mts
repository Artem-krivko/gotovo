import { describe, test } from "node:test"
import assert from "node:assert/strict"

import { curateDesignDirections } from "../design/directions.ts"
import { selectConceptAssets, type PexelsCandidate } from "../design/images/pexels.ts"
import { specDistance } from "../design/quality.ts"
import { baseSpecFor } from "../design/spec.ts"
import { parseVisualBrief } from "../design/visual-brief.ts"
import { getNicheQuery } from "../templates/index.ts"
import { REFERENCE_BRIEFS } from "../design/reference-briefs.ts"

describe("visual brief", () => {
  test("принимает только короткий английский поисковый запрос", () => {
    assert.deepEqual(
      parseVisualBrief({ visualBrief: { query: "septic tank installation house", avoid: ["office team"] } }),
      { query: "septic tank installation house", avoid: ["office team"] }
    )
    assert.equal(parseVisualBrief({ visualBrief: { query: "монтаж септиков" } }), null)
    assert.equal(parseVisualBrief({ visualBrief: { query: "https://example.com secret" } }), null)
  })

  test("описание услуги имеет приоритет над общей категорией", () => {
    assert.equal(
      getNicheQuery("Строительная компания", "Монтаж септиков в Могилёвской области"),
      "septic tank installation private house"
    )
    assert.equal(
      getNicheQuery("Строительная компания", "Бурение скважин и обустройство воды"),
      "water well drilling equipment"
    )
  })
})

describe("concept assets", () => {
  const candidates: PexelsCandidate[] = [1, 2, 3].map((id) => ({
    id,
    width: 1800,
    height: 1200,
    alt: `photo ${id}`,
    asset: {
      url: `https://images.pexels.com/${id}.jpg`,
      alt: `photo ${id}`,
      credit: { name: `Author ${id}`, url: `https://www.pexels.com/photo/${id}` },
    },
  }))

  test("назначает разные изображения и сохраняет детерминизм", () => {
    const first = selectConceptAssets(candidates, "same brief", 3)
    const second = selectConceptAssets(candidates, "same brief", 3)
    assert.deepEqual(first, second)
    assert.equal(new Set(first.map((assets) => assets.hero?.url)).size, 3)
  })
})

describe("niche archetypes", () => {
  test("три направления различаются по hero и взвешенной дистанции", () => {
    const directions = curateDesignDirections(
      baseSpecFor("corporate"),
      "corporate",
      "Строительная компания",
      "Монтаж септиков и бурение скважин"
    )
    assert.equal(directions.length, 3)
    assert.equal(new Set(directions.map((direction) => direction.spec.heroVariant)).size, 3)
    for (let left = 0; left < directions.length; left += 1) {
      for (let right = left + 1; right < directions.length; right += 1) {
        assert.ok(specDistance(directions[left].spec, directions[right].spec) >= 8)
      }
    }
  })

  test("разные ниши получают разные альтернативы", () => {
    const construction = curateDesignDirections(
      baseSpecFor("modern"), "modern", "Строительная компания", "Монтаж септиков"
    ).map((direction) => direction.id)
    const fitness = curateDesignDirections(
      baseSpecFor("modern"), "modern", "Фитнес-клуб", "Силовые тренировки"
    ).map((direction) => direction.id)
    assert.notDeepEqual(construction, fitness)
  })

  test("все эталонные брифы получают три валидно различающихся направления", () => {
    for (const brief of REFERENCE_BRIEFS) {
      const directions = curateDesignDirections(
        baseSpecFor(brief.style),
        brief.style,
        brief.businessType,
        brief.userDescription
      )
      assert.equal(directions.length, 3, `Недостаточно направлений: ${brief.id}`)
      for (let left = 0; left < directions.length; left += 1) {
        for (let right = left + 1; right < directions.length; right += 1) {
          assert.ok(
            specDistance(directions[left].spec, directions[right].spec) >= 8,
            `Слишком похожие направления: ${brief.id}`
          )
        }
      }
    }
  })
})
