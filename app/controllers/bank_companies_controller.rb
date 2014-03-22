class BankCompaniesController < ApplicationController

  def index
    @companies = BankCompany.all.limit(params[:limit]).offset(params[:offset])
    render json: @companies
  end

  def show
    @companies = BankCompany.find(params[:id])
    render json: @companies
  end

end
