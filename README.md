# ontopic
> Semantic data over time and space 📑⏰🚀

**Note:** *This project is very much a work in progress. The README might be incorrect because it partially serves as a way to figure out how this library should work. Some of these things are just ideas. Feel free to open an issue if you are unsure about something.*

The idea behind this library is to provide an abstract way of dealing with semantic data, including updates on the dataset and distribution of data. The abstract part refers to the ability to swap out what you are using to store your semantic data in time (Kafka) and/or space (N3, Cayley). The dealing refers to being able to query the current dataset and get automatic updates on the result if relevant updates come in. Semantic data in the context of this library refers to RDF and JSON-LD.

ontopic can use other instances of ontopic as a source for data, so you can easily distribute your data. Automatically updated queries allow you to stay... on topic 😎.

## Installation
With NPM:
```
npm install -S ontopic
```

With yarn:
```
yarn add ontopic
```

## Usage
By default ontopic is initialised with an ephemeral data store and an ephemeral bus that can send and receive updates. You can store data, push updates and do queries that automatically update their result.

```
import ontopic from 'ontopic';

const db = ontopic();
```

However, the main purpose of ontopic is to initialise it with an ontology:
```
const ontology = `
  # My ontology
`;

const db = ontopic.fromOntology(ontology);
```

This provides validation (link here?) and access to the database via semantic-graphql (link here).

### Bus
In the context of this library, a bus is anything that is able to send and receive updates about the dataset. The bus represents the temporal component of the dataset.

### Store
In this library a store is a spatial data storage abstraction. It represents the current state of our data.

### Querying
**Note: This is an experimental API based on intuition. Please send suggestions for improvements.**

The main reason for the inception of this library was a need for the ability to frame an unpredictable stream of JSON-LD documents with the ability to tell when a particular view on our data was 'complete', so that processing could commence. As such, the idea behind the API is that JSON-LD frames serve as a sort of queries.

You can query space:
```
const promise = db.query(frame);
```

And you can query time:
```
const aysnc_iterator = db.query(frame);
```

## Use cases
The following are some possible ways this library can be used.

### Setting up a distributed knowledge graph
ontopic can load any number of stores and busses, and it consists of stores and busses, so it can load instances of itself. Just provide ontopic with the respective API URIs during configuration to aggregate multiple ontopic instances.

### Adding semantic context to an existing JSON API
We like the semantic web. It's...*elegant*. Using ontopic, you can easily add semantic context to your existing API, assuming it returns JSON responses. JSON-LD can be used to re-contextualize plain JSON object into a semantic framework (add links to resources here). Using ontopic, you can easily load an ontology to do so and make the resulting data available as a separate API.

Add more info here.

## Additional information

### Philosophy
This section contains some rambling about the ideas behind this library. Some terminology:

- Graph: A collection of semantic data that can be represented as RDF, JSON-LD or any other valid semantic data representation supported by ontopic.
- Agent: See PROV-O. In our case, basically something that reads from and/or writes to the bus.

#### Push based updates
Structured data evolves. It changes, gets deleted or restructured in such a way that it might as well have been deleted. Keeping up with the updates requires any agents to process updates as they get them, i.e. push based. Pull based updates on semantic data are a pain (insert link to GraphQL blog about subscriptions here).

#### Going back in time (Kafka only)
Kafka has the ability to preserve information indefinitely for later consumption in case any agent is late to the party. That means that with a properly configured Kafka bus, an agent joining in a later stadium (i.e. a new agent being deployed) can catch up on all of the updates since the Kafka bus was added to the ontopic cluster. Combining this with Kafka log compation and keyed messages allows for plug-and-play like scaling of the ontopic cluster.

## The query system
*Yes, it gets it own section*

### Frames as queries
So JSON-LD isn't really designed for temporal stuff. However, it has this interesting mechanic of flattening a graph and then framing the documents in accordance with a predefined frame, which basically 'picks up' the graph from a certain node. That's pretty much how GraphQL works as well: provide a starting point and go traverse these paths! So this could suffice as a way of 'querying' the graph, since the point of framing is to get your data in a particular format anyway. Instead of just formatting, we go get it first. This is the easy part.

Then there is the temporal aspect of querying, i.e. framing JSON-LD over time. What does that mean? Well, over time implies some idea of distinct events happening, so we need to know when to trigger these events. This depends on the frame in question, and when it is 'complete' in some sense.

### JSON-LD and time
When you flatten a JSON-LD graph, you'll usually end up with a bunch of ids in at least one of the documents. We want to 'unflatten' this list of documents, ending up with one document with the relvant information embedded. This just comes down to framing it properly, but we want to 'unflatten' the document over time, based on a stream of updates about individual (i.e. flattened) documents. This begs the question: In a graph containing many different document, when is a particular document 'unflattened', with regards to a particular frame?

The answer to this question is complex. It starts with the bus, which receives all the updates about documents. We want to map and reduce these updates to only trigger when a frame has been 'completed'. Because the update system is inherently push-based, we have to do same manual caching. After an update we can disregard some data (i.e. clean the cache) that was only associated with this frame. Everytime the frame is 'completed', we send the 'completed' version through as an updated query result.

### JSON-LD frame completeness
What does it mean for a frame to be 'completed' by a graph? In spatial terms, this question doesn't matter. There is only the current state of the data, so whatever the result of 'querying' the state with the frame is, that is the result (although it might not complete the frame).

In temporal terms, completeness makes a lot more sense. Looking at the flattened graph of a JSON-LD document with embedded documents, one can imagine the individual document being streamed in random order. Completeness over time is simple: possessing all of the documents eventually. The top-level document (according to the original data structure, although you could use frames for this as well) contains all of the ids of the nested documents, so it can be used to verify the completeness of the set.

The catch here is that until the top-level document is observed, we don't know which documents might be relevant, so we have to cache everything (except things we might filter out before).

### We can go deeper
Multi-level embedding --> recursion (over time 😄!).

### Additional resources
Google these things.

#### Time
- Kafka

#### Space
- N3 triplestore (ephemeral)
- Cayley (persistent, backend agnostic)
- DBPedia (read-only)

# Contributing
Any input is very much appreciated! Feel free to open an issue or a pull request 👐.

# License
The `package.json` says MIT at the moment.
