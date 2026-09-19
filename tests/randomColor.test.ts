import { describe, it, expect } from "vitest";
import { randomColor } from "../src/utils/randomColor";

describe("randomColor", () => {
  it("returns a 7-character uppercase hex color string", () => {
    const color = randomColor();
    expect(color).toMatch(/^#[0-9A-F]{6}$/);
  });

  it("produces varied output across repeated calls", () => {
    const colors = new Set(Array.from({ length: 20 }, () => randomColor()));
    expect(colors.size).toBeGreaterThan(1);
  });
});
