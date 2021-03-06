const Callable = require("./utils/callable.js");
const pkg = require("../package.json");
const Request = require("./LadybugRequest.js");
const { mergeObjects } = require("./utils/utils.js");
const { validateMethod } = require("./utils/validators.js");
const RequestBase = require("./RequestBase");

/**
 * The base instance class
 * a global instance of this is also exported with default options.
 * you may use {@link create} to create an instance of this with more options
 * @constructor
 * @extends {Callable}
 */
class Ladybug extends Callable {
  constructor(options = {}) {
    if(!validateMethod(options.method || "get")) throw new Error("Invalid Request Method, expected one of (`get`, `put`, `post`, `patch`, `delete`)");
    super((options.method || "get").toLowerCase());
    this.headers = {};
    this._query = {};
    this.data = null;
    this.plugins = new Set();
    this.baseURL = options.baseURL;
  }

  request(method, url, options = {}) {
    if(!validateMethod(method)) throw new Error("Invalid Request Method expected one of (`get`, `put`, `post`, `patch`, `delete`)");
    if(typeof url === "object") options = url;
    else options.url = url;
    options.method = method;
    return new Request(mergeObjects({
      headers: this.headers,
      query: this._query,
      plugins: this.plugins,
      baseURL: this.baseURL,
      status: this.validateStatus,
      promise: this.promiseLibrary
    }, options));
  }

  get(...args) {
    return this.request("get", ...args);
  }

  post(...args) {
    return this.request("post", ...args);
  }

  put(...args) {
    return this.request("put", ...args);
  }

  patch(...args) {
    return this.request("patch", ...args);
  }

  delete(...args) {
    return this.request("delete", ...args);
  }

  static create(options = {}) {
    return new Ladybug(mergeObjects({
      headers: { "User-Agent": `ladybug-fetch/${pkg.version}` }
    }, options));
  }
}

// A workaround for extending two classes.
RequestBase.applyTo(Ladybug);


module.exports = Ladybug;
