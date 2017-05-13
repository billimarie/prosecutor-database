class Attorney < ApplicationRecord
  has_many :cases

  validates :name, :status, :party, :district,  presence: true

end
