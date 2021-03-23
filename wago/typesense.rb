require 'typesense'
require 'json'
require 'pry'
require 'fileutils'

require_relative 'categories'

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

if client.collections.retrieve.none? { |collection| collection['name'] == 'auras' }
  client.collections.create(
    name: 'auras',
    fields: [
      { name: 'name', type: 'string' },
      { name: 'categories', type: 'string[]', facet: true },
      { name: 'viewCount', type: 'int32' },
      { name: 'type', type: 'string', facet: true },
      { name: 'dateModified', type: 'string' },
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
    'type' => aura['type'],
    'description' => aura['description'],
    'dateModified' => aura.dig('date', 'modified'),
    'viewCount' => aura['viewCount'],
    'categories' => (aura['categories'] || []).map do |category|
      categories.dig(category, 'text')
    end.compact,
    'screens' => (aura['screens'] || []).map do |screen|
       screen['src']
    end,
    'wagoUrl' => aura['url'],
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
FileUtils.rm('new_auras.jsonl')

new_auras = res['hits'].map do |h|
  new_screens = h['document']['screens'].map do |screen|
    next screen unless screen.end_with?('.gif')
    key = screen.split('https://media.wago.io/screenshots/')[1].sub('.gif', '.webm')
    path = File.join('/Users/acornellier/Documents/compressed', key)
    `aws s3api put-object --bucket elasticbeanstalk-us-east-2-577827958072 --key #{key} --body #{path}`
    "https://elasticbeanstalk-us-east-2-577827958072.s3.us-east-2.amazonaws.com/screens/#{key}"
  end
  h['document'].merge('screens' => new_screens)
end

res = client.collections['auras'].documents.search(
  q: '',
  query_by: 'name,categories',
)
pp res;1
