class BanksController < ApplicationController

  def index
    @banks = Bank.all.limit(params[:limit]).offset(params[:offset])
    render json: @banks
  end

  def show
    @bank = Bank.find(params[:id])
    render json: @bank
  end

end
