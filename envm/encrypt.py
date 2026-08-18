#!/usr/bin/env python3
"""Encrypt the ENVM timetable into a GitHub Pages–compatible password gate.

Usage:
  python3 envm/encrypt.py --password 'your-phrase'
  python3 envm/encrypt.py --password 'your-phrase' --dry-run
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import sys
from datetime import datetime
from pathlib import Path

from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

ITERATIONS = 210_000
SALT_LEN = 16
IV_LEN = 12
KEY_LEN = 32

HERE = Path(__file__).resolve().parent
PLAIN_PATH = HERE / "~noupload" / "index.html"
OUT_PATH = HERE / "index.html"


def log(msg: str) -> None:
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {msg}", flush=True)


def b64(data: bytes) -> str:
    return base64.b64encode(data).decode("ascii")


def encrypt(plaintext: bytes, password: str) -> dict:
    salt = os.urandom(SALT_LEN)
    iv = os.urandom(IV_LEN)
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=KEY_LEN,
        salt=salt,
        iterations=ITERATIONS,
    )
    key = kdf.derive(password.encode("utf-8"))
    ciphertext = AESGCM(key).encrypt(iv, plaintext, None)
    return {
        "v": 1,
        "kdf": "PBKDF2",
        "hash": "SHA-256",
        "iter": ITERATIONS,
        "salt": b64(salt),
        "iv": b64(iv),
        "ct": b64(ciphertext),
    }


GATE_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>HKU ENVM 2026–27 · Access</title>
<meta name="robots" content="noindex, nofollow" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,650&family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet" />
<style>
:root {
  --paper: #f3efe4;
  --ink: #1b2118;
  --muted: #9aa394;
  --green: #247a4d;
  --danger: #f0a3b5;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; }
body {
  font-family: Figtree, system-ui, sans-serif;
  background: var(--ink);
  color: var(--paper);
  display: grid;
  place-items: center;
  padding: 24px;
}
h1 { font-family: Fraunces, Georgia, serif; font-weight: 650; font-size: clamp(28px, 5vw, 42px); line-height: 1.15; margin: 12px 0 10px; }
.kicker { letter-spacing: .12em; text-transform: uppercase; font-size: 12px; color: #9dcead; }
.lead { color: #d5ddd0; max-width: 420px; font-size: 15px; line-height: 1.5; }
.card { width: min(440px, 100%); }
form { display: flex; gap: 8px; margin-top: 28px; }
input[type="password"] {
  flex: 1; min-width: 0;
  border: 1px solid #3a4434; background: #2a3226; color: var(--paper);
  border-radius: 12px; padding: 14px 16px; font: inherit; font-size: 16px;
}
input[type="password"]:focus { outline: 2px solid var(--green); border-color: var(--green); }
button {
  border: 0; border-radius: 12px; background: var(--green); color: #fff;
  padding: 14px 18px; font: inherit; font-weight: 700; cursor: pointer; white-space: nowrap;
}
button:disabled { opacity: .55; cursor: wait; }
.fine { margin-top: 18px; font-size: 12px; color: var(--muted); }
.err { margin-top: 12px; color: var(--danger); font-size: 13px; font-weight: 600; min-height: 1.2em; }
.shake { animation: shake .35s ease; }
@keyframes shake {
  0%,100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}
</style>
</head>
<body>
<div class="card" id="card">
  <p class="kicker">The University of Hong Kong</p>
  <h1>MSc Environmental Management<br>2026–27 timetable</h1>
  <p class="lead">This planner is restricted to invited classmates. Enter the access phrase you were given.</p>
  <form id="gate" autocomplete="off">
    <input id="pw" type="password" name="password" autocomplete="current-password" placeholder="Access phrase" autofocus required />
    <button type="submit" id="go">Unlock</button>
  </form>
  <p class="err" id="err"></p>
  <p class="fine">Content is encrypted in the browser. Without the phrase the timetable cannot be read.</p>
</div>
<script type="application/json" id="payload">__PAYLOAD__</script>
<script>
const SESSION_KEY = "envm-unlocked-html";
const enc = new TextEncoder();
const dec = new TextDecoder();

function b64(s) {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function deriveKey(password, salt, iter) {
  const material = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: iter, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );
}

async function decryptWith(password, payload) {
  const key = await deriveKey(password, b64(payload.salt), payload.iter);
  const pt = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: b64(payload.iv) },
    key,
    b64(payload.ct)
  );
  return dec.decode(pt);
}

function show(html) {
  document.open();
  document.write(html);
  document.close();
}

const cached = sessionStorage.getItem(SESSION_KEY);
if (cached) {
  show(cached);
} else {
  const payload = JSON.parse(document.getElementById("payload").textContent);
  const form = document.getElementById("gate");
  const pw = document.getElementById("pw");
  const go = document.getElementById("go");
  const err = document.getElementById("err");
  const card = document.getElementById("card");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    err.textContent = "";
    go.disabled = true;
    go.textContent = "Unlocking…";
    try {
      const html = await decryptWith(pw.value, payload);
      sessionStorage.setItem(SESSION_KEY, html);
      show(html);
    } catch (ex) {
      card.classList.remove("shake");
      void card.offsetWidth;
      card.classList.add("shake");
      err.textContent = "That phrase doesn't match.";
      pw.select();
      go.disabled = false;
      go.textContent = "Unlock";
    }
  });
}
</script>
</body>
</html>
"""


def main() -> int:
    parser = argparse.ArgumentParser(description="Encrypt ENVM timetable behind a password gate.")
    parser.add_argument("--password", required=True, help="Access phrase assigned users will type")
    parser.add_argument("--dry-run", action="store_true", help="Encrypt and report sizes without writing index.html")
    parser.add_argument("--input", type=Path, default=PLAIN_PATH, help="Plaintext HTML to encrypt")
    parser.add_argument("--output", type=Path, default=OUT_PATH, help="Password-gate HTML to write")
    args = parser.parse_args()

    started = datetime.now()
    log("Starting ENVM page encryption")

    if not args.input.is_file():
        log(f"ERROR: plaintext not found: {args.input}")
        return 1

    plaintext = args.input.read_bytes()
    log(f"Read plaintext: {args.input} ({len(plaintext):,} bytes)")
    log(f"Deriving key with PBKDF2-SHA256 ({ITERATIONS:,} iterations) and encrypting AES-256-GCM")

    payload = encrypt(plaintext, args.password)
    embedded = GATE_HTML.replace("__PAYLOAD__", json.dumps(payload, separators=(",", ":")))
    out_bytes = embedded.encode("utf-8")

    log(f"Ciphertext: {len(payload['ct']):,} base64 chars")
    log(f"Gate page: {len(out_bytes):,} bytes")

    if args.dry_run:
        log("Dry run: no files written")
        return 0

    args.output.write_text(embedded, encoding="utf-8")
    elapsed = (datetime.now() - started).total_seconds()
    log(f"Wrote {args.output}")
    log(f"Done in {elapsed:.2f}s")
    return 0


if __name__ == "__main__":
    sys.exit(main())
