require 'fileutils'

files = Dir['/Users/acornellier/Documents/screens/**/*.gif']

def to_outfile(file)
  File.join(
    '/Users/acornellier/Documents/compressed',
    file.split('/Users/acornellier/Documents/screens/').last,
  ).sub('.gif', '.webm')
end

to_convert = files.reject { |file| File.exist?(to_outfile(file)) }
to_convert.each.with_index do |file, idx|
  outfile = to_outfile(file)
  puts "#{Time.now} compressing item #{idx + 1}/#{to_convert.size}"
  puts "  from: #{file}"
  puts "    to: #{outfile}"

  FileUtils.mkdir_p(File.dirname(outfile))
  `ffmpeg -i "#{file}" -y -c vp9 -b:v 0 -crf 43 -threads 7 -pass 1 -speed 4 -f webm -passlogfile /tmp/ -hide_banner -loglevel error /dev/null`
  `ffmpeg -i "#{file}" -y -c vp9 -b:v 0 -crf 43 -threads 7 -pass 2 -speed 2 -passlogfile /tmp/ -hide_banner -loglevel error "#{outfile}"`
end