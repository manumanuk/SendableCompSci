// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyD8YHcpEJKBFnrTt4DXftDVdsOw9XGYLrg",
    authDomain: "sendablecompsci.firebaseapp.com",
    databaseURL: "https://sendablecompsci.firebaseio.com",
    projectId: "sendablecompsci",
    storageBucket: "sendablecompsci.appspot.com",
    messagingSenderId: "934426938633",
    appId: "1:934426938633:web:cd0868be058bfb0ae417d8",

    clientId: "934426938633-6t4rnqdo9n7epqdgjb5hkptvs532upl1.apps.googleusercontent.com",

    scopes: [
      "email",
      "profile",
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.readonly'
    ],

    discoveryDocs: [
      'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    ]
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
