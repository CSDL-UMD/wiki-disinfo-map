// creates a filter for a range of numbers
const createRangeFilter = (column, lo, hi) => {
  return (data) =>
    data.filter((item) => {
      const val = Number(item[column]);
      return lo <= val && val <= hi;
    });
};

// creates a filter for a filter component
const createFilterComponentFilter = (column, str) => {
  return (data) => data.filter((item) => {
      let arr = item[column]

      // Languages could typically be an array, so we iterate through to find label
      if (column === "Languages") {
        for (let i = 0 ; i < arr.length; i++) {
          if (arr[i] === str['label']) {
            return true;
          }
        }

        return false
      } else {
        const val = String(item[column]);   
        return val === str['label'];
      }
    })
};


export { createRangeFilter, createFilterComponentFilter };
