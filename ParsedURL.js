/*
 * Created by Jon Abrams
 * http://github.com/JonAbrams/parsedURL
 */
var ParsedURL = function (url) {
  var remaining; // The remainder of the url to be parsed
  var hostname;
  var i;
  var hashMatch, schemeMatch;
  var paramArray, paramSplit, paramMatches, paramsString;
  
  if (!url) {
    if (location) {
      url = location.href;
    } else {
      return;
    }
  }
  
  remaining = url;
  
  schemeMatch = remaining.match(/^https?:\/\//);
  if (schemeMatch) {
    this.scheme = schemeMatch[0].replace("://", "");
      remaining = remaining.replace(this.scheme + "://", "");
  } else {
    return;
  }
  
  this.hostname = remaining.replace(/[:?\/].*/, "").toLowerCase();
  if (!this.hostname || this.hostname.length > 25 || this.hostname.match(/[^\-.a-z0-9]+/)) {
    return;
  }
  
  remaining = remaining.replace(this.hostname, "");
  this.port = remaining.match(/^:\d+/) || "";
  if (this.port) {
    this.port = parseInt(this.port[0].slice(1), 10);
    remaining = remaining.replace(":"+this.port, "");
  }
  
  this.path = remaining;
  if (this.path) {
    hashMatch = this.path.match(/#.+/) || "";
    if (hashMatch) {
      this.hash = hashMatch[0];
      this.path = this.path.replace(this.hash, "");
      this.hash = decodeURIComponent(this.hash.replace("#", ""));
    }
    
    paramMatch = this.path.match(/\?.*/);
    paramsString = (paramMatch) ? paramMatch[0].replace("?", "") : "";

    if (paramsString) {
      this.path = this.path.replace("?" + paramsString, "");
    
      paramArray = paramsString.split("&");
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

ParsedURL.prototype.getSubdomains = function () {
  var subdomains = this.hostname.split(".");
  return subdomains;
};

ParsedURL.prototype.isValid = function () {
  return Boolean(this.scheme && this.hostname);
};

ParsedURL.prototype.toString = function () {
  var paramKey;
  var url = this.scheme + "://";
  
  if (!this.isValid()) {
    return "invalid url";
  }
  
  url += this.hostname;
  
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
