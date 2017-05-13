class AddNotesToAttorneys < ActiveRecord::Migration[5.0]
  def change
    add_column :attorneys, :notes, :text
  end
end
