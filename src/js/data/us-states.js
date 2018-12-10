const usStateData = [
  {
    name: 'Alabama',
    abbr: 'AL',
    area: '135767SKM',
    largest_city: 'Birmingham',
    capital: 'Montgomery',
    nickname: 'Yellowhammer State',
    population: 4888949
  },
  {
    name: 'Alaska',
    abbr: 'AK',
    area: '1723337SKM',
    largest_city: 'Anchorage',
    capital: 'Juneau',
    nickname: 'Last Frontier',
    population: 738068
  },
  {
    name: 'Arizona',
    abbr: 'AZ',
    area: '113594SKM',
    largest_city: 'Phoenix',
    capital: 'Phoenix',
    nickname: 'Grand Canyon State',
    population: 7123898
  },
  {
    name: 'Arkansas',
    abbr: 'AR',
    area: '52035SKM',
    largest_city: 'Little Rock',
    capital: 'Little Rock',
    nickname: 'Natural State',
    population: 3020327
  },
  {
    name: 'California',
    abbr: 'CA',
    area: '423967SKM',
    largest_city: 'Los Angeles',
    capital: 'Sacramento',
    nickname: 'Golden State',
    population: 39776830
  },
  {
    name: 'Colorado',
    abbr: 'CO',
    area: '103642SKM',
    largest_city: 'Denver',
    capital: 'Denver',
    nickname: 'Centennial State',
    population: 5684203
  },
  {
    name: 'Connecticut',
    abbr: 'CT',
    area: '14357SKM',
    largest_city: 'Bridgeport',
    capital: 'Hartford',
    nickname: 'Constitution State',
    population: 3588683
  },
  {
    name: 'Delaware',
    abbr: 'DE',
    area: '6446SKM',
    largest_city: 'Wilmington',
    capital: 'Dover',
    nickname: 'First State',
    population: 971180
  },
  {
    name: 'Florida',
    abbr: 'FL',
    area: '170312SKM',
    largest_city: 'Jacksonville',
    capital: 'Tallahassee',
    nickname: 'Sunshine State',
    population: 21312211
  },
  {
    name: 'Georgia',
    abbr: 'GA',
    area: '57513SKM',
    largest_city: 'Atlanta',
    capital: 'Atlanta',
    nickname: 'Peach State',
    population: 10545138
  },
  {
    name: 'Hawaii',
    abbr: 'HI',
    area: '6423SKM',
    largest_city: 'Honolulu',
    capital: 'Honolulu',
    nickname: 'Aloha State',
    population: 1426393
  },
  {
    name: 'Idaho',
    abbr: 'ID',
    area: '82643SKM',
    largest_city: 'Boise',
    capital: 'Boise',
    nickname: 'Gem State',
    population: 1753860
  },
  {
    name: 'Illinois',
    abbr: 'IL',
    area: '149995SKM',
    largest_city: 'Chicago',
    capital: 'Springfield',
    nickname: 'Prairie State',
    population: 12768320
  },
  {
    name: 'Indiana',
    abbr: 'IN',
    area: '35826SKM',
    largest_city: 'Indianapolis',
    capital: 'Indianapolis',
    nickname: 'Hoosier State',
    population: 6699629
  },
  {
    name: 'Iowa',
    abbr: 'IA',
    area: '55857SKM',
    largest_city: 'Des Moines',
    capital: 'Des Moines',
    nickname: 'Hawkeye State',
    population: 3160553
  },
  {
    name: 'Kansas',
    abbr: 'KS',
    area: '213100SKM',
    largest_city: 'Wichita',
    capital: 'Topeka',
    nickname: 'Sunflower State',
    population: 2918515
  },
  {
    name: 'Kentucky',
    abbr: 'KY',
    area: '104656SKM',
    largest_city: 'Louisville',
    capital: 'Frankfort',
    nickname: 'Bluegrass State',
    population: 4472265
  },
  {
    name: 'Louisiana',
    abbr: 'LA',
    area: '135659SKM',
    largest_city: 'New Orleans',
    capital: 'Baton Rouge',
    nickname: 'Pelican State',
    population: 4682509
  },
  {
    name: 'Maine',
    abbr: 'ME',
    area: '91633SKM',
    largest_city: 'Portland',
    capital: 'Augusta',
    nickname: 'Pine Tree State',
    population: 1341582
  },
  {
    name: 'Maryland',
    abbr: 'MD',
    area: '32131SKM',
    largest_city: 'Baltimore',
    capital: 'Annapolis',
    nickname: 'Old Line State',
    population: 6079602
  },
  {
    name: 'Massachusetts',
    abbr: 'MA',
    area: '7800SKM',
    largest_city: 'Boston',
    capital: 'Boston',
    nickname: 'Bay State',
    population: 6895917
  },
  {
    name: 'Michigan',
    abbr: 'MI',
    area: '250487SKM',
    largest_city: 'Detroit',
    capital: 'Lansing',
    nickname: 'Great Lakes State',
    population: 9991177
  },
  {
    name: 'Oklahoma',
    abbr: 'OK',
    area: '68595SKM',
    largest_city: 'Oklahoma City',
    capital: 'Oklahoma City',
    nickname: 'Sooner State',
    population: 3940521
  },
  {
    name: 'Oregon',
    abbr: 'OR',
    area: '254799SKM',
    largest_city: 'Portland',
    capital: 'Salem',
    nickname: 'Beaver State',
    population: 4199563
  },
  {
    name: 'Pennsylvania',
    abbr: 'PA',
    area: '119280SKM',
    largest_city: 'Philadelphia',
    capital: 'Harrisburg',
    nickname: 'Keystone State',
    population: 12823989
  },
  {
    name: 'Rhode Island',
    abbr: 'RI',
    area: '1034SKM',
    largest_city: 'Providence',
    capital: 'Providence',
    nickname: 'Ocean State',
    population: 1061712
  },
  {
    name: 'South Carolina',
    abbr: 'SC',
    area: '82933SKM',
    largest_city: 'Charleston',
    capital: 'Columbia',
    nickname: 'Palmetto State',
    population: 5088916
  },
  {
    name: 'South Dakota',
    abbr: 'SD',
    area: '199729SKM',
    largest_city: 'Sioux Falls',
    capital: 'Pierre',
    nickname: 'Mount Rushmore State',
    population: 877790
  },
  {
    name: 'Tennessee',
    abbr: 'TN',
    area: '41235SKM',
    largest_city: 'Nashville',
    capital: 'Nashville',
    nickname: 'Volunteer State',
    population: 6782564
  },
  {
    name: 'Texas',
    abbr: 'TX',
    area: '695662SKM',
    largest_city: 'Houston',
    capital: 'Austin',
    nickname: 'Lone Star State',
    population: 28704330
  },
  {
    name: 'Utah',
    abbr: 'UT',
    area: '82170SKM',
    largest_city: 'Salt Lake City',
    capital: 'Salt Lake City',
    nickname: 'Beehive State',
    population: 3159345
  },
  {
    name: 'Minnesota',
    abbr: 'MN',
    area: '225163SKM',
    largest_city: 'Minneapolis',
    capital: 'St. Paul',
    nickname: 'North Star State',
    population: 5628162
  },
  {
    name: 'Mississippi',
    abbr: 'MS',
    area: '46923SKM',
    largest_city: 'Jackson',
    capital: 'Jackson',
    nickname: 'Magnolia State',
    population: 2982785
  },
  {
    name: 'Missouri',
    abbr: 'MO',
    area: '180540SKM',
    largest_city: 'Kansas City',
    capital: 'Jefferson City',
    nickname: 'Show-Me State',
    population: 6135888
  },
  {
    name: 'Montana',
    abbr: 'MT',
    area: '380831SKM',
    largest_city: 'Billings',
    capital: 'Helena',
    nickname: 'Treasure State',
    population: 1062330
  },
  {
    name: 'Nebraska',
    abbr: 'NE',
    area: '200330SKM',
    largest_city: 'Omaha',
    capital: 'Lincoln',
    nickname: 'Cornhusker State',
    population: 1932549
  },
  {
    name: 'Nevada',
    abbr: 'NV',
    area: '286380SKM',
    largest_city: 'Las Vegas',
    capital: 'Carson City',
    nickname: 'Silver State',
    population: 3056824
  },
  {
    name: 'New Hampshire',
    abbr: 'NH',
    area: '24214SKM',
    largest_city: 'Manchester',
    capital: 'Concord',
    nickname: 'Granite State',
    population: 1350575
  },
  {
    name: 'New Jersey',
    abbr: 'NJ',
    area: '22591SKM',
    largest_city: 'Newark',
    capital: 'Trenton',
    nickname: 'Garden State',
    population: 9032872
  },
  {
    name: 'New Mexico',
    abbr: 'NM',
    area: '314917SKM',
    largest_city: 'Albuquerque',
    capital: 'Santa Fe',
    nickname: 'Land of Enchantment',
    population: 2090708
  },
  {
    name: 'New York',
    abbr: 'NY',
    area: '141297SKM',
    largest_city: 'New York City',
    capital: 'Albany',
    nickname: 'Empire State',
    population: 19862512
  },
  {
    name: 'North Carolina',
    abbr: 'NC',
    area: '139391SKM',
    largest_city: 'Charlotte',
    capital: 'Raleigh',
    nickname: 'Old North State',
    population: 10390149
  },
  {
    name: 'North Dakota',
    abbr: 'ND',
    area: '183108SKM',
    largest_city: 'Fargo',
    capital: 'Bismarck',
    nickname: 'Peace Garden State',
    population: 755238
  },
  {
    name: 'Ohio',
    abbr: 'OH',
    area: '40861SKM',
    largest_city: 'Columbus',
    capital: 'Columbus',
    nickname: 'Buckeye State',
    population: 11694664
  },
  {
    name: 'Vermont',
    abbr: 'VT',
    area: '24906SKM',
    largest_city: 'Burlington',
    capital: 'Montpelier',
    nickname: 'Green Mountain State',
    population: 623960
  },
  {
    name: 'Virginia',
    abbr: 'VA',
    area: '110787SKM',
    largest_city: 'Virginia Beach',
    capital: 'Richmond',
    nickname: 'Old Dominion State',
    population: 8525660
  },
  {
    name: 'Washington',
    abbr: 'WA',
    area: '184661SKM',
    largest_city: 'Seattle',
    capital: 'Olympia',
    nickname: 'Evergreen State',
    population: 7530552
  },
  {
    name: 'West Virginia',
    abbr: 'WV',
    area: '24038SKM',
    largest_city: 'Charleston',
    capital: 'Charleston',
    nickname: 'Mountain State',
    population: 1803077
  },
  {
    name: 'Wisconsin',
    abbr: 'WI',
    area: '169635SKM',
    largest_city: 'Milwaukee',
    capital: 'Madison',
    nickname: 'Badger State',
    population: 5818049
  },
  {
    name: 'Wyoming',
    abbr: 'WY',
    area: '97093SKM',
    largest_city: 'Cheyenne',
    capital: 'Cheyenne',
    nickname: 'Equality State',
    population: 573720
  },
  {
    name: 'District of Columbia',
    abbr: 'DC',
    area: '177SKM',
    largest_city: 'Washington',
    capital: undefined,
    nickname: 'Nation\'s Capital',
    population: 703608
  }
];

module.exports = usStateData;
