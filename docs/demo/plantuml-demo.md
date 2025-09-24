# Demo: PlantUML via Kroki

This page shows a simple PlantUML diagram rendered via Kroki/PlantUML.

```kroki-plantuml
@startuml
Alice -> Bob: Hello Bob, how are you?
Bob --> Alice: I am good thanks!
@enduml

```

<!-- kroki-plantuml fence will be recognized by the kroki plugin and sent to the Kroki server -->

Notes:

- Kroki must be installed/present or the plugin must be configured to point at a Kroki server.

- If you prefer a local PlantUML JAR, I can instead configure `mkdocs-plantuml` and add build instructions.
