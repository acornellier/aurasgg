require 'net/http'
require 'json'
require 'set'
require 'redis'
require 'pry'

redis = Redis.new

def make_endpoints(path)
  (1..10).map { |n| "https://data#{n}.wago.io#{path}" }
end

# search_endpoints = make_endpoints('/search?sort=date&page=%s"')
search_endpoints = make_endpoints('/search?q=Type:WeakAura&cc=1&page=%s')
end_page = 500
give_up = false

aura_endpoints = make_endpoints('/lookup/wago?id=%s')
code_endpoints = make_endpoints('%s')

auras = (redis.hgetall('auras').merge(redis.hgetall('auras_migrated')))
          .transform_values { |aura| JSON.parse(aura) }
slugs_to_fetch = Set.new

retries = 0

nothings_in_a_row = 0
(0..end_page).each do |page|
  puts "Fetching slugs on page #{page}"

  res = JSON.parse(Net::HTTP.get(URI(format(search_endpoints.sample, page))))
  results = res.fetch('results')

  new_slugs = results.select do |result|
    item = auras[result.fetch('slug')]
    item.nil? ||
      result.dig('date', 'modified') > (item.dig('date', 'modified') || item['dateModified'])
  end.map { |result| result.fetch('slug') }

  puts "found #{new_slugs.size} new or modified slugs"
  slugs_to_fetch += new_slugs

  if new_slugs.size > 0
    nothings_in_a_row = 0
  else
    nothings_in_a_row += 1
    if give_up && nothings_in_a_row >= 5
      puts "All caught up!"
      break
    end
  end

  sleep rand(0.5..1.0)
rescue => error
  puts "error, retries #{retries}, #{error}"
  puts error.backtrace
  retries += 1
  next if retries < 10
  raise error
end

def needs_code?(aura)
  !aura.key?('code') && aura.key?('codeURL') && aura['type'] != 'SNIPPET'
end

slugs_to_fetch.each.with_index do |slug, idx|
  puts "#{Time.now} fetching aura #{idx + 1}/#{slugs_to_fetch.size} slug #{slug}"

  aura = JSON.parse(Net::HTTP.get(URI(format(aura_endpoints.sample, slug))))
  if aura.key?('error')
    puts "error: #{aura['error']}"
    next
  end

  if needs_code?(aura)
    sleep rand(0.5..1.0)
    code_res = JSON.parse(Net::HTTP.get(URI(format(code_endpoints.sample, aura['codeURL']))))
    aura['code'] = code_res.fetch('encoded')
  else
    aura['code'] = nil
  end

  auras[slug] = aura
  redis.hset('auras', slug, aura.to_json)
  redis.hdel('auras_migrated', slug)

  sleep rand(0.5..1.0)
rescue => error
  puts "error, retries #{retries}, #{error}"
  puts error.backtrace
  retries += 1
  next if retries < 10
  raise error
end

codes_to_fetch = auras.select { |_, aura| needs_code?(aura) }
codes_to_fetch.each.with_index do |(slug, aura), idx|
  puts "#{Time.now} fetching code #{idx + 1}/#{codes_to_fetch.size} slug #{slug}"

  code_res = JSON.parse(Net::HTTP.get(URI(format(code_endpoints.sample, aura['codeURL']))))

  aura['code'] = code_res.fetch('encoded')
  redis.hset('auras', slug, aura.to_json)

  sleep rand(0.5..1.0)
rescue => error
  puts "error, retries #{retries}, #{error}"
  puts error.backtrace
  retries += 1
  next if retries < 10
  raise error
end
