@AGENTS.md

## Resource cleanup

Every resource created for a project (Docker containers, images, volumes and networks, Testcontainers leftovers,
background processes, temporary files) must be removed once the project is finished and validated: CI green,
pushed, and its showcase live. Before deleting, list what will be removed and confirm it was created for that
project; never touch resources that belong to other projects (e.g. `aetherforge`, `aurora_*`). Shared images
still needed by an active project stay until that project finishes too.
