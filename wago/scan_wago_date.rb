require 'net/http'
require 'json'
require 'set'
require 'redis'
require 'pry'

redis = Redis.new

endpoints = (1..10).map { |n| "https://data#{n}.wago.io/search?sort=date&page=%s" }
item_endpoints = (1..10).map { |n| "https://data#{n}.wago.io/lookup/wago?id=%s" }

auras = redis.hgetall('auras').transform_values { |aura| JSON.parse(aura) }
slugs_to_fetch = Set.new

retries = 0

nothings_in_a_row = 0
(0..499).each do |page|
  puts "Fetching slugs on page #{page}"
  res = JSON.parse(Net::HTTP.get(URI(format(endpoints.sample, page))))
  results = res.fetch('results')

  new_slugs = results.select do |result|
    item = auras[result.fetch('slug')]
    item.nil? || result.dig('date', 'modified') > item.dig('date', 'modified')
  end.map { |result| result.fetch('slug') }

  puts "found #{new_slugs.size} new or modified slugs"
  slugs_to_fetch += new_slugs
 
  if new_slugs.size > 0
    nothings_in_a_row = 0
  else
    nothings_in_a_row += 1
    if nothings_in_a_row >= 5
      puts "All caught up!"
      break
    end
  end

  sleep rand(0.5..1.0)
rescue => error
  puts "error, retries #{retries}, #{error}"
  retries += 1
  retry if retries < 10
end

slugs_to_fetch.each.with_index do |slug, idx|
  puts "#{Time.now} fetching item #{idx + 1}/#{slugs_to_fetch.size} slug #{slug}"
  res = JSON.parse(Net::HTTP.get(URI(format(item_endpoints.sample, slug))))
  auras[slug] = res

  sleep rand(0.5..1.0)
rescue => error
  puts "error, retries #{retries}, #{error}"
  retries += 1
  retry if retries < 10
ensure
  redis.hset('auras', auras.transform_values(&:to_json).to_a.flatten(1))
end
