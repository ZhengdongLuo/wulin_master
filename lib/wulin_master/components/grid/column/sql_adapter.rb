module WulinMaster
  class SqlAdapter
    attr_accessor :model, :query

    def initialize(model, query)
      @model = model
      @query = query
    end

    %w(null_query boolean_query string_query).each do |method_name|
      class_eval <<-RUBY, __FILE__, __LINE__ + 1
        def #{method_name}(column_name, value, column)
          if model < ActiveRecord::Base
            @query = SqlQuery.#{method_name}(@query, column_name, value, column)
          end
        end
      RUBY
    end
  end

  module SqlQuery
    def null_query(query, column_name, value, _column)
      query.where("#{column_name} IS #{value} NULL")
    end

    def boolean_query(query, column_name, value, column)
      if ((column.options[:formatter] == 'YesNoCellFormatter') || (column.options[:inner_formatter] == 'YesNoCellFormatter')) && !value
        query.where("#{column_name} = ? OR #{column_name} is NULL", 'f')
      else
        query.where(column_name => value)
      end
    end

    def string_query(query, column_name, value, _column)
      query.where(["UPPER(cast((#{column_name}) as text)) LIKE UPPER(?)", value + "%"])
    end

    module_function :null_query, :boolean_query, :string_query
  end
end
