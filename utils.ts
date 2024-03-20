export class Utils {
  public getRandomString = async (length: number) =>
    Math.round(Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))
      .toString(36)
      .slice(1);
  public getRandomNumber = async (length: number) => Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)).toString();
  public getRandomEMail = async () => (await this.getRandomString(10)) + '@mailinator.com';

  public getRandomMerchantWebsiteURL = async () => {
    const randomString = await this.getRandomString(10);
    const randomDomain = this.getRandomDomain();

    // Combine random string and domain to create a random URL
    const randomURL = `https://www.${randomString}.${randomDomain}`;

    return randomURL;
  };
  private getRandomDomain = () => {
    const domains = ['com', 'net', 'org', 'io']; // Add more if needed
    return domains[Math.floor(Math.random() * domains.length)];
  };

  public delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public readCountriesAndSchemesFromCSVFile = async () => {
    const csvFileForSRCCountriesConfiguration = new Map<string, string[]>();
    //Reading SRC Countries and its schemes from CSV file
    const csvFilePath = parse(fs.readFileSync('main/testData/srcV2/qa/src-v2-countries.csv'), {
      columns: true,
      skipEmptyLines: true,
    });

    //Adding CSV file Countries and its schemes to Map
    for (const record of csvFilePath) {
      if (csvFileForSRCCountriesConfiguration.has(record.Country)) {
        csvFileForSRCCountriesConfiguration.get(record.Country).push(record.Scheme);
      } else {
        const tempArray: string[] = [record.Scheme];
        csvFileForSRCCountriesConfiguration.set(record.Country, tempArray);
      }
    }
    console.log('REQUIRED COUNTRIES AND SCHEMES FROM CSV FILE: ', csvFileForSRCCountriesConfiguration);
    return csvFileForSRCCountriesConfiguration;
  };

  public getRandomOrderID = async () => {
    const orderPrefix = 'ORDERD-';
    const numSequence1 = await this.getRandomNumber(6);
    const numSequence2 = await this.getRandomNumber(4);
    return orderPrefix + numSequence1 + '-' + numSequence2;
  };

  public getRandomPhoneNumber = async (prefix?: string) => {
    const maxLength = 10;
    let phonePrefix = '555';
    if (prefix !== undefined && prefix !== null && prefix !== '') {
      phonePrefix = prefix;
    }
    const remainingLength = maxLength - phonePrefix.length;
    const numSequence1 = await this.getRandomNumber(remainingLength);
    return '+1 ' + phonePrefix + numSequence1;
  };
}
