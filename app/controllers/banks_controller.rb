class BanksController < ApplicationController

  def index

    @banks = Bank.first

  end

end
