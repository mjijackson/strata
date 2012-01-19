var util = require("util"),
    BufferedStream = require("bufferedstream");

try {
    // This shim is for node < 0.6 only. gzbz2 is not in the dependecies, as
    // it can't be installed on node >= 0.6. Instead we have this workaround
    // until strata will lift it's engine dependency.
    Gzip = require("gzbz2").Gzip;
} catch (e) {
    throw new Error("Required module gzbz2 not found.\n" +
                    "Please, upgrade your node to the latest stable to have " +
                    "built-in Zlib module, or install `gzbz2` manually with " +
                    "`npm install gzbz2`");
}

exports.createGzip = createGzip;
exports.GzipStream = GzipStream;

function createGzip(options) {
    // Ignore options. Those are for node 0.6 zlib API.
    return new GzipStream;
}

/**
 * A small wrapper class for response bodies that gzip's the data on the way
 * through.
 */
function GzipStream(source, encoding) {
    this._gzip = new Gzip;
    this._gzip.init();

    BufferedStream.call(this, source, encoding);
}

util.inherits(GzipStream, BufferedStream);

GzipStream.prototype.write = function write(chunk) {
    return BufferedStream.prototype.write.call(this, this._gzip.deflate(chunk));
}

GzipStream.prototype.end = function end(chunk, encoding) {
    if (arguments.length > 0) {
        this.write(chunk, encoding);
    }

    BufferedStream.prototype.write.call(this, this._gzip.end());
    BufferedStream.prototype.end.call(this);
}
