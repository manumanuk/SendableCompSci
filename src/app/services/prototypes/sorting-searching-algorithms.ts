// str1.localeCompare(str2) compares the alpha order of two strings.
// If str1 comes first in alpha order, localeCompare returns -1
// If str2 comes first in alpha order, localeCompare returns 1.
// If str==str2, localeCompare returns 0

/**
 * Sorts an array of strings using BUBBLE SORT.
 * @param { Array<string> } stringArray - Array of strings to be sorted
 * @returns { Array<string> } - Returns the sorted string array
 */
export function bubbleSort( stringArray: Array<string> ) {
  for (let k=0; k<stringArray.length-1;k++) {
    for (let i=0; i<stringArray.length-k-1; i++) {
      let temp = '';
      if (stringArray[i] == undefined || stringArray[i+1] == undefined) {
        //do nothing (this is not a max)
      } else if (stringArray[i].localeCompare(stringArray[i+1]) == 1) {
        temp = stringArray[i];
        stringArray[i] = stringArray[i+1];
        stringArray[i+1] = temp;
      }
    }
  }
  return stringArray;
}

/**
 * Sorts an array of strings using SELECTION SORT.
 * @param { Array<string> } stringArray - Array of strings to be sorted
 * @returns { Array<string> } - Returns the sorted string array
 */
