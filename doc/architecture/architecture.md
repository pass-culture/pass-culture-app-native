flowchart LR
  subgraph AppState["AppState (Zustand)"]
    selectors@{ shape: das }
    actions
    store@{ shape: bow-rect }

    selectors -->|read| store
    actions -->|write| store
  end

  subgraph ServerState["ServerState (react-query)"]
    query@{ shape: lean-l }
    mutation@{ shape: lean-r }

    query -->|get| QueryCache@{ shape: win-pane }
  end

  subgraph Navigation["Navigation (react-navigation)"]
    queryParams@{ shape: win-pane }
    Modals@{ shape: processes }
    OthersPages@{ shape: processes }
  end

  Page@{ shape: doc }
  -->|render| Container@{ shape: processes }
  -->|render| Presentational@{ shape: processes }

  Page -->|parse| queryParams
  Container -->|read| selectors
  Container -->|write| actions
  Container -->|get| query
  Container -->|post| mutation
  Container -->|display| Modals@{ shape: docs }
  Container -->|navigate to| OthersPages@{ shape: docs }
