# Year 12 — Programming for the Web: Module Plan

Focus on back-end Python examples and standards-based front-end. Keep security and accessibility in scope.

---

## Chapter 1 — Web foundations and data transmission

Covers: applications, how data moves, protocols/ports, web security, certificates and encryption, and basic architectures for large-scale web systems. Outcomes: SE-12-03, SE-12-04.

### 1.1 Explore the applications of web programming

- Outcomes: SE-12-03

- Learn: application types, trade-offs and constraints.

- Explore the applications of web programming including:

  - interactive websites / webpages (dynamic content, forms, client-side interactivity)

  - e-commerce (catalogues, shopping cart, payments, security and privacy concerns)

  - progressive web apps (PWAs) (offline support, installability, service workers)

### 1.2 How data moves on the internet (packets, IP, DNS, protocols)

- Outcomes: SE-12-03

- Learn: request/response path; name resolution; map to developer tooling.

- Investigate and describe the function of web protocols and their ports. Including:

  - HTTP and HTTPS (ports 80 / 443)

  - TCP/IP (transport and addressing fundamentals)

  - DNS (name resolution)

  - FTP and SFTP (file transfer; secure alternatives)

  - SSL / TLS (secure transport layer)

  - SMTP, POP3, IMAP (email protocols and their role in web systems)

### 1.3 Web protocols, ports and secure transport concepts

- Outcomes: SE-12-04

- Learn: how protocols map to developer responsibilities and where security is applied.

- Secure Sockets Layer (SSL) and Transport Layer Security (TLS):

  - SSL certificates and Certificate Authorities (what a certificate contains and why it matters)

  - encryption algorithms (symmetric vs asymmetric)

  - encryption keys (public/private keys, key management basics)

  - plain text vs cipher text (why we encrypt)

  - authentication and authorisation (identity vs permission)

  - hash values (integrity checks, password hashing basics)

  - digital signatures (non-repudiation and verification)

### 1.4 Big data and web architectures

- Outcomes: SE-12-03

- Learn: data mining, metadata, streaming challenges; basic architectural patterns (monoliths, microservices, serverless) and where scaling concerns affect design.

Exit: students can trace a request from client to server, list the relevant protocols and ports, and name security, privacy and performance considerations.

---

## Chapter 2 — Designing web applications

Covers: standards and accessibility, client/server models, developer tools, CSS/design systems, version control and libraries. Outcomes: SE-12-06, SE-12-02.

### 2.1 The role of the W3C and web standards

- Outcomes: SE-12-06

- Learn: the World Wide Web Consortium's role in developing web standards and best practices.

- Investigate and explain the role of the W3C including:

  - Web Accessibility Initiative (WAI) and accessibility guidelines

  - internationalisation (i18n) and localisation (l10n)

  - web security standards and recommended patterns

  - privacy and privacy-by-design principles for web applications

  - machine-readable data standards (e.g., ARIA, microdata, JSON-LD)

### 2.2 Model elements that form a web development system

- Outcomes: SE-12-02

- Learn: high level architecture and interfaces.

- Model elements:

  - client-side (front-end) web programming: HTML, CSS, JavaScript, progressive enhancement

  - server-side (back-end) web programming: request handling, routing, business logic

  - interfacing with databases that are SQL-based (relational) and NoSQL systems; when to choose each

  - middleware, APIs, and third-party services

### 2.3 Influence of the web browser and developer tools

- Outcomes: SE-12-02

- Learn: how browser behaviour influences development and testing.

- Explore and explain the influence of a web browser on web development, including:

  - rendering differences and cross-browser testing concerns

  - using Developer (Dev) Tools: DOM inspection, network tracing, performance profiling, storage inspection, and debugging JavaScript/Python served responses

### 2.4 CSS, UI and UX principles

- Outcomes: SE-12-06

- Learn: separation of concerns between content, presentation and behaviour.

