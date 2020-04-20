import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
/**
 * A class to hold all data about a subscription
 * Note: all data is currently public, but can be changed
 * @class
 */
export class SubscriptionService {
  public name: String;
  public emailFrequency: String;
  public pipAddress: String;
  public logoSrc: String;
  public deleteAccountURL: String;

  /**
   * Creates SubscriptionService class
   * @constructor
   */
  constructor() {}


}
