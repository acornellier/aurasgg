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
  File.join(
    '/Users/acornellier/Documents/compressed',
    url.split('https://media.wago.io/screenshots/').last,
  ).sub('.gif', '.webm')
end

@s3_folder = '/Users/acornellier/Documents/s3'

def to_s3_file(compressed_file, slug)
  File.join(
    @s3_folder,
    slug,
  ) + File.extname(compressed_file)
end

redis = Redis.new
auras = redis.hgetall('auras').transform_values { |aura| JSON.parse(aura) }

to_upload = auras.values.select do |aura|
  aura['screens'] ||= []
  !aura.key?('s3screens') && !aura['screens'].empty? && aura['screens'].all? do |screen|
    File.exist?(to_compressed_file(screen['src']))
  end
end

puts "uploading #{to_upload.size} files"
exit if to_upload.empty?

to_upload.each.with_index do |aura, idx|
  aura['s3screens'] = aura['screens'].map do |screen|
    slug = generate_slug
    compressed_file = to_compressed_file(screen['src'])
    FileUtils.cp(compressed_file, to_s3_file(compressed_file, slug))
    "s3://elasticbeanstalk-us-east-2-577827958072/screens/#{slug}"
  end
end

`aws s3 sync #{@s3_folder} s3://elasticbeanstalk-us-east-2-577827958072/screens/`

redis.hset('auras', auras.transform_values(&:to_json).to_a.flatten(1))
