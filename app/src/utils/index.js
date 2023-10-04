// creates a filter for a range of numbers
const createRangeFilter = (column, lo, hi) => {
  return (data) =>
    data.filter((item) => {
      const val = Number(item[column]);
      return lo <= val && val <= hi;
    });
};

export { createRangeFilter };
