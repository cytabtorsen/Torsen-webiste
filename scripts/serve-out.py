#!/usr/bin/env python3
"""Range-capable static server for the exported site — for the local booth demo.

    python3 scripts/serve-out.py [port]   # serves ./out on 127.0.0.1:8753

Unlike `python -m http.server`, this advertises Accept-Ranges and honours byte-range
requests, so the /case incident clip is seekable (scrub-to-frame works offline, same
as GitHub Pages). No third-party install, no network needed.
"""
import sys, os
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

class RangeHandler(SimpleHTTPRequestHandler):
    # HTTP/1.1 so Chromium negotiates ranges up front (keep-alive) instead of
    # aborting a full download to seek — that abort is what logs a spurious
    # ERR_CONTENT_LENGTH_MISMATCH on the clip.
    protocol_version = "HTTP/1.1"

    def send_head(self):
        rng = self.headers.get("Range")
        if not rng:
            resp = super().send_head()
            return resp
        path = self.translate_path(self.path)
        try:
            f = open(path, "rb")
        except OSError:
            self.send_error(404); return None
        size = os.fstat(f.fileno()).st_size
        try:
            unit, _, rangespec = rng.partition("=")
            start_s, _, end_s = rangespec.partition("-")
            start = int(start_s) if start_s else 0
            end = int(end_s) if end_s else size - 1
            end = min(end, size - 1)
            if unit.strip() != "bytes" or start > end:
                raise ValueError
        except ValueError:
            f.close(); self.send_error(416); return None
        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.send_header("Content-Length", str(end - start + 1))
        self.end_headers()
        f.seek(start)
        self._range = (f, end - start + 1)
        return None

    def copyfile(self, source, outputfile):
        rng = getattr(self, "_range", None)
        if not rng:
            return super().copyfile(source, outputfile)
        f, remaining = rng
        while remaining > 0:
            chunk = f.read(min(64 * 1024, remaining))
            if not chunk: break
            outputfile.write(chunk); remaining -= len(chunk)
        f.close()

    def end_headers(self):
        if self.headers.get("Range") is None:
            self.send_header("Accept-Ranges", "bytes")
        super().end_headers()

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8753
    root = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "out")
    os.chdir(root)
    print(f"serving {root} on http://127.0.0.1:{port} (range-capable)")
    ThreadingHTTPServer(("127.0.0.1", port), partial(RangeHandler)).serve_forever()
