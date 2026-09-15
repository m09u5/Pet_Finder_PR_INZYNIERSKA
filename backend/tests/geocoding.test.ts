import { describe, expect, it } from "vitest";
import { parseNominatimResponse } from "../src/services/geocoding.service";

describe("parseNominatimResponse", () => {
  it("returns null for an empty result list", () => {
    expect(parseNominatimResponse([])).toBeNull();
  });

  it("parses the first result's lat/lon strings into numbers", () => {
    const result = parseNominatimResponse([{ lat: "51.1079", lon: "17.0385" }]);
    expect(result).toEqual({ latitude: 51.1079, longitude: 17.0385 });
  });

  it("returns null when the coordinates are not numeric", () => {
    expect(parseNominatimResponse([{ lat: "not-a-number", lon: "17.0385" }])).toBeNull();
  });
});
