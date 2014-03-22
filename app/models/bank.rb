class Bank
  include Mongoid::Document
  include Mongoid::Spacial::Document

  belongs_to :bank_company

  field :name, type: String
  field :address, type: String
  field :geo, type: Array, spacial: true
  field :zip, type: Integer
  field :phone, type: Integer
  field :ssh, as: :safe_stop_hub, type: Boolean
  field :ssa, as: :safe_stop_account, type: Boolean
  field :mf, as: :monthly_fee, type: Float
  field :yf, as: :yearly_fee, type: Float
  field :mb, as: :min_balance, type: Float
  field :od, as: :opening_deposit, type: Float
  field :of, as: :opening_fee, type: Float
  field :ob, as: :online_bank, type: Boolean
  field :gid, as: :government_id, type: Boolean
  field :esp, as: :spanish, type: Boolean
  field :ssitn, type: Symbol
  field :notes, type: String
  field :hours, type: String

  validates_uniqueness_of :address

  index({address: 1}, {unique: true})

  #spacial_index :geo
end
