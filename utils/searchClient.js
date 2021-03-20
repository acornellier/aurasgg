import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'

console.log(process.env)
const typesenseAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: 'Wad4LgiHsDn2hv6pkiq1mlLAhTozaDgy',
    nodes: [
      {
        host: 'cvymrnbw60fxs7uap-1.a1.typesense.net',
        port: '443',
        protocol: 'https',
      },
    ],
  },
  additionalSearchParameters: {
    queryBy: 'name,categories',
  },
})

const searchClient = typesenseAdapter.searchClient
export default searchClient
