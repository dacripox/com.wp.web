let getRandom = (arrayList, sumOfWeights) => {
  var random = Math.floor(Math.random() * (sumOfWeights + 1));

  return function (arrayList) {
    random -= arrayList.weight;
    return random <= 0;
  };
}



module.exports = {


  /**
   * weightedListRandomAlgorithm.js
   *
   * @description :: Server-side logic for managing promotions.
   */
  getFirstNElements: (numElements, arrayList) => {
    selectedElements = {};

    sumOfWeights = arrayList.reduce(function (memo, item) {
      return memo + item.weight;
    }, 0);

    for (var i = 0; i < numElements; i++) {
      let item = getRandom(arrayList, sumOfWeights);
      selectedElements.push(item);
    }
 return selectedElements;
  }

}