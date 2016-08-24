class AddIpAddressToPost < ActiveRecord::Migration
  def change
    add_column :posts, :ip_address, :string
  end
end
