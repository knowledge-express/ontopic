*This is basically my notepad with regars to the project. I needed a place to put it, so why not here.*

# Basic concept
Ontopic: Semantic data over time and space

initialise with ontology

rxjs for time?
rdf-spaces for space

kafka-store
cayley-store
rdf-store-store
redis-store?

# What does it do?
jsonld-framing over time for 'queries'

Actual use-case: RDF triplestore + Kafka

Store:
Modifying the database send over the output channel

query returns promise
subscribe returns asynciterator?

Bus:
Separate input and output channel
Receiving on the input channel applies the operation to the database (add/remove)

# How does it work?
ontopic 'brokers' between the bus and the store, ensuring eventual consistency with regards to processing the input channel and notification of other parties by sending updates over the output channel. Data may only enter the store in question if it can be contextualized with regards to the ontology that ontopic was loaded with.

Read-only stores:
Some stores are not mutable, like the dbpedia-store.

Using multiple stores:
Since some stores are not mutable and it would be a bit redundant to write all data to all mutable stores, you can indicate which store to modify to by default and per operation. ontopic will only account for mutable stores so if you only register one mutable store and convert the other stores to read-only, you don't have to specify which store to write to.

# Mechanics
Internal uses of stores:
- The ontology is stored in a store.
- When framing over time, a store is used as a cache.

Querying space by JSON-LD frame:

- Frames can be expanded just like normals documents
- ignore @-prefixed keywords for now except @type

or take the same approach as temporal querying!
- Flatten

Querying time by JSON-LD frame:
- 'Flatten' the frame by types
- Cache everything from that type in a store
- Query cache for complete frame after caching something
- Emit result when complete frame matches
- Remove result quads from cache

## Note
There is an assumption here that data passing by only relates to a single framed result. However, due to the nature of quads, any additional information from these documents that is not 'used' by the frame will be preserved in the cache. This basically means: formulate your frame carefully to only use the data you need, otherwise the cache will fill up with useless data. It also means that if some data happens to be relevant to a frame now and in the future, it will be missing from the cache when the future frame is queried against the cache. Since the data will be contained in the result that is emitted after processing the present frame, the data is not lost

# Framing
*Note: This section is somewhat inaccurate. Completeness and consistency are basically the same thing here*

Framing is about graphs and representation. When framing, the point is to 'pick
up' the graph from a particular type of node and returning an array of trees. As a graph changes over time, the trees might change and trees might be added or removed. Furthermore, since framing is about representation as well, the changes must some how conform to this representation.

## Frame completeness with regards to graphs
A framed document could be considered 'completed' by a graph is for every document used to construct the framed document, all of the relationships relevant to the frame are fully satisfied. Frame completeness offers a way to frame mutations over time by allowing providing a definition for the validity of a frame that is time-independent. It is important to note here that completeness is defined within the context of a graph, so the same framed document might be considered incomplete with regards to a different graph because some relationships are not satisfied. However, if the documents relevant to the frame are present **exactly equivalent** within both graphs (allowing for unrelated documents to be present as well), the completeness should with regards to both graphs should be the same.

## Completeness and consistency
When the graph is mutated, a framed document might change and so might its completeness. We define a framed document to remain consistent as long as it remains complete with regards to a particular frame and mutating graph. When it becomes incomplete, it becomes inconsistent. Note that consistency is defined over time, as opposed to incompleteness which is independent of time, and both pertain to a particular frame.

<!-- | Completeness | Mutation1 | Mutation2 | Mutation3 |
| :---: | :-------------: |:-------------:| -----:|
| Consistent? | No | Yes | Yes | No | No | Yes |
| Complete? | No | Yes | Yes | No | No | Yes | -->


## A framed point of view
Framing is about representation and in the process it narrows the perspective of the framer to whatever they are interested in. Taking this into account, it would make sense that this narrowed perspective would also translate to updates about mutations on a store. The question then becomes: how can we translate this perspective accurately?

From a framed point of view, a store is only mutated if one of the framed documents changes. Changes can be handled by resending the updated framed document. If the framed document remains consistent after a mutation, we can compare the old an new framed document to determine if we need to send an update. When the framed document becomes inconsistent, relationships are being modified. That cannot happen in a single mutation, since any relationship added or removed would mutate at least 2 documents. As such, we need to
