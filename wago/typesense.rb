require 'typesense'
require 'json'
require 'pry'
require 'fileutils'

HOST = ENV.fetch('NEXT_PUBLIC_TYPESENSE_HOST')
API_KEY = ENV.fetch('TYPESENSE_ADMIN_KEY')

client = Typesense::Client.new(
  nodes: [{
    host: HOST,
    port: 443,
    protocol: 'https'
  }],
  api_key: API_KEY,
  connection_timeout_seconds: 2
)

res = client.collections['auras'].documents.search(
  q: '',
  query_by: 'name,categoryNames',
  per_page: 10,
)

client.collections.create(
  name: 'auras',
  fields: [
    { name: 'type', type: 'string', facet: true },
    { name: 'epochCreated', type: 'int64', facet: true },
    { name: 'epochModified', type: 'int64', facet: true },
    { name: 'name', type: 'string' },
    { name: 'categoryNames', type: 'string[]', facet: true },
    { name: 'views', type: 'int32', facet: true },
  ],
  default_sorting_field: 'views',
)
