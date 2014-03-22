class BankCompany
  include Mongoid::Document

  has_many :banks

  field :name, type: String
  field :info, type: String

  validates_uniqueness_of :name
end

