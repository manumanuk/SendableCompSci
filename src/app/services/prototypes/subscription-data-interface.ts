/**
 * Contains all information about a given subscription
 * @class SubscriptionData
 */
export class SubscriptionData {
  name: string;
  emailFrequency: number;
  pipAddress: string;
  logoSrc: string;
  deleteAccountURL: string;
  url: string;

  /**
   * Initializes all variables with defaults
   * @constructor
   */
  constructor() {
    this.name = "";
    this.emailFrequency = 1;
    this.pipAddress = "";
    this.logoSrc = "/assets/images/question-mark-icon.PNG";
    this.deleteAccountURL = "";
    this.url = "";
  }
}
