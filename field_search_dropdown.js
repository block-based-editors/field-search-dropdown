
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

CustomFields.FieldSearchDropdown = function(options, opt_validator) {
  CustomFields.FieldSearchDropdown.superClass_.constructor.call(this, options, opt_validator);
  // save the options
  this.option_function = options
  this.searchString = ''
};
Blockly.utils.object.inherits(CustomFields.FieldSearchDropdown, Blockly.FieldDropdown);

CustomFields.FieldSearchDropdown.prototype.showEditor_ = function() {
  CustomFields.FieldSearchDropdown.superClass_.showEditor_.call(this);
  var searchInput = this.dropdownCreateSearch_();
  searchInput.addEventListener('input', this.dropdownSearchOnChange_.bind(this));
  searchInput.addEventListener('keydown', this.handleKeyEvent_.bind(this));
  setFocus();
};

CustomFields.FieldSearchDropdown.prototype.dropdownCreateSearch_ = function() {
  var searchInput = document.createElement('input');
  searchInput.setAttribute('type', 'search');
  searchInput.setAttribute('placeholder', 'Search...');
  searchInput.setAttribute('autocomplete', 'off');
  searchInput.setAttribute('value', this.searchString);
  
  Blockly.DropDownDiv.getContentDiv().insertBefore(searchInput, Blockly.DropDownDiv.getContentDiv().firstChild);
  return searchInput;
};

CustomFields.FieldSearchDropdown.prototype.handleKeyEvent_ = function(event) {

  var key = event.which || event.keyCode;
  
  // enter select the first option
  if (key == 13) {
    // enter
    var options = this.filteredOptions || this.getOptions();
    if (options.length == 1 ) {
      this.setValue(options[0][1]);
      Blockly.DropDownDiv.hideIfOwner(this, true);
    }
  }

  // down arrow goto to the first option
  if (key == 40) {
    // select the first option in the menu
    var options = this.filteredOptions || this.getOptions();
    if (options.length > 0) {
      // get the menu
      var menu = this.menu_
      menu.highlightFirst_();
      menu.focus();
    }
  }
}


CustomFields.FieldSearchDropdown.prototype.dropdownSearchOnChange_ = function(event) {
  var searchString = event.target.value.toLowerCase();
  
  var filteredOptions = this.getOptions().filter(function(option) {
    return option[0].toLowerCase().indexOf(searchString) !== -1;
  });
  this.searchString = event.target.value
  Blockly.DropDownDiv.getContentDiv().cursor = event.target.selectionStart;
  this.updateOptions_(filteredOptions);
  this.filteredOptions = filteredOptions;

  // Set a timeout to focus on the search input after a short delay.
  setFocus();
 
};

CustomFields.FieldSearchDropdown.prototype.updateOptions_ = function(options) {
  // set the options to the filtered options
  this.menuGenerator_ = options;
  // render the menu
  this.dropdownDispose_();
  Blockly.DropDownDiv.clearContent();
  this.showEditor_()
  // restore the options
  this.menuGenerator_ = this.option_function;
};


 /**
   * Construct a FieldSearchDropdown from a JSON arg object.
   * @param {!Object} options A JSON object with options (options).
   * @returns {!FieldSearchDropdown} The new field instance.
   * @package
   * @nocollapse
   */
CustomFields.FieldSearchDropdown.fromJson = function(options) {
  // `this` might be a subclass of FieldSearchDropdown if that class doesn't
  // override the static fromJson method.
  return new this(options['options'], undefined, options);
}

Blockly.fieldRegistry.register('field_searchdropdown', CustomFields.FieldSearchDropdown);

function setFocus() {
  setTimeout(function () {
    var input = Blockly.DropDownDiv.getContentDiv().firstChild;
    input.focus();
    var cursor = Blockly.DropDownDiv.getContentDiv().cursor;
    input.setSelectionRange(cursor, cursor);
  }, 10);
}

