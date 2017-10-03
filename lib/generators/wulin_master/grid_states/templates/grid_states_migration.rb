class CreateGridStates < ActiveRecord::Migration[5.0]
  def change
    unless table_exists?(:grid_states)
      create_table :grid_states do |t|
        t.integer :user_id
        t.string  :name, default: 'default'
        t.string  :grid_name
        t.boolean :current, default: false, null: false
        t.string  :state_value
        t.timestamps
      end
      add_index :grid_states, :user_id
    end
  end
end
