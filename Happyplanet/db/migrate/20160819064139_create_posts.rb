class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.date :date
      t.string :image
      t.string :location
      t.float :latitude
      t.float :longtitude
      t.text :description

      t.timestamps null: false
    end
  end
end
