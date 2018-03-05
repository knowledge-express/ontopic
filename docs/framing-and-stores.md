# Stores

resolveSourceId --> Get's the id
resolveResource --> Just passes through the call to allow 'lazy' traversal
resolveResources --> Just passes through the call to allow 'lazy' traversal

resolveSourcePropertyValue(source, iri) --> Actually traverse to get the property
resolveSourceTypes(source) --> This determines the actual types/interfaces of our results
resolveResourcesByPredicate(types, iri, value) --> This is only used when following inverse relationships.

# Query by frame

Determine if document is relevant to frame --> By type
Query store based on received document to see if there is a result -->
  We know the id of the document, and we know it might be relevant to a frame. The goal now is to find other documents of this frame, which we can do by traversing back from the document to the top-level of the frame and then querying the entire frame from there.

- Find the type of the document in the frame
- Traverse back up to find the parent of the document
- Formulate a query from the document to its parent (this is the tricky part)
- Repeat until top level reached (at this point, we are in some kind of nested query)
- Insert query for entire frame

# Frame completeness

The point of completeness is to avoid doing a lot of redundant processing. When dealing with streaming flattened JSON-LD, you can have a valid result for the frame operation everytime you get an update or only once, depending on the frame and the order of the updates. However, you are probably really only interested in the end result and not all of the intermediate framing result. Completeness provides a mechanism for distinguishing the finished result from the intermediate ones. This allows us to reason about an infinite stream of documents in any order.

A frame is incomplete if we know a document is missing. We know a document is missing because one of the relationships is not like the others. Either, the amount of related docs is off by some number (@explicit) or one of the documents is missing type information (non-@explicit).

Framed document completeness:
- If @type is not among the keys, document is incomplete
- Traverse document, check value of each key
- If value is document, recurse
- If value is array of documents:
  - (recurse) Each of them should have @type information, otherwise the document is incomplete
  - The ids of the documents should be the complete list

Steps in framing:
- Expand
- Flatten
- Filter by types in frame
- Cache
- Frame (Cache is needed to frame?)
- Validate
- Cleanup cache
