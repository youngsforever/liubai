import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import device, { getSunriseSunset } from "./device";
import time from "../basic/time";

describe("getSunriseSunset", () => {
  it("should calculate correct sunrise and sunset on Jan 1st", () => {
    const date = new Date(2026, 0, 1); // Jan 1
    const { sunrise, sunset } = getSunriseSunset(date);
    expect(sunrise).toBe(7.0);
    expect(sunset).toBe(17.0);
  });

  it("should calculate correct sunrise and sunset on Jul 1st", () => {
    const date = new Date(2026, 6, 1); // Jul 1
    const { sunrise, sunset } = getSunriseSunset(date);
    expect(sunrise).toBe(5.0);
    expect(sunset).toBe(19.0);
  });

  it("should interpolate correctly on Apr 1st (mid-point of first half)", () => {
    const date = new Date(2026, 3, 1); // Apr 1
    const { sunrise, sunset } = getSunriseSunset(date);

    // Jan 1 -> Jul 1 is 181 days. Apr 1 is day 90.
    // ratio = 90 / 181 = 0.497237569
    // sunrise = 7.0 - 2.0 * ratio = 6.0055
    // sunset = 17.0 + 2.0 * ratio = 17.9945
    expect(sunrise).toBeCloseTo(6.0055, 4);
    expect(sunset).toBeCloseTo(17.9945, 4);
  });

  it("should interpolate correctly on Oct 1st (mid-point of second half)", () => {
    const date = new Date(2026, 9, 1); // Oct 1
    const { sunrise, sunset } = getSunriseSunset(date);
    // Jul 1 to Jan 1 next year is 184 days. Oct 1 is day 92.
    // ratio = 92 / 184 = 0.5
    // sunrise = 5.0 + 2.0 * 0.5 = 6.0
    // sunset = 19.0 - 2.0 * 0.5 = 18.0
    expect(sunrise).toBeCloseTo(6.0, 5);
    expect(sunset).toBeCloseTo(18.0, 5);
  });
});

describe("getThemeFromTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("should return light mode during daytime on Jan 1st (e.g. 12:00 PM)", () => {
    // 2026-01-01 12:00:00 (midday)
    const mockTime = new Date(2026, 0, 1, 12, 0, 0).getTime();
    vi.spyOn(time, "getTime").mockReturnValue(mockTime);

    const theme = device.getThemeFromTime();
    expect(theme).toBe("light");
  });

  it("should return dark mode during nighttime on Jan 1st (e.g. 8:00 PM)", () => {
    // 2026-01-01 20:00:00
    const mockTime = new Date(2026, 0, 1, 20, 0, 0).getTime();
    vi.spyOn(time, "getTime").mockReturnValue(mockTime);

    const theme = device.getThemeFromTime();
    expect(theme).toBe("dark");
  });

  it("should return dark mode during early morning on Jan 1st (e.g. 6:30 AM)", () => {
    // 2026-01-01 06:30:00 (sunrise is 7:00 AM on Jan 1st, so 6:30 AM should be dark)
    const mockTime = new Date(2026, 0, 1, 6, 30, 0).getTime();
    vi.spyOn(time, "getTime").mockReturnValue(mockTime);

    const theme = device.getThemeFromTime();
    expect(theme).toBe("dark");
  });

  it("should return light mode during morning on Jul 1st (e.g. 6:00 AM)", () => {
    // 2026-07-01 06:00:00 (sunrise is 5:00 AM on Jul 1st, so 6:00 AM should be light)
    const mockTime = new Date(2026, 6, 1, 6, 0, 0).getTime();
    vi.spyOn(time, "getTime").mockReturnValue(mockTime);

    const theme = device.getThemeFromTime();
    expect(theme).toBe("light");
  });
});

describe("getLocation", () => {
  const originalNavigator = globalThis.navigator;
  const originalWindow = (globalThis as any).window;

  afterEach(() => {
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

  it("should resolve with position data on success", async () => {
    (globalThis as any).window = {};
    const mockPosition = {
      coords: {
        latitude: 37.7749,
        longitude: -122.4194,
        accuracy: 10,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: 123456789,
    };

    const getCurrentPositionMock = vi.fn((success) => success(mockPosition));

    Object.defineProperty(globalThis, "navigator", {
      value: {
        geolocation: {
          getCurrentPosition: getCurrentPositionMock,
        },
      },
      writable: true,
      configurable: true,
    });

    const res = await device.getLocation();
    expect(res).toEqual(mockPosition);
    expect(getCurrentPositionMock).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 3600000,
      }
    );
  });

  it("should reject with error on failure", async () => {
    (globalThis as any).window = {};
    const mockError = new Error("Permission denied");

    const getCurrentPositionMock = vi.fn((success, error) => error(mockError));

    Object.defineProperty(globalThis, "navigator", {
      value: {
        geolocation: {
          getCurrentPosition: getCurrentPositionMock,
        },
      },
      writable: true,
      configurable: true,
    });

    await expect(device.getLocation()).rejects.toThrow("Permission denied");
  });

  it("should reject if geolocation is not supported", async () => {
    (globalThis as any).window = {};
    Object.defineProperty(globalThis, "navigator", {
      value: {},
      writable: true,
      configurable: true,
    });

    await expect(device.getLocation()).rejects.toThrow();
  });
});

