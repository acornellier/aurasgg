import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'

// TODO: do not make search queries from the server
const typesenseAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: process.env.NEXT_PUBLIC_TYPESENSE_API_KEY,
    nodes: [
      {
        host: process.env.NEXT_PUBLIC_TYPESENSE_HOST,
        port: '443',
        protocol: 'https',
      },
    ],
  },
  additionalSearchParameters: {
    perPage: 30,
    queryBy: 'name,categoryNames',
  },
})

const searchClient = typesenseAdapter.searchClient
export default searchClient
