/* eslint-disable no-undef */
/**
 * @fileoverview Field search dropdown.
 * @author koen.van.wijk@ict.nl Koen van Wijk
 * 
 */
'use strict';




class FieldSearchDropdown extends Blockly.FieldDropdown {

  constructor(options, opt_validator) {
    super(options, opt_validator);

    // save the options
    this.option_function = options;  
    this.searchString = '';
    this.cursor = 0;
    this.searchInputDiv = null;
    this.listener = false;
  }

  // override the showEditor_ method to add the search input
  // the showEditor_ method is called when the options are changed
  showEditor_(e) {
    super.showEditor_(e);
    // add the search input
    this.searchInputDiv = this.dropdownCreateSearch_();
    
    // set the focus on the search input
    this.setFocusToInput();

    if (!this.listener) {
      const dropdownDiv = Blockly.DropDownDiv.getContentDiv();
      dropdownDiv.addEventListener('input', this.dropdownSearchOnChange_.bind(this));
      dropdownDiv.addEventListener('keydown', this.handleKeyEvent_.bind(this));
      this.listener = true;
    }
  }
  // create a search input
  dropdownCreateSearch_() {
    var searchInput = document.createElement('input');
    searchInput.setAttribute('type', 'search');
    searchInput.setAttribute('placeholder', 'Search...');
    searchInput.setAttribute('autocomplete', 'off');
    searchInput.setAttribute('value', this.searchString);
  
    Blockly.DropDownDiv.getContentDiv().insertBefore(searchInput, Blockly.DropDownDiv.getContentDiv().firstChild);
    return searchInput;
  }

  // reset the search string when the menu is closed
  onItemSelected_(menu, menuItem) {
    this.searchString = '';
    const dropdownDiv = Blockly.DropDownDiv.getContentDiv();
    dropdownDiv.removeEventListener('input', this.dropdownSearchOnChange_.bind(this));
    dropdownDiv.removeEventListener('keydown', this.handleKeyEvent_.bind(this));
    this.listener = false;
    super.onItemSelected_(menu, menuItem);
    this.cursor = null;
  }

  // handle the enter and down arrow keys
  handleKeyEvent_(event) {
    const key = event.which || event.keyCode;
  
    // enter select the only option
    if (key == 13) { // enter
      const options = this.filteredOptions || this.getOptions();
      
      // select the first options on enter
      if (options.length >= 1 ) {
        this.setValue(options[0][1]);
        this.searchString = '';
        Blockly.DropDownDiv.hideIfOwner(this, true);
      }
    } else if (key == 40) {// down arrow goto to the first option
      // select the first option in the menu
      const options = this.filteredOptions || this.getOptions();
      if (options.length > 0) {
        // get the menu
        const menu = this.menu_;
        menu.highlightFirst();
        menu.focus();
      }
    } else {
      // redirect the key to the search input
      if (this.searchInputDiv) {
         this.searchInputDiv.focus();
         // let the event goto the search input
      }
    }
  }

  // handle the search input change event
  dropdownSearchOnChange_(event) {
    const searchStringLower = event.target.value.toLowerCase().replaceAll('_',' ');
    
    // save the filtered options needed for the enter key
    this.filteredOptions = this.getOptions().filter(
      function(option) {
        let all_parts_found = true;
        const parts = searchStringLower.split(' ');
        for (var i = 0; i < parts.length; i++) {
          const searchString = parts[i];
          all_parts_found = all_parts_found && option[0].toLowerCase().indexOf(searchString) !== -1;
        }
        return all_parts_found;
      }
    );
    if (this.filteredOptions.length == 0) {
      this.filteredOptions = [['no matches', 'no matches']];
    }

    // save the search string and the cursor position
    this.searchString = event.target.value;
    // cursor not saved in the this as it is not available in the set
    this.cursor = event.target.selectionStart;
    this.updateOptions_(this.filteredOptions);

    // Set a timeout to focus on the search input after a short delay.
    this.setFocusToInput();
  }

  updateOptions_(options) {
    // set the options to the filtered options
    this.menuGenerator_ = options;
    // render the menu
    this.dropdownDispose_();
    Blockly.DropDownDiv.clearContent();
    this.showEditor_();
    // restore the options
    this.menuGenerator_ = this.option_function;
  }


  /**
     * Construct a FieldSearchDropdown from a JSON arg object.
     * @param {!Object} options A JSON object with options (options).
     * @returns {!FieldSearchDropdown} The new field instance.
     * @package
     * @nocollapse
     */
  static fromJson(options) {
    // `this` might be a subclass of FieldSearchDropdown if that class doesn't
    // override the static fromJson method.
    return new this(options['options'], undefined, options);
  }


  setFocusToInput() {
    setTimeout(() => {
      if (!this.searchInputDiv) {
        return;
      }
      this.searchInputDiv.focus();
      
      var cursor = this.cursor;
      this.searchInputDiv.setSelectionRange(cursor, cursor);
    }, 10);
  }
}
Blockly.fieldRegistry.register('field_searchdropdown', FieldSearchDropdown);

