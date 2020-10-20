/**
 * @license
 * Copyright (C) 2010 The Libphonenumber Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview  Phone Number Parser Demo.
 *
 * @author Nikolaos Trogkanis
 */
goog.provide('i18n.phonenumbers.demo');

goog.require('goog.dom');
goog.require('goog.json');
goog.require('goog.proto2.ObjectSerializer');
goog.require('goog.string.StringBuffer');
goog.require('i18n.phonenumbers.AsYouTypeFormatter');
goog.require('i18n.phonenumbers.PhoneNumberFormat');
goog.require('i18n.phonenumbers.PhoneNumberType');
goog.require('i18n.phonenumbers.PhoneNumberUtil');
goog.require('i18n.phonenumbers.PhoneNumberUtil.ValidationResult');
goog.require('i18n.phonenumbers.ShortNumberInfo');


function phoneNumberParser() {
  var $ = goog.dom.getElement;
  var phoneNumber = $('phoneNumber').value;
  var regionCode = $('defaultCountry').value.toUpperCase();
  var carrierCode = $('carrierCode').value;
  var output = new goog.string.StringBuffer();
  try {
    var phoneUtil = i18n.phonenumbers.PhoneNumberUtil.getInstance();
    var number = phoneUtil.parseAndKeepRawInput(phoneNumber, regionCode);
    output.append('****Parsing Result:****\n');
    output.append(goog.json.serialize(new goog.proto2.ObjectSerializer(
        goog.proto2.ObjectSerializer.KeyOption.NAME).serialize(number)));
    output.append('\n\n****Validation Results:****');
    var isPossible = phoneUtil.isPossibleNumber(number);
    output.append('\nResult from isPossibleNumber(): ');
    output.append(isPossible);
    var validationResult = i18n.phonenumbers.PhoneNumberUtil.ValidationResult;
    var isPossibleReason = phoneUtil.isPossibleNumberWithReason(number)
    if (!isPossible) {
      output.append('\nResult from isPossibleNumberWithReason(): ');
      switch (isPossibleReason) {
        case validationResult.INVALID_COUNTRY_CODE:
          output.append('INVALID_COUNTRY_CODE');
          break;
        case validationResult.TOO_SHORT:
          output.append('TOO_SHORT');
          break;
        case validationResult.TOO_LONG:
          output.append('TOO_LONG');
          break;
        case validationResult.INVALID_LENGTH:
          output.append('INVALID_LENGTH');
          break;
      }
      // IS_POSSIBLE shouldn't happen, since we only call this if _not_
      // possible.
      output.append('\nNote: Numbers that are not possible or possible ' +
           'local only have type UNKNOWN, an unknown region, and are ' +
           'considered invalid.');
    } else {
      // Checking as isValid() fails if possible local only.
      if (isPossibleReason == validationResult.IS_POSSIBLE_LOCAL_ONLY) {
        output.append('\nResult from isPossibleNumberWithReason(): ');
        output.append('IS_POSSIBLE_LOCAL_ONLY');
        output.append('\nNumber is considered as invalid as it is ' +
          'not a possible national number.');
      } else {
        var isNumberValid = phoneUtil.isValidNumber(number);
        output.append('\nResult from isValidNumber(): ');
        output.append(isNumberValid);
        if (isNumberValid && regionCode && regionCode != 'ZZ') {
        output.append('\nResult from isValidNumberForRegion(): ');
        output.append(phoneUtil.isValidNumberForRegion(number, regionCode));
        }
        output.append('\nPhone Number region: ');
        output.append(phoneUtil.getRegionCodeForNumber(number));
        output.append('\nResult from getNumberType(): ');
        var phoneNumberType = i18n.phonenumbers.PhoneNumberType;
        switch (phoneUtil.getNumberType(number)) {
          case phoneNumberType.FIXED_LINE:
            output.append('FIXED_LINE');
            break;
          case phoneNumberType.MOBILE:
            output.append('MOBILE');
            break;
          case phoneNumberType.FIXED_LINE_OR_MOBILE:
            output.append('FIXED_LINE_OR_MOBILE');
            break;
          case phoneNumberType.TOLL_FREE:
            output.append('TOLL_FREE');
            break;
          case phoneNumberType.PREMIUM_RATE:
            output.append('PREMIUM_RATE');
            break;
          case phoneNumberType.SHARED_COST:
            output.append('SHARED_COST');
            break;
          case phoneNumberType.VOIP:
            output.append('VOIP');
            break;
          case phoneNumberType.PERSONAL_NUMBER:
            output.append('PERSONAL_NUMBER');
            break;
          case phoneNumberType.PAGER:
            output.append('PAGER');
            break;
          case phoneNumberType.UAN:
            output.append('UAN');
            break;
          case phoneNumberType.UNKNOWN:
            output.append('UNKNOWN');
            break;
        }
      }
    }
    var shortInfo = i18n.phonenumbers.ShortNumberInfo.getInstance();
    output.append('\n\n****ShortNumberInfo Results:****');
    output.append('\nResult from isPossibleShortNumber: ');
    output.append(shortInfo.isPossibleShortNumber(number));
    output.append('\nResult from isValidShortNumber: ');
    output.append(shortInfo.isValidShortNumber(number));
    output.append('\nResult from isPossibleShortNumberForRegion: ');
    output.append(shortInfo.isPossibleShortNumberForRegion(number, regionCode));
    output.append('\nResult from isValidShortNumberForRegion: ');
    output.append(shortInfo.isValidShortNumberForRegion(number, regionCode));

    var PNF = i18n.phonenumbers.PhoneNumberFormat;
    output.append('\n\n****Formatting Results:**** ');
    output.append('\nE164 format: ');
    output.append(isNumberValid ?
                  phoneUtil.format(number, PNF.E164) :
                  'invalid');
    output.append('\nOriginal format: ');
    output.append(phoneUtil.formatInOriginalFormat(number, regionCode));
    output.append('\nNational format: ');
    output.append(phoneUtil.format(number, PNF.NATIONAL));
    output.append('\nInternational format: ');
    output.append(isNumberValid ?
                  phoneUtil.format(number, PNF.INTERNATIONAL) :
                  'invalid');
    output.append('\nOut-of-country format from US: ');
    output.append(isNumberValid ?
                  phoneUtil.formatOutOfCountryCallingNumber(number, 'US') :
                  'invalid');
    output.append('\nOut-of-country format from Switzerland: ');
    output.append(isNumberValid ?
                  phoneUtil.formatOutOfCountryCallingNumber(number, 'CH') :
                  'invalid');
    if (carrierCode.length > 0) {
      output.append('\nNational format with carrier code: ');
      output.append(phoneUtil.formatNationalNumberWithCarrierCode(number,
                                                                  carrierCode));
    }
    output.append('\n\n****AsYouTypeFormatter Results****');
    var formatter = new i18n.phonenumbers.AsYouTypeFormatter(regionCode);
    var phoneNumberLength = phoneNumber.length;
    for (var i = 0; i < phoneNumberLength; ++i) {
      var inputChar = phoneNumber.charAt(i);
      output.append('\nChar entered: ');
      output.append(inputChar);
      output.append(' Output: ');
      output.append(formatter.inputDigit(inputChar));
    }
  } catch (e) {
    output.append('\n' + e.toString());
  }
  $('output').value = output.toString();
  return false;
}

goog.exportSymbol('phoneNumberParser', phoneNumberParser);
