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
  return (data) =>
    data.filter((item) => {
      let arr = item[column];

      // Languages could typically be an array, so we iterate through to find label
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === str['label']) {
          return true;
        }
      }

      return false;
    });
};

const createValueFilter = (column, value) => {
  return (data) =>
    data.filter((item) => {
      return item[column] === value;
    });
};

const createContainsFilter = (column, str) => {
  return (data) =>
    data.filter((item) => {
      let arr = item[column];
      return arr.includes(str);
    });
};

export {
  createRangeFilter,
  createFilterComponentFilter,
  createValueFilter,
  createContainsFilter,
};
