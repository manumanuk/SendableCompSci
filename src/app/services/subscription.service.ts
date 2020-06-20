import { Injectable } from '@angular/core';
import { SubscriptionData } from './prototypes/subscription-data-interface'
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
/**
 * A class to hold all data about a subscription
 * @class
 */
export class SubscriptionService {
  private dbRead: SubscriptionData[];
  private subscriptionData = new SubscriptionData;
  private databasePath = "/companies";
  private databaseRef: AngularFireList<SubscriptionData>;

  /**
   * Creates SubscriptionService class
   * @constructor
   * @param { AngularFireDatabase } _database - Creates private object of type AngularFireDatabase
   * @param { HttpClient } _http - Object to handle HTTP requests
   */
  constructor(private _database: AngularFireDatabase, private _http: HttpClient) {
    this.databaseRef = _database.list(this.databasePath);
    this.databaseRef.valueChanges().subscribe(data => {
      this.dbRead = data;
    });
  }

  /**
   * Searches existing database to find company's privacy policy and privacy email
   * @param { string } service - Name of company to search for
   * @returns { number } - Returns -1 if company name is not in database, else returns 0
   */
  private readDatabase(service: string) {
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
   * @param { string } name - Name of company to search for
   * @param { string } url - Url of company website
   */
  private async crawlWeb(name: string, url: string) {
    let response = await this._http
      .post<Array<SubscriptionData>>(
        "https://us-central1-sendablecompsci.cloudfunctions.net/scraper",
        JSON.stringify({ text: "https://" + url })
      )
      .toPromise<Array<SubscriptionData>>()
      .catch((rej) => {
        console.log(rej);
        this.subscriptionData = new SubscriptionData();
        this.subscriptionData.name = name;
        this.subscriptionData.url = url;
        //this.databaseRef.push(this.subscriptionData);
        return;
      });
    if (response != null) {
      let data = response[0];
      if (data.logoSrc == null) {
        this.subscriptionData.logoSrc = '../../assets/images/question-mark-icon.PNG';
      } else if (data.logoSrc.startsWith('https://')) {
        this.subscriptionData.logoSrc = data.logoSrc;
      } else if (data.logoSrc.startsWith("//")) {
        this.subscriptionData.logoSrc = "https:" + data.logoSrc;
      } else if (data.logoSrc.startsWith('/')) {
        this.subscriptionData.logoSrc = data.url + data.logoSrc;
      } else {
        this.subscriptionData.logoSrc = data.url + '/' + data.logoSrc;
      }
      this.subscriptionData.pipAddress = data.pipAddress;
      this.databaseRef.push(this.subscriptionData);
    } else {
      this.subscriptionData = new SubscriptionData();
      this.subscriptionData.name = name;
      this.subscriptionData.url = url;
      //this.databaseRef.push(this.subscriptionData);
    }
    return;
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
   * @param { string } name - Name of company to search for
   * @param { string } url - Url of company website
   */
  async searchForCompany (name: string, url: string) {
    this.subscriptionData = new SubscriptionData();
    this.subscriptionData.name = name;
    this.subscriptionData.url = url;
    if (this.readDatabase(name) != -1) {
      return;
    } else {
      await this.crawlWeb(name, url);
    }
  }

  /**
   * Refreshes the HTML view of the dashboard by adding then deleting a test data SubscriptionData to the firebase database
   */
  finalUpdate() {
    let testData = new SubscriptionData();
    testData.name = "update";
    let key = this.databaseRef.push(testData).key;
    this._database.object('/companies/' + key).remove();
  }
}
