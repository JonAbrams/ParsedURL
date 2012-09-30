# ParsedURL

A simple JavaScript class/library for parsing/manipulating http URL's.

It's especially helpful when you want to easily change a URL's components such as its parameters, hostname, or path while leaving the rest of it intact.

# How to use it

Just include download and include parsedURL.js with your web page:

    <script src="/js/parsedURL.js"></script>

Then when you have a URL you need to parse just create a new ParsedURL object:

    var url = "https://a.complex-url.com:8080/users/jon/messages?q=cake&when=recent#searchbox"";
    var purl = new ParsedURL(url);

### Getting the URL string

You can always get the URL back as a string by asking for it:

    var url = purl.toString();
    // newUrl is now "https://a.complex-url.com:8080/users/jon/messages?q=cake&when=recent#searchbox"
    
or by using type coercion:

    var newUrl = "" + purl;
    // newUrl is now "https://a.complex-url.com:8080/users/jon/messages?q=cake&when=recent#searchbox"

### Hostname and scheme/protocol

If you need the hostname, get it:

    var hostname = purl.hostname;

Or the scheme/protocol:

    var scheme = purl.scheme;

If you want to change the hostname (or scheme), just set it:

    purl.hostname = "a.different-url.com";

### Port

You can get/set the port as you would the hostname, but not that it will be a number, not a string.

For example:

    console.log(purl.toString());
    purl.port++;
    console.log(purl.toString());

Outputs:

    https://a.complex-url.com:8080/users/jon/messages?q=pie&when=recent#searchbox
    
    https://a.complex-url.com:8081/users/jon/messages?q=pie&when=recent#searchbox

### URL path

The URL's path can be be accesseded or changed the same way you would the hostname:

    var path = purl.path;
    console.log(path);
    purl.path = path.replace("jon", "time");
    console.log(purl.toString());

Outputs:

    /users/jon/messages
    https://a.complex-url.com:8080/users/tim/messages?q=cake&when=recent#searchbox

If you want to get the path parsed into an array:

    var pathDirectories = purl.parsedPath();
    for (var i = 0; i < pathDirectories.length; i++) {
      console.log(pathDirectories[i]);
    }

Outputs:

    users
    tim
    messages

### URL parameters

All of the URL's parameters are parsed and placed into the params attribute as an object literal.

For example:

    // Print out all URL parameters + values
    for (var paramName in purl.params) {
      console.log(paramName + " = " + purl.params[paramName]);
    }
    
    // Change the q parameter from "cake" to "pie"
    purl.params.q = "pie";
    console.log(purl.toString())
 
Prints out:

    q = cake
    when = recent
    https://a.complex-url.com:8080/users/jon/messages?q=pie&when=recent#searchbox
    
### Hash

You can get/set the way you would guess by now:

    var hash = purl.hash;
    console.log(hash);

Outputs:

    searchbox

## Some tests

[Here's a jsbin](http://jsbin.com/anabuy/12/edit) using Angluar.js to ouput the components from a bunch of URL's.

## License

Use it for anything you want, as long as it is for good and not evil.

## Credit

Created by [Jon Abrams](http://about.me/JonAbrams) - [Twitter](http://twitter.com/JonathanAbrams) - [Github](http://github.com/JonAbrams)