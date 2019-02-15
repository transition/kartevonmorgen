const Logger = {
  error: (...details) => {
    console.error(...details);
  },
  log: (...details) => {
    if (__DEVELOPMENT__) {
      console.log(...details);
    }
  },
  warn: (...details) => {
    if (__DEVELOPMENT__) {
      console.warn(...details);
    }
  }
}

export default Logger;