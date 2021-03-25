require 'redis'
require 'json'
require 'fileutils'

endpoints = (1..10).map { |n| "https://data#{n}.wago.io/search?sort=date&page=%s" }

auras = Redis.new.hgetall('auras').transform_values { |json| JSON.parse(json) }

to_download = auras.reject { |aura| aura.key?('code') }

retries = 0
wait_time = 10

to_download.each.with_index do |url, idx|
  outfile = to_outfile(url)
  puts "#{Time.now} fetching item #{idx + 1}/#{to_download.size} url #{url}"
  puts "  from: #{url}"
  puts "    to: #{outfile}"

  FileUtils.mkdir_p(File.dirname(outfile))
  `wget "#{url}" -O "#{outfile}" --quiet`
  sleep rand(1.0..5.0)
rescue => error
  puts "error, retries #{retries}, #{error}"
  retries += 1
  sleep wait_time
  wait_time *= 2
  retry if retries < 10
end