- Investigate cascading style sheets (CSS) and its impact on the design of a web application including:

  - consistency of appearance (design tokens, variables)

  - flexibility across browsers and display devices (responsive design)

  - CSS maintenance tools (preprocessors, linters, utility-first approaches)

  - the application of design and UI/UX principles for font, colour, audio, video and navigation

  - building UIs that consider accessibility and inclusivity (contrast, keyboard navigation, captions, semantics)

### 2.5 Front-end code libraries and frameworks

- Outcomes: SE-12-06

- Learn: patterns for reuse and complexity management.

- Explore the types and significance of code libraries for front-end web development including:

  - frameworks that control complex web applications (responsibility, routing, state management)

  - template engines for server-side rendering

  - predesigned CSS classes and UI component libraries (utility classes, component systems)

  - when to adopt libraries versus building minimal bespoke code

### 2.6 Open-source and content management systems (CMS)

- Outcomes: SE-12-06

- Learn: development models that power much of the web.

- Explain the use and development of open-source software in relation to web development (community, licensing, contribution workflows).

- Research, experiment with and evaluate the prevalence and use of web content management systems (CMS): trade-offs of hosted vs self-hosted, plugin ecosystems, security/update considerations.

Exit: students can design accessible, standards-compliant front-ends and reason about when to adopt libraries or CMS platforms.

---

## Chapter 3 — Back-end, databases, and PWAs

Covers: back-end Python, the backend request lifecycle, databases (SQL and NoSQL), performance, and PWA basics. Outcomes: SE-12-02, SE-12-06.

### 3.1 Server-side Python with a microframework and the back-end request flow

- Outcomes: SE-12-02

- Learn: minimal routes and templates; safe input handling; small Flask-like example.

- Observe and describe the back-end process used to manage a web request, including:

  - role of webserver software (receiving sockets, serving static vs dynamic content)

  - web framework request handling (routing, middleware, controllers/handlers)

  - objects and libraries used in request processing (sessions, authentication helpers)

  - interfacing with databases and external services during a request

### 3.2 Databases: SQL, common queries and ORM comparison

- Outcomes: SE-12-02

- Learn: CRUD patterns, joins, constraints and basic optimisation.

- When teaching SQL: apply a web-based database and construct scripts that execute SQL, including:

  - selecting fields (SELECT)

  - incorporating GROUP BY

  - common SQL queries (filtering, ordering, aggregation)

  - constraints and conditional selection using WHERE

  - table joins (INNER, LEFT/RIGHT) and how they model relationships

  - safe parameterised queries to avoid injection

- Look at Object Relational Mapping (ORM) and compare it to raw SQL:

  - how an ORM maps classes to tables and objects to rows

  - trade-offs: productivity and abstraction vs explicit control and performance

### 3.3 Performance and page-load management

- Outcomes: SE-12-06

- Learn: caching strategies (CDNs, server-side caching), compression, asset bundling and lazy loading; basic profiling tools and hotspots.

### 3.4 Designing and implementing a PWA

- Outcomes: SE-12-02

- Learn: offline basics (service workers), installable app characteristics, syncing strategies and accessibility considerations for PWAs.

Exit: students can implement a small back-end that handles requests, use a database to persist data, write safe SQL scripts, and evaluate ORM trade-offs for web applications.

---

## Author deliverables per section

- `index.md`: explanation, short numbered display title, small Python example(s) (must be Python-only), PlantUML diagram(s) where relevant, practice tasks, recap and outcomes mapping.

- `quiz.md`: 6–10 questions (mix of multiple-choice and short-answer) with an answer key.

## Folder naming (mapping to numbered sections)

- Display: numbered titles (e.g., “3.2 Databases: SQL and ORM basics”).

- Folders: `docs/Year12/ProgrammingForTheWeb/Chapter-0X-Name/Section-0Y-Name/`

  - `index.md`

  - `quiz.md`
