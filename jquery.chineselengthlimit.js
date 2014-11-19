/*
 * jQuery Chinese Characters Length Limit Plugin 1.2.1
 * http://code.google.com/p/jquery-chinese-characters-length-limit-plugin/
 *
 * Copyright (C) 2012 - 2014 Patrick Wang <patw.hi@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
 * OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

/*jslint browser: true*/
/*jshint nonew: true */
/*global $, jQuery*/

(function ($) {
  'use strict';

  $.fn.ChineseLengthLimit = function (options) {

    var defaults = {
        limitCount: 10,
        isByte: true,
        callback: undefined
      },
      opts = $.extend({}, defaults, options),
      $elements = $(this),
      byteLength = 0,                     // 以位元數計算的字串長度 (中文: 2 字元, 英文: 1 字元)
      charLength = 0,                     // 以字數計算的字串長度 (中英文皆算 1 字元)
      maxCharacters = opts.limitCount,    // 限制長度
      numLeft = 0,                        // 剩餘長度
      getInfo,
      checkLimit;

    // callback event
    getInfo = function () {
      var info = {
        input: (opts.isByte) ? byteLength : charLength, // 目前字數
        max: maxCharacters, // 最大字數
        left: numLeft // 剩餘字數
      };
      return info;
    };

    checkLimit = function () {
      // 目前字數
      var txtCount = 0;

      // 若以位元計
      if (opts.isByte) {
        // 目前字數，以位元計算 (中文: 2 字元, 英文: 1 字元)
        txtCount = $elements.val().replace(/[^\x00-\xff]/g, "pp").length + ($elements.val().match(/\n/g) || []).length;
      } else {
        // 目前字數，以字數計算 (中英文皆算 1 字元)
        txtCount = $elements.val().length + ($elements.val().match(/\n/g) || []).length;
      }

      // 若目前字數大於設定的限制長度
      if (txtCount > opts.limitCount) {
        if (opts.isByte) {
          $elements.val($elements.val().slice(0, charLength + Math.floor((opts.limitCount - byteLength) / 2)));
          byteLength = $elements.val().replace(/[^\x00-\xff]/g, "pp").length;
        } else {
          $elements.val($elements.val().slice(0, options.limitCount));
        }
      }
      charLength = $elements.val().length + ($elements.val().match(/\n/g) || []).length;
      byteLength = $elements.val().replace(/[^\x00-\xff]/g, "pp").length + ($elements.val().match(/\n/g) || []).length;

      if (opts.isByte) {
        numLeft = maxCharacters - byteLength;
      } else {
        numLeft = maxCharacters - charLength;
      }

      // function call back
      if (typeof (opts.callback) === 'function') {
        opts.callback.call(this, getInfo());
      }
    };

    $elements.on('checkLimit', function () {
      setTimeout(function () {
        checkLimit();
      }, 15);
    });

    return this.each(function () {
      var $this = $(this);

      if ((!options || !options.limitCount) && parseInt($this.attr('maxlength'), 10) > 0 && parseInt($this.attr('maxlength'), 10) !== opts.limitCount) {
        $this.ChineseLengthLimit(
          $.extend({},
            opts,
            {
              limitCount: parseInt($this.attr('maxlength'), 10)
            }),
          opts.callback
        );
      } else {
        $elements.attr('maxlength', opts.limitCount);
        $elements.on('keyup paste', function () {
          setTimeout(function () {
            checkLimit();
          }, 15);
        });
      }
    });
  };
}(jQuery));
