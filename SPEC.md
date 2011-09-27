This specification aims to formalize the Strata protocol for building web applications.
Use the strata.lint middleware to catch common mistakes.

# Applications

A Strata application is a function that takes exactly two arguments: the
*environment* and a *callback*.

## The Environment

The environment is a JavaScript object that contains CGI-like properties.
The application is free to modify its environment but it should prefix its
property names to avoid collisions with other middleware.

#### Mandatory Properties

These properties must always be present in the environment and, except where
indicated, must be a non-emtpy String.

  - **protocol**      The protocol used in the request (i.e. "http:" or
                      "https:"). This variable may never be an empty string and
                      is always required.
  - **protocolVersion** The version of the protocol used in the request (i.e. '1.1').
                      This variable may never be an empty string and is always
                      required.
  - **requestMethod** The request method (e.g. "GET" or "POST"). This cannot
                      ever be an empty string, and is always required.
  - **requestTime**   A Date that indicates the time the request was received.
  - **serverName**    The address returned by the Net module's
                      [server.address()](http://nodejs.org/docs/latest/api/net.html#server.address)
                      call.  If httpHost is present, it should be used in
                      preference to serverName.
  - **serverPort**    A String that specifies the TCP port that received this
                      request.  serverName, serverPort, scriptName and pathInfo
                      may be used to reconstruct the original request URL.
  - **scriptName**    The initial portion of the request URL's "path" that
                      corresponds to the application, so that it knows its
                      virtual "location". This may be an empty string, if the
                      application corresponds to the "root" of the server.
  - **pathInfo**      The remainder of the request URL's "path", designating
                      the virtual "location" of the target resource within the
                      application. This may be an empty string if the request
                      URL targets the root of the application and does not
                      have a trailing slash. This value may be percent-encoded
                      when originating from a URL.
  - **queryString**   The portion of the request URL that follows the "?", if
                      any. May be an empty string, but is always required.
  - **http\***        Variables corresponding to the client-supplied HTTP
                      request headers (i.e. variables whose names begin with
                      "http"). The presence or absence of these variables should
                      correspond with the presence or absence of the
                      appropriate HTTP header in the request. The remainder of
                      the property name will be the camel-cased version of the
                      original header name (e.g. "httpAccept" and
                      "httpUserAgent").

#### Mandatory Strata Properties

The prefix "strata" is reserved for use within the Strata core distribution.

  - **input**           A readable Stream of data contained in the request body
  - **error**           A writable Stream for error output
  - **session**         An object containing session data
  - **strataVersion**   The current version of Strata as [major, minor, patch]

#### Optional Properties

These properties are likely to be found in a Strata environment (depending
on your web client).
Note that httpContentType and httpContentLength must never be included in
the environment.  Use contentType and contentLength instead.

  - **contentType**     The Content-Type header, specifies the type
                        of the request body or '' if the body is empty.
  - **contentLength**   The Content-Length header, a String containing
                        an integer value, '0' if the request body is empty.
  - **httpHost**        The Host header, i.e. 'localhost:1982'
  - **httpAccept**      The content types that the browser will accept,
                        i.e. 'text/html,application/xhtml+xml,application/xml'
  - **httpUserAgent**   The User-Agent header.

#### Invariants

The environment must always adhere to the following restrictions.

  - **protocol**         must be either "http:" or "https:"
  - **requestMethod**    must be a valid HTTP verb as an uppercase String
  - **requestTime**      must be a Date
  - **scriptName**       and pathInfo, if not empty, should start with a "/"
  - **scriptName**       should never be "/" but instead be empty
  - **pathInfo**         should be "/" if scriptName is empty
  - **contentLength**    if given, must be a JavaScript string that consists of only digits.
  - **input**            must be a readable Stream
  - **error**            must be a writable Stream
  - **strataVersion**    must be an array of integers

## The Callback

The callback is used to issue a response to the client and must be called with
exactly three arguments: the response *status*, HTTP *headers*, and *body*.

### The Status

The status must be an HTTP status code as a Number.

### The Headers

The headers must be an object whose properties are the names of HTTP headers in
their canonical form (i.e. "Content-Type" instead of "content-type"). Header
names may contain only letters, digits, "-", and "_" and must start with a
letter and must not end with a "-" or "_". If more than one value for a header
is required, the value for that property must be an array.

There must be a Content-Type header, except for when the status is 1xx, 204, or
304, in which case there must be none given.

There must not be a Content-Length header when the status is 1xx, 204, or 304,
or it must be "0".

### The Body

The body must be either a string or a readable Stream. If it is a Stream, the
response will be pumped through to the client.

# Credits

Some parts of this specification are adopted from
[PEP333: Python Web Server Gateway Interface v1.0](http://www.python.org/dev/peps/pep-0333/) and the
[Rack specification](http://rack.rubyforge.org/doc/files/SPEC.html).
