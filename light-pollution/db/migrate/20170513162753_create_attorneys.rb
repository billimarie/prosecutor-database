class CreateAttorneys < ActiveRecord::Migration[5.0]
  def change
    create_table :attorneys do |t|
      t.string :name
      t.string :party
      t.string :status
      t.string :district

      t.timestamps
    end
  end
end
