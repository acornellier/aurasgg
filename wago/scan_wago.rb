require 'net/http'
require 'json'
require 'set'
require 'redis'
require 'pry'

redis = Redis.new

search_endpoints = (1..10).map { |n| "https://data#{n}.wago.io/search?sort=date&page=%s" }
aura_endpoints = (1..10).map { |n| "https://data#{n}.wago.io/lookup/wago?id=%s" }
code_endpoints = (1..10).map { |n| "https://data#{n}.wago.io%s" }

auras = (redis.hgetall('auras').merge(redis.hgetall('auras_migrated')))
          .transform_values { |aura| JSON.parse(aura) }
slugs_to_fetch = Set.new

retries = 0

nothings_in_a_row = 0
(0..499).each do |page|
  puts "Fetching slugs on page #{page}"

  res = JSON.parse(Net::HTTP.get(URI(format(search_endpoints.sample, page))))
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
  puts "#{Time.now} fetching aura #{idx + 1}/#{slugs_to_fetch.size} slug #{slug}"

  aura = JSON.parse(Net::HTTP.get(URI(format(aura_endpoints.sample, slug))))
  next if aura.key?('error')

  if aura.key?('codeURL')
    sleep rand(0.5..1.0)
    code_res = JSON.parse(Net::HTTP.get(URI(format(code_endpoints.sample, aura['codeURL']))))
    aura['code'] = code_res.fetch('encoded')
  else
    aura['code'] = nil
  end

  auras[slug] = aura
  redis.hset('auras', slug, aura.to_json)

  sleep rand(0.5..1.0)
rescue => error
  puts "error, retries #{retries}, #{error}"
  retries += 1
  retry if retries < 10
end

codes_to_fetch = auras.values.reject { |aura| aura.key?('code') }
codes_to_fetch.each.with_index do |aura, idx|
  puts "#{Time.now} fetching code #{idx + 1}/#{codes_to_fetch.size} slug #{aura['slug']}"

  if !aura.key?('codeURL') || aura['type'] == 'SNIPPET'
    aura['code'] = nil
    next
  end

  code_res = JSON.parse(Net::HTTP.get(URI(format(code_endpoints.sample, aura['codeURL']))))

  if code_res.key?('error')
    auras.delete(aura['slug'])
    next
  end

  aura['code'] = code_res.fetch('encoded')
  redis.hset('auras', slug, aura.to_json)

  sleep rand(0.5..1.0)
rescue => error
  puts "error, retries #{retries}, #{error}"
  retries += 1
  retry if retries < 10
end
