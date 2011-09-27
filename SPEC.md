This specification aims to formalize the Strata protocol for building web
applications using the node.js JavaScript platform. You can (and should) use
the strata.lint middleware to enforce it. When you develop middleware, be sure
to add a strata.lint before and after to catch all mistakes.

# Applications

A Strata application is a function that takes exactly two arguments: the
*environment* and a *callback*.

## The Environment

The environment is an object that contains CGI-like properties. It must include
the following:

  - protocol          The protocol used in the request (i.e. "http:" or
                      "https:"). This variable may never be an empty string and
                      is always required.
  - protocolVersion   The version of the protocol used in the request. This
                      variable may never be an empty string and is always
                      required.
  - requestMethod     The request method (e.g. "GET" or "POST"). This cannot
                      ever be an empty string, and is always required.
  - requestTime       A Date that indicates the time the request was received.
  - serverName,       When combined with scriptName and pathInfo these
    serverPort        variables may be used to reconstruct the original
                      request URL. Note, however, that if httpHost is present,
                      it should be used in preference to serverName. These
                      variables can never be empty strings, and are always
                      required.
  - scriptName        The initial portion of the request URL's "path" that
                      corresponds to the application, so that it knows its
                      virtual "location". This may be an empty string, if the
                      application corresponds to the "root" of the server.
  - pathInfo          The remainder of the request URL's "path", designating
                      the virtual "location" of the target resource within the
                      application. This may be an empty string if the request
                      URL targets the root of the application and does not
                      have a trailing slash. This value may be percent-encoded
                      when originating from a URL.
  - queryString       The portion of the request URL that follows the "?", if
                      any. May be an empty string, but is always required.
  - http*             Variables corresponding to the client-supplied HTTP
                      request headers (i.e. variables whose names begin with
                      "http"). The presence or absence of these variables should
                      correspond with the presence or absence of the
                      appropriate HTTP header in the request. The remainder of
                      the property name will be the camel-cased version of the
                      original header name (e.g. "httpAccept" and
                      "httpUserAgent").

The environment must not contain the properties httpContentType or
httpContentLength (use contentType and contentLength instead).

In addition to these, the environment may include the following Strata-specific
properties:

  - input           A readable Stream of data contained in the request body
  - error           A writable Stream for error output
  - session         An object containing session data
  - strataVersion   The current version of Strata as [major, minor, patch]

There are the following restrictions:

  - protocol must be either "http:" or "https:"
  - requestMethod must be a valid HTTP verb as an uppercase String
  - requestTime must be a Date
  - scriptName and pathInfo, if not empty, should start with a "/"
  - scriptName should never be "/" but instead be empty
  - pathInfo should be "/" if scriptName is empty
  - contentLength, if given, must consist of digits only
  - input must be a readable Stream
  - error must be a writable Stream
  - strataVersion must be an array of integers

The application is free to modify the environment. Property names must be
prefixed uniquely. The prefix "strata" is reserved for use within the Strata
core distribution and other accepted specifications and is not available for
use elsewhere.

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

Some parts of this specification are adopted from PEP333: Python Web Server
Gateway Interface v1.0 (http://www.python.org/dev/peps/pep-0333/) and the Rack
specification (http://rack.rubyforge.org/doc/files/SPEC.html).
