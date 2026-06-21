import { describe, it, expect, vi } from "vitest";
import time from "./time";

describe("time utils", () => {
  describe("getTimezoneIANA", () => {
    it("should return the timezone from Intl.DateTimeFormat", () => {
      const tz = time.getTimezoneIANA();
      expect(typeof tz).toBe("string");
      expect(tz.length).toBeGreaterThan(0);
    });

    it("should return empty string if Intl throws an error", () => {
      const spy = vi.spyOn(Intl, "DateTimeFormat").mockImplementation(() => {
        throw new Error("Mocked Intl Error");
      });
      const tz = time.getTimezoneIANA();
      expect(tz).toBe("");
      spy.mockRestore();
    });
  });
});