export function selectionSort( stringArray: Array<string> ) {
  let max:number;
  for (let i = 0; i<stringArray.length-2; i++) {
    max = 0;
    for (let j=0; j<stringArray.length-i-2; j++) {
      if (stringArray[j] == undefined || stringArray[j+1] == undefined){
        //do nothing (this is not a max)
      } else if (stringArray[j].localeCompare(stringArray[j+1]) == 1) {
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
  let high = stringArray.length-1;
  let low = 0;
  while (low<=high) {
    let midPoint = Math.round((high + low) / 2)
    if (stringArray[midPoint] == undefined) {
      low = midPoint + 1;
    } if (stringArray[midPoint].localeCompare(searchString) == -1) {
      low = midPoint + 1;
    } else if (stringArray[midPoint].localeCompare(searchString) == 1) {
      high = midPoint-1;
    } else {
      return midPoint;
    }
  }
  return -1
}

/**
 * COMPUTATIONAL COMPLEXITY ANALYSIS
 * RUNTIMES TO BE ADDED LATER (CURRENTLY RUNNING)
 * ----------------------------
 * BUBBLE SORT
 * Runtime: 3169338.41 ms (52 minutes)
 * The bubbleSort() function takes in a list of length n, and cycles through n in the first cycle,
 * then n-1, then n-2, and so on until n-n. It makes  This can be represented with n + (n-1) + (n-2) + (n-3) + ... + (n-n)
 * This can be rewritten as (n + n + n + n ... + n) - (1 + 2 + 3 + ... + n), which can be roughly simplified to n^2.
 * Therefore, the computational complexity of bubbleSort() should be O(n^2) comparisons. Swaps of values occur a maximum of n times per loop, therefore the swaps
 * have a computational complexity of O(n^2) as well. The algorithm I created uses the .localeCompare() built-in function,
 * which compares two strings and returns an integer indicating which one comes first in alphanumeric order (see top of this file).
 * The bubbleSort() function checks two adjacent elements in an array, and swaps their order if the larger one (the one that comes second in alpha order)
 * is on the left. This continues until the string which would come last in alpha order is indeed at the end. This process is continued again, placing the
 * string which would come second-last in alpha order in its place, until all strings have been ordered correctly.
 *
 * SELECTION SORT
 * Runtime: 3174806.23 ms (52 minutes)
 * The selectionSort() function takes in a list of length n, and cycles through n in the first cycle, then n-1, then n-2, similar to bubble sort. Its iterations
 * can similarly be represented with (n + n + n + n + ... + n) - (1 + 2 + 3 + ... + n), which can be roughly simplified to n^2. Therefore, the computational
 * complexity in terms of comparisons for selection sort is also O(n^2). However, swaps occur such that only one swap occurs for every iteration of the array,
 * making the swaps computational complexity equivalent to only O(n). The empircal data supports the estimation that both bubble sort and selection sort have similar
 * search times.
 *
 * BUILT-IN SORT
 * Runtime: 256.825 ms
 * Depending on the browser, Javascript uses different sorting algorithms. Generally, however, merge sort is the most commonly used option.
 * Merge sort uses a divide and conquer, method, where the given array is split into half multiple times, and then each subarray is sorted
 * and reassembled. The computational complexity of this operation is known to be O(nlogn), which is significantly faster than bubble sort or
 * selection sort for sorts of almost every size, but its effects are particularly noticeable when the array is of huge sizes, as in this example.
 * Here, the built-in sort is able to complete the tasks in a matter of milliseconds, while the algorithms I have created take minutes to hours.
 *
 * LINEAR SEARCH
 * Runtime: 0.125 ms
 * Linear search has a maximum complexity of O(n), when it searches through all items in an array. In this case, the value being searched for ("From:")
 * was relatively close to the beginning of the array, so the linear search was incredibly quick. Linear search algorithms simply compare the desired value
 * to each value in an array. For a word that did not exist in the array, the algorithm took 2.59 ms.
 *
 * BINARY SEARCH
 * Runtime independent: 0.76 ms
 * Runtime with Bubble Sort: 3169339.17 ms (52 minutes)
 * A binary search algorithm is one in which the program looks at the middle element in a sorted array, and checks whether the given string/number is of a higher
 * or lower value. If it is higher, the bottom half of the array is cut off. If it is lower, the top half of the array is cut off. The cut array is then searched
 * in a similar fashion, and the array is continuously cut in halves until the value is either found or not found. This has a complexity of O(logn). In comparison
 * to a regular search, this is quite clearly a faster option if compared side by side with linear search. However, when the sorting is taken into account, using the
 * in-built sort function with complexity O(nlogn) would produce a complexity of O(nlogn), which is slower than linear search (complexity O(n)). Meanwhile, using a
 * bubble sort makes the binary search even slower, with a combined complexity of O(n^2*logn). As such, it is generally faster to use linear search unless data is
 * already sorted. This can be seen in the data above, where, although the binary search on its own may seem to be quite fast, it is much slower than linear search when
 * taken into consideration with the sorting speed. Even with the built-in sort function, the total time taken is well over 250 ms, compared to the maximum search time
 * of a linear search, which took 2.59 ms.
 */


 /**
  * YOUTUBE VIDEO ANALYSIS
  * 1. The searches with thin bars and those with thick bars seem to complete over approximately the same time frames, but since the ones with thin bars represent
  * more data, this means that those with thin bars are algorithms that are generally faster. These algorithms seem to use techniques where the dataset is divided
  * into parts and then rearranged, as opposed to the thicker bar algorithms which tend to scan th entire dataset multiple times, and build the sorted array from one
  * end to the other.
  * 2. This video is very helpful for showing the general techniques that algorithms use to sort data, and proving which are more effective. For instance, as one can
  * observe, the divide and conquer type algorithms seem to complete their tasks the fastest. Visualization of these algorithms can be an important tool in understanding
  * their sorting processes better, and weighing one against another.
  * 3. For an individual who does not understand clearly what each of the bars represent, some of these algorithms may seem to be equally fast, whereas they are not in reality.
  * For instance, the bubble sort algorithm visualization uses a small dataset with thick bars, and thus completes its task in the same amount of time as the others that are
  * shown. But this only seems to be so because there is fewer data to deal with, and showing the entirety of the bubble sort algorithm with a much larger dataset would be tedious.
  * As such, the dataset size can easily skew interpretations. Additionally, the speed at which the visualization is run is another factor that can change one's perception
  * of how fast each algorithm sorts. Sped up visualizations can make it seem as thought they are as fast as slower ones. In reality, this visualization is really only useful for
  * picturing HOW algorithms sort, and which types (divide and conquer vs linear) tend to be more effective.
  */
