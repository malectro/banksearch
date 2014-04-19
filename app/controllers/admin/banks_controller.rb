require 'csv'

class Admin::BanksController < Admin::AdminController
  def index
    @title = 'Banks'
    @banks = Bank.all.sort(name: 1).limit(params[:limit]).skip(params[:offset])
    render json: @banks
  end

  def show
    @bank = Bank.find(params[:id])
    render json: @bank
  end

  def create
    @bank = Bank.new(params[:bank])
    if @bank.save
      render json: @bank, status: :created, location: @bank
    else
      render json: @bank.errors, status: :failed
    end
  end

  def update
    @bank = Bank.find(params[:id])
    if @bank.update_attributes(params[:bank])
      render json: @bank, location: @bank
    else
      render json: @bank.errors, status: :failed
    end
  end

  def destroy
    @bank = Bank.find(params[:id])
    if @bank.destroy
      render json: @bank
    else
      render json: @bank.errors, status: :failed
    end
  end

  def csv
    ssitn_map = {
      "0" => :none,
      "1" => :ss,
      "2" => :ss_or_itn
    }

    banks = []

    CSV.foreach(params[:csv].path, {
        headers: :first_row
      }) do |row|
        attrs = {
          name: row[0],
          url: row[1],
          address: row[2],
          zip: row[3],
          phone: row[4],
          ssh: row[5],
          mf: row[6],
          mb: row[7],
          od: row[8],
          of: row[9],
          ob: row[10],
          gid: row[11],
          ssitn: row[12],
          notes: row[13],
          hours: row[14],
          esp: row[15],
          ssa: 0,
          yf: 0
        }

        company_attrs = {
          name: row[0],
          info: row[16]
        }

        # normalize phones
        attrs[:phone] = attrs[:phone].gsub(/[()\.\-)]/, '').to_i

        # parse out the monthly fee number
        attrs[:mf] = attrs[:mf][/\d+/].to_i

        # yearly fee?
        if attrs[:of] and match = attrs[:of].match(/(\d) Annual/)
          attrs[:yf] = match[1].to_i
        end

        # one-time opening fee?
        if attrs[:of] and match = attrs[:of].match(/(\d) OT/)
          attrs[:of] = match[1].to_i
        else
          attrs[:of] = 0
        end

        attrs[:ssitn] = ssitn_map[attrs[:ssitn]]

        company = BankCompany.find_or_create_by({
          name: company_attrs[:name]
        })

        company.info = company_attrs[:info]
        company.save

        attrs[:bank_company_id] = company.id

        bank = Bank.new(attrs)

        if bank.save
          banks << bank
        end
    end

    render json: banks
  end

  def all
    Bank.all.destroy
    render json: "ouch"
  end
end

