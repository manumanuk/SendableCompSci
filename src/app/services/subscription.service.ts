import { Injectable } from '@angular/core';
import { SubscriptionData } from './subscription-data-interface'
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database'

@Injectable({
  providedIn: 'root'
})
/**
 * A class to hold all data about a subscription
 * @class
 */
export class SubscriptionService {
  private subscriptionData: SubscriptionData;
  private databasePath = "/companies";
  databaseRef: AngularFireList<SubscriptionData> = null;

  /**
   * Creates SubscriptionService class
   * @constructor
   * @param { String } _name - Name of company to search for
   * @param { AngularFireDatabase } [_database] - Creates private object of type AngularFireDatabase
   */
  constructor(_name:String, private _database?: AngularFireDatabase) {
    this.subscriptionData.name = _name;
    this.searchForCompany(_name);
    this.databaseRef = _database.list(this.databasePath);
  }

  /**
   * Crawls web and database to find company's privacy policy and privacy email
   * @param service - Name of company to search for
   */
  searchForCompany(service: String) {
    //Check first to see if company name is already in the database
    //DATABASE FILE READING
    if (Object(this.databaseRef).keys().find(companyName => {return companyName == service })) {
      return
    }

    //Call function that crawls web for company's privacy policy
    /** Code to be added later */
    this.subscriptionData.name = service;
    this.subscriptionData.logoSrc="example-source-link.png";
    this.subscriptionData.emailFrequency=3;
    this.subscriptionData.deleteAccountURL="sample-url.com"
    this.subscriptionData.pipAddress="privacy.sample-company@domain.com"

    //DATABASE FILE WRITING
    //Add information to database of available companies
    this.databaseRef.push(this.subscriptionData)
  }

  /**
   * Returns information associated with subscription
   * @returns { SubscriptionData } - Returns interface of data about subscription, including name of service and privacy email.
   */
  getData(): SubscriptionData {
    return this.subscriptionData;
  }
}
