class Case < ApplicationRecord
  belongs_to :attorney

  validates :name, :date, :type, :judgement, :ruling, :opinion_link, presence: true
end
