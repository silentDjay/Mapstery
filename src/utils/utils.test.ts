import { getRandomCountryData, getFilteredCountryList } from ".";
import { GameCategoryList } from "../types";

test("Random country logic does not exclude any countries", () => {
  const randomCountries = new Set<string>();
  let previousCountryCode: string;

  GameCategoryList.forEach((category) => {
    const filteredCountryList = getFilteredCountryList(category.value);

    // INFO: 3000 iterations seems to be enough to almost guarantee that all countries in a given category will be selected
    // but there is a chance for flakiness here due to the random nature - https://en.wikipedia.org/wiki/Coupon_collector%27s_problem
    for (var i = 0; i < 3000; i++) {
      const randomCountryCode = getRandomCountryData(
        category.value,
        previousCountryCode
      ).cca2;

      previousCountryCode = randomCountryCode;
      randomCountries.add(randomCountryCode);
    }

    expect(randomCountries.size).toEqual(filteredCountryList.length);

    randomCountries.clear();
  });
});

test("Random Contry logic does not repeat countries", () => {
  let previousCountryCode: string;

  GameCategoryList.forEach((category) => {
    for (var i = 0; i < 500; i++) {
      const randomCountryCode = getRandomCountryData(
        category.value,
        previousCountryCode
      ).cca2;
      expect(randomCountryCode).not.toEqual(previousCountryCode);

      previousCountryCode = randomCountryCode;
    }
  });
});
