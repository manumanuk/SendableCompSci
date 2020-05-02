//ASCII ORDER: http://www.asciitable.com/
/**
 * Sorts an array of strings by first character by ASCII value using BUBBLE SORT.
 * @param { Array<string> } stringArray - Array of strings to be sorted by ASCII by first character
 * @returns { Array<string> } - Returns the sorted string array
 */
export function bubbleSort( stringArray: Array<string> ) {
  for (let k=0; k<stringArray.length-1;k++) {
    for (let i=0; i<stringArray.length-k-1; i++) {
      let temp = '';
      if (stringArray[i][0].toLowerCase().charCodeAt(0)>stringArray[i+1][0].toLowerCase().charCodeAt(0)) {
        temp = stringArray[i];
        stringArray[i] = stringArray[i+1];
        stringArray[i+1] = temp;
      }
    }
  }
  return stringArray;
}

/**
 * Sorts an array of strings by first character by ASCII value using SELECTION SORT.
 * @param { Array<string> } stringArray - Array of strings to be sorted by ASCII
 * @returns { Array<string> } - Returns the sorted string array
 */
export function selectionSort( stringArray: Array<string> ) {
  let max:number;
  for (let i = 0; i<stringArray.length-2; i++) {
    max = 0;
    for (let j=0; j<stringArray.length-i-2; j++) {
      if (stringArray[j] == undefined || stringArray[j+1] == undefined){
        //do nothing (this is not a max)
      } else if (stringArray[j][0].toLowerCase().charCodeAt(0) > stringArray[j+1][0].toLowerCase().charCodeAt(0)) {
        max = j+1;
      }
    }
    let temp = stringArray[-1];
    stringArray[-1] = stringArray[max];
    stringArray[max] = temp;
  }
  return stringArray;
}

/**
 * Searches every element of a string array for the given string using LINEAR SEARCH.
 * @param { Array<string> } stringArray - Array of strings in which to perform search
 * @param { string } searchString - String to search for in array
 * @returns { number } - Returns index of array in which searchString is located, or returns -1 if it is not located in the array
 */
export function linearSearch( stringArray: Array<string>, searchString: string ) {
  for (let i=0; i<stringArray.length; i++) {
    //NOTE: USES STARTSWITH() BECAUSE stringArray[i] == searchString IS NOT USEFUL FOR ANY FUNCTIONS OF THIS PARTICULAR WEB APP
    // A PROPER LINEAR SEARCH WOULD UTILIZE if(stringArray[i] == searchString)
    if (stringArray[i] == searchString) {
      return i;
    }
  }
  return -1;
}

/**
 * Searches every element of an alpha-ordered string array for the given string using BINARY SEARCH.
 * @param { Array<string> } stringArray - Array of strings in which to perform search
 * @param { string } searchString - String to search for in array
 * @returns { number } - Returns index of array in which searchString is located, or returns -1 if it is not located in the array
 */
export function binarySearch( stringArray: Array<string>, searchString: string ) {
  //Get ASCII decimal value of first character in searchString
  let searchValue = searchString[0].toLowerCase().charCodeAt(0);
  let high = stringArray.length-1;
  let low = 0;
  while (low<=high) {
    let midPoint = Math.round((high + low) / 2)
    if (stringArray[midPoint][0].toLowerCase().charCodeAt(0) < searchValue) {
      low = midPoint + 1;
    } else if (stringArray[midPoint][0].toLowerCase().charCodeAt(0) > searchValue) {
      high = midPoint-1;
    } else {
      return midPoint;
    }
  }
  return -1
}
