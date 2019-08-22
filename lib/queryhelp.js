﻿/*!
 *  queryhelp.js
 *  by fengshangbin 2019-06-27
 *  正则匹配 HTML 嵌套元素
 */

(function(root, factory) {
  if (typeof define === 'function' && (define.amd || define.cmd)) {
    define('QueryHelp', function(exports) {
      return factory(exports);
    });
  } else {
    root.QueryHelp = factory({});
  }
})(this, function(QueryHelp) {
  function querySelectorElement(html, regStr, multiElement) {
    regStr = encodEscapeWord(regStr);
    var regArr = regStr.split(' ');
    var source = [html];
    var index = 0;
    while (source && source.length > 0 && index < regArr.length) {
      if (regArr[index].length > 0) {
        source = queryBlock(source, regArr[index], index == regArr.length - 1, multiElement);
      }
      index++;
    }
    return source;
  }
  function queryBlock(source, regStr, last, multiElement) {
    var attrRegs = '';
    var attrReg = /\[[^\]]*\]/g;
    var group = attrReg.exec(regStr);
    while (group != null) {
      attrRegs += decodeEscapeWord(group[0]);
      group = attrReg.exec(regStr);
    }
    regStr = regStr.replace(attrReg, '');

    var idReg = /#[^#.[]*/g;
    var group2 = idReg.exec(regStr);
    while (group2 != null) {
      attrRegs += '[id=' + group2[0].substring(1) + ']';
      group2 = idReg.exec(regStr);
    }
    regStr = regStr.replace(idReg, '');

    var classRegs = '';
    var classReg = /\.[^#.[]*/g;
    var group3 = classReg.exec(regStr);
    while (group3 != null) {
      classRegs += group3[0];
      group3 = classReg.exec(regStr);
    }
    regStr = regStr.replace(classReg, '');

    var tagReg = regStr.trim();
    if (tagReg.length == 0) tagReg = '[^ >]*';
    var classRegsMark = classRegs.length > 0 ? '[^>]*?\\bclass *= *"([^"]*)"' : '';
    regStr = '< *(' + tagReg + ')(' + classRegsMark + '[^>]*)>';

    var option = {
      multiElement: !last || multiElement,
      moreRegs: []
    };
    if (attrRegs.length > 0)
      option.moreRegs.push({
        index: 2,
        regStr: buildAttrReg(attrRegs)
      });
    if (classRegs.length > 0)
      option.moreRegs.push({
        index: 3,
        regStr: buildClassReg(classRegs)
      });
    var resultAll = [];
    for (var i = 0; i < source.length; i++) {
      var result = queryElement(regStr, source[i], option);
      if (!option.multiElement) {
        if (result || i == source.length - 1) return result;
      } else resultAll = resultAll.concat(result);
    }
    return resultAll;
  }
  function buildClassReg(classNames) {
    var classArr = classNames.split('.');
    var classReg = '';
    for (var i = 0; i < classArr.length; i++) {
      var className = classArr[i];
      if (className.length > 0) {
        classReg += '(?=.*?\\b' + className + '\\b)';
      }
    }
    return classReg;
  }
  function getElementByAttr(html, attrs, multiElement) {
    var option = {
      multiElement: multiElement,
      moreRegs: [
        {
          index: 2,
          regStr: buildAttrReg(attrs)
        }
      ]
    };
    var regStr = '< *([^ >]*)\\b([^>]*)>';
    return queryElement(regStr, html, option);
  }
  function buildAttrReg(attrs) {
    var attrArr = attrs.substring(1, attrs.length - 1).split('][');
    var attrReg = '';
    for (var i = 0; i < attrArr.length; i++) {
      var attrGroup = attrArr[i].split('=');
      var key = attrGroup[0].trim();
      var value = null;
      if (attrGroup.length == 2) {
        value = attrGroup[1]
          .trim()
          .replace(/^'|"/, '')
          .replace(/'|"$/, '');
      }
      if (value == null) {
        attrReg += '(?=.*?\\b' + key + '\\b)';
      } else {
        attrReg += '(?=.*?\\b' + key + ' *= *"?' + value + '"?' + '\\b)';
      }
    }
    //console.log(attrReg);
    return attrReg;
  }
  function queryElement(regStr, html, option) {
    var match = new RegExp(regStr, 'img');
    var result = option.multiElement ? [] : null;
    var group = match.exec(html);
    while (group != null) {
      if (option.moreRegs != null && option.moreRegs.length > 0) {
        while (group != null) {
          var moreState = true;
          for (var i = 0; i < option.moreRegs.length; i++) {
            var moreContent = group[option.moreRegs[i].index];
            var moreMatch = new RegExp(option.moreRegs[i].regStr, 'im');
            moreState = moreState && moreMatch.test(moreContent);
          }
          if (moreState) break;
          group = match.exec(html);
        }
        if (group == null) return result;
      }
      var searchStart = group.index + group[0].length;
      var closeIndex = 0;
      if (/\/ *>$/.test(group[0]) == false) {
        closeIndex = queryCloseTag(group[1], html.substring(searchStart));
      }
      var targetHtml = html.substring(group.index, searchStart + closeIndex);
      if (result == null) {
        result = targetHtml;
        break;
      } else {
        result.push(targetHtml);
        group = match.exec(html);
      }
    }
    return result;
  }
  function queryCloseTag(tag, html) {
    var regStrAll = '< */? *' + tag + '[^>]*>';
    var matchAll = new RegExp(regStrAll, 'img');

    var regStrClose = '< */ *' + tag + ' *>';
    var matchClose = new RegExp(regStrClose, 'im');

    var openCount = 1;
    var lastCloseIndex = 0;
    while (openCount > 0) {
      var groupAll = matchAll.exec(html);
      if (groupAll == null) {
        break;
      } else {
        if (matchClose.test(groupAll[0])) {
          openCount--;
          lastCloseIndex = groupAll.index + groupAll[0].length;
        } else {
          openCount++;
          if (new RegExp('\\b' + tag + '\\b', 'i').test('input br image')) return 0;
        }
      }
    }
    return lastCloseIndex;
  }
  function encodEscapeWord(regStr) {
    var marks = [];
    var marksReg = /'[^']*'/g;
    var marksReg2 = /"[^"]*"/g;
    var group = marksReg.exec(regStr);
    while (group != null) {
      marks.push(group[0]);
      group = marksReg.exec(regStr);
    }
    var group2 = marksReg2.exec(regStr);
    while (group2 != null) {
      marks.push(group2[0]);
      group2 = marksReg2.exec(regStr);
    }
    for (var i = 0; i < marks.length; i++) {
      regStr = regStr.replace(
        marks[i],
        marks[i]
          .replace(/ /g, '{-space-}')
          .replace(/\[/g, '{-left-}')
          .replace(/\]/g, '{-right-}')
      );
    }
    return regStr;
  }
  function decodeEscapeWord(regStr) {
    return regStr
      .replace(/\{-space-\}/g, ' ')
      .replace(/\{-left-\}/g, '[')
      .replace(/\{-right-\}/g, ']');
  }

  QueryHelp.querySelector = function(html, regStr) {
    return querySelectorElement(html, regStr, false);
  };
  QueryHelp.querySelectorAll = function(html, regStr) {
    return querySelectorElement(html, regStr, true);
  };
  QueryHelp.getElementById = function(html, id) {
    return getElementByAttr(html, '[id=' + id + ']', false);
  };
  QueryHelp.getElementsByTag = function(html, tag) {
    var regStr = '< *(' + tag + ')[^>]*>';
    return queryElement(regStr, html, { multiElement: true });
  };
  QueryHelp.getElementsByClass = function(html, classNames) {
    var option = {
      multiElement: true,
      moreRegs: [
        {
          index: 2,
          regStr: buildClassReg(classNames)
        }
      ]
    };
    var regStr = '< *([^ >]*)[^>]*?\\bclass *= *"([^"]*)"[^>]*>';
    return queryElement(regStr, html, option);
  };
  QueryHelp.queryCloseTag = queryCloseTag;
  return QueryHelp;
});