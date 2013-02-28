require "csv"

ssitn_map = {
  "0" => :none,
  "1" => :ss,
  "2" => :ss_or_itn
}

CSV.foreach(Rails.root.join('db', 'safestart.csv'), {
    headers: :first_row
  }) do |row|
    attrs = {
      name: row[0],
      address: row[1],
      zip: row[2],
      phone: row[3],
      ssh: row[4],
      ssa: row[5],
      mf: row[6],
      yf: 0,
      mb: row[7],
      od: row[8],
      of: row[9],
      gid: row[10],
      ssitn: row[11],
      notes: row[12]
    }

    # normalize phones
    attrs[:phone] = attrs[:phone].gsub(/[()\.\-)]/, '').to_i

    # parse out the monthly fee number
    attrs[:mf] = attrs[:mf][/\d+/].to_i

    # yearly fee?
    if match = attrs[:of].match(/(\d) Annual/)
      attrs[:yf] = match[1].to_i
    end

    # one-time opening fee?
    if match = attrs[:of].match(/(\d) OT/)
      attrs[:of] = match[1].to_i
    else
      attrs[:of] = 0
    end

    attrs[:ssitn] = ssitn_map[attrs[:ssitn]]

    bank = Bank.new(attrs)

    puts bank.attributes
    #puts bank.errors unless bank.save
end


