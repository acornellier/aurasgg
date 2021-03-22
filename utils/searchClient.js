import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'

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
    queryBy: 'name,categories',
  },
})

const searchClient = typesenseAdapter.searchClient
export default searchClient
