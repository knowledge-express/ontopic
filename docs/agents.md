# Agents

- Has ontology (to contextualize the data and the frames)
- Listens to a bus for updates to react to
- Reacts to updates by querying a store
- Cares about updates about data that fits one or more frames
- Can apply an action to framed data to generate update requests
- Sends update requests over the bus

Each frame can be mapped to a query.
Each update can be turned into a traversal to the top-level type in the frame.
The query result can be mapped back to the frame structure.
The query result can be validated based on the updates that we have seen.

- [x] Need GraphQL interface for querying (based on ontology).
Need cayley store.
Need memux bus (buffer through Redis to ensure uncommitted offsets?).
