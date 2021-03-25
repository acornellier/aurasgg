require 'net/http'
require 'json'
require 'set'
require 'redis'
require 'pry'
require 'fileutils'

def generate_slug
  @o ||= [('a'..'z'), ('A'..'Z'), ('0'..'9')].map(&:to_a).flatten
  (0...7).map { @o[rand(@o.length)] }.join
end

def to_compressed_file(url)
  folder = url.include?('.gif') ? 'compressed' : 'screens'
  path = url.split('https://media.wago.io/screenshots/').last
  File.join(
    "/Users/acornellier/Documents/",
    folder,
    path,
  ).sub('.gif', '.webm')
end

redis = Redis.new
auras = redis.hgetall('auras').transform_values { |aura| JSON.parse(aura) }

to_upload = auras.values.select do |aura|
  aura['screens'] ||= []
  !aura.key?('s3screens') && aura['screens'].all? do |screen|
    File.exist?(to_compressed_file(screen['src']))
  end
end

puts "uploading #{to_upload.size} files"
exit if to_upload.empty?

to_upload.each do |aura|
  aura['s3screens'] = aura['screens'].map do |screen|
    slug = generate_slug
    compressed_file = to_compressed_file(screen['src'])
    s3_file = slug + File.extname(compressed_file)
    FileUtils.cp(compressed_file, "/Users/acornellier/Documents/gcloud/#{s3_file}")
    "https://storage.googleapis.com/aurasgg/screens/#{s3_file}"
  end
end

redis.hset('auras', auras.transform_values(&:to_json).to_a.flatten(1))
