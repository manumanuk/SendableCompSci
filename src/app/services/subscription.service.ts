import { Injectable } from '@angular/core';
import { SubscriptionData } from './subscription-data-interface'
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
/**
 * A class to hold all data about a subscription
 * @class
 */
export class SubscriptionService {
  //private databaseReader:Observable<SubscriptionData[]>;
  private subData: SubscriptionData[];
  private subscriptionData = new SubscriptionData;
  private databasePath = "/companies";
  private databaseRef: AngularFireList<SubscriptionData>;

  /**
   * Creates SubscriptionService class
   * @constructor
   * @param { AngularFireDatabase } [_database] - Creates private object of type AngularFireDatabase
   */
  constructor(private _database: AngularFireDatabase) {
    this.databaseRef = _database.list(this.databasePath);
  }

  /**
   * Crawls web and database to find company's privacy policy and privacy email
   * @param service - Name of company to search for
   */
  readDatabase(service: String) {
    //Check first to see if company name is already in the database
    //DATABASE FILE READING
    for (let key of this.subData) {
      if (key.name == service) {
        this.subscriptionData=key;
        return;
      }
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

  /**
   * Clears information associated with subscription
   */
  clearData(): void {
    this.subscriptionData = new SubscriptionData;
  }

  /**
   * Reads values in database and calls the read database function
   * @param service - Name of company to search for
   */
  searchForCompany (service: String) {
    //let promise = await
    return this.databaseRef.valueChanges().subscribe(data=> {
      this.subData = data;
      this.readDatabase(service)
    })
    //let result = await promise;
    //this.subData = result;
  }
}
