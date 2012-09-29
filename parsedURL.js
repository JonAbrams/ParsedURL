/*
 * Created by Jon Abrams
 * http://github.com/JonAbrams/parsedURL
 */
var ParsedURL = function (url) {
  var remaining; // The remainder of the url to be parsed
  var hostname;
  var i, paramArray, paramSplit;
  
  if (!url) {
    if (location) {
      url = location.href;
    } else {
      return;
    }
  }
  
  remaining = url;
  
  this.scheme = remaining.match(/^https?:\/\//);
  if (this.scheme) {
    this.scheme = this.scheme[0].replace("://", "");
      remaining = remaining.replace(this.scheme + "://", "");
  } else {
    this.scheme = "";
    return;
  }
  
  hostname = remaining.replace(/[:?\/].*/, "").toLowerCase();
  if (!hostname || hostname.length > 25 || hostname.match(/[^\-.a-z0-9]+/)) {
    return;
  }
  
  this.subdomains = hostname.split(".");
  if (this.subdomains.length < 2) {
    this.valid = false;
    return;
  }
  
  remaining = remaining.replace(hostname, "");
  this.port = remaining.match(/^:\d+/) || "";
  if (this.port) {
    this.port = parseInt(this.port[0].slice(1), 10);
    remaining = remaining.replace(":"+this.port, "");
  }
  
  this.path = remaining;
  if (this.path) {
    this.hash = this.path.match(/#.+/) || "";
    if (this.hash) {
      this.hash = this.hash[0];
      this.path = this.path.replace(this.hash, "");
      this.hash = decodeURIComponent(this.hash.replace("#", ""));
    }
    
    this.params = this.path.match(/\?.+/);
    this.params = (this.params) ? this.params[0].replace("?", "") : "";

    if (this.params) {
      this.path = this.path.replace("?" + this.params, "");
    
      paramArray = this.params.split("&");
      this.params = {};
      for (i = 0; i < paramArray.length; i++) {
        if (paramArray[i]) {
          paramSplit = paramArray[i].split("=");
        
          this.params[paramSplit[0]] = paramSplit[1] || "";
          this.params[paramSplit[0]] = decodeURIComponent(this.params[paramSplit[0]].replace("+", " "));
        }
      }
    } else {
      this.params = {};
    }
  } else {
    this.hash = "";
    this.params = {};
  }
    
  this.valid = true;
};
  
ParsedURL.prototype.getHostname = function () {
  var hostname = "";
  var numSubdomains;
  var i;
  
  if (this.subdomains) {
    numSubdomains = this.subdomains.length;
    for (i = 0; i < numSubdomains; i++) {
      hostname += this.subdomains[i];
      if (i < numSubdomains - 1) {
        hostname += ".";
      }
    }
  }
  
  return hostname;
};

ParsedURL.prototype.parsedPath = function () {
  var pathList, i;
  var toBeRemoved = [];
  
  if (this.path) {
    pathList = this.path.split("/");
    for (i = 0; i < pathList.length; i++) {
      if (pathList[i] === "") {
        toBeRemoved.push(i);
      }
    }
    for (i = toBeRemoved.length - 1; i >= 0; i--) {
      pathList.splice(toBeRemoved[i], 1);
    }
  }
  
  return pathList || [];
};

ParsedURL.prototype.isValid = function () {
  return this.scheme && this.subdomains && this.subdomains.length > 0;
};

ParsedURL.prototype.toString = function () {
  var paramKey;
  var url = this.scheme + "://";
  
  if (!this.isValid()) {
    return "invalid url";
  }
  
  url += this.getHostname();
  
  if (this.port) {
    url += ":" + this.port;
  }
  
  url += this.path;
  if (this.params) {
    url += "?";
    for (paramKey in this.params) {
      url += paramKey + "=";
      url += encodeURIComponent(this.params[paramKey]);
      url += "&";
    }
    url = url.slice(0, url.length - 1);
  }
  
  if (this.hash) {
    url += "#" + encodeURIComponent(this.hash);
  }
  return url;
};
