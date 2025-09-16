# 11.2 How data moves on the internet (packets, IP, DNS, protocols)

Outcomes: SE-12-03

In this section, you will trace a web request end-to-end: from typing a URL to receiving a web page. You'll see how DNS resolves names, how TCP establishes a connection, how TLS secures it, and how HTTP delivers content. We'll also map core protocols to their typical ports and show how to inspect and reason about all this with developer tools.

## Learning objectives

By the end, you can:

- Explain the steps of a browser request/response path

- Describe the role of DNS, IP, TCP, TLS and HTTP(S)

- Identify common protocol ports (80, 443, 53, etc.)

- Use developer tooling to observe requests, certificates, DNS and timing

## The request path at a glance

```kroki-plantuml
@startuml
!theme aws-orange
skinparam participantStyle rectangle

actor User as u
participant "Browser" as b
participant "OS Resolver" as os
participant "DNS Resolver" as rdns
participant "Authoritative DNS" as auth
participant "Server IP" as srv
participant "TLS" as tls
participant "Web App (HTTP)" as app

u -> b: Enter https://www.example.com/
b -> os: Resolve hostname (example.com)
os -> rdns: Query (recursive)
rdns -> auth: Ask authoritative (NS)
auth --> rdns: A/AAAA records (IP)
rdns --> os: Return IP address
os --> b: IP for example.com

b -> srv: TCP 3-way handshake (SYN/SYN-ACK/ACK) on port 443
b -> tls: ClientHello (TLS)
tls --> b: ServerHello + Certificate
b -> tls: Key exchange, Finished

b -> app: HTTPS GET / (HTTP/1.1 or HTTP/2)
app --> b: Response (HTML, assets)

b -> app: Fetch assets (CSS/JS/images)
app --> b: Responses

@enduml
```

Notes:

- DNS returns A (IPv4) and/or AAAA (IPv6) records that map the name to an IP address

- TCP ensures reliable, ordered delivery; UDP is faster but unreliable (used by DNS by default)

- TLS secures the transport (encryption + integrity + server identity)

- HTTP(S) carries the application data

## DNS resolution deep-dive

```kroki-plantuml
@startuml
!theme aws-orange

package "DNS Resolution" {
  actor User
  component "Browser" as B
  component "OS Resolver" as OR
  component "Recursive Resolver (ISP/Public)" as RR
  component "Root DNS" as ROOT
  component ".com TLD" as TLD
  component "example.com Authoritative" as AUTH

  User --> B : enter example.com
  B --> OR : check OS cache/hosts
  OR --> RR : recursive query
  RR --> ROOT : where is .com?
  ROOT --> RR : refer to .com TLD
  RR --> TLD : where is example.com?
  TLD --> RR : refer to AUTH NS
  RR --> AUTH : what's A/AAAA for example.com?
  AUTH --> RR : return IP(s) + TTL
  RR --> OR : answer + TTL
  OR --> B : IP cached locally
}
@enduml
```

Key ideas:

- TTL controls caching duration along the chain (authoritative → recursive → OS → browser)

- Negative caching (NXDOMAIN) also has TTL

- DNS primarily uses UDP/53; large or secure transfers may use TCP/53; DNS over HTTPS (DoH) uses 443

## Protocols and ports (developer's view)

| Protocol | Purpose | Default Port(s) | Transport |
|---------|---------|-----------------|-----------|
| DNS | Name resolution | 53 | UDP (TCP for large/zone) |
| HTTP | Hypertext transfer | 80 | TCP |
| HTTPS | HTTP over TLS | 443 | TCP (+ TLS) |
| TCP | Reliable transport | — | IP |
| UDP | Unreliable datagrams | — | IP |
| FTP / SFTP | File transfer (legacy/secure) | 20/21, 22 | TCP |
| SMTP | Send email | 25 | TCP |
| POP3 | Retrieve email | 110 | TCP |
| IMAP | Retrieve/sync email | 143 | TCP |
| STARTTLS variants | Opportunistic TLS upgrade | 587/993/995 | TCP + TLS |

Notes:

- Modern email commonly uses SMTPS (TLS) on 465, submission on 587, IMAPS on 993, POP3S on 995

- Prefer SFTP/HTTPS over FTP for secure file transfer

## TCP vs UDP (at a glance)

