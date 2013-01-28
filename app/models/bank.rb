class Bank
  include Mongoid::Document

  field :name, type: String
  field :address, type: String
  field :zip, type: Integer
  field :phone, type: Integer
  field :ssh, as: :safe_stop_hub, type: Boolean
  field :ssa, as: :safe_stop_account, type: Boolean
  field :mf, as: :monthly_fee, type: Float
  field :yf, as: :yearly_fee, type: Float
  field :mb, as: :min_balance, type: Float
  field :od, as: :opening_deposit, type: Float
  field :of, as: :opening_fee, type: Float
  field :gid, as: :government_id, type: Boolean
  field :ssitn, type: Integer
  field :notes, type: String

end
