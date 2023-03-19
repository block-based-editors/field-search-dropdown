
/**
 * @fileoverview Field search dropdown.
 * @author koen.van.wijk@ict.nl Koen van Wijk
 * 
 */
'use strict';

goog.provide('CustomFields.FieldSearchDropdown');

goog.require('Blockly.FieldDropdown');
goog.require('Blockly.utils.object');

var CustomFields = CustomFields || {};

class FieldSearchDropdown extends Blockly.FieldDropdown {

   constructor(options, opt_validator) {
    super(options, opt_validator)

    // save the options
    this.option_function = options    
    this.searchString = ''
   }




  showEditor_() {
    super.showEditor_();
    const searchInput = this.dropdownCreateSearch_();
    searchInput.addEventListener('input', this.dropdownSearchOnChange_.bind(this));
    searchInput.addEventListener('keydown', this.handleKeyEvent_.bind(this));
    setFocus();
  }

  dropdownCreateSearch_() {
    var searchInput = document.createElement('input');
    searchInput.setAttribute('type', 'search');
    searchInput.setAttribute('placeholder', 'Search...');
    searchInput.setAttribute('autocomplete', 'off');
    searchInput.setAttribute('value', this.searchString);
  
    Blockly.DropDownDiv.getContentDiv().insertBefore(searchInput, Blockly.DropDownDiv.getContentDiv().firstChild);
    return searchInput;
  }

  handleKeyEvent_(event) {
    const key = event.which || event.keyCode;
  
    // enter select the first option
    if (key == 13) {
      // enter
      const options = this.filteredOptions || this.getOptions();
      if (options.length == 1 ) {
        this.setValue(options[0][1]);
        Blockly.DropDownDiv.hideIfOwner(this, true);
      }
    }

    // down arrow goto to the first option
    if (key == 40) {
      // select the first option in the menu
      const options = this.filteredOptions || this.getOptions();
      if (options.length > 0) {
        // get the menu
        const menu = this.menu_
        menu.highlightFirst_();
        menu.focus();
      }
    }
  }


  dropdownSearchOnChange_(event) {
    const searchString = event.target.value.toLowerCase();
    
    const filteredOptions = this.getOptions().filter(function(option) {
      return option[0].toLowerCase().indexOf(searchString) !== -1;
    });
    this.searchString = event.target.value
    Blockly.DropDownDiv.getContentDiv().cursor = event.target.selectionStart;
    this.updateOptions_(filteredOptions);
    this.filteredOptions = filteredOptions;

    // Set a timeout to focus on the search input after a short delay.
    setFocus();
  }

  updateOptions_(options) {
    // set the options to the filtered options
    this.menuGenerator_ = options;
    // render the menu
    this.dropdownDispose_();
    Blockly.DropDownDiv.clearContent();
    this.showEditor_()
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


  setFocus() {
    setTimeout(function () {
      const input = Blockly.DropDownDiv.getContentDiv().firstChild;
      input.focus();
      var cursor = Blockly.DropDownDiv.getContentDiv().cursor;
      input.setSelectionRange(cursor, cursor);
    }, 10);
  }
}
Blockly.fieldRegistry.register('field_searchdropdown', CustomFields.FieldSearchDropdown);

CustomFields.FieldSearchDropdown = FieldSearchDropdown;