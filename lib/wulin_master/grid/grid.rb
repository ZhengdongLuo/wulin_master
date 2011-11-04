require File.join(File.dirname(__FILE__), 'toolbar')
require File.join(File.dirname(__FILE__), 'toolbar_item')
require File.join(File.dirname(__FILE__), 'column')
require File.join(File.dirname(__FILE__), 'grid_styling')
require File.join(File.dirname(__FILE__), 'grid_columns')
require File.join(File.dirname(__FILE__), 'grid_toolbar')

module WulinMaster
  class Grid
    include GridStyling
    include GridColumns
    include GridToolbar

    CONFIGURABLE_ACTIONS = %w(add delete)
    cattr_accessor :grids
    @@grids = []

    # Grid has been subclassed
    def self.inherited(klass)
      @@grids << klass
      klass.init
    end

    # Class methods
    # -------------------
    class << self
      # Called when the grid is subclassed
      def init
        initialize_columns
        initialize_toolbar
      end

      attr_accessor :controller_class

      [:title, :model, :path].each do |attr|
        define_method attr do |*new_attr|
          (new_attr.size > 0) ? self.instance_variable_set("@#{attr}".to_sym, new_attr.first) : self.instance_variable_get("@#{attr}".to_sym)
        end
      end

      def actions(*args)
        actions_str = args.map(&:to_s) & CONFIGURABLE_ACTIONS
        self.toolbar.delete_if{ |t| t.title.downcase == 'add' } unless actions_str.include?('add')
        self.toolbar.delete_if{ |t| t.title.downcase == 'delete' } unless actions_str.include?('delete')
      end
    end

    # Instance methods
    # --------------------
    attr_accessor :controller

    def initialize(controller_instance)
      self.controller = controller_instance
    end

    # Grid Properties that can be overriden
    def title
      self.class.title || self.class.to_s.humanize
    end

    def model
      self.class.model
    end

    def path
      self.class.path
    end

    def name
      self.class.to_s.sub('Grid', '').underscore
    end

    # Helpers for SQL and Javascript generation
    # ----------
    def sql_columns
      self.columns.map(&:sql_names).flatten.uniq.map(&:to_s)
    end

    def apply_filter(query, column_name, filtering_value)
      column = self.columns.find{|c| c.name.to_s == column_name.to_s}
      column.nil? ? query : column.apply_filter(query, filtering_value)
    end

    # Returns the includes to add to the query
    def includes
      self.columns.map{|col| col.includes}.flatten.uniq
    end

    # Returns the joins to add to the query
    def joins
      self.columns.map{|col| col.joins}.flatten.uniq
    end

    def arraify(objects)
      objects.collect do |object|
        self.columns.collect {|col| {col.name => col.json(object)} }
      end
    end

    def javascript_column_model
      @javascript_column_model = self.columns.collect(&:to_column_model).to_json
    end

    # State

    def states_for_user(user)
      return "false" if user.nil?
      result = {}
      begin
        states = GridState.where(:user_id => user.id, :grid_name => self.name)
        ["width", "sort", "order", "visibility"].each do |t|
          value = states.where(:state_type => t).first.try(:state_value)
          result.merge!(t => ActiveSupport::JSON.decode(value)) if value
        end
        result.to_json
      rescue Exception => e
        Rails.logger.info "Exception thrown while trying to get user states: #{e.inspect}"
        {}.to_json
      end
    end

    def get_actions
      (self.toolbar.map(&:title).map(&:downcase) & CONFIGURABLE_ACTIONS).to_json
    end
  end
end