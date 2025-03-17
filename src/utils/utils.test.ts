import {
  getRandomCountryData,
  getNextCountryData,
  getFilteredCountryList,
} from ".";
import { RandomOrderGameCategoryList } from "../types";

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
    }

    expect(selectedTargetCountries.size).toEqual(filteredCountryList.length);

    selectedTargetCountries.clear();
  });
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

  targetCountryCode = getNextCountryData("LARGEST_TO_SMALLEST_POPULATION").cca2;
  expect(targetCountryCode).toEqual("IN");
});
