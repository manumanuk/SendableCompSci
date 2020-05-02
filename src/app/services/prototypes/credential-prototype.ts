import * as firebase from 'firebase/app'
/**
 * Stores credential data about Firebase Login event
 * @class
 * @implements { firebase.auth.UserCredential }
 */
export class CredentialData implements firebase.auth.UserCredential {
  additionalUserInfo?: firebase.auth.AdditionalUserInfo;
  credential: firebase.auth.AuthCredential;
  operationType?: string;
  user: firebase.User;
  refreshToken?: string;
  scopes?: Array<string>;
  tokenType?: string;
  expirationDate?: number;
  providerId?: string;
  signInMethod?: string;
}
