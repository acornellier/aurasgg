require 'typesense'
require 'json'
require 'pry'

require_relative 'categories'

HOST = 'cvymrnbw60fxs7uap-1.a1.typesense.net'
API_KEY = 'gM8yABaX7bBjW8279bhae8ev7kyljcfC'
client = Typesense::Client.new(
  nodes: [{
    host:     HOST,
    port:     443,
    protocol: 'https'
  }],
  api_key:  API_KEY,
  connection_timeout_seconds: 2
)

if client.collections.retrieve.none? { |collection| collection['name'] == 'auras' }
  client.collections.create(
    name: 'auras',
    fields: [
      { name: 'name', type: 'string' },
      { name: 'categories', type: 'string[]', facet: true },
      { name: 'type', type: 'string', facet: true },
      { name: 'dateModified', type: 'string' },
      { name: 'installCount', type: 'int32' },
      { name: 'viewCount', type: 'int32' },
      { name: 'viewsThisWeek', type: 'int32' },
    ],
    default_sorting_field: 'viewCount',
  )
end; 1

auras = JSON.parse(File.read('auras.json')); 1
new_auras = auras.values.map do |aura|
  {
    'id' => aura['_id'],
    'slug' => aura['slug'],
    'name' => aura['name'],
    'url' => aura['url'],
    'type' => aura['type'],
    'description' => aura['description'],
    'dateCreated' => aura.dig('date', 'created'),
    'dateModified' => aura.dig('date', 'modified'),
    'installCount' => aura['installCount'],
    'viewCount' => aura['viewCount'],
    'viewsThisWeek' => aura['viewsThisWeek'],
    'categories' => (aura['categories'] || []).map do |category|
      categories.dig(category, 'text')
    end.compact,
    'screens' => (aura['screens'] || []).map do |screen|
       screen['src']
    end
  }
end; 1
h = new_auras.to_h { |aura| [aura['id'], aura] }; 1

File.write('new_auras.jsonl', new_auras.map(&:to_json).join("\n"))
`
curl "https://#{HOST}:443/collections/auras/documents/import?action=upsert" \
    -H "X-TYPESENSE-API-KEY: #{API_KEY}" \
    -X POST \
    --data-binary @new_auras.jsonl
`

res = client.collections['auras'].documents.search(
  q: 'luxthos paladin',
  query_by: 'name',
  filter_by: 'type:WEAKAURA',
  include_fields: 'name,viewCount',
  per_page: 10,
  sort_by: 'viewCount:desc,_text_match:desc',
)
pp res;1
