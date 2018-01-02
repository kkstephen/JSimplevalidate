/*
 * easyValidate, a form validation jquery plugin
 * By Alex Gill, www.alexpetergill.com
 * Version 1.3
 * Copyright 2011 APGDESIGN
 * Updated 19/01/2013
 * Free to use under the MIT License
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Modify by Stephen Yeung, Hong Kong, 2017/12/30
*/ 
(function ($) {

    // DEFINE METHOD
    $.fn.simpleValidate = function (settings) {

        // DEFAULT OPTIONS
        var config = {
            promptPosition: 'topRight',
            errorText: 'This field is required',
            errorEmail: 'Please provide a valid email address',
            errorNumber: 'Please enter numeric',
            showError: true
        };

        // EXTEND OPTIONS
        var settings = $.extend(config, settings);

        return this.each(function () {

            // SET VARIABLES
            var promptText = "";
            var isError = false;
            var button;

            // GET ALL FORM ELEMENTS
            var elements = $(this).find('input, textarea, radio, checkbox, select');

            $(this).submit(function () {
                if (_isValid()) {
                    if (settings.onsubmit) {
                        return settings.onsubmit();
                    }
                    else {
                        return true;
                    }
                }
                else {
                    if (settings.onerror) {
                        settings.onerror();
                    }
                    return false;
                }
            });

            // FOCUS LISTERNER
            elements.each(function () {
                $(this).bind('blur change', function () {
                    _getRules($(this));
                });
            });

            // GET RULES FROM CLASS NAME
            function _getRules(element) {
                var rulesParsed = element.attr('class');
                if (rulesParsed) {
                    var rules = rulesParsed.split(' ');
                    _validate(element, rules);
                }
            };

            // APPLY RULES TO EACH ELEMENT
            function _validate(element, rules) {

                // RESET VALUES FOR EACH ELEMENT
                promptText = "";

                isError = false;

                // LOOP RULES FOR EACH ELEMENT
                for (var i = 0; i < rules.length; i++) {
                    if (rules[i] == 'required') {
                        _required(element);
                    }

                    if (rules[i] == 'email') {
                        _email(element);
                    }

                    if (rules[i] == 'numeric') {
                        _number(element);
                    }

                    if (rules[i] == 'mobile') {
                        _mobile(element);
                    }

                    if (rules[i] == 'idcard') {
                        _idcard(element);
                    }
                }

                // BUILD PROMPT IF RULE FAILS
                if (isError) {
                    _buildPrompt(element, promptText);
                    _addErrorClasses(element);
                } else {
                    _removePrompt(element);
                    _removeErrorClasses(element);
                }
            };

            // RULE: REQUIRED FIELD
            function _required(element) {
                if (!element.val() || element.val() == "") {
                    isError = true;
                    promptText = settings.errorText + "<br />";
                }
            };

            // RULE: VALID EMAIL STRING REQUIRED
            function _email(element) {
                var addr = element.val().trim();
                var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                if (addr != "" && !filter.test(addr)) {
                    isError = true;
                    promptText = promptText + settings.errorEmail;
                }
            };

            // RULE: Numeric check
            function _number(element) {
                var no = element.val();
                if (!no || !$.isNumeric(no)) {
                    isError = true;
                    promptText = promptText + settings.errorNumber;
                }
            }

            // RULE: Mobile check
            function _mobile(element) {
                var no = element.val();
                var filter = /^\d{8}$/;
                if (!no && !filter.test(no)) {
                    isError = true;
                    promptText = promptText + "Mobile No. is incorrect";
                }
            }

            // RULE: ID card check
            function _idcard(element) {
                var no = element.val();
                var filter = /^[A-Z]\d{6,7}[A-Z0-9]$/;

                if (no != "" && !filter.test(no)) {
                    isError = true;
                    promptText = promptText + 'HKID No. is incorrect';
                }
            }

            // RETURNS FORM VALIDATION STATUS
            function _isValid() {
                var errorsFound = 0;
                elements.each(function () {
                    var elementTagName = this.tagName;
                    var elementType = $(this).attr('type');
                    if (elementTagName == 'INPUT' && elementType == 'text' || elementTagName == 'INPUT' && elementType == 'password' || elementTagName == 'TEXTAREA' || elementTagName == 'SELECT') {
                        _getRules($(this));
                        if (isError) {
                            errorsFound++;
                        }
                    }
                });
                if (!errorsFound > 0) {
                    return true;
                }
            };

            // BUILDS DYNAMIC ERROR PROMPT
            function _buildPrompt(element, message) {

                // REMOVE ALL EXISTING PROMPTS ON INIT
                _removePrompt(element);

                // CREATE ERROR WRAPPER
                var divFormError = $('<span></span>');
                $(divFormError).addClass('formErrorContent');
                $(divFormError).addClass('formError' + $(element).attr('name'));

                if (settings.showError)
                    $(divFormError).html(message);

                $(element).parent().append(divFormError);

                // DEFINE LAYOUT WITH CSS
                $(divFormError).css({
                    opacity: 0
                });

                // SHOW PROMPT
                return $(divFormError).animate({
                    opacity: 0.8
                });
            };

            // REMOVE PROMPT
            function _removePrompt(element) {
                $('body').find('.formError' + $(element).attr('name')).remove();
            };

            // ADD ERROR CLASSES TO ELEMENTS
            function _addErrorClasses(element) {
                $(element).addClass('form-error');
            }

            // REMOVE ERROR CLASSES FROM ELEMENTS
            function _removeErrorClasses(element) {
                $(element).removeClass('form-error').siblings().removeClass('form-class');
                $(element).parent().find('span').removeClass('form-error'); //NOT SURE WHY THIS WASNT REMOVED WITH SIBLINGS()
            }
        });
    };

})(jQuery);