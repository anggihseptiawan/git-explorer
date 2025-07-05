import { describe, expect, it } from "vitest"
import { getLanguageColor } from "~/utils/get-language-color"

describe("Get background color based on programming language", () => {
  it("The color for JavaScript should be: bg-yellow-500", () => {
    const color = getLanguageColor("JavaScript")
    expect(color).toBe("bg-yellow-500")
  })
})
