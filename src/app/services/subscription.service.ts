import { Injectable } from '@angular/core';
import { SubscriptionData } from './prototypes/subscription-data-interface'
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database'
import { HttpClient } from '@angular/common/http'
import { CrawlData } from '../services/prototypes/crawl-data'
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
/**
 * Creates a new subscription and holds data about existing ones
 * @class
 */
export class SubscriptionService {
  private $subscriptionData: Observable<SubscriptionData>;
  private $dbRead: Observable<SubscriptionData[]>
  //private dbRead: SubscriptionData[];
  //private subscriptionData = new SubscriptionData;
  private databasePath = "/companies";
  private databaseRef: AngularFireList<SubscriptionData>;

  /**
   * Creates SubscriptionService class
   * @constructor
   * @param { AngularFireDatabase } _database - Creates private object of type AngularFireDatabase
   */
  constructor(private _database: AngularFireDatabase, private _http: HttpClient) {
    this.databaseRef = _database.list(this.databasePath);
    /*this.databaseRef.valueChanges().subscribe(data => {
      this.dbRead = data;
    });*/
    this.$dbRead = this.databaseRef.valueChanges();
  }

  /**
   * Searches existing database to find company's privacy policy and privacy email
   * @param { String } service - Name of company to search for
   * @returns { number } - Returns -1 if company name is not in database, else returns 0
   */
  private readDatabase(service) {
    //Check first to see if company name is already in the database
    //DATABASE FILE READING
    let $searchResults = this.$dbRead.pipe(map(dbData => dbData.filter(companyData => {
      if (companyData.name == service) {
        return companyData;
      }
    })));
    return $searchResults;

    /*for (let key of this.dbRead) {
      if (key.name == service) {
        this.subscriptionData=key;
        return 0;
      }
    }
    return -1;*/
  }

  /**
   * Crawls web for privacy policy and email information
   * @param { String } - service - Name of company to search for
   */
  /*private crawlWeb(service: String) {
    return this._http.post<Array<CrawlData>>("http://localhost:5001/sendablecompsci/us-central1/scraper", JSON.stringify({ text: "https://" + service }));
  }*/
  private crawlWeb (service) {
    return this._http.post<Array<SubscriptionData>>("http://localhost:5001/sendablecompsci/us-central1/scraper", JSON.stringify({ text: "https://" + service })).pipe(map(response => {
      let data = response[0];
      if (data.logoSrc == null) {
        data.logoSrc = '../../assets/images/question-mark-icon.PNG';
      } else if (data.logoSrc.startsWith('https://')) {
        // Do nothing
      } else if (data.logoSrc.startsWith("//")) {
        data.logoSrc = "https:" + data.logoSrc;
      } else if (data.logoSrc.startsWith('/')) {
        data.logoSrc = data.url + data.logoSrc;
      } else {
        data.logoSrc = data.url + '/' + data.logoSrc;
      }
      return data;
    }));
  }

  /**
   * Returns information associated with subscription
   * @returns { SubscriptionData } - Returns interface of data about subscription, including name of service and privacy email.
   */
  getData(): Observable<SubscriptionData> {
    return this.$subscriptionData;
  }

  /**
   * Clears information associated with subscription
   */
  clearData(): void {
    this.$subscriptionData = null;
    this.$subscriptionData = new Observable<SubscriptionData>();
  }

  /**
   * Searches for a given company name in database or crawls web
   * @param { String } service - Name of company to search for
   */
  searchForCompany (url: string, name: string) {
    this.$subscriptionData = new Observable<SubscriptionData>(observer => {
      let dataPush = new SubscriptionData();
      dataPush.name = name;
      observer.next(dataPush);
    })
    this.readDatabase(url).subscribe(searchResult => {
      if (searchResult.length >= 1) {
        searchResult[0].name = name;
        this.$subscriptionData = new Observable<SubscriptionData>(observer => {
          observer.next(searchResult[0]);
        });
      } else {
        this.crawlWeb(url).pipe(map(data => {
          data[0].name = name;
          return data;
        })/*, catchError(err => {
          let emptyData = new SubscriptionData();
          emptyData.name = name;
          emptyData.url = url;
          this.databaseRef.push(emptyData);
          this.$subscriptionData = new Observable<SubscriptionData>(observer => {
            observer.next(emptyData);
          });
          throw "The Web Crawler encountered an error";
        })*/).subscribe(searchResult => {
          this.databaseRef.push(searchResult[0]);
          this.$subscriptionData = new Observable<SubscriptionData>(observer => {
            observer.next(searchResult);
          })
        }, httpError => {
          let emptyData = new SubscriptionData();
          emptyData.name = name;
          emptyData.url = url;
          this.databaseRef.push(emptyData);
          this.$subscriptionData = new Observable<SubscriptionData>(observer => {
            observer.next(emptyData);
          });
        });
      }
    });
    return;
    /*if (this.readDatabase(service) != -1) {
      return;
    } else {
      this.subscriptionData.name = service;
      this.subscriptionData.emailFrequency = 1;
      let httpResp = await this.crawlWeb(service).toPromise<Array<CrawlData>>();
      if (httpResp != null) {
        let data: CrawlData = httpResp[0];
        if (data.favicon == null) {
          this.subscriptionData.logoSrc = '../../assets/images/question-mark-icon.PNG';
        } else if (data.favicon.startsWith('https://')) {
          this.subscriptionData.logoSrc = data.favicon;
        } else if (data.favicon.startsWith("//")) {
          this.subscriptionData.logoSrc = "https:" + data.favicon;
        } else if (data.favicon.startsWith('/')) {
          this.subscriptionData.logoSrc = data.url + data.favicon;
        } else {
          this.subscriptionData.logoSrc = data.url + '/' + data.favicon;
        }
        this.databaseRef.push(this.subscriptionData);
      }

      else {
        this.subscriptionData.logoSrc="../../assets/images/question-mark-icon.PNG"
        this.databaseRef.push(this.subscriptionData);
      }
      return;
    }*/
  }
}
