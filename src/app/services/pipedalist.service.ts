import { Injectable } from '@angular/core';
import { SubscriptionData } from './prototypes/subscription-data-interface';

const footnote = "This%20email%20was%20sent%20using%20Sendable,%20an%20automated%20PIPEDA%20request%20generator.%20If%20you%20believe%20this%20email%20was%20sent%20to%20the%20wrong%20address,%20please%20contact%20the%20developers.%20See%20https://sendablecompsci.firebaseapp.com/.";

@Injectable({
  providedIn: "root",
})

/**
 * Holds a list of subscriptions that are utilizing the PIPEDA automatic request feature
 * Initiates mailto request or downloads
 * @class
 */
export class PIPEDAListService {
  private retrievalList: Array<SubscriptionData> = [];
  private deletionList: Array<SubscriptionData> = [];

  /**
   * Creates PIPEDAListService class
   * @constructor
   */
  constructor() {}

  /**
   * Provides the body portion of the mailto: email
   * @param { string } email - User's email address
   * @param { string } type  - Type of request being initiated ("retrieval" or "deletion")
   * @returns { string } - Returns the email body depending on type of request
   */
  createEmailBody (email:string, type: string) {
    if (type=="retrieval") {
      return "To%20whom%20it%20may%20concern,%0D%0A%0D%0A" +
        "Under%20section%204.9%20of%20Schedule%201%20of%20Canada’s%20federal%20privacy%20legislation%20—" +
        "%20The%20Personal%20Information%20Protection%20and%20Electronic%20Documents%20Act%20—%20I%20am%20requesting%20a%20copy%20of%20the%20personal%20information%20which%20you%20hold%20associated%20with%20my%20account." +
        "%20For%20information%20on%20what%20I%20require%20from%20you,%20please%20see%20https://www.priv.gc.ca/en/privacy-topics/accessing-personal-information/api_bus/.%20" +
        "%0D%0A%0D%0AIn%20general,%20PIPEDA%20requires%20organizations%20to%20provide%20individuals%20with%20access%20to%20their%20personal%20information%20at%20free%20or%20minimal%20cost%20within%2030%20days." +
        "%20For%20details%20about%20organizations'%20responsibilities%20under%20PIPEDA's%20access%20provision%20see%20the%20Office%20of%20the%20Privacy%20Commissioner's%20guidance%20at%20priv.gc.ca:%20What%20businesses%20need%20to%20know." +
        "%0D%0A%0D%0AIf%20you%20do%20not%20normally%20handle%20these%20types%20of%20requests,%20please%20forward%20this%20letter%20to%20the%20person%20in%20your%20organization%20responsible%20for%20privacy%20compliance." +
        "%0D%0A%0D%0APlease%20contact%20me%20at%20" + email + "%20if%20you%20require%20additional%20information%20from%20me%20before%20you%20proceed.";

    } else {
      return "To%20whom%20it%20may%20concern,%0D%0A%0D%0A" +
        "Under%20section%204.3.9%20of%20Schedule%201%20of%20Canada’s%20federal%20privacy%20legislation%20—%20The%20Personal%20Information%20Protection%20and%20Electronic%20Documents%20Act%20(PIPEDA)%20—%20I%20am%20withdrawing%20my%20consent%20for%20you" +
        "%20to%20collect,%20use,%20or%20disclose%20my%20personal%20information,%20requesting%20the%20deletion%20of%20my%20account.%20In%20accordance%20with%20section%204.5%20of%20Schedule%201%20of%20PIPEDA,%20you%20must%20also%20delete%20my%20stored" +
        "%20personal%20information%20if%20it%20is%20no%20longer%20required%20for%20any%20other%20legal%20purposes." +
        "%0D%0A%0D%0AIn%20general,%20PIPEDA%20requires%20organizations%20to%20provide%20individuals%20with%20access%20to%20their%20personal%20information%20at%20free%20or%20minimal%20cost%20within%2030%20days." +
        "%20For%20details%20about%20organizations'%20responsibilities%20under%20PIPEDA's%20access%20provision%20see%20the%20Office%20of%20the%20Privacy%20Commissioner's%20guidance%20at%20priv.gc.ca:%20What%20businesses%20need%20to%20know." +
        "%0D%0A%0D%0AIf%20you%20do%20not%20normally%20handle%20these%20types%20of%20requests,%20please%20forward%20this%20letter%20to%20the%20person%20in%20your%20organization%20responsible%20for%20privacy%20compliance." +
        "%0D%0A%0D%0APlease%20contact%20me%20at%20" + email + "%20if%20you%20require%20additional%20information%20from%20me%20before%20you%20proceed.";
    }
  }

  /**
   * Adds/removes/changes the retrieval/deletion state a given subscription to the PIPEDA list
   * @param { SubscriptionData } subscription - the subscription being added to the PIPEDA list
   * @param { string } type - the type of request to be sent (retrieval or deletion)
   */
  add(subscription: SubscriptionData, type: string) {
    if (type == "retrieval" && this.retrievalList.indexOf(subscription) == -1) {
      this.retrievalList.push(subscription);
      if (this.deletionList.indexOf(subscription) != -1) {
        this.deletionList.splice(this.deletionList.indexOf(subscription), 1);
      }
    } else if (type == "deletion" && this.deletionList.indexOf(subscription) == -1) {
      this.deletionList.push(subscription);
      if (this.retrievalList.indexOf(subscription) != -1) {
        this.retrievalList.splice(this.retrievalList.indexOf(subscription), 1);
      }
    } else if (type == "retrieval" && this.retrievalList.indexOf(subscription) != -1) {
      this.retrievalList.splice(this.retrievalList.indexOf(subscription), 1)
    } else if (type == "deletion" && this.deletionList.indexOf(subscription) != -1) {
      this.deletionList.splice(this.deletionList.indexOf(subscription), 1)
    }
  }

  /**
   * Sends PIPEDA requests using mailto:
   * @param { string } type - Type of mailto to initiate ("deletion" or "retrieval")
   * @param { string } userEmail - User's email address
   * @returns { string } - mailto href text
   */
  send(type: string, userEmail: string) {
    let recipients = "";
    if (type=="retrieval") {
      for (let subscription of this.retrievalList) {
        recipients += subscription.pipAddress;
        recipients +=","
      }
    } else {
      for (let subscription of this.deletionList) {
        recipients += subscription.pipAddress;
        recipients += ","
      }
    }
    return "mailto:" + userEmail + "?bcc=" + recipients.slice(0, recipients.length - 1).trim() + "&subject=" + "PIPEDA%20" + type[0].toUpperCase() + type.slice(1) + "%20Request" + "&body=" + this.createEmailBody(userEmail, type) +"%0D%0A%0D%0A"+ footnote;
  }

  /**
   * Downloads PIPEDA list addresses in current form as a .txt file
   */
  downloadAddresses() {
    //Initiate download
  }

  /**
   * Searches PIPEDA lists for a particular subscription and returns which list, if any, it is located in
   * @param { SubscriptionData } subscription - Subscription to be searched for
   * @returns { string } - returns "retrieval" if in retrieval list, "deletion" if in deletion list, or "neither" if in neither
   */
  subState(subscription: SubscriptionData) {
    if (this.retrievalList.indexOf(subscription) != -1) {
      return "retrieval";
    } else if (this.deletionList.indexOf(subscription) != -1) {
      return "deletion"
    } else {
      return "neither"
    }
  }
}
