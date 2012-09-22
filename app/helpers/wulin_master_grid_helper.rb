module WulinMasterGridHelper
  def select_options(column)
    if column.choices.is_a?(Array)
      # column.choices.map{|o| {:id => o, :name => o}}
      column.choices.map{|o| o.is_a?(Hash) ? [o[:name], o[:id]] : o }
    else
      []
    end
  end
  
  def fetch_path(column)
    column.choices.is_a?(String) ? column.choices : nil
  end
  
  def select_tag_options(column)
    choices = column.options[:choices]
    if choices.is_a?(Array)
      choices.map!{|o| o.is_a?(Hash) ? o : {:id => o, :name => o} }
      choices.inject(''){|options, x| options << "<option value='#{x[:id]}'>#{x[:name]}</option>"}.html_safe
    elsif choices.is_a?(Hash) # TODO: support hash options
      choices.map{|k,v| v.inject("<option value=''></option>"){|str, e| str << "<option value='#{e}' data-key='#{k}' style='display:none'>#{e}</option>"}}.inject(""){|options, x| options << x}.html_safe
    else
      []
    end
  end
  
  def select_tag_fetch_path(column)
    column.options[:choices].is_a?(String) ? column.options[:choices] : nil 
  end
  
  def date_column?(column)
    'true' if column.sql_type.to_s.downcase == 'date'
  end
  
  def datetime_column?(column)
    'true' if column.sql_type.to_s.downcase == 'datetime'
  end

  def time_column?(column)
    'true' if column.options[:editor] == 'TimeCellEditor'
  end
  
  def get_column_name(column)
    if column.sql_type.to_s == 'has_and_belongs_to_many' or column.sql_type.to_s == 'has_many'
      column.reflection.name.to_s
    else
      column.form_name
    end
  end
  
  def formable?(column)
    if params[:action] == 'wulin_master_new_form'
      new_form_able?(column)
    elsif params[:action] == 'wulin_master_edit_form'
      edit_form_able?(column)
    else
      false
    end
  end
  
  %w(new edit).each do |form|
    module_eval <<-RUBY, __FILE__, __LINE__ + 1
      def #{form}_form_able?(column)
        formable = column.options[:formable]
        return true if formable.nil?
        if formable
          Array === formable ? formable.include?(:#{form}) : !!formable
        else
          false
        end
      end
    RUBY
  end
  

end