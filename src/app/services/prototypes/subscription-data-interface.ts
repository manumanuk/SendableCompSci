/**
 * Contains all information about a given subscription
 * @class SubscriptionData
 */
export class SubscriptionData {
  name: String;
  emailFrequency: number;
  pipAddress: String;
  logoSrc: String;
  deleteAccountURL: String;
  constructor() {
    this.name = "";
    this.emailFrequency = 0;
    this.pipAddress = "";
    this.logoSrc = "";
  }
}
