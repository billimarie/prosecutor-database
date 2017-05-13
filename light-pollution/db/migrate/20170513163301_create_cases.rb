class CreateCases < ActiveRecord::Migration[5.0]
  def change
    create_table :cases do |t|
      t.string :name
      t.datetime :date
      t.string :type
      t.string :judgment
      t.text :ruling
      t.string :opinion_link

      t.timestamps
    end
  end
end
