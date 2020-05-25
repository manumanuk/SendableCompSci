import { Component, OnInit } from '@angular/core';
import { SubscriptionListService } from '../services/subscription-list.service';
import { PIPEDAListService } from '../services/pipedalist.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: "app-dashboard-page",
  templateUrl: "./dashboard-page.component.html",
  styleUrls: ["./dashboard-page.component.css"],
})
/**
 * Controls View of Dashboard Page Outer Frame and calls relevant functions
 * @class
 * @implements { OnInit }
 */
export class DashboardPageComponent implements OnInit {
  /**
   * Creates Subscription List and PIPEDA List class instances
   * @constructor
   * @param { SubscriptionListService } _subscriptionList - Creates object to hold list of companies associated with user email
   * @param { PIPEDAListService } _PIPEDAList - Creates object to hold list of companies for PIPEDA
   * @param { LoginService } _login - Handles authorization events
   */
  constructor(private _subscriptionList: SubscriptionListService, private _PIPEDAList: PIPEDAListService, private _login: LoginService) {}

  /**
   * Loads google client for Google Drive API
   */
  ngOnInit(): void {
    this._login.initGoogleClient();
  }

  /**
   * Assigns upload source link to subscription list and initiates scan
   */
  uploadData() {
    this._subscriptionList.searchForTestFile(this._login.getCredentials());
  }

  /**
   * Checks whether email data has been uploaded
   * @returns { Boolean } Returns true if data has been uploaded, false if it hasn't
   */
  isEmailUploaded() {
    return this._subscriptionList.isDataUploaded();
  }

  /**
   * Adds a given subscription to the list of PIPEDA requests
   * @param { string } name - Name of the particular subscription on sublist
   * @param { string } type - Is this a retrieval or deletion request?
   */
  addToPIPEDAList(name: string, type: String) {
    this._PIPEDAList.add(this._subscriptionList.getSubscription(name), type)
  }

  /**
   * Initiates a mailto request using pipedalist object
   */
  sendMailTo() {
    this._PIPEDAList.send();
  }

  /**
   * Downloads PIPEDA template
   */
  downloadPIPEDATemplate() {
    this._subscriptionList.downloadTemplate();
  }

  /**
   * Downloads a text file of PIPEDA addresses
   */
  downloadAddresses() {
    this._PIPEDAList.downloadAddresses();
  }

  /**
   * Returns subscription data associated with email
   * @returns { } - Returns an array where 1st element is an array of subscription names, 2nd is object containing SubscriptionData objects associated with names
   */
  getSubList() {
    return this._subscriptionList.printSubscriptionData();
  }

  /**
   * Takes in a word and resizes it to fit inside the subscription box in the DOM
   * @param { string } word - Word to resize
   * @returns { Array<string> } - Two element array: element 1: size of word in pixels, element 2: distance from bottom of subscription box in px
   */
  textResize(word: string) {
    if (word == null) {
      return ['1px', '1px'];
    }
    let stringArray = word.split('');
    let shortLetters = stringArray.filter(letter => {
      letter = letter.toLowerCase();
      if (letter === 'i' || letter === 'f' || letter === 'j' || letter === 'l' || letter === 'r' || letter === 't' || letter === ' ') {
        return letter;
      }
    }).length;
    let longLetters = stringArray.filter(letter => {
      letter = letter.toLowerCase();
      if (letter === 'm' || letter === 'w') {
        return letter;
      }
    }).length;
    let stringSize = word.length + longLetters - shortLetters*0.5;
    let fontSize = (400 / stringSize) * 1.7;
    if (fontSize > 80)
      fontSize = 80;
    return [fontSize + 'px', 20+(80-fontSize)*0.3 + 'px'];
  }
}
