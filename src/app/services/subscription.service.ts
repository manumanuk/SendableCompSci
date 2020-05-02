import { Injectable } from '@angular/core';
import { SubscriptionData } from './prototypes/subscription-data-interface'
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database'

@Injectable({
  providedIn: 'root'
})
/**
 * A class to hold all data about a subscription
 * @class
 */
export class SubscriptionService {
  //private databaseReader:Observable<SubscriptionData[]>;
  private dbRead: SubscriptionData[];
  private subscriptionData = new SubscriptionData;
  private databasePath = "/companies";
  private databaseRef: AngularFireList<SubscriptionData>;

  /**
   * Creates SubscriptionService class
   * @constructor
   * @param { AngularFireDatabase } _database - Creates private object of type AngularFireDatabase
   */
  constructor(private _database: AngularFireDatabase) {
    this.databaseRef = _database.list(this.databasePath);
    this.databaseRef.valueChanges().subscribe(data => {
      this.dbRead = data;
    });
  }

  /**
   * Searches existing database to find company's privacy policy and privacy email
   * @param { String } service - Name of company to search for
   * @returns { number } - Returns -1 if company name is not in database, else returns 0
   */
  private readDatabase(service: String) {
    //Check first to see if company name is already in the database
    //DATABASE FILE READING
    for (let key of this.dbRead) {
      if (key.name == service) {
        this.subscriptionData=key;
        return 0;
      }
    }
    return -1;
  }

  /**
   * Crawls web for privacy policy and email information
   * @param { String } - service - Name of company to search for
   */
  private crawlWeb(service: String) {
    /** Code to be added later */
    this.subscriptionData.name = service;
    this.subscriptionData.logoSrc="example-source-link.png";
    this.subscriptionData.emailFrequency=1;
    this.subscriptionData.deleteAccountURL="sample-url.com"
    this.subscriptionData.pipAddress="privacy.sample-company@domain.com"
    return 0
    //DATABASE FILE WRITING
    //Add information to database of available companies
    //this.databaseRef.push(this.subscriptionData)
  }

  /**
   * Returns information associated with subscription
   * @returns { SubscriptionData } - Returns interface of data about subscription, including name of service and privacy email.
   */
  getData(): SubscriptionData {
    return this.subscriptionData;
  }

  /**
   * Clears information associated with subscription
   */
  clearData(): void {
    this.subscriptionData = null;
    this.subscriptionData = new SubscriptionData;
  }

  /**
   * Searches for a given company name in database or crawls web
   * @param { String } service - Name of company to search for
   */
  searchForCompany (service: String) {
    if (this.readDatabase(service) == -1) {
      this.crawlWeb(service);
      return
    } else {
      return
    }
  }
}
