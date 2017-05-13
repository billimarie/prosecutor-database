class AddNotesToCases < ActiveRecord::Migration[5.0]
  def change
    add_column :cases, :notes, :text
  end
end