| Aspect | TCP | UDP |
|--------|-----|-----|
| Reliability | Guaranteed delivery, ordering, retransmission | Best-effort, no ordering |
| Overhead | Higher (handshake, ACKs, congestion control) | Lower (no connection setup) |
| Use cases | Web pages, APIs, file transfer | DNS, streaming, real-time games |

## TLS in the flow (quick view)

- Provides encryption (confidentiality), integrity (tamper detection), and authentication (server identity)

- Negotiates protocol version and cipher suite; modern stacks prefer TLS 1.3

- Certificate chains validate the server's domain via Certificate Authorities (CAs)

```kroki-plantuml
@startuml
!theme aws-orange

participant Client
participant Server

Client -> Server: TCP connect (443)
Client -> Server: ClientHello (SNI: example.com)
Server -> Client: ServerHello + Certificate (chain)
Client -> Server: Key exchange; Finished
Server -> Client: Finished
note over Client,Server
  Now the HTTP session is encrypted
end note
@enduml
```

## Developer tooling: trace and verify

- Browser DevTools → Network tab: timing (DNS, TCP, TLS), headers, HTTP/2 multiplexing

- Security tab: certificate chain, issuer, validity, protocol (TLS 1.2/1.3)

- Command-line:

  - nslookup / dig: DNS answers and authority

  - ping / tracert: reachability and route hops

  - curl: raw HTTP(S) requests, headers, and TLS info

### Python-only, safe demos

These examples simulate or interrogate network concepts without requiring external services.

#### 1) Resolve a hostname and show records

```python
import socket

hostname = "example.com"
print(f"Resolving: {hostname}")

# IPv4
try:
    ipv4 = socket.getaddrinfo(hostname, None, family=socket.AF_INET)
    print("IPv4:", sorted({rec[4][0] for rec in ipv4}))
except Exception as e:
    print("IPv4 lookup failed:", e)

# IPv6
try:
    ipv6 = socket.getaddrinfo(hostname, None, family=socket.AF_INET6)
    print("IPv6:", sorted({rec[4][0] for rec in ipv6}))
except Exception as e:
    print("IPv6 lookup failed:", e)
```

#### 2) Measure a simple TCP connect time (no data)

```python
import socket, time

def tcp_connect_time(host, port, timeout=3):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(timeout)
    t0 = time.perf_counter()
    try:
        s.connect((host, port))
        return (time.perf_counter() - t0) * 1000
    finally:
        try:
            s.close()
        except Exception:
            pass

for host, port in [("example.com", 80), ("example.com", 443)]:
    try:
        ms = tcp_connect_time(host, port)
        print(f"TCP connect to {host}:{port} took ~{ms:.1f} ms")
    except Exception as e:
        print(f"Connect to {host}:{port} failed:", e)
```

#### 3) Minimal HTTP GET over TLS using stdlib

```python
import ssl, socket

host = "example.com"
ctx = ssl.create_default_context()

with socket.create_connection((host, 443), timeout=5) as sock:
    with ctx.wrap_socket(sock, server_hostname=host) as ssock:
        # Send HTTP/1.1 GET request
        req = (
            f"GET / HTTP/1.1\r\n"
            f"Host: {host}\r\n"
            "User-Agent: Python-SSL-Demo\r\n"
            "Connection: close\r\n\r\n"
        )
        ssock.sendall(req.encode("ascii"))
        data = ssock.recv(4096)
        print("Response head:\n", data.decode("latin1", errors="ignore").split("\r\n\r\n")[0])
```

Note: The examples target `example.com` which is a reserved domain for documentation and should be safe to query.

## Practice tasks

1. Draw a sequence diagram that shows Browser → DNS → Server for a first-time visit vs a cached visit (label where caching occurs and TTL applies).

2. Capture a page load in your browser and annotate the Network waterfall: DNS, TCP, TLS, TTFB, content download. Explain which step took the longest and why.

3. Using the tables above, list which protocols/ports are involved when: sending an email from a client, downloading mail to a phone, and viewing a website securely.

4. Explain when DNS would use TCP instead of UDP. Give two real reasons.

## Recap and outcomes

You can now trace how data moves on the internet:

- DNS maps names to IP addresses (with caching and TTL)

- TCP provides reliable transport; UDP trades reliability for speed

- TLS secures transport; HTTPS runs HTTP over TLS on port 443

- Developer tools let you observe each stage and validate security

Outcome mapping: SE-12-03 — investigate and describe the function of web protocols and their ports, and trace request/response paths including DNS and transport layers.
