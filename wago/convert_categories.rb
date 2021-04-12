require 'redis'
require 'pry'

require_relative 'categories'

def convert_typical(category)
  id = category['slug']
         .tr('/', '.')
         .sub('classes', 'class')
         .sub('dungeons', 'dungeon')
  {
    'id' => id,
    'text' => category['text'],
    'root' => !!category['root'],
  }
end

# def root_class?(category)
#   category['WEAKAURA'] && category['slug'].start_with?('classes/') && category['slug'].count('/') == 1
# end
#
# def convert_root_class(category)
#   CATEGORIES.select do |other|
#     other['slug'] != category['slug'] && other['slug'].start_with?(category['slug'])
#   end.map do |other|
#     convert_typical(other)
#   end
# end

def mdt_class?(category)
  category['MDT'] && category['slug'].start_with?('classes/')
end

def convert_raid(category)
  convert_typical(category.merge('slug' => category['slug'].sub('pve/', 'raid/')))
end

def convert_dungeon(category)
  match = category['slug'].match(/^pve\/(\w+)-dungeons(\/[\w-]+)?$/)
  convert_typical(category.merge('slug' => "dungeon/#{match[1]}#{match[2]}"))
end

def convert_mdt_dungeon(category)
  return nil if category['id'].include?('crew') || category['id'].include?('faction')
  bfa_match = category['slug'].match(/^pve\/dungeons(\/[\w-]+)?$/)
  match = category['slug'].match(/^pve\/(\w+)-dungeons(\/[\w-]+)?$/)
  expansion, dungeon = match ? match[1..2] : ['bfa', bfa_match[1]]
  convert_typical(category.merge('slug' => "dungeon/#{expansion}#{dungeon}"))
end

def convert_mdt_speed(category)
  convert_typical(category.merge('slug' => 'mdt' + category['slug']))
end

def convert_mdt_week(category)
  bfa_match = category['slug'].match(/affixes\/s(\d+)\/week(\d+)/)
  match = category['slug'].match(/affixes\/(\w+)-s(\d+)\/week-(\d+)/)
  expansion, season, week = match ? match[1..] : ['bfa', *bfa_match[1..]]
  {
    'id' => "mdtweek.#{expansion}.s#{season}.w#{week}",
    'text' => "S#{season} Week #{week}",
    'root' => false,
  }
end

DISCARD_IDS = %w[gen0 gen3 gen4 gen5 gen16 mech4 role0 vuhdo0 plater0 totalrp0 totalrp4] +
  %w[oldraids raidworld wpvp wpvp1 beta2 beta-bfa beta-sl] +
  %w[mdtaffix mdtdun mdt-sldun mdtdun16-crew1 mdtdun16-crew2]
DISCARD_CLS = %w[opie]

KEEP_IDS = %w[plater1 plater2 plater3 plater4 plater5 totalrp1 totalrp2 totalrp3 torghast]
KEEP_CLS = %w[rplang]
KEEP_SLUGS = %w[classes general equipment combat-mechanics class-roles] +
  %w[vuhdo professions pvp totalrp/items affixes]

POST_DISCARD_CLS = %w[plater snippets torghast]

def convert(category)
  return nil if DISCARD_IDS.include?(category['id'])
  return nil if DISCARD_CLS.include?(category['cls'])
  # return convert_root_class(category) if root_class?(category)
  return nil if mdt_class?(category)

  return convert_raid(category) if category['id'].start_with?('raid')
  return convert_mdt_dungeon(category) if category['MDT'] && category['cls'] == 'dungeon'
  return convert_dungeon(category) if category['cls'].start_with?('dungeon')

  return convert_mdt_speed(category) if category['cls'] == 'speed'
  return convert_mdt_week(category) if category['slug'].include?('week')

  return convert_typical(category) if KEEP_IDS.include?(category['id'])
  return convert_typical(category) if KEEP_CLS.include?(category['cls'])

  return convert_typical(category) if KEEP_SLUGS.any? do |prefix|
    category['slug'].start_with?("#{prefix}")
  end

  return nil if POST_DISCARD_CLS.include?(category['cls'])

  throw "uncaught category: #{category['id']}"
end

NEW_CATEGORIES = CATEGORIES.map { |category| convert(category) }

# all_nathria = { 'id' => 'raid.nathria.all', 'text' => 'All bosses' }
# all_sl_dg = { 'id' => 'dungeon.shadowlands.all', 'text' => 'All dungeons' }

redis = Redis.new
auras = redis.hgetall('auras').transform_values { |json| JSON.parse(json) }; 1

def delete_filled_subcategories(aura, parent, id, ids)
  match = id.match(/^#{parent}\.([\w-]+)$/)
  return false unless match
  subs = ids.select { |id| id.match?(/#{parent}\.#{match[1]}\./) }
  max_subs = CATEGORIES.select { |cat| cat['id'].match?(/#{parent}\.#{match[1]}\./) }
  if subs.size == max_subs
    aura['newCategories'].delete_if { |category| subs.include?(category['id']) }
    return true
  end
  false
end

auras.values.each do |aura|
  aura['newCategories'] = aura['categories'].flat_map do |category_id|
    convert(CATEGORY_HASH.fetch(category_id))
  end.compact.uniq

  # loop do
  #   new_ids = aura['newCategories'].map { |category| category['id'] }
  #   break if new_ids.none? do |id|
  #     delete_filled_subcategories(aura, 'class', id, new_ids) ||
  #       delete_filled_subcategories(aura, 'raid', id, new_ids) ||
  #       delete_filled_subcategories(aura, 'dungeon', id, new_ids)
  #   end
  # end
end; 1

redis.hset('auras', auras.transform_values(&:to_json).to_a.flatten(1))
