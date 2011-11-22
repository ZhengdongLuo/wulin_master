// ------------------------------------ UI tools -----------------------------------------
var Ui = {	
  // Select record id attribute form grid - shouldn't this be an extension of Grid ? Why in Ui? Ui == User interface?
  selectIds: function(grid){
    var selectedIndexes = grid.getSelectedRows();
    var ids, item;
    if (grid == null) return false;
    if (selectedIndexes.length > 0) {
      ids = $.map(selectedIndexes,function(n, i) { 
        item = grid.loader.data[n];
        return item['id']; 
        }).join();
        return ids;
    } else {
        return false;
    }
  },

    // return true if the dialog of grid with "name" is open, unless return false 
  isOpen: function() {
    return ($(".ui-dialog:visible").size() > 0);
  },

  // check if the grid is being edited
  isEditing: function() {
    var editing = false;
    $.each(gridManager.grids, function(){
      if(this.isEditing()) editing = true;
    });
    return editing;
  },
    
  //check if filter panel is open
  filterPanelOpen: function() {
    return ($('.slick-headerrow-columns:visible').size() > 0 && $( document.activeElement ).parent().attr('class') === 'slick-headerrow-columns');
  },

  // Select grid names
  selectGridNames: function() {
    var gridContainers = $(".grid_container"), gridName;
    return $.map( gridContainers, function(container){
      gridName = $.trim($(container).attr("id").split("grid_")[1]);
      if (gridName) {
        return gridName;
      }
    });
  },

  // Reset form
  resetForm: function(name) {
    $(':input','#new_' + name).not(':button, :submit, :reset, :hidden').val('').removeAttr('checked').removeAttr('selected');
    // For chosen
    $('ul.chzn-choices li.search-choice').remove();
  },

  // Create and open dialog
  openDialog: function(name) {
    $( '#' + name + '-form' ).dialog({
      height: 300,
      width: 500,
      show: "blind",
      modal: true,
      open: function(event, ui) {
      // The latest jqueryui had fixed the open event's bug,so the below will be works fine 
      $( '#' + name + '-form input:text' ).first().focus();
			},
      close: function(event, ui) { 
        $(this).find("input:text").val("");
        $(this).find(".field_error").text(""); 
        setTimeout(function(){
          Ui.highlightCreatedRows(name);
          gridManager.createdIds = [];
        }, 300);
        window._focused = {};
      }
    });
  },

  // Close dialog
  closeDialog: function(name) {
    $( '#' + name + '-form' ).dialog( "close" );
    setTimeout(function(){
      Ui.highlightCreatedRows(name);
      gridManager.createdIds = [];
      }, 300);
  },

  // Handle delete confirm with dialog
  deleteGrids: function(ids) {
    $( "#confirm_dialog" ).dialog({
      modal: true,
      buttons: {
        Yes: function() {
          Requests.deleteByAjax(Ui.findCurrentGrid(), ids);
          $( this ).dialog( "close" );
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      }
    });
  },

  // Highlight the created rows after close the dialog
  highlightCreatedRows: function(name) {
    var grid = gridManager.getGrid(name),
    createdRows = [];
    $.each(gridManager.createdIds, function(){
      if (grid.getRowByRecordId(this).row) {
        createdRows.push(grid.getRowByRecordId(this).row);
      }
    });
    $.each(createdRows, function(){
      $(this).effect( 'highlight', {}, 5000 );
    });
  },

  // Flash the notification
  flashNotice: function(ids, action) {
    var recordSize = $.isArray(ids) ? ids.length : ids.split(',').length,
    recordUnit = recordSize > 1 ? 'records' : 'record',
    actionDesc = action === 'delete' ? 'has been deleted!' : 'has been created!';

    if (recordSize > 0) {
      $('.notice_flash').remove();
      $('#indicators').before('<div class="notice_flash">' + recordSize + ' ' + recordUnit + ' ' + actionDesc + '</div>');
      $('.notice_flash').fadeOut(7000);
    }
  },

  // Find the selected grid
  findCurrentGrid: function() {
    var currentGrid = null;
    currentGridContainer = $('.grid_container:visible');
    if (currentGridContainer.size() == 0) {
      return null;
    }
    gridName = currentGridContainer.attr('id').split('grid_')[1];

    if (gridManager.grids.length == 1) {
      currentGrid = gridManager.grids[0]
    } else {
      if (currentGridContainer.size() == 1) {
        currentGrid = gridManager.getGrid(gridName);
      } else {
        $.each(gridManager.grids, function(){
          if(this.getSelectedRows().length > 0) currentGrid = this;
        });
      }
    }
    return currentGrid;
  },
  
  addAble: function(grid) {
    return grid.actions.indexOf('add') != -1;
  },
  
  deleteAble: function(grid) {
    return grid.actions.indexOf('delete') != -1;
	},
	
	formatData: function(grid, arrayData) {
	  var data = {}, columns;
    columns = grid.loader.getColumns();
	  $.each(columns, function(index, column){
	    data[column['id']] = arrayData[index];
	  })
	  return data;
	}

};



// ------------------------- keypress action --------------------------------------
(function($) {
  $(document).keypress(function(e){
    var isEditing = Ui.isEditing(), 
    isOpen = Ui.isOpen(),
    filterPanelOpen = Ui.filterPanelOpen(),
    grid = Ui.findCurrentGrid();
    if (grid) {
      var ids = Ui.selectIds(grid),
      gridSize = gridManager.grids.length;

      if (isOpen || isEditing || filterPanelOpen) {
        return true;
      } else {
        if (Ui.deleteAble(grid) && (e.which == 100 || e.which == 68)) {  // keypress 'D' for delete
          if (ids) {
            Ui.deleteGrids(ids);
            return false;
          }
          return false;
        } else if (Ui.addAble(grid) && (e.which == 99 || e.which == 67)) {  // keypress 'C' for show dialog
          if (gridSize > 0 && grid) {
            Ui.openDialog(grid.name);
            return false;
          }
          return false;
        } else {
          return true;
        }
      }
    }	
  });
})(jQuery);
