require 'csv'

class Admin::BankCompaniesController < Admin::AdminController
  def index
    @title = 'BankCompanies'
    @banks = Bank.all.limit(params[:limit]).offset(params[:offset])
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
          ob: row[10],
          gid: row[11],
          ssitn: row[12],
          notes: row[13],
          hours: row[14]
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

