# 11.2 How data moves on the internet - Quiz

!!! quiz "Check your understanding"

    1. Which record types map a hostname to an IPv4 or IPv6 address?

        - A and AAAA { data-correct }
        - CNAME and TXT
        - MX and SRV
        - NS and SOA

    2. Which protocol and default port does HTTPS use?

        - HTTP over TCP, port 80
        - HTTP over UDP, port 80
        - HTTP over TLS on TCP, port 443 { data-correct }
        - TLS over UDP, port 443

    3. Which is true about TCP vs UDP?

        - UDP guarantees delivery and ordering; TCP does not
        - TCP establishes a connection and guarantees ordered delivery; UDP does not { data-correct }
        - Both TCP and UDP use handshakes
        - Both TCP and UDP retransmit lost packets by default

    4. What does TLS primarily provide? (choose the best set)

        - Confidentiality, integrity, authentication { data-correct }
        - Compression, routing, congestion control
        - Name resolution, caching, negative responses
        - Load balancing, multiplexing, prioritisation

    5. Place these in order for a first HTTPS request with a cold DNS cache:

        - HTTP request, TCP handshake, TLS handshake, DNS resolution
        - DNS resolution, TCP handshake, TLS handshake, HTTP request { data-correct }
        - TLS handshake, DNS resolution, HTTP request, TCP handshake
        - TCP handshake, DNS resolution, HTTP request, TLS handshake

    6. Which of the following commonly use STARTTLS to upgrade a plaintext connection?

        - SMTP submission, IMAP, POP3 { data-correct }
        - DNS, HTTP, FTP
        - SSH, SFTP, SCP
        - TLS 1.3, HTTP/2, QUIC

    7. When would DNS use TCP instead of UDP? (choose two)

        - For large responses that don't fit in a single UDP packet { data-correct }
        - For zone transfers between DNS servers { data-correct }
        - For typical small A/AAAA record lookups
        - For better latency on lossy links

    8. Match protocol to default port:

        - DNS → 53 { data-correct }
        - SMTP → 25 { data-correct }
        - IMAP (unencrypted) → 143 { data-correct }
        - HTTPS → 443 { data-correct }

    9. What does SNI (Server Name Indication) in TLS allow?

        - A client to specify the domain it's requesting during the TLS handshake { data-correct }
        - DNS to tell the browser which IP to use
        - The server to force the client to use HTTP/2
        - A client to bypass certificate validation

    10. Which developer tool would you use to view the certificate chain and TLS version for a site?

        - Browser Security tab / padlock details { data-correct }
        - Browser Console tab
        - traceroute / tracert
        - ping
