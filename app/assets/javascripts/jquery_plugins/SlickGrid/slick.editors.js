/* THESE FORMATTERS & EDITORS ARE JUST SAMPLES! */

(function($) {

    var SlickEditor = {

        SelectorCellFormatter : function(row, cell, value, columnDef, dataContext) {
            return (!dataContext ? "" : row);
        },

        PercentCompleteCellFormatter : function(row, cell, value, columnDef, dataContext) {
            if (value == null || value === "")
                return "-";
            else if (value < 50)
                return "<span style='color:red;font-weight:bold;'>" + value + "%</span>";
            else
                return "<span style='color:green'>" + value + "%</span>";
        },

        GraphicalPercentCompleteCellFormatter : function(row, cell, value, columnDef, dataContext) {
            if (value == null || value === "")
                return "";

            var color;

            if (value < 30)
                color = "red";
            else if (value < 70)
                color = "silver";
            else
                color = "green";

            return "<span class='percent-complete-bar' style='background:" + color + ";width:" + value + "%'></span>";
        },

        YesNoCellFormatter : function(row, cell, value, columnDef, dataContext) {
            return value ? "Yes" : "No";
        },

        BoolCellFormatter : function(row, cell, value, columnDef, dataContext) {
            return value ? "<img src='/assets/tick.png'>" : "";
        },

        TaskNameFormatter : function(row, cell, value, columnDef, dataContext) {
            // todo:  html encode
            var spacer = "<span style='display:inline-block;height:1px;width:" + (2 + 15 * dataContext["indent"]) + "px'></span>";
            return spacer + " <img src='../images/expand.gif'>&nbsp;" + value;
        },

        ResourcesFormatter : function(row, cell, value, columnDef, dataContext) {
            var resources = dataContext["resources"];

            if (!resources || resources.length == 0)
                return "";

            if (columnDef.width < 50)
                return (resources.length > 1 ? "<center><img src='../images/user_identity_plus.gif' " : "<center><img src='../images/user_identity.gif' ") +
                        " title='" + resources.join(", ") + "'></center>";
            else
                return resources.join(", ");
        },

        StarFormatter : function(row, cell, value, columnDef, dataContext) {
            return (value) ? "<img src='../images/bullet_star.png' align='absmiddle'>" : "";
        },
        
        // Date cell formatter to handle "yy-mm-dd" format (for StandardDateCellEditor)
        StandardDateCellFormatter: function(row, cell, value, columnDef, dataContext) {
            if (value == null || value === "") {
              return "";
            }
            var thedate = $.datepicker.parseDate("yy-mm-dd", value);
            return $.datepicker.formatDate(columnDef.DateShowFormat, thedate);
        },
        
        BelongsToFormatter : function(row, cell, value, columnDef, dataContext) {
  					return dataContext[columnDef.id][columnDef.optionTextAttribute];
  			},
        
        TextCellEditor : function(args) {
            var $input;
            var defaultValue;
            var scope = this;

            this.init = function() {
                $input = $("<INPUT type=text class='editor-text' />")
                    .appendTo(args.container)
                    .bind("keydown.nav", function(e) {
                        if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
                            e.stopImmediatePropagation();
                        }
                    })
                    .focus()
                    .select();
            };

            this.destroy = function() {
                $input.remove();
            };

            this.focus = function() {
                $input.focus();
            };

            this.getValue = function() {
                return $input.val();
            };

            this.setValue = function(val) {
                $input.val(val);
            };

            this.loadValue = function(item) {
                defaultValue = item[args.column.field] || "";
                $input.val(defaultValue);
                $input[0].defaultValue = defaultValue;
                $input.select();
            };

            this.serializeValue = function() {
                return $input.val();
            };

            this.applyValue = function(item,state) {
                item[args.column.field] = state;
            };

            this.isValueChanged = function() {
                return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
            };

            this.validate = function() {
                if (args.column.validator) {
                    var validationResults = args.column.validator($input.val());
                    if (!validationResults.valid)
                        return validationResults;
                }

                return {
                    valid: true,
                    msg: null
                };
            };
            
            this.getCell = function(){
              return $input.parent();
            };
            
            this.init();
        },

        IntegerCellEditor : function(args) {
            var $input;
            var defaultValue;
            var scope = this;

            this.init = function() {
                $input = $("<INPUT type=text class='editor-text' />");

                $input.bind("keydown.nav", function(e) {
                    if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
                        e.stopImmediatePropagation();
                    }
                });

                $input.appendTo(args.container);
                $input.focus().select();
            };

            this.destroy = function() {
                $input.remove();
            };

            this.focus = function() {
                $input.focus();
            };

            this.loadValue = function(item) {
                defaultValue = item[args.column.field];
                $input.val(defaultValue);
                $input[0].defaultValue = defaultValue;
                $input.select();
            };

            this.serializeValue = function() {
                return parseInt($input.val(),10) || 0;
            };

            this.applyValue = function(item,state) {
                item[args.column.field] = state;
            };

            this.isValueChanged = function() {
                return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
            };

            this.validate = function() {
                if (isNaN($input.val()))
                    return {
                        valid: false,
                        msg: "Please enter a valid integer"
                    };

                return {
                    valid: true,
                    msg: null
                };
            };
            
            this.getCell = function(){
              return $input.parent();
            };

            this.init();
        },

        DateCellEditor : function(args) {
            var $input;
            var defaultValue;
            var scope = this;
            var calendarOpen = false;

            this.init = function() {
                $input = $("<INPUT type=text class='editor-text' />");
                $input.appendTo(args.container);
                $input.focus().select();
                $input.datepicker({
                    showOn: "button",
                    buttonImageOnly: true,
                    buttonImage: "../images/calendar.gif",
                    beforeShow: function() { calendarOpen = true },
                    onClose: function() { calendarOpen = false }
                });
                $input.width($input.width() - 18);
            };

            this.destroy = function() {
                $.datepicker.dpDiv.stop(true,true);
                $input.datepicker("hide");
                $input.datepicker("destroy");
                $input.remove();
            };

            this.show = function() {
                if (calendarOpen) {
                    $.datepicker.dpDiv.stop(true,true).show();
                }
            };

            this.hide = function() {
                if (calendarOpen) {
                    $.datepicker.dpDiv.stop(true,true).hide();
                }
            };

            this.position = function(position) {
                if (!calendarOpen) return;
                $.datepicker.dpDiv
                    .css("top", position.top + 30)
                    .css("left", position.left);
            };

            this.focus = function() {
                $input.focus();
            };

            this.loadValue = function(item) {
                defaultValue = item[args.column.field];
                $input.val(defaultValue);
                $input[0].defaultValue = defaultValue;
                $input.select();
            };

            this.serializeValue = function() {
                return $input.val();
            };

            this.applyValue = function(item,state) {
                item[args.column.field] = state;
            };

            this.isValueChanged = function() {
                return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
            };

            this.validate = function() {
                return {
                    valid: true,
                    msg: null
                };
            };
            
            this.getCell = function(){
              return $input.parent();
            };

            this.init();
        },
        
        // Date cell editor which can handle "yy-mm-dd" format
        StandardDateCellEditor: function(args) {
            var $input;
            var defaultValue;
            var scope = this;
            var calendarOpen = false;
            var showFormat = "yy-mm-dd";
            var sourceFormat = "yy-mm-dd";
            
            this.init = function() {
                if (args.column.DateSourceFormat != undefined) {
                    sourceFormat = args.column.DateSourceFormat;
                }
                if (args.column.DateShowFormat != undefined) {
                    showFormat = args.column.DateShowFormat;
                }
                $input = $("<INPUT type=text class='editor-text' />");
                $input.appendTo(args.container);
                $input.focus().select();
                $input.datepicker({
                  showOn: "button",
                  buttonImageOnly: true,
                  buttonImage: "/assets/calendar.gif",
                  beforeShow: function() { calendarOpen = true },
                  onClose: function() { calendarOpen = false },
                  dateFormat: showFormat
                });
                $input.width($input.width() - 18);
            };
            
            this.destroy = function() {
                $.datepicker.dpDiv.stop(true, true);
                $input.datepicker("hide");
                $input.datepicker("destroy");
                $input.remove();
            };
            
            this.show = function() {
                if (calendarOpen) {
                    $.datepicker.dpDiv.stop(true, true).show();
                }
            };
            
            this.hide = function() {
                if (calendarOpen) {
                    $.datepicker.dpDiv.stop(true, true).hide();
                }
            };
            
            this.position = function(position) {
                if (!calendarOpen) return;
                $.datepicker.dpDiv
                .css("top", position.top + 30)
                .css("left", position.left);
            };
            
            this.focus = function() {
                $input.focus();
            };
            
            this.loadValue = function(item) {
                defaultValue = item[args.column.field];
                var thedate = $.datepicker.parseDate(sourceFormat, defaultValue);
                defaultValue = $.datepicker.formatDate(showFormat, thedate);
                $input.val(defaultValue);
                $input[0].defaultValue = defaultValue;
                $input.select();
            };
            
            this.serializeValue = function() {
                var thedate = $.datepicker.parseDate(showFormat, $input.val());
                return $.datepicker.formatDate(sourceFormat,
                thedate);
            };
            
            this.applyValue = function(item, state) {
                item[args.column.field] = state;
            };
            
            this.isValueChanged = function() {
                return (! ($input.val() == "" && defaultValue == null))
                && ($input.val() != defaultValue);
            };
            
            this.validate = function() {
                return {
                    valid: true,
                    msg: null
                };
            };
            
            this.getCell = function(){
              return $input.parent();
            };
            
            this.init();
        },

        YesNoSelectCellEditor : function(args) {
            var $select;
            var defaultValue;
            var scope = this;

            this.init = function() {
                $select = $("<SELECT tabIndex='0' class='editor-yesno'><OPTION value='yes'>Yes</OPTION><OPTION value='no'>No</OPTION></SELECT>");
                $select.appendTo(args.container);
                $select.focus();
            };

            this.destroy = function() {
                $select.remove();
            };

            this.focus = function() {
                $select.focus();
            };

            this.loadValue = function(item) {
                $select.val((defaultValue = item[args.column.field]) ? "yes" : "no");
                $select.select();
            };

            this.serializeValue = function() {
                return ($select.val() == "yes");
            };

            this.applyValue = function(item,state) {
                item[args.column.field] = state;
            };
           
            this.isValueChanged = function() {
                return ($select.val() != defaultValue);
            };

            this.validate = function() {
                return {
                    valid: true,
                    msg: null
                };
            };

            this.init();
        },

        YesNoCheckboxCellEditor : function(args) {
            var $select;
            var defaultValue;
            var scope = this;

            this.init = function() {
                $select = $("<INPUT type=checkbox class='editor-checkbox' hideFocus>");
                $select.appendTo(args.container);
                $select.focus();
            };

            this.destroy = function() {
                $select.remove();
            };

            this.focus = function() {
                $select.focus();
            };

            this.loadValue = function(item) {
                defaultValue = item[args.column.field];
                if (defaultValue) {
                  $select.attr("checked", "checked");
                } else {
                  $select.removeAttr("checked");
                }
            };

            this.serializeValue = function() {
                return $select[0].checked;
            };

            this.applyValue = function(item,state) {
                item[args.column.field] = state;
            };

            this.isValueChanged = function() {
                var currentValue = $select[0].checked;
                return (currentValue != defaultValue);
            };

            this.validate = function() {
                return {
                    valid: true,
                    msg: null
                };
            };
            
            this.getCell = function(){
              return $select.parent();
            };

            this.init();
        },

        PercentCompleteCellEditor : function(args) {
            var $input, $picker;
            var defaultValue;
            var scope = this;

            this.init = function() {
                $input = $("<INPUT type=text class='editor-percentcomplete' />");
                $input.width($(args.container).innerWidth() - 25);
                $input.appendTo(args.container);

                $picker = $("<div class='editor-percentcomplete-picker' />").appendTo(args.container);
                $picker.append("<div class='editor-percentcomplete-helper'><div class='editor-percentcomplete-wrapper'><div class='editor-percentcomplete-slider' /><div class='editor-percentcomplete-buttons' /></div></div>");

                $picker.find(".editor-percentcomplete-buttons").append("<button val=0>Not started</button><br/><button val=50>In Progress</button><br/><button val=100>Complete</button>");

                $input.focus().select();

                $picker.find(".editor-percentcomplete-slider").slider({
                    orientation: "vertical",
                    range: "min",
                    value: defaultValue,
                    slide: function(event, ui) {
                        $input.val(ui.value)
                    }
                });

                $picker.find(".editor-percentcomplete-buttons button").bind("click", function(e) {
                    $input.val($(this).attr("val"));
                    $picker.find(".editor-percentcomplete-slider").slider("value", $(this).attr("val"));
                })
            };

            this.destroy = function() {
                $input.remove();
                $picker.remove();
            };

            this.focus = function() {
                $input.focus();
            };

            this.loadValue = function(item) {
                $input.val(defaultValue = item[args.column.field]);
                $input.select();
            };

            this.serializeValue = function() {
                return parseInt($input.val(),10) || 0;
            };

            this.applyValue = function(item,state) {
                item[args.column.field] = state;
            };

            this.isValueChanged = function() {
                return (!($input.val() == "" && defaultValue == null)) && ((parseInt($input.val(),10) || 0) != defaultValue);
            };

            this.validate = function() {
                if (isNaN(parseInt($input.val(),10)))
                    return {
                        valid: false,
                        msg: "Please enter a valid positive number"
                    };

                return {
                    valid: true,
                    msg: null
                };
            };
            
            this.getCell = function(){
              return $input.parent();
            };

            this.init();
        },

        StarCellEditor : function(args) {
            var $input;
            var defaultValue;
            var scope = this;

            function toggle(e) {
                if (e.type == "keydown" && e.which != 32) return;

                if ($input.css("opacity") == "1")
                    $input.css("opacity", 0.5);
                else
                    $input.css("opacity", 1);

                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            this.init = function() {
                $input = $("<IMG src='../images/bullet_star.png' align=absmiddle tabIndex=0 title='Click or press Space to toggle' />")
                    .bind("click keydown", toggle)
                    .appendTo(args.container)
                    .focus();
            };

            this.destroy = function() {
                $input.unbind("click keydown", toggle);
                $input.remove();
            };

            this.focus = function() {
                $input.focus();
            };

            this.loadValue = function(item) {
                defaultValue = item[args.column.field];
                $input.css("opacity", defaultValue ? 1 : 0.2);
            };

            this.serializeValue = function() {
                return ($input.css("opacity") == "1");
            };

            this.applyValue = function(item,state) {
                item[args.column.field] = state;
            };

            this.isValueChanged = function() {
                return defaultValue != ($input.css("opacity") == "1");
            };

            this.validate = function() {
                return {
                    valid: true,
                    msg: null
                };
            };
            
            this.getCell = function(){
              return $input.parent();
            };

            this.init();
        },

        /*
         * An example of a "detached" editor.
         * The UI is added onto document BODY and .position(), .show() and .hide() are implemented.
         * KeyDown events are also handled to provide handling for Tab, Shift-Tab, Esc and Ctrl-Enter.
         */
        LongTextCellEditor : function (args) {
            var $input, $wrapper;
            var defaultValue;
            var scope = this;

            this.init = function() {
                var $container = $("body");

                $wrapper = $("<DIV style='z-index:10000;position:absolute;background:white;padding:5px;border:3px solid gray; -moz-border-radius:10px; border-radius:10px;'/>")
                    .appendTo($container);

                $input = $("<TEXTAREA hidefocus rows=5 style='backround:white;width:250px;height:80px;border:0;outline:0'>")
                    .appendTo($wrapper);

                $("<DIV style='text-align:right'><BUTTON>Save</BUTTON><BUTTON>Cancel</BUTTON></DIV>")
                    .appendTo($wrapper);

                $wrapper.find("button:first").bind("click", this.save);
                $wrapper.find("button:last").bind("click", this.cancel);
                $input.bind("keydown", this.handleKeyDown);

                scope.position(args.position);
                $input.focus().select();
            };

            this.handleKeyDown = function(e) {
                if (e.which == $.ui.keyCode.ENTER && e.ctrlKey) {
                    scope.save();
                }
                else if (e.which == $.ui.keyCode.ESCAPE) {
                    e.preventDefault();
                    scope.cancel();
                }
                else if (e.which == $.ui.keyCode.TAB && e.shiftKey) {
                    e.preventDefault();
                    grid.navigatePrev();
                }
                else if (e.which == $.ui.keyCode.TAB) {
                    e.preventDefault();
                    grid.navigateNext();
                }
            };

            this.save = function() {
                args.commitChanges();
            };

            this.cancel = function() {
                $input.val(defaultValue);
                args.cancelChanges();
            };

            this.hide = function() {
                $wrapper.hide();
            };

            this.show = function() {
                $wrapper.show();
            };

            this.position = function(position) {
                $wrapper
                    .css("top", position.top - 5)
                    .css("left", position.left - 5)
            };

            this.destroy = function() {
                $wrapper.remove();
            };

            this.focus = function() {
                $input.focus();
            };

            this.loadValue = function(item) {
                $input.val(defaultValue = item[args.column.field]);
                $input.select();
            };

            this.serializeValue = function() {
                return $input.val();
            };

            this.applyValue = function(item,state) {
                item[args.column.field] = state;
            };

            this.isValueChanged = function() {
                return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
            };

            this.validate = function() {
                return {
                    valid: true,
                    msg: null
                };
            };
            
            this.getCell = function(){
              return $input.parent();
            };

            this.init();
        },
        
        
        // The editor which use jquery.chosen to allow you inputting multiple values that belongs to a record
        BelongsToEditor : function(args) {
  				var $select;
  				var choices = args.column.choices;
  				var optionTextAttribute = args.column.optionTextAttribute || 'name';
  				var width = args.position.width;
  				var horizontalMargin = 4;
  				var defaultValue;

  				this.init = function() {
  				  if (args.column.type === 'has_and_belongs_to_many') {
  				    $select = $("<select class='chzn-select' multiple></select>");
  				  } else {
  				    $select = $("<select class='chzn-select'></select>");
  				  }
  					$select.css('width', width-horizontalMargin);
            $select.appendTo(args.container);
            $select.focus();
  					var options = "";
  					$.each(choices, function() {
  						options += "<option value='"+this.id+"'>"+this[optionTextAttribute]+"</option>";
  					});
  					$select.html(options);

  					// FIXME
  					// Fix keyboard enter bug stupidly, find a better way please.
            setTimeout(function(){
                        $(".grid_container .chzn-drop").css('left', '0');
                        }, 100);
  				};

  				this.destroy = function() {
  		        // remove all data, events & dom elements created in the constructor
              $select.remove();
  		    };

  		    this.focus = function() {
  		        // set the focus on the main input control (if any)
              $select.focus();
  		    };

  		    this.isValueChanged = function() {
  		        // return true if the value(s) being edited by the user has/have been changed
  						return ($select.val() != defaultValue);
  		    };

  		    this.serializeValue = function() {
  		        // return the value(s) being edited by the user in a serialized form
  		        // can be an arbitrary object
  		        // the only restriction is that it must be a simple object that can be passed around even
  		        // when the editor itself has been destroyed
  						var obj = {id: $select.val()};
  						if (args.column.type === 'has_and_belongs_to_many') {
    				    obj[optionTextAttribute] = $.map($('option:selected', $select), function(n){
                  return $(n).text();
                }).join();
    				  } else {
    				    obj[optionTextAttribute] = $('option:selected', $select).text();
    				  }
  		        return obj;
  		    };

  		    this.loadValue = function(item) {
  		        // load the value(s) from the data item and update the UI
  		        // this method will be called immediately after the editor is initialized
  		        // it may also be called by the grid if if the row/cell being edited is updated via grid.updateRow/updateCell
              defaultValue = item[args.column.id].id;
  						$select.val(defaultValue);
              $select.select();
  						$select.chosen().trigger("chzn:open");
  		    };

  		    this.applyValue = function(item,state) {
  		        // deserialize the value(s) saved to "state" and apply them to the data item
  		        // this method may get called after the editor itself has been destroyed
  		        // treat it as an equivalent of a Java/C# "static" method - no instance variables should be accessed
              
              item[args.column.id].id = state.id;
              item[args.column.id][optionTextAttribute] = state[optionTextAttribute];
  		    };

  		    this.validate = function() {
  		        // validate user input and return the result along with the validation message, if any
  		        // if the input is valid, return {valid:true,msg:null}
              return {
                  valid: true,
                  msg: null
              };
  		    };

  				this.getCell = function(){
            return $select.parent();
          }

  				this.init();
  			},
  			
  			
        // The editor which use jquery.chosen to allow you choose the value as select
        SelectEditor : function(args) {
  				var $select;
  				var choices = args.column.choices;
  				var width = args.position.width;
  				var horizontalMargin = 4;
  				var defaultValue;

  				this.init = function() {
				    $select = $("<select class='chzn-select'></select>");
  					$select.css('width', width-horizontalMargin);
            $select.appendTo(args.container);
            $select.focus();
  					var options = "";
  					$.each(choices, function() {
  						options += "<option value='"+this.id+"'>" + this.id + "</option>";
  					});
  					$select.html(options);

  					// FIXME
  					// Fix keyboard enter bug stupidly, find a better way please.
            setTimeout(function(){
                        $(".grid_container .chzn-drop").css('left', '0');
                        }, 100);
  				};

  				this.destroy = function() {
              $select.remove();
  		    };

  		    this.focus = function() {
              $select.focus();
  		    };

  		    this.isValueChanged = function() {
  		        // return true if the value(s) being edited by the user has/have been changed
  						return ($select.val() != defaultValue);
  		    };

  		    this.serializeValue = function() {
  						var obj = {id: $select.val()};
  				    obj.id = $('option:selected', $select).text();
  		        return obj;
  		    };

  		    this.loadValue = function(item) {
              defaultValue = item[args.column.id].id;
  						$select.val(defaultValue);
              $select.select();
  						$select.chosen().trigger("chzn:open");
  		    };

  		    this.applyValue = function(item,state) {
              item[args.column.id] = state.id;
  		    };

  		    this.validate = function() {
              return {
                  valid: true,
                  msg: null
              };
  		    };

  				this.getCell = function(){
            return $select.parent();
          }

  				this.init();
  			}


    };

    $.extend(window, SlickEditor);

})(jQuery);
