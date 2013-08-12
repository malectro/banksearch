class Admin::BankCompaniesController < Admin::AdminController

  def index
    @title = 'BankCompanies'
    @bank_companys = BankCompany.all.sort(name: 1).limit(params[:limit]).skip(params[:offset])
    render json: @bank_companys
  end

  def show
    @bank_company = BankCompany.find(params[:id])
    render json: @bank_company
  end

  def create
    @bank_company = BankCompany.new(params[:bank_company])
    if @bank_company.save
      render json: @bank_company, status: :created, location: @bank_company
    else
      render json: @bank_company.errors, status: :failed
    end
  end

  def update
    @bank_company = BankCompany.find(params[:id])
    if @bank_company.update_attributes(params[:bank_company])
      render json: @bank_company, location: @bank_company
    else
      render json: @bank_company.errors, status: :failed
    end
  end

  def destroy
    @bank_company = BankCompany.find(params[:id])
    if @bank_company.destroy
      render json: @bank_company
    else
      render json: @bank_company.errors, status: :failed
    end
  end

  def all
    BankCompany.all.destroy
    render json: "kaboom"
  end
end

