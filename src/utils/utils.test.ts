import {
  isCampaignCompleted,
  addCountryToLocalStorageList,
  getCountriesFoundList,
  removeCountriesFoundList,
  getFilteredCountryList,
  getRandomCountryData,
  getNextCountryData,
  getCountryDataFromCca2Code,
  getCountryDataFromCca3Code,
  getNumberOfClicksOnLand,
  reverseGeolocateCoordinates,
} from ".";
import { RandomOrderGameCategoryList } from "../types";
import { GEONAMES_USERNAME, GEONAMES_TOKEN } from "../config";

describe("Mapstery Gameplay Utils", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  test("addCountryToLocalStorageList adds and retrieves countries", () => {
    addCountryToLocalStorageList("US", "AFRICA");
    const list = getCountriesFoundList("AFRICA");
    expect(list).toContain("US");
  });

  test("addCountryToLocalStorageList does not add duplicates", () => {
    addCountryToLocalStorageList("US", "AFRICA");
    addCountryToLocalStorageList("US", "AFRICA");
    const list = getCountriesFoundList("AFRICA");
    expect(list).toEqual(["US"]);
  });

  test("getCountriesFoundList returns empty array when no countries found", () => {
    const list = getCountriesFoundList("AFRICA");
    expect(list).toEqual([]);
  });

  test("removeCountriesFoundList clears all countries", () => {
    addCountryToLocalStorageList("US", "AFRICA");
    removeCountriesFoundList("AFRICA");
    const list = getCountriesFoundList("AFRICA");
    expect(list).toEqual([]);
  });

  test("isCampaignCompleted returns true when all countries found", () => {
    const filteredCountryList = getFilteredCountryList("MAPSTERY_QUEST");
    filteredCountryList.forEach((country) => {
      addCountryToLocalStorageList(country.cca2, "MAPSTERY_QUEST");
    });
    expect(isCampaignCompleted()).toBe(true);
  });

  test("getFilteredCountryList excludes previously found countries", () => {
    addCountryToLocalStorageList("US", "MAPSTERY_QUEST");
    const filtered = getFilteredCountryList("MAPSTERY_QUEST");
    expect(filtered.find((c) => c.cca2 === "US")).toBeUndefined();
  });

  test("Get random target country logic does not exclude any countries", () => {
    const selectedTargetCountries = new Set<string>();
    let previousCountryCode: string;

    RandomOrderGameCategoryList.forEach((category) => {
      const filteredCountryList = getFilteredCountryList(category.value);

      // INFO: 3000 iterations seems to be enough to almost guarantee that all countries in a given category will be selected
      // but there is a chance for flakiness here due to the random nature - https://en.wikipedia.org/wiki/Coupon_collector%27s_problem
      for (var i = 0; i < 3000; i++) {
        const targetCountryCode = getRandomCountryData(
          category.value,
          previousCountryCode
        ).cca2;

        previousCountryCode = targetCountryCode;
        selectedTargetCountries.add(targetCountryCode);

        // exit the test instance once the expected result has been achieved
        if (selectedTargetCountries.size === filteredCountryList.length) {
          break;
        }
      }
      expect(selectedTargetCountries.size).toEqual(filteredCountryList.length);

      selectedTargetCountries.clear();
    });

    return;
  });

  test("Get random target country logic does not repeat countries", () => {
    let previousCountryCode: string;

    RandomOrderGameCategoryList.forEach((category) => {
      for (var i = 0; i < 500; i++) {
        const targetCountryCode = getRandomCountryData(
          category.value,
          previousCountryCode
        ).cca2;
        expect(targetCountryCode).not.toEqual(previousCountryCode);

        previousCountryCode = targetCountryCode;
      }
    });
  });

  test("Target country list sorting logic returns the correct countries", () => {
    let targetCountryCode: string;

    targetCountryCode = getNextCountryData("LARGEST_TO_SMALLEST_AREA").cca2;
    expect(targetCountryCode).toEqual("RU");

    targetCountryCode = getNextCountryData(
      "LARGEST_TO_SMALLEST_POPULATION"
    ).cca2;
    expect(targetCountryCode).toEqual("IN");
  });

  test("getCountryDataFromCca2Code returns country data for valid code", () => {
    const country = getCountryDataFromCca2Code("US");
    expect(country).toBeDefined();
    expect(country?.cca2).toBe("US");
  });

  test("getCountryDataFromCca2Code returns undefined for invalid code", () => {
    const country = getCountryDataFromCca2Code("XX");
    expect(country).toBeUndefined();
  });

  test("getCountryDataFromCca3Code returns country data for valid code", () => {
    const country = getCountryDataFromCca3Code("USA");
    expect(country).toBeDefined();
    expect(country?.cca3).toBe("USA");
  });

  test("getNumberOfClicksOnLand counts only land clicks", () => {
    const clicks = [
      { countedClickNumber: 1 } as any,
      { countedClickNumber: 2 } as any,
      { countedClickNumber: null } as any,
    ];
    expect(getNumberOfClicksOnLand(clicks)).toBe(2);
  });
});

describe("reverseGeolocateCoordinates", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test("should successfully fetch geolocation data from geonames API", async () => {
    const mockResponse = {
      countryCode: "US",
      countryName: "United States",
      adminName1: "California",
      adminName2: "Los Angeles County",
      toponymName: "Los Angeles",
    };

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce(mockResponse),
    } as any);

    const result = await reverseGeolocateCoordinates(
      "findNearbyPlaceName",
      34.0522,
      -118.2437
    );

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("findNearbyPlaceName")
    );
    expect(result).toEqual(mockResponse);
  });

  test("should construct correct URL with credentials", async () => {
    const mockResponse = { countryCode: "FR" };

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce(mockResponse),
    } as any);

    await reverseGeolocateCoordinates("findNearby", 48.8566, 2.3522);

    const callUrl = vi.mocked(global.fetch).mock.calls[0][0];
    expect(callUrl).toContain("https://secure.geonames.org/findNearby");
    expect(callUrl).toContain(`username=${GEONAMES_USERNAME}`);
    expect(callUrl).toContain(`token=${GEONAMES_TOKEN}`);
    expect(callUrl).toContain("lang=en");
  });

  test("should handle different endpoints", async () => {
    const mockResponse = { featureName: "Test" };

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce(mockResponse),
    } as any);

    await reverseGeolocateCoordinates("countryCode", 51.5074, -0.1278);

    const callUrl = vi.mocked(global.fetch).mock.calls[0][0];
    expect(callUrl).toContain("countryCode");
  });

  test("should throw error when API response is not ok", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      statusText: "Unauthorized",
    } as any);

    await expect(
      reverseGeolocateCoordinates("findNearbyPlaceName", 0, 0)
    ).rejects.toThrow("Geonames API request failed: Unauthorized");
  });
});
