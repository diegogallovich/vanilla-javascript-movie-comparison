// helper functions
const debounce = (func, delay = 200) => {
  let timeout;
  return (...args) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

const getYear = (date) => {
  const year = new Date(date).getFullYear();
  return year;
};
