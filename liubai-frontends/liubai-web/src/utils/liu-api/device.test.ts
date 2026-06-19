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
    const date = new Date(2026, 5, 19); // 6 月 19 日
    const { sunrise, sunset } = getSunriseSunset(date);

    console.log("6/19 日出、日落时间🌄:")
    console.log(sunrise)
    console.log(sunset)
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
