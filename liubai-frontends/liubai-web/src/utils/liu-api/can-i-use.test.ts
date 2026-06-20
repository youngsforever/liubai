import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import canIUse from "./can-i-use";

describe("canIUse.geolocation", () => {
  const originalNavigator = globalThis.navigator;
  const originalWindow = (globalThis as any).window;

  afterEach(() => {
    // Restore the original objects
    Object.defineProperty(globalThis, "navigator", {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
    if (originalWindow === undefined) {
      delete (globalThis as any).window;
    } else {
      (globalThis as any).window = originalWindow;
    }
  });

  it("should return true when geolocation is supported in navigator", () => {
    (globalThis as any).window = {};
    Object.defineProperty(globalThis, "navigator", {
      value: {
        geolocation: {},
      },
      writable: true,
      configurable: true,
    });

    const res = canIUse.geolocation();
    expect(res).toBe(true);
  });

  it("should return false when geolocation is not in navigator", () => {
    (globalThis as any).window = {};
    Object.defineProperty(globalThis, "navigator", {
      value: {},
      writable: true,
      configurable: true,
    });

    const res = canIUse.geolocation();
    expect(res).toBe(false);
  });

  it("should return false when window is undefined", () => {
    delete (globalThis as any).window;
    Object.defineProperty(globalThis, "navigator", {
      value: {
        geolocation: {},
      },
      writable: true,
      configurable: true,
    });

    const res = canIUse.geolocation();
    expect(res).toBe(false);
  });
});
