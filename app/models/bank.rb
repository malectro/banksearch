class Bank
  include Mongoid::Document

  field :name, type: String
  field :address, type: String
  field :zip, type: Integer
  field :phone, type: Integer
  field :ssh, as: :safe_stop_hub, type: Boolean
  field :monthly_fee, type: Integer
  field :min_balance, type: Float
  field :opening_deposit, type: Float

end
