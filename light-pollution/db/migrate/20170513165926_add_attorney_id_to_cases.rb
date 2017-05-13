class AddAttorneyIdToCases < ActiveRecord::Migration[5.0]
  def change
    add_column :cases, :attorney_id, :integer
  end
end
