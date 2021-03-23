require 'redis'
require 'json'
require 'fileutils'

auras = Redis.new.hgetall('auras').transform_values { |json| JSON.parse(json) }

urls = auras.values.flat_map { |aura| aura['screens']&.map { |screen| screen['src'] } }.compact

def to_outfile(url)
  File.join(
    '/Users/acornellier/Documents/screens',
    url.split('https://media.wago.io/screenshots/').last,
  )
end

to_download = urls.reject { |url| File.exist?(to_outfile(url)) }

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
