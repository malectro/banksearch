class Admin::AdminController < ActionController::Base
  protect_from_forgery

  #activate this for production
  USERS = { "username" => "password" }
  before_filter :authenticate if ENV['RAILS_ENV'] == 'production'

  layout "admin"

  MODELS = [Bank]

  def index

  end

private

  def authenticate
    authenticate_or_request_with_http_digest do |username|
      USERS[username]
    end
  end

end

