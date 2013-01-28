class Admin::BanksController < Admin::AdminController
  def index
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
      render json: @bank, status: :updated, location: @bank
    else
      render json: @bank.errors, status: :failed
    end
  end

  def delete
    @bank = Bank.find(params[:id])
    if @bank.destroy
      render json: @bank, status: :deleted
    else
      render json: @bank.errors, status: :failed
    end
  end
end
