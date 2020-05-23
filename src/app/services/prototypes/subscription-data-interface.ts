/**
 * Contains all information about a given subscription
 * @class SubscriptionData
 */
export class SubscriptionData {
  name: String;
  url: string;
  emailFrequency: number;
  pipAddress: String;
  logoSrc: String;
  deleteAccountURL: String;
  constructor() {
    this.name = "";
    this.url = "";
    this.emailFrequency = 1;
    this.pipAddress = "";
    this.logoSrc = "/assets/images/question-mark-icon.PNG";
  }
}
