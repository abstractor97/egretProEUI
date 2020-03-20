(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.ImGui = {}));
}(this, function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function commonjsRequire () {
    	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var require$$0 = {};

    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.

    // resolves . and .. elements in a path array with directory names there
    // must be no slashes, empty elements, or device names (c:\) in the array
    // (so also no leading and trailing slashes - it does not distinguish
    // relative and absolute paths)
    function normalizeArray(parts, allowAboveRoot) {
      // if the path tries to go above the root, `up` ends up > 0
      var up = 0;
      for (var i = parts.length - 1; i >= 0; i--) {
        var last = parts[i];
        if (last === '.') {
          parts.splice(i, 1);
        } else if (last === '..') {
          parts.splice(i, 1);
          up++;
        } else if (up) {
          parts.splice(i, 1);
          up--;
        }
      }

      // if the path is allowed to go above the root, restore leading ..s
      if (allowAboveRoot) {
        for (; up--; up) {
          parts.unshift('..');
        }
      }

      return parts;
    }

    // Split a filename into [root, dir, basename, ext], unix version
    // 'root' is just a slash, or nothing.
    var splitPathRe =
        /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
    var splitPath = function(filename) {
      return splitPathRe.exec(filename).slice(1);
    };

    // path.resolve([from ...], to)
    // posix version
    function resolve() {
      var resolvedPath = '',
          resolvedAbsolute = false;

      for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
        var path = (i >= 0) ? arguments[i] : '/';

        // Skip empty and invalid entries
        if (typeof path !== 'string') {
          throw new TypeError('Arguments to path.resolve must be strings');
        } else if (!path) {
          continue;
        }

        resolvedPath = path + '/' + resolvedPath;
        resolvedAbsolute = path.charAt(0) === '/';
      }

      // At this point the path should be resolved to a full absolute path, but
      // handle relative paths to be safe (might happen when process.cwd() fails)

      // Normalize the path
      resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
        return !!p;
      }), !resolvedAbsolute).join('/');

      return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
    }
    // path.normalize(path)
    // posix version
    function normalize(path) {
      var isPathAbsolute = isAbsolute(path),
          trailingSlash = substr(path, -1) === '/';

      // Normalize the path
      path = normalizeArray(filter(path.split('/'), function(p) {
        return !!p;
      }), !isPathAbsolute).join('/');

      if (!path && !isPathAbsolute) {
        path = '.';
      }
      if (path && trailingSlash) {
        path += '/';
      }

      return (isPathAbsolute ? '/' : '') + path;
    }
    // posix version
    function isAbsolute(path) {
      return path.charAt(0) === '/';
    }

    // posix version
    function join() {
      var paths = Array.prototype.slice.call(arguments, 0);
      return normalize(filter(paths, function(p, index) {
        if (typeof p !== 'string') {
          throw new TypeError('Arguments to path.join must be strings');
        }
        return p;
      }).join('/'));
    }


    // path.relative(from, to)
    // posix version
    function relative(from, to) {
      from = resolve(from).substr(1);
      to = resolve(to).substr(1);

      function trim(arr) {
        var start = 0;
        for (; start < arr.length; start++) {
          if (arr[start] !== '') break;
        }

        var end = arr.length - 1;
        for (; end >= 0; end--) {
          if (arr[end] !== '') break;
        }

        if (start > end) return [];
        return arr.slice(start, end - start + 1);
      }

      var fromParts = trim(from.split('/'));
      var toParts = trim(to.split('/'));

      var length = Math.min(fromParts.length, toParts.length);
      var samePartsLength = length;
      for (var i = 0; i < length; i++) {
        if (fromParts[i] !== toParts[i]) {
          samePartsLength = i;
          break;
        }
      }

      var outputParts = [];
      for (var i = samePartsLength; i < fromParts.length; i++) {
        outputParts.push('..');
      }

      outputParts = outputParts.concat(toParts.slice(samePartsLength));

      return outputParts.join('/');
    }

    var sep = '/';
    var delimiter = ':';

    function dirname(path) {
      var result = splitPath(path),
          root = result[0],
          dir = result[1];

      if (!root && !dir) {
        // No dirname whatsoever
        return '.';
      }

      if (dir) {
        // It has a dirname, strip trailing slash
        dir = dir.substr(0, dir.length - 1);
      }

      return root + dir;
    }

    function basename(path, ext) {
      var f = splitPath(path)[2];
      // TODO: make this comparison case-insensitive on windows?
      if (ext && f.substr(-1 * ext.length) === ext) {
        f = f.substr(0, f.length - ext.length);
      }
      return f;
    }


    function extname(path) {
      return splitPath(path)[3];
    }
    var require$$1 = {
      extname: extname,
      basename: basename,
      dirname: dirname,
      sep: sep,
      delimiter: delimiter,
      relative: relative,
      join: join,
      isAbsolute: isAbsolute,
      normalize: normalize,
      resolve: resolve
    };
    function filter (xs, f) {
        if (xs.filter) return xs.filter(f);
        var res = [];
        for (var i = 0; i < xs.length; i++) {
            if (f(xs[i], i, xs)) res.push(xs[i]);
        }
        return res;
    }

    // String.prototype.substr - negative index don't work in IE8
    var substr = 'ab'.substr(-1) === 'b' ?
        function (str, start, len) { return str.substr(start, len) } :
        function (str, start, len) {
            if (start < 0) start = str.length + start;
            return str.substr(start, len);
        }
    ;

    var bindImgui = createCommonjsModule(function (module, exports) {
    var Module = (function() {
      var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
      return (
    function(Module) {
      Module = Module || {};

    var Module=typeof Module!=="undefined"?Module:{};var moduleOverrides={};var key;for(key in Module){if(Module.hasOwnProperty(key)){moduleOverrides[key]=Module[key];}}Module["arguments"]=[];Module["thisProgram"]="./this.program";Module["quit"]=function(status,toThrow){throw toThrow};Module["preRun"]=[];Module["postRun"]=[];var ENVIRONMENT_IS_WEB=false;var ENVIRONMENT_IS_WORKER=false;var ENVIRONMENT_IS_NODE=false;var ENVIRONMENT_IS_SHELL=false;ENVIRONMENT_IS_WEB=typeof window==="object";ENVIRONMENT_IS_WORKER=typeof importScripts==="function";ENVIRONMENT_IS_NODE=typeof process==="object"&&typeof commonjsRequire==="function"&&!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_WORKER;ENVIRONMENT_IS_SHELL=!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_NODE&&!ENVIRONMENT_IS_WORKER;var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}else{return scriptDirectory+path}}if(ENVIRONMENT_IS_NODE){scriptDirectory=__dirname+"/";var nodeFS;var nodePath;Module["read"]=function shell_read(filename,binary){var ret;ret=tryParseAsDataURI(filename);if(!ret){if(!nodeFS)nodeFS=require$$0;if(!nodePath)nodePath=require$$1;filename=nodePath["normalize"](filename);ret=nodeFS["readFileSync"](filename);}return binary?ret:ret.toString()};Module["readBinary"]=function readBinary(filename){var ret=Module["read"](filename,true);if(!ret.buffer){ret=new Uint8Array(ret);}assert(ret.buffer);return ret};if(process["argv"].length>1){Module["thisProgram"]=process["argv"][1].replace(/\\/g,"/");}Module["arguments"]=process["argv"].slice(2);process["on"]("uncaughtException",function(ex){if(!(ex instanceof ExitStatus)){throw ex}});process["on"]("unhandledRejection",abort);Module["quit"]=function(status){process["exit"](status);};Module["inspect"]=function(){return "[Emscripten Module object]"};}else if(ENVIRONMENT_IS_SHELL){if(typeof read!="undefined"){Module["read"]=function shell_read(f){var data=tryParseAsDataURI(f);if(data){return intArrayToString(data)}return read(f)};}Module["readBinary"]=function readBinary(f){var data;data=tryParseAsDataURI(f);if(data){return data}if(typeof readbuffer==="function"){return new Uint8Array(readbuffer(f))}data=read(f,"binary");assert(typeof data==="object");return data};if(typeof scriptArgs!="undefined"){Module["arguments"]=scriptArgs;}else if(typeof arguments!="undefined"){Module["arguments"]=arguments;}if(typeof quit==="function"){Module["quit"]=function(status){quit(status);};}}else if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){if(ENVIRONMENT_IS_WORKER){scriptDirectory=self.location.href;}else if(document.currentScript){scriptDirectory=document.currentScript.src;}if(_scriptDir){scriptDirectory=_scriptDir;}if(scriptDirectory.indexOf("blob:")!==0){scriptDirectory=scriptDirectory.substr(0,scriptDirectory.lastIndexOf("/")+1);}else{scriptDirectory="";}Module["read"]=function shell_read(url){try{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.send(null);return xhr.responseText}catch(err){var data=tryParseAsDataURI(url);if(data){return intArrayToString(data)}throw err}};if(ENVIRONMENT_IS_WORKER){Module["readBinary"]=function readBinary(url){try{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)}catch(err){var data=tryParseAsDataURI(url);if(data){return data}throw err}};}Module["readAsync"]=function readAsync(url,onload,onerror){var xhr=new XMLHttpRequest;xhr.open("GET",url,true);xhr.responseType="arraybuffer";xhr.onload=function xhr_onload(){if(xhr.status==200||xhr.status==0&&xhr.response){onload(xhr.response);return}var data=tryParseAsDataURI(url);if(data){onload(data.buffer);return}onerror();};xhr.onerror=onerror;xhr.send(null);};Module["setWindowTitle"]=function(title){document.title=title;};}var out=Module["print"]||(typeof console!=="undefined"?console.log.bind(console):typeof print!=="undefined"?print:null);var err=Module["printErr"]||(typeof printErr!=="undefined"?printErr:typeof console!=="undefined"&&console.warn.bind(console)||out);for(key in moduleOverrides){if(moduleOverrides.hasOwnProperty(key)){Module[key]=moduleOverrides[key];}}moduleOverrides=undefined;var asm2wasmImports={"f64-rem":function(x,y){return x%y},"debugger":function(){debugger}};var setTempRet0=function(value){};if(typeof WebAssembly!=="object"){err("no native wasm support detected");}var wasmMemory;var wasmTable;var ABORT=false;function assert(condition,text){if(!condition){abort("Assertion failed: "+text);}}var UTF8Decoder=typeof TextDecoder!=="undefined"?new TextDecoder("utf8"):undefined;function UTF8ArrayToString(u8Array,idx,maxBytesToRead){var endIdx=idx+maxBytesToRead;var endPtr=idx;while(u8Array[endPtr]&&!(endPtr>=endIdx))++endPtr;if(endPtr-idx>16&&u8Array.subarray&&UTF8Decoder){return UTF8Decoder.decode(u8Array.subarray(idx,endPtr))}else{var str="";while(idx<endPtr){var u0=u8Array[idx++];if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=u8Array[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}var u2=u8Array[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2;}else{u0=(u0&7)<<18|u1<<12|u2<<6|u8Array[idx++]&63;}if(u0<65536){str+=String.fromCharCode(u0);}else{var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023);}}}return str}function UTF8ToString(ptr,maxBytesToRead){return ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead):""}function stringToUTF8Array(str,outU8Array,outIdx,maxBytesToWrite){if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343){var u1=str.charCodeAt(++i);u=65536+((u&1023)<<10)|u1&1023;}if(u<=127){if(outIdx>=endIdx)break;outU8Array[outIdx++]=u;}else if(u<=2047){if(outIdx+1>=endIdx)break;outU8Array[outIdx++]=192|u>>6;outU8Array[outIdx++]=128|u&63;}else if(u<=65535){if(outIdx+2>=endIdx)break;outU8Array[outIdx++]=224|u>>12;outU8Array[outIdx++]=128|u>>6&63;outU8Array[outIdx++]=128|u&63;}else{if(outIdx+3>=endIdx)break;outU8Array[outIdx++]=240|u>>18;outU8Array[outIdx++]=128|u>>12&63;outU8Array[outIdx++]=128|u>>6&63;outU8Array[outIdx++]=128|u&63;}}outU8Array[outIdx]=0;return outIdx-startIdx}function stringToUTF8(str,outPtr,maxBytesToWrite){return stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite)}function lengthBytesUTF8(str){var len=0;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343)u=65536+((u&1023)<<10)|str.charCodeAt(++i)&1023;if(u<=127)++len;else if(u<=2047)len+=2;else if(u<=65535)len+=3;else len+=4;}return len}var UTF16Decoder=typeof TextDecoder!=="undefined"?new TextDecoder("utf-16le"):undefined;var WASM_PAGE_SIZE=65536;var buffer,HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;function updateGlobalBufferViews(){Module["HEAP8"]=HEAP8=new Int8Array(buffer);Module["HEAP16"]=HEAP16=new Int16Array(buffer);Module["HEAP32"]=HEAP32=new Int32Array(buffer);Module["HEAPU8"]=HEAPU8=new Uint8Array(buffer);Module["HEAPU16"]=HEAPU16=new Uint16Array(buffer);Module["HEAPU32"]=HEAPU32=new Uint32Array(buffer);Module["HEAPF32"]=HEAPF32=new Float32Array(buffer);Module["HEAPF64"]=HEAPF64=new Float64Array(buffer);}var DYNAMIC_BASE=5316752,DYNAMICTOP_PTR=73840;var TOTAL_STACK=5242880;var INITIAL_TOTAL_MEMORY=Module["TOTAL_MEMORY"]||16777216;if(INITIAL_TOTAL_MEMORY<TOTAL_STACK)err("TOTAL_MEMORY should be larger than TOTAL_STACK, was "+INITIAL_TOTAL_MEMORY+"! (TOTAL_STACK="+TOTAL_STACK+")");if(Module["buffer"]){buffer=Module["buffer"];}else{if(typeof WebAssembly==="object"&&typeof WebAssembly.Memory==="function"){wasmMemory=new WebAssembly.Memory({"initial":INITIAL_TOTAL_MEMORY/WASM_PAGE_SIZE,"maximum":INITIAL_TOTAL_MEMORY/WASM_PAGE_SIZE});buffer=wasmMemory.buffer;}else{buffer=new ArrayBuffer(INITIAL_TOTAL_MEMORY);}}updateGlobalBufferViews();HEAP32[DYNAMICTOP_PTR>>2]=DYNAMIC_BASE;function callRuntimeCallbacks(callbacks){while(callbacks.length>0){var callback=callbacks.shift();if(typeof callback=="function"){callback();continue}var func=callback.func;if(typeof func==="number"){if(callback.arg===undefined){Module["dynCall_v"](func);}else{Module["dynCall_vi"](func,callback.arg);}}else{func(callback.arg===undefined?null:callback.arg);}}}var __ATPRERUN__=[];var __ATINIT__=[];var __ATMAIN__=[];var __ATPOSTRUN__=[];var runtimeInitialized=false;function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift());}}callRuntimeCallbacks(__ATPRERUN__);}function ensureInitRuntime(){if(runtimeInitialized)return;runtimeInitialized=true;callRuntimeCallbacks(__ATINIT__);}function preMain(){callRuntimeCallbacks(__ATMAIN__);}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift());}}callRuntimeCallbacks(__ATPOSTRUN__);}function addOnPreRun(cb){__ATPRERUN__.unshift(cb);}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb);}var runDependencies=0;var runDependencyWatcher=null;var dependenciesFulfilled=null;function addRunDependency(id){runDependencies++;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies);}}function removeRunDependency(id){runDependencies--;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies);}if(runDependencies==0){if(runDependencyWatcher!==null){clearInterval(runDependencyWatcher);runDependencyWatcher=null;}if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback();}}}Module["preloadedImages"]={};Module["preloadedAudios"]={};var dataURIPrefix="data:application/octet-stream;base64,";function isDataURI(filename){return String.prototype.startsWith?filename.startsWith(dataURIPrefix):filename.indexOf(dataURIPrefix)===0}var wasmBinaryFile="data:application/octet-stream;base64,AGFzbQEAAAAB3gyyAWACf38Bf2ACf38AYAJ8fAF8YAF/AX9gAX8AYAN/f38Bf2AEf39/fwBgA39/fwBgAn9/AX1gBH9/f38Bf2AEf399fwBgAn99AX9gA399fQF/YAZ9fX1/f38AYAR/fX9/AGAFf39/fX8AYAABfGADf31/AGAFf39/f38Bf2AIf39/f39/f38Bf2AHf39/f39/fwF/YAZ/f39/f38Bf2AGf398fH9/AX9gCX9/f39/f39/fwF/YAN9f38AYAl/f39/f39/f38AYAZ/f39/f38AYAJ/fQBgAX8BfWAAAX9gAn19AGABfQBgAAF9YAAAYAN/f30Bf2AGf39/fX9/AGAIf399fX1/f38AYAR/fX99AX9gBn9/fX9/fwBgBX9/f399AGAHf39/f31/fQBgBn9/f399fwBgB39/f39/f38AYAd/f39/f399AGAGf39/f399AGAFf39/f38AYAZ/f31/f30AYAV/f31/fwBgCH9/fX9/f31/AGALf39/f39/f39/f38AYAl/f39/f39/fX8AYAh/f39/f399fwBgBH9/f30AYAZ/f319fX8AYAp/f39/f39/f39/AGADf399AGADf35/AX5gBn98f39/fwF/YAF/AXxgA39/fwF9YAR/f319AX9gCH9/fX19f39/AX9gBH9/fX8Bf2AFf399f30Bf2AHf39/fHx/fwF/YAR/f399AX9gBX9/f31/AX9gBn9/f31/fwF/YAp/f39/f39/f39/AX9gA399fQBgB399fX1/f38AYAd/f399fX1/AGAHf39/fX9/fQBgB39/f31/f38AYAl/f399f39/fX8AYAd/f39/f31/AGAIf39/f399f30AYAh/f39/f39/fQBgCH9/f39/f39/AGAKf39/f39/f399fwBgDH9/f39/f39/f39/fwBgDX9/f39/f39/f39/f38AYAN/f3wAYAN/f38BfGABfQF9YAJ9fQF9YAV/fX19fQBgB39/f319f38AYAJ/fQF9YAR9fX19AX9gBH9/fX0AYAJ9fQF/YAV/f399fQBgA319fQF9YAR9fX19AX1gC399fX19fX19fX1/AGAJf399f39/f31/AGAKf399f39/f399fwBgBX99f399AX9gCH9/fX1/f39/AGALf399fX19fX19fX0AYAh/f39/f319fwBgBX9/fX9/AX9gCH9/f399fX9/AGAHf39/fX19fQBgCn9/fX19fX19fX8AYAx/f319fX19fX19fX8AYAd/fX19fX19AGAEf31/fwF/YAd/f39/fX1/AGACfn4BfmAIf39/fX9/f30Bf2AFf31/f38Bf2AFf31+fn8Bf2AGf319fX99AX9gBn99fHx/fQF/YAJ/fAF8YAJ/fgF+YAl/f39/fX9/f30Bf2AHf399fX1/fQF/YAl/f399fX1/f30Bf2AGf399f39/AX9gCH9/f31/f39/AX9gCn9/f39/f399f38Bf2AJf39/f39/fX9/AX9gCX9/f35+f31/fwF/YAl/f399fX99f38Bf2AJf39/fHx/fX9/AX9gBXx8fH19AX1gA3x8fQF8YAN8fHwBfGAFfX19fX0BfWADfn5+AX1gA35+fgF+YAV+fn59fQF9YAV/f399fQF9YAd/f39/f399AX9gCH9/f39/f399AX9gBn9/fX1/fQF/YAd/f399fX99AX9gBn9/fX1/fwF/YAd/f399f31/AGAJf39/f39/fX1/AGAEf319fQF9YAZ/f39/f30Bf2AHf399f39/fQF/YAJ/fgBgA39/fgBgAn9/AX5gBX9/f39/AXxgBn9/f39/fwF8YAJ8fwF8YAN+f38Bf2ACfn8Bf2ABfAF9YAJ9fwF/YAJ9fwF9YAF/AX5gAn9/AXxgBH9/f38BfWAHf398f39/fwF/YAV/f399fQF/YAl/f399fX1/f38Bf2AGf39/fX99AX9gCH9/f398fH9/AX9gBX9/f399AX9gBn9/f399fwF/YAd/f39/fX9/AX9gC39/f39/f39/f39/AX9gCX9/f319fX9/fwBgCH9/f399fX1/AGAHf39/f31/fwBgCH9/f399f399AGAIf39/f31/f38AYAp/f39/fX9/f31/AGAJf39/f39/fX99AGAJf39/f39/f399AGALf39/f39/f39/fX8AAvQDNwNlbnYBYgA2A2VudgFjAE4DZW52AWQAGgNlbnYBZQAEA2VudgFmAAADZW52AWcAUwNlbnYBaABRA2VudgFpAAcDZW52AWoAAANlbnYBawAAA2VudgFsAAYDZW52AW0ALQNlbnYBbgAhA2VudgFvAAcDZW52AXAAAANlbnYBcQAaA2VudgFyAAQDZW52AXMABANlbnYBdAAHA2Vu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AX9BoLIEKAIAQawzaigCACIAQQE6AHwgAAsGAEElEAMLQwEBfyAAQQEgABshAQN/IAEQ0AEiAAR/IAAFQay3BEGstwQoAgAiADYCACAABH8gAEE/cUGWBGoRIQAMAgVBAAsLCwtDAQF/IAAEQEGgsgQoAgAiAQRAIAEgASgC8AZBf2o2AvAGCwtB7IACKAIAIQEgAEGksgQoAgAgAUH/AXFBggdqEQEAC1oBA38jBCECIwRBEGokBCACQaCyBCgCACIDQcQraiAAQQR0aiIAKQIANwIAIAIgACkCCDcCCCACIAIqAgwgA0GYKmoqAgAgAZSUOAIMIAIQrwMhBCACJAQgBAscACAAIAEqAgAgAioCAJMgASoCBCACKgIEkxAyCxIAIABBqIICNgIAIABBBGoQPAsqACAAKAIQEFYEQEEAIQAFIABBBGoiACwAC0EASARAIAAoAgAhAAsLIAALEgAgACABELERIABBtIICNgIACxYAIAAgASkCADcCACAAIAIpAgA3AggLEQBBACAAQQRqIAAoAggQVhsLKgEBfyMEIQEjBEEQaiQEIAEgADYCAEEEED8iACABKAIANgIAIAEkBCAACwYAQTQQAwvGAwEDfyACQYDAAE4EQCAAIAEgAhAjGiAADwsgACEEIAAgAmohAyAAQQNxIAFBA3FGBEADQCAAQQNxBEAgAkUEQCAEDwsgACABLAAAOgAAIABBAWohACABQQFqIQEgAkEBayECDAELCyADQXxxIgJBQGohBQNAIAAgBUwEQCAAIAEoAgA2AgAgACABKAIENgIEIAAgASgCCDYCCCAAIAEoAgw2AgwgACABKAIQNgIQIAAgASgCFDYCFCAAIAEoAhg2AhggACABKAIcNgIcIAAgASgCIDYCICAAIAEoAiQ2AiQgACABKAIoNgIoIAAgASgCLDYCLCAAIAEoAjA2AjAgACABKAI0NgI0IAAgASgCODYCOCAAIAEoAjw2AjwgAEFAayEAIAFBQGshAQwBCwsDQCAAIAJIBEAgACABKAIANgIAIABBBGohACABQQRqIQEMAQsLBSADQQRrIQIDQCAAIAJIBEAgACABLAAAOgAAIAAgASwAAToAASAAIAEsAAI6AAIgACABLAADOgADIABBBGohACABQQRqIQEMAQsLCwNAIAAgA0gEQCAAIAEsAAA6AAAgAEEB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AoQGRgRAIAMgBUcEQCAFKAIIIAMoAghyQYCAgARxRQ0CCyADIAIgACACGyABEMQRCwsLIAMgATYCiAIgAyAAKQIANwKQAiADIAApAgg3ApgCIANBADYCjAIgBEHoNGpBADYCACAAIAEQygUEf0EABSAAIABBCGpBARCSAwRAIAMgAygCjAJBAXI2AowCC0EBCwsZACABIABBxANqEHsoAgAQ9AEiABCbAiAACyEAIABD//9/f0P//39/EDIgAEEIakP//3//Q///f/8QMgsNACAAQdgAaiABEI4CCyEBAX8jBCECIwRBEGokBCACIAE2AgAgACACEOUCIAIkBAsSACAAIAEoAgAiADYCACAAEBALFAAgASACIAAgACACXhsgACABXRsLUgECfyMEIQQjBEEQaiQEIAQgAzYCACAAIAEgAiAEEK4HIgIgAUF/aiACQX9HIAIgAUhxGyEBIAAEfyAAIAFqQQA6AAAgAQUgAgshBSAEJAQgBQsQACAAKAIIIgAEQCAAEEALCxcAIABBADYCBCAAQQA2AgAgAEEANgIIC4gBAgJ/AX0jBCEFIwRBEGokBEGgsgQoAgAhBiADBEAgASACEJUBIQILIAUhAyAGQcgxaioCACEHIAEgAkYEQCAAQwAAAAAgBxAyBSADIAZBxDFqKAIAIAdD//9/fyAEIAEgAkEAEKcDIAMgAyoCAEMzM3M/kqiyOAIAIAAgAykDADcCAAsgBSQEC5gCAQR/IAAgAmohBCABQf8BcSEDIAJBwwBOBEADQCAAQQNxBEAgACADOgAAIABBAWohAAwBCwsgA0EIdCADciADQRB0ciADQRh0ciEBIARBfHEiBUFAaiEGA0AgACAGTARAIAAgATYCACAAIAE2AgQgACABNgIIIAAgATYCDCAAIAE2AhAgACABNgIUIAAgATYCGCAAIAE2AhwgACABNgIgIAAgATYCJCAAIAE2AiggACABNgIsIAAgATYCMCAAIAE2AjQgACABNgI4IAAgATYCPCAAQUBrIQAMAQsLA0AgACAFSARAIAAgATYCACAAQQRqIQAMAQsLCwNAIAAgBEgEQCAAIAM6AAAgAEEBaiEADAELCyAEIAJrC58BAQN/ED0iAiwAf0UEQEGgsgQoAgAhBCABQwAAAABdIQMgAEMAAAAAXARAIAIqArgDQwAAAAAgASADGyAC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ADcCACAAIAEgCSAHEOECGkMAAAAAQwAAgL8Qa0HprAJBAEEAEMIBEOEGCwsgEiwAAEUgCUHAAHFBAEdyRQRAIAAgASAJQYKAmMABcRDSCAsgAwRAIA4QwQELIAMFQQALCyEZIAQkBCAZC0gBAn8gACwAACIBBEADQAJAIABBAWohAiABQf8BcUElRiIBBEAgAiwAAEElRw0BCyACIAAgARtBAWoiACwAACIBDQELCwsgAAs0ACAAQQBIBH1DAACAAAUgAEEKSAR9IABBAnRB0NEBaioCAAVDAAAgQUEAIABrshCFAQsLC0ABAn8gACgCBCABSARAIAEQVSECIAAoAggiAwRAIAIgAyAAKAIAEEoaIAAoAggQQAsgACACNgIIIAAgATYCBAsLNgECfxA9LAB/RQRAQaCyBCgCACICQcDeAGoiAyADQYEYIAAgARDLAiACQcDeAGpqQQEQwgELC4YBAQV/AkACQCABQbSyBCgCACIDaiIEQayyBCgCACICSw0AQbCyBCgCACAASwRAIAJBAWohBAwBCyABBEAgACECIAMhAANAAn8gAkEBaiEGIABBAWohAyAAIAIsAAA6AAAgAUF/aiIBRQ0DIAYLIQIgAyEADAAACwALDAELQbSyBCAENgIACwtDAQF/IABBAEEAEIgCIAIgA3JBAE4EQCABKAIIIgQgAkggBCACayADSHJFBEAgACACIAEoAgBqNgIAIAAgAzYCCAsLC1kBAn8jBCEFIwRBEGokBCAFIgQgACABEMIJIAJBAEoEQAJAQQAhAANAIAQoAgQgBCgCCE4NASAAQQJ0IANqIAQQ4QQ2AgAgAEEBaiIAIAJIDQALCwsgBSQEC/ABAQN/IwQhASMEQRBqJAQgAEEgaiICEDsgAEEoaiIDEDsgAEEANgIAIABBADYCBCAAQQE6AAggAEEANgIMIABDAAAAADgCECAAQQM2AhQgAEEBNgIYIABBADoAHCABQwAAAABDAAAAABAyIAIgASkDADcCACABQwAAAABDAAAAABAyIAMgASkDADcCACAAQQA2AjAgAEMAAAAAOAI0IABD//9/fzgCOCAAQQA6ADwgAEFAa0EANgIAIABDAACAPzgCRCAAQgA3AkggAEIANwJQIABCADcCWCAAQgA3AmAgAEIANwJoIABBADYCcCABJAQLEAAgASAAa7IgApQg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gL9bDQEgDiAPkiIOIA1eDQEgASABKAIAQQFqNgIAIAJBAWoiAiAKSA0ACwsLIAAgARCEASABQQE6AA8gASANOAIUIAgEQCABIAEoAgA2AggLCwwHCyABQQA2AgggAUEANgIEIAFBADYCACABQQA6AA8MBgsgASAAKAIENgIAIAFBADYCCCABQQA2AgQgAUEAOgAPDAULIAAgARCEASABEJ0DIAEsABAEQCABQQA2AgAFIAEoAgAiAkEASgRAA0AgACACQX9qEOwBQf//A3FBCkcEQCABIAEoAgAiBEF/aiICNgIAIARBAUoNAQsLCwsgAUEAOgAPDAQLIAAoAgQhBCAAIAEQhAEgARCdAyABLAAQBEAgASAENgIABSABKAIAIgIgBEgEQANAIAAgAhDsAUH//wNxQQpHBEAgASABKAIAQQFqIgI2AgAgAiAESA0BCwsLCyABQQA6AA8MAwsgACABEIQBIAEQ6wEgASwAEARAIAFBADYCAEEAIQIFIAEoAgAiAkEASgRAA0ACQAJ/IAAgAkF/ahDsAUH//wNxQQpGIQsgASgCACEEIAsLBEAgBCECDAELIAEgBEF/aiICNgIAIARBAUoNAQsLCwsgASACNgIIIAFBADoADwwCCwJAAkACQAJAAkACQAJAAkAgBUGFgAxrDgkGBAUAAQcHAgMHC0HJACEDDAgLQc4AIQMMBwsgASgCBCABKAIIRgRAIAEQ6wELIAEgACABKAIAEIIGIgI2AgAgASACNgIIIAAgARCEAQwGCyABKAIEIAEoAghGBEAgARDrAQsgASAAIAEoAgAQgQYiAjYCACABIAI2AgggACABEIQBDAULIAEQ6wEgAUEANgIIIAFBADYCACABQQA6AA8MBAsgARDrASABIAAoAgQiAjYCCCABIAI2AgAgAUEAOgAPDAMLIAAoAgQhBCAAIAEQhAEgARDrASABLAAQBEAgASAENgIAIAQhAgUgASgCACICIARIBEADQAJAAn8gACACEOwBQf//A3FBCkYhDCABKAIAIQIgDAsNACABIAJBAWoiAjYCACACIARIDQELCwsLIAEgAjYCCCABQQA6AA8MAgtBAyEDDAELIAVBgIAMSARAIAVBjYAEawRAQQMhAwwCCyABKAIEIAEoAghGBEAgASAAIAEoAgAQgQY2AgAgACABEIQBBSAAIAEQyQQL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ADYCACAIIAMgBAR/IAQuAQAFQYCAfgtBEHRBEHUgBQR/IAUuAQAFQf//AQtBEHRBEHUgBhDSBCIABEAgAiAIKAIAOwEACwwICyAIIAIvAQA2AgAgCCADIAQEfyAELgEABUEAC0H//wNxIAUEfyAFLgEABUF/C0H//wNxIAYQ0QQiAARAIAIgCCgCADsBAAsMBwsgAiADIAQEfyAEKAIABUGAgICAeAsgBQR/IAUoAgAFQf////8HCyAGENIEIQAMBgsgAiADIAQEfyAEKAIABUEACyAFBH8gBSgCAAVBfwsgBhDRBCEADAULIAIgAyAEBH4gBCkDAAVCgICAgICAgICAfwsgBQR+IAUpAwAFQv///////////wALIAYQgwkhAAwECyACIAMgBAR+IAQpAwAFQgALIAUEfiAFKQMABUJ/CyAGEIIJIQAMAwsgAiADIAQEfSAEKgIABUP//3//CyAFBH0gBSoCAAVD//9/fwsgBiAHEIEJIQAMAgsgAiADIAQEfCAEKwMABUT////////v/wsgBQR8IAUrAwAFRP///////+9/CyAGIAcQgAkhAAwBC0EAIQALBUEAIQALIAkkBCAAC00AQoCAgICAgICAgH9C////////////ACAAIAF9IAFCAFMgAUL///////////8AfCAAU3EbIAFCAFUgAUKAgICAgICAgIB/hCAAVXEbC00AQoCAgICAgICAgH9C////////////ACAAIAF8Qv///////////wAgAX0gAFMgAUIAVXEbIAFCAFNCgICAgICAgICAfyABfSAAVXEbCzkAQYCAgIB4Qf////8HIAAgAWsgAUEASCABQf////8HaiAASHEbIAFBAEogAUGAgICAeHIgAEpxGws5AEGAgICAeEH/////ByAAIAFqQf////8HIAFrIABIIAFBAEpxGyABQQBIQYCAgIB4IAFrIABKcRsLKABBACAAQf//A3EgAUH//wNxa0H//wNxIABB//8DcSABQf//A3FIGws0AQF/QX8gAEH//wNxIgAgAUH//wNxIgJqQf//A3EgAUH//wNxQQBHIAJB//8DcyAASXEbC2wBAX8gAUEQdEEQdSECAn8CQCABQRB0QRB1QQBKBH8gAkGAgH5qIABBEHRBEHVMDQFBgIB+BSABQRB0QRB1QQBOIAJB//8BaiAAQRB0QRB1TnINAUH//wELDAELIABB//8DcSACa0H//wNxCwtpAQF/IAFBEHRBEHUhAgJ/AkAgAUEQdEEQdUEASAR/QYCAfiACayAAQRB0QRB1TA0BQYCAfgUgAUH//wNxRUH//wEgAmsgAEEQdEEQdU5yDQFB//8BCwwBCyACIABB//8DcWpB//8DcQsLIwBBACAAQf8BcSABQf8BcWtB/wFxIABB/wFxIAFB/wFxSBsLLwEBf0F/IABB/wFxIgAgAUH/AXEiAmpB/wFxIAFB/wFxQQBHIAJB/wFzIABJcRsLZgEBfyABQRh0QRh1IQICfwJAIAFBGHRBGHVBAEoEfyACQYB/aiAAQRh0QRh1TA0BQYB/BSABQRh0QRh1QQBOIAJB/wBqIABBGHRBGHVOcg0BQf8ACwwBCyAAQf8BcSACa0H/AXELC2IBAX8gAUEYdEEYdSECAn8CQCABQRh0QRh1QQBIBH9BgH8gAmsgAEEYdEEYdUwNAUGAfwUgAUH/AXFFQf8AIAJrIABBGHRBGHVOcg0BQf8ACwwBCyACIABB/wFxakH/AXELCxkAIAIEQCACIAFBAnQgAGooAgA2AgALQQELBQAQxAELJQEBfyABKgIEIAAqAgSTqCICRQRAIAEoAgAgACgCAGshAgsgAgvuAQICfwN9IAFBAUoiAwRAIAAgAUEIQQUQ0wIgAyACQwAAAABecQRAQQEhAwNAIAAqAgQhBgJ9AkAgAyABSAR9A0AgBiADQQN0IABqKgIEIgdbBEAgA0EBaiIDIAFIBEAMAgUMBAsACwsgBiAHkwUMAQsMAQsgBkMAAIC/kgshBSACIAOyIgeVIAUQSyEFIANBAEoEQCAAIAYgBZM4AgQgA0EBRwRAQQEhBANAIARBA3QgAGogBEEDdCAAaioCBCAFkzgCBCAEQQFqIgQgA0cNAAsLCyADIAFIIAIgBSAHlJMiAkMAAAAAXnENAAsLCwuGBAIJfwN9IwQhBSMEQTBqJAQgBSEGIAVBGGohAiAFQRBqIQMgBUEIaiEEED0iASwAf0UEQAJAQaCyBCgCACEHIABBAnEEQCABKgLMASIKIAEqAuwBkiELIAMgASoCyAEgChAyIAQgASoCyAFDAACAP5IgCxAyIAIgAyAEEEYgA0MAAAAAQwAAAAAQMiADQwAAAAAQjAEgAkEAQQAQX0UNAQJ/IAEoAvwEIQggAyACKgIAIAIqAgQQMiAEIAIqAgAgAioCDBAyIAgLIAMgBEEbQwAAgD8QQUMAAIA/ENcBIAdBoNoAaiwAAARAQYiqAiAGEMoCCwwBCyAAQQFxBEAgASoCDCEKIAEqAhQhDCABQZwDahB6BH0gCgUgCiABKgK0A5ILIQsgAEEEcQR/IAEoAsADIgAEfxDmBkEBBUEAIQBBAAsFQQAhAEEACyEGIAMgCyABKgLMARAyIAQgCiAMkiABKgLMAUMAAIA/khAyIAIgAyAEEEYgA0MAAAAAQwAAAAAQMiADQwAAAAAQjAEgAkEAQQAQX0UEQCAGBEAQ/wMLDAILAn8gASgC/AQhCSADIAIqAgggAioCBBAyIAkLIAIgA0EbQwAAgD8QQUMAAIA/ENcBIAdBoNoAaiwAAARAIAJBi6oCQQAQ1AELIAYEQBD/AyAAIAEoAswBNgIcCwsLCyAFJAQLfQEFfyMEIQIjBEEQaiQEIAIhABA9IgEsAH9FBEBBoLIEKAIAIQMgASgC3AIhBCABQQE2AtwCIAEqAuwBQwAAAABeBEAgAEMAAAAAQwAAAAAQMgUgAEMAAAAAIANByDFqKgIAEDILIABDAAAAABCMASABIAQ2AtwCCyACJAQLhgICC38BfSMEIQEjBEEwaiQEIAFBIGohAiABQRBqIQMgASEEIAFBCGohBxA9IgUsAH9FBEBBoLIEKAIAIgBByDFqIggqAgAhCyAAQdAqaiEGIAQgCyAFKgLsASALIABB1CpqKgIAQwAAAECUkhBLIAsQNyILEDIgAiAFQcgBaiIAIAQQNSADIAAgAhBGIANDAAAAABCmASADQQBBABBfBEBBAEMAAIA/EEEhCQJ/IAUoAvwEIQogBCAGKgIAIAgqAgBDAAAAP5SSIAtDAAAAP5QQMiAHIAMgBBA1IAIgBykCADcCACAKCyACIAkQwQQLQwAAAAAgBioCAEMAAABAlBBrCyABJAQLowQCDX8CfSMEIQMjBEGAAWokBCADQfgAaiEFIAMhCSADQdAAaiELIANByABqIQcgA0HwAGohCCADQUBrIQwgA0EwaiEEIANB6ABqIQogA0HgAGohDSADQdgAaiEOED0iDywAf0UEQEGgsgQoAgAhBiAHIA8pAsgBNwMAIAwgASkCADcDABCYASEQIAZByDFqKgIAIAZB1CpqIgEqAgBDAAAAQJSSIREgBSAMKQIANwIAIAggBSAQIBEQvQMgBSAHIAgQNSAEIAcgBRBGIAggASoCABCMASAEQQBBABBfBEAgABBZIQAgAyAEKQMANwMoIAMgBEEIaiIBKQMANwMgQQdDAACAPxBBIQcgBkHYKmoiCCoCACEQIAkgAykCKDcCACAFIAMpAiA3AgAgCSAFIAdBASAQELMBIAUgBkHcKmoqAgCMIhAgEBAyIAQgBRDbAiAFIAQqAgAgASoCACAAEIYBIAQqAgwQMiAPKAL8BCAEQShDAACAPxBBIAAgCCoCABCkCSACRQRAIAsgAEMAAMhClEMK1yM8krs5AwAgCUEgQYGqAiALEGYaIAkhAgsgCiACQQBBAEMAAIC/EGkgCioCACIAQwAAAABeBEAgDSAFKgIAIAZB4CpqKgIAkiAEKgIAIAEqAgAgAJMgBkHoKmoqAgCTEGUgBCoCBBAyIA5DAAAAAEMAAAA/EDIgDSABIAJBACAKIA4gBBC1AQsLCyADJAQL0QMCDn8BfSMEIQcjBEHgAGokBCAHQcgAaiELIAdBQGshDCAHQSBqIQggB0EQaiEJIAdBMGohCiAHQShqIQ0gB0HQAGohECAHIREQPSIOLAB/BH9BAAVBoLIEKAIAIRIgABDYASAOQeqpAhBgIQ8QeSAEQX9KBEAgCCAEsiIVIBUQMgUgCCASQdAqaikCADcDAAsgDCAOQcgBaiIEIAEQNSAKIAgQ2AQgCyAMIAoQNSAJIAQgCxBGIAsgBCAIEDUgDSAEIAgQNSAMIA0gARA1IAogCyAMEEYgCUMAAAAAEKYBIAkgD0EAEF8EfyAJIA8gDSAQQQAQlgEhE0EVQRYgDSwAAEUiARtBFyAQLAAARSABchtDAACAPxBBIQEgCSAPQQEQnQEgByAJKQMANwMIIBEgCSkDCDcDACAIKgIAIAgqAgQQS0MAAAAAIBJB2CpqKgIAEGUhFSAMIAcpAgg3AgAgCyARKQIANwIAIAwgCyABQQEgFRCzASAFKgIMQwAAAABeBEAgDigC/AQgCiAKQQhqIgEgBRDvAUMAAAAAQQ8QdQUgCkEIaiEBCyAOKAL8BCAAIAogASACIAMgBhDvARCKAiATBUEACwshFCAHJAQgFAu8AgEJfyMEIQgjBEEwaiQEIAhBIGohBiAIQRhqIQcgCEEQaiELIAhBCGohDCAIIQ0QPSIKLAB/RQRAIAcgCkHIAWoiCSABEDUgBiAJIAcQRiAFKgIMQwAAAABeBEAgB0MAAABAQwAAAEAQMiAGIAcqAgAgBioCCJI4AgggBiAHKgIEIAYqAgySOAIMCyAGQwAAAAAQpgEgBkEAQQAQXwRAIAooAvwEIQkgBkEIaiEBIAUqAgxDAAAAAF4EQCAJIAYgASAFEO8BQwAAAABBD0MAAIA/EKEBAn8gCigC/AQhDiALQwAAgD9DAACAPxAyIAcgBiALEDUgDUMAAIA/QwAAgD8QMiAMIAEgDRBCIA4LIAAgByAMIAIgAyAEEO8BEIoCBSAJIAAgBiABIAIgAyAEEO8BEIoCCwsLIAgkBAvhBgIKfwd9IwQhCiMEQUBrJAQgCkEoaiEHIApBIGohCSAKQThqIQ0gCkEQaiELIAohDEGgsgQoAgAiCEGsM2ooAgAiDiwAfwR/QQAFIAAQgAEiEkMAAAAAXyAAEL0BIhFDAAAAAF9yBH9BAAUCfyACQQFGBEAgESAIQcgxaioCACITIAhB1CpqKgIAQwAAAECUIhSSXQRAQQAgESATkyAUlRBZIhNDAAAAAF8NAhoFQwAAgD8hEwsFQwAAgD8hEwsgByAAKQIANwIAIAcgACkCCDcCCCAJIBJDAAAAwJJDAAAAP5SoskMAAAAAQwAAQEAQZYwgEUMAAADAkkMAAAA/lKiyQwAAAABDAABAQBBljBAyIAcgCRDbAiACRSICBH0gBxCAAQUgBxC9AQsiESAEIAUgBBA3QwAAgD8QN5WUIAhBiCtqKgIAIBEQZSIUIBGVIRIgCUEAOgAAIA1BADoAACAHIAEgDSAJQYDAABCWARpDAACAPyAFIASTEDchFSARIBSTIhYgAyoCACAVlRBZlCARlSEEIBJDAACAP10gE0MAAIA/YHEgCSwAAEEAR3EEQCAIQeABaiAIQeQBaiACGyoCACAHKgIAIAcqAgQgAhuTIBGVEFkhBSABEM4FAn8gCEHcM2osAAAEfyAFIARdIAUgEiAEkl5yBH8gCEHM2QBqIgFDAAAAADgCAEMAAAAAIQRBAQUgCEHM2QBqIgEgBSAEkyASQwAAAD+UkyIEOAIAQQALBSAIQczZAGoiASoCACEEQQALIRAgAyAVIAUgBJMgEkMAAAA/lCIXk0MAAIA/IBKTlRBZlEMAAAA/kqiyIgQ4AgAgFiAEIBWVEFmUIBGVIQQgEAsEQCABIAUgBJMgF5M4AgALCyAOKAL8BCAAIABBCGpBDkMAAIA/EEEgDioCPCAGEHUgCSwAAAR/QREFQRBBDyANLAAAGwsgExBBIQAgCxBhIAIEQCAMIAcqAgAgByoCCCAEEIYBIgQgByoCBCAUIASSIAcqAgwQXgUgDCAHKgIAIAcqAgQgByoCDCAEEIYBIgQgByoCCCAUIASSEF4LIAsgDCkCADcCACALIAwpAgg3AgggDigC/AQgCyALQQhqIAAgCEGEK2oqAgBBDxB1IAksAAALCwsaIAokBAvLAgINfwF9IwQhAiMEQUBrJARBoLIEKAIAIgNBrDNqKAIAIQQgAkEQaiIFIANByDFqIgoqAgAiDyAPEDIgAkEYaiIGIAEgBRA1IAIiCCADQdAqaiILENgEIAJBMGoiCSAGIAIQNSACQSBqIgcgASAJEEYgByAAQQAQXxogByAAIAYgBUEAEJYBIQ5BFUEWIAYsAABFIgAbQRcgBSwAAEUgAHIbQwAAgD8QQSEAQQBDAACAPxBBIQMgAiAHENcEIAYsAAAgBSwAAHJB/wFxBEAgBCgC/AQgCCAKKgIAQwAAAD+UQwAAgD+SIABBDBClAgsCfyAEKAL8BCENIAJBCGoiASAHIAsQNUEBQQMgBCwAfRshACAJIAEpAgA3AgAgDQsgCSADIABDAACAPxDdAhD9AgRAQQBDAACAvxCSBARAIAQQ5wcLCyACJAQgDgs+AgN/AX0jBCECIwRBEGokBCACENkBIgUgBRAyIAJBCGoiAyACKQIANwIAIAAgASADQQAQ2gQhBCACJAQgBAudAwIOfwN9IwQhAiMEQUBrJAQgAkEwaiEDIAJBKGohCCACQRhqIQUgAiEEIAJBEGohCiACQQhqIQsQPSIGLAB/RQRAQaCyBCgCACIHQcDeAGoiDEGBGCAAIAEQywIgB0HA3gBqaiENIAggDCANQQBDAACAvxBpQwAAAAAgBioC+AEQNyESIAdB0CpqIQkgBioC7AEgB0HIMWoiDioCACIQIAdB1CpqKgIAQwAAAECUkhBLIBAQNyERIAQgECAIKgIAIhBDAAAAAF4EfSAQIAkqAgBDAAAAQJSSBUMAAAAAC5IgESAIKgIEEDcQMiADIAZByAFqIgAgBBA1IAUgACADEEYgBUMAAAAAEKYBIAVBAEEAEF8EQEEAQwAAgD8QQSEBAn8gBigC/AQhDyAEIAkqAgAgDioCAEMAAAA/lJIgEUMAAAA/lBAyIAogBSAEEDUgAyAKKQIANwIAIA8LIAMgARDBBCAEIA4qAgAgCSoCAEMAAABAlJIgEhAyIAsgBSAEEDUgAyALKQIANwIAIAMgDCANQQAQuAELCyACJAQL/QICC38BfSMEIQIjBEHQAGokBCACQUBrIQMgAkE4aiEEIAJBKGohBSACQRhqIQYgAkEIaiELIAIhCSACQRBqIQwQPSIHLAB/RQRAQaCyBCgCACEIEJgBIQ0gBCAAQQBBAUMAAIC/EGkgBiANIAQqAgQgCEHUKmoiCioCAEMAAABAlJIQMiADIAdByAFqIgcgBhA1IAUgByADEEYgCSANIAQqAgBDAAAAAF4EfSAIQegqaioCAAVDAAAAAAuSIAoqAgBDAAAAQJQQMiALIAcgCRA1IAMgCyAEEDUgBiAHIAMQRiAGIAoqAgAQpgEgBkEAQQAQXwRAIAhBwN4AaiIJQYEYQY3aAiABEMsCIAhBwN4AamohASADQwAAAABDAAAAPxAyIAUgBUEIaiAJIAFBACADQQAQtQEgBCoCAEMAAAAAXgRAIAwgBSoCCCAIQegqaioCAJIgBSoCBCAKKgIAkhAyIAMgDCkCADcCACADIABBAEEBELgBCwsLIAIkBAshAQF/IwQhAiMEQRBqJAQgAiABNgIAIAAgAhCfCSACJAQLSwEBfyMEIQEjBEEQaiQEIAEgADYCACABIQAQPSoC9AJDAAAAAF0EQEMAAAAAEP4GQY3aAiAAEOUCEP0GBUGN2gIgABDlAgsgASQECzgBAX8jBCEBIwRBEGokBCABIAA2AgBBAEGgsgQoAgBB1CtqEPkBQY3aAiABEOUCQQEQrQIgASQEC7MBAgV/BH0jBCEDIwRBEGokBCADQQhqIQQgAyEFIAEgASoCBCAAKAIoIgcoAggiBioCNCAHKgIMIAYqAhCVIAYqAkiUkkMAAAA/kkMAAIC/kqiykiIIOAIEIAEqAgAhCSAIQwAAgD+SIQpBACEBA0AgBCABskMAAABAlCAJkiILIAgQMiAFIAtDAACAP5IgChAyIAAgBCAFIAJDAAAAAEEPEHUgAUEBaiIBQQNHDQALIAMkBAuQBgIHfwR9IwQhCCMEQTBqJAQgCEEgaiEGIAhBEGohByAIIgVBGGoiCUMAAAAAOAIAIAVBCGoiCiADOAIAIANDAAAAAFwEQEMAAAAAIANeBEAgCSgCACELIAkgCigCADYCACAKIAs2AgAgCSoCACENIAoqAgAhAwsgBiABKgIAIAEqAgggDRCGASABKgIEEDIgByABKgIAIAEqAgggAxCGASABKgIMEDIgBEMAAAAAWwRAIAAgBiAHIAJDAAAAAEEPEHUFQwAAgD9DAACAPyABKgIIIAEqAgAiDpNDAAAAP5QgASoCDCABKgIEk0MAAAA/lBBLQwAAgL+SQwAAAAAgBBBlIgyVIg0gBioCACIDIA6TlJMQ7AMhD0MAAIA/IA0gByoCACAOk5STEOwDIQQgAyAOIAySEDchAyAPIARbBEAgBSADIAcqAgQQMiAAIAUQYiAFIAMgBioCBBAyIAAgBRBiBSAPQwAAAABbIARD2w/JP1txBEAgBSADIAcqAgQgDJMQMiAAIAUgDEEDQQYQugEgBSADIAwgBioCBJIQMiAAIAUgDEEGQQkQugEFIAUgAyAHKgIEIAyTEDIgACAFIAxD2w9JQCAEk0PbD0lAIA+TQQMQ8QEgBSADIAwgBioCBJIQMiAAIAUgDCAPQ9sPSUCSIARD2w9JQJJBAxDxAQsLIAcqAgAiBCAMIAEqAgCSXgRAAkBDAACAPyANIAEqAggiAyAEk5STEOwDIQ5DAACAPyANIAMgBioCAJOUkxDsAyENIAQgAyAMkxBLIQMgDiANWwRAIAUgAyAGKgIEEDIgACAFEGIgBSADIAcqAgQQMiAAIAUQYgwBCyAOQwAAAABbIA1D2w/JP1txBEAgBSADIAwgBioCBJIQMiAAIAUgDEEJQQwQugEgBSADIAcqAgQgDJMQMiAAIAUgDEEAQQMQugEFIAUgAyAMIAYqAgSSEDIgACAFIAwgDYwgDoxBAxDxASAFIAMgByoCBCAMkxAyIAAgBSAMIA4gDUEDEPEBCwsLIAAgAhDyAQsLIAgkBAv1AwEPfyMEIQQjBEHwAGokBCAEQegAaiEHIARB4ABqIQogBCEIIARB2ABqIQUgBEHQAGohBiAEQcgAaiELIARBQGshDCAEQThqIQ0gBEEwaiEOIARBKGohDyAEQSBqIRAgA0F/RwRAIAAoAigoAggoAjghESAHEDsgChA7IAhBIGohEiAIIQkDQCAJEDsgCUEIaiIJIBJHDQALIBEgAyAHIAogCCAIQRBqIgkQqwkEQCABIAEqAgAgByoCAJM4AgAgASABKgIEIAcqAgSTOAIEIAAgESgCCCIDEIwCIAtDAACAP0MAAAAAEDIgBiALIAIQTiAFIAEgBhA1IA9DAACAP0MAAAAAEDIgDiAPIAIQTiANIAEgDhA1IBAgCiACEE4gDCANIBAQNSAAIAMgBSAMIAkgCEEYaiIHQYCAgIADEIoCIAtDAAAAQEMAAAAAEDIgBiALIAIQTiAFIAEgBhA1IA9DAAAAQEMAAAAAEDIgDiAPIAIQTiANIAEgDhA1IBAgCiACEE4gDCANIBAQNSAAIAMgBSAMIAkgB0GAgICAAxCKAiAGIAogAhBOIAUgASAGEDUgACADIAEgBSAJIAdBgICAeBCKAiAGIAogAhBOIAUgASAGEDUgACADIAEgBSAIIAhBCGpBfxCKAiAAEO4CCwsgBCQEC3IBBH8gAgR/IAIgAWsFIAEQWgshAiAAKAIEIgVBAXQhBCACIAAoAgAiA0EBIAMbIgZqIgMgBU4EQCAAIAMgBCADIARKGxDkAgsgACADEO0BIAAgBkF/aiIDEJ8CIAEgAhBKGiAAIAIgA2oQnwJBADoAAAuRAgIFfwJ9IwQhBiMEQSBqJAQgBkEYaiEHIAZBEGohCCAGQQhqIQkgBiEKAkACQCAFQRB0QRB1QQlrDhgBAQAAAQAAAAAAAAAAAAAAAAAAAAAAAAEACyAAIAUQ6wIiBQRAIAJDAAAAAGAEfSACIAAqAhCVBUMAAIA/CyECIAMgACoCMCADKgIAqLKSIgs4AgAgAyAAKgI0IAMqAgSospIiDDgCBCABQQZBBBC7ASAHIAsgAiAFKgIIlJIgDCACIAUqAgyUkhAyIAggCyACIAUqAhCUkiAMIAIgBSoCFJSSEDIgCSAFKgIYIAUqAhwQMiAKIAUqAiAgBSoCJBAyIAEgByAIIAkgCiAEEPMDCwsgBiQECw4AIAAgATsBQiAAEOUECzsAQcDsAy4BAEUEQEHA7ANBsLEBKQMANwMAQcjsA0G4sQEpAwA3AwBBwLEBQZoPQdDsAxCXBgtBwOwDC0kAQZCeAy4BAEUEQEGQngNBgIoBKQMANwMAQZieA0GIigEpAwA3AwBBoJ4DQZCKASgCADYCAEGgigFBxBNBpJ4DEJcGC0GQngMLlQICB38BfiMEIQkjBEEgaiQEIAlBGGohByAJQQhqIQggCSIGQRBqIQogAUEHSwR/QQAFIAAoAgRBAnEEf0EABSAIIABBQGsgACgCWBBtIgsvAQiyIAsvAQqyEDIgByABQRhsQaCIAWogCBA1IAggAUEYbEGoiAFqKQMAIg03AwAgAyANNwIAIAIgAUEYbEGwiAFqKQMANwIAIAYgByAAQSRqIgAQqwIgBCAGKQMANwIAIAogByAIEDUgBiAKIAAQqwIgBCAGKQMANwIIIAcgByoCAEMAANpCkjgCACAGIAcgABCrAiAFIAYpAwA3AgAgCiAHIAgQNSAGIAogABCrAiAFIAYpAwA3AghBAQsLIQwgCSQEIAwL7AEBB38jBCEJIwRBEGokBCAJIQUgACgCGCIGBEAgBiEFBSAFQQA2AgAgACAFQQBBAEEAELIGIAUoAgAiBwRAIAAgACgCICAAKAIcQQJ0bBBVIgY2AhggBiEFIAAoAhwgACgCIGwiCEEASgRAA0AgB0EBaiEKIAZBBGohCyAGIActAABBGHRB////B3I2AgAgCEF/aiEHIAhBAUoEQCALIQYgByEIIAohBwwBCwsLBSAAKAIYIQULCyABIAU2AgAgAgRAIAIgACgCHDYCAAsgAwRAIAMgACgCIDYCAAsgBARAIARBBDYCAAsgCSQEC6AEAQJ/IAAsAAAiAUH/AXEhAgJAIAFB/wFxQR9KBEAgAUEASARAQbSyBCgCACAALQABa0F/aiACQYF/ahDmAiAAQQJqIQAMAgsgAUH/AXFBP0oEf0G0sgQoAgBB//8AIAAtAAEgAkEIdHJraiAALQACQQFqEOYCIABBA2oFIABBAWogAkFhahDcBCAAIAAtAABBYmpqCyEABSABQf8BcUEXSgRAQbSyBCgCAEH//98AIAAtAAIgAkEQdHIgAC0AAUEIdHJraiAALQADQQFqEOYCIABBBGohAAwCCyABQf8BcUEPSgRAQbSyBCgCAEH//z8gAC0AAiACQRB0ciAALQABQQh0cmtqIAAtAAQgAC0AA0EIdHJBAWoQ5gIgAEEFaiEADAILIAFB/wFxQQdKBEAgAEECaiAALQABIAJBCHRyQYFwahDcBCAAIAAtAAEgAC0AAEEIdHJBg3BqaiEADAILAkACQAJAAkAgAUEEaw4EAgMBAAMLIABBA2ogAC0AAiAALQABQQh0ckEBahDcBCAAIAAtAAIgAC0AAUEIdHJBBGpqIQAMBAtBtLIEKAIAIAAtAAMgAC0AAUEQdHIgAC0AAkEIdHJBf3NqIAAtAARBAWoQ5gIgAEEFaiEADAMLQbSyBCgCACAALQADIAAtAAFBEHRyIAAtAAJBCHRyQX9zaiAALQAFIAAtAARBCHRyQQFqEOYCIABBBmohAAsLCyAAC94BAQF/IAAoAgAiAiAAKAIERgRAIAAgACACQQFqEFwQmAYgACgCACECCyAAKAIIIAJB9ABsaiICIAEpAgA3AgAgAiABKQIINwIIIAIgASkCEDcCECACIAEpAhg3AhggAiABKQIgNwIgIAIgASkCKDcCKCACIAEpAjA3AjAgAiABKQI4NwI4IAJBQGsgAUFAaykCADcCACACIAEpAkg3AkggAiABKQJQNwJQIAIgASkCWDcCWCACIAEpAmA3AmAgAiABKQJoNwJoIAIgASgCcDYCcCAAIAAoAgBBAWo2AgALvgEBBX8jBCEDIwRBEGokBCADIQIgAEE0aiEFIAEsADwEQCAFEHoaBUHYABBVIQQgAyADLAAEOgAFIAQQmQYgAiAENgIAIAUgAhB/CyAAQcwAaiICIAEQrgkgAigCCCACKAIAQX9qQfQAbGoiAigCcEUEQCACIAUQeygCADYCcAsgAiwACEUEQCACIAIoAgQQVSIENgIAIAJBAToACCAEIAEoAgAgAigCBBBKGgsgABDxAyACKAJwIQYgAyQEIAYLqwEBAX8gAS0AAyABLQAAQRh0IAEtAAFBEHRyciABLQACQQh0ckGAgPC9BUYEQCABLQAHIAEtAARBGHQgAS0ABUEQdHJyIAEtAAZBCHRyRQRAIAEQmwYhAkGosgQgATYCAEGssgQgACACaiICNgIAQbCyBCAANgIAQbSyBCAANgIAIAFBEGohAANAIAAQrQkiASAARkG0sgQoAgAgAktyRQRAIAEhAAwBCwsLCwvpAQEFfyMEIQYjBEGAAWokBCAGIQUgARCbBiIHEFUiCCABELAJIAMEQCAFIAMpAgA3AgAgBSADKQIINwIIIAUgAykCEDcCECAFIAMpAhg3AhggBSADKQIgNwIgIAUgAykCKDcCKCAFIAMpAjA3AjAgBSADKQI4NwI4IAVBQGsgA0FAaykCADcCACAFIAMpAkg3AkggBSADKQJQNwJQIAUgAykCWDcCWCAFIAMpAmA3AmAgBSADKQJoNwJoIAUgAygCcDYCcAUgBRDpAgsgBUEBOgAIIAAgCCAHIAIgBSAEEJoGIQkgBiQEIAkLWQEDfyMEIQUjBEEQaiQEIAUhAwJAAkAgACABEKsDIgQgABCqA0YNACAEKAIAIAFHDQAgBCACNgIEDAELIAMgATYCACADIAI2AgQgACAEIAMQ3wQaCyAFJAQLigEBAn9B0CohAUHQKiwAACICBEADQCAAIAIQqAMgASwAARCoAyABLAACEKgDIAEsAAMQqAMgASwABBCoA0HVAGxqQdUAbGpB1QBsakHVAGxqIgI6AAAgACACQQh2OgABIAAgAkEQdjoAAiAAIAJBGHY6AAMgAEEEaiEAIAFBBWoiASwAACICDQALCwsuAQJ/QdAqEFpBBGpBBW1BAnQQVSIEELMJIAAgBCABIAIgAxCxCSEFIAQQQCAFC2gBAn8jBCEBIwRBEGokBCAAQRBqIgIQOyAAQX82AgAgAEEAOwEGIABBADsBBCAAQX87AQogAEF/OwEIIABDAAAAADgCDCABQwAAAABDAAAAABAyIAIgASkDADcCACAAQQA2AhggASQEC00BA38gACgCBCABSARAIAFBxAFsEFUhAiAAQQhqIgMoAgAiBARAIAIgBCAAKAIAQcQBbBBKGiADKAIAEEALIAMgAjYCACAAIAE2AgQLC7oCAAJ/AkACQAJAAkACQCAALAAADnUDBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAgQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAEECyAALAABDQMgACwAAg0DIAAsAAMNA0EBDAQLAkACQCAALAABQfIAaw4IAQQEBAQEBAAECyAALAACQfAARw0DIAAsAANBMUcNA0EBDAQLIAAsAAJB9QBHDQIgACwAA0HlAEcNAkEBDAMLIAAsAAFB1ABHDQEgACwAAkHUAEcNASAALAADQc8ARw0BQQEMAgsgACwAAUEBRw0AIAAsAAINACAALAADDQBBAQwBC0EACwugAQEBfyAAELcJBH8gAUEAR0EfdEEfdQUgACwAAEH0AEYEfyAALAABQfQARgR/IAAsAAJB4wBGBH8gACwAA0HmAEYEfwJ/IABBBGoQzAEiAkGAgAhIBH9BfyACQYCABGsNAQVBfyACQYCACGsNAQsaIABBCGoQzAEgAUoEfyAAQQxqIAFBAnRqEMwBBUF/CwsFQX8LBUF/CwVBfwsFQX8LCwvDCAESfyMEIQYjBEHgAGokBCAGQUBrIQggBkE0aiEEIAZBKGohByAGQSRqIQogBkEgaiELIAZBEGohDCAGQQxqIQ0gBkEUaiEOIAYhBSAAIAE2AgQgACACNgIIIAZBzABqIgNBAEEAEIgCIAAgAykCADcCNCAAIAMoAgg2AjwgASACQZCpAhDuASEJIAAgASACQZWpAhDuASIPNgIQIAAgASACQZqpAhDuASIQNgIUIAAgASACQZ+pAhDuASIRNgIYIAAgASACQaSpAhDuASISNgIcIAAgASACQampAhDuASITNgIgIAAgASACQa6pAhDuATYCJCAAIAEgAkGzqQIQ7gE2AiggE0UgEkUgCUUgEEVycnIEf0EABQJ/IBEEQEEAIA9FDQEaBQJAIApBAjYCACALQQA2AgAgDEEANgIAIA1BADYCACABIAJBuKkCEO4BIg8EQAJAIANBAEEAEIgCIAAgAykCADcCZCAAIAMoAgg2AmwgA0EAQQAQiAIgACADKQIANwJwIAAgAygCCDYCeCADIAEgD2pBgICAgAIQiAIgACADKQIANwI0IAAgAygCCDYCPCAEIAApAjQ3AgAgBCAAKAI8NgIIIARBAhChAiAEIAQQqwFB/wFxEIcCIAMgBBDHAiAOIAQQxwIgAyAOKQIANwIAIAMgDigCCDYCCCAHIANBABDvAyADIAQQxwIgAyAEEMcCIAAgAykCADcCTCAAIAMoAgg2AlQgB0ERQQEgCxDoAiAHQYYCQQEgChDoAiAHQaQCQQEgDBDoAiAHQaUCQQEgDRDoAiAIIAQpAgA3AgAgCCAEKAIINgIIIAMgBykCADcCACADIAcoAgg2AgggBSAIIAMQoAYgACAFKQIANwJYIAAgBSgCCDYCYCALKAIAIgdFIAooAgBBAkdyRQRAIAwoAgAiCARAIA0oAgAiBUUNAiAEIAgQhwIgAyAEEMcCIAAgAykCADcCZCAAIAMoAgg2AmwgAyAEIAUgBCgCCCAFaxDnAiAAIAMpAgA3AnAgACADKAIINgJ4CyAEIAcQhwIgAyAEEMcCIABBQGsiBSADKQIANwIAIAUgAygCCDYCCAwDCwsLQQAMAgsLIAAgASACQb2pAhDuASICBH8gASACakEEahBMQf//A3EFQf//Aws2AgwgASAJakECahBMIgJB//8DcSEEIABBADYCLCACQf//A3EEfyAJQQRqIQdBACECQQAhBQNAAkACQAJAIAEgByAFQQN0amoiAxBMQRB0QRB1DgQBAgIAAgsCQCADQQJqEExBEHRBEHVBAWsOCgACAgICAgICAgACCyAAIANBBGoQzAEgCWoiAjYCLAwBCyAAIANBBGoQzAEgCWoiAjYCLAsgBUEBaiIFIARHDQALIAIEfyAAIAEgACgCFGpBMmoQTEH//wNxNgIwQQEFQQALBUEACwsLIRQgBiQEIBQLoQEBAn8jBCEHIwRBMGokBCAHIgZCADcCBCAGQgA3AgwgBkIANwIUIAZCADcCHCAGQgA3AiQgBkEANgIsIAZBATYCACAAIAEgBhDjBCEAIAIEQCACIAYoAhhBACAAGzYCAAsgAwRAIAMgBigCIEEAIAAbNgIACyAEBEAgBCAGKAIcQQAgABs2AgALIAUEQCAFIAYoAiRBACAAGzYCAAsgByQEC6QBACAAKAI8BH8gACABIAIgAyAEIAUQuglBAQUgACABEJ8GIgFBAEgEf0EABSACBEAgAiAAKAIEIAFqQQJqEExBEHRBEHU2AgALIAMEQCADIAAoAgQgAWpBBGoQTEEQdEEQdTYCAAsgBARAIAQgACgCBCABakEGahBMQRB0QRB1NgIACyAFBEAgBSAAKAIEIAFqQQhqEExBEHRBEHU2AgALQQELCwu+AQECfyAEQX9qIQYgBEEBSgR/A38gBUEDdCADaiAFQQFqIgVBA3QgA2o2AgQgBSAGRw0AIAYLBUEAC0EDdCADakEANgIEIABBATYCDCAAQQA2AhAgACADNgIcIAAgAEEgajYCGCAAIAE2AgAgACACNgIEIAAgBDYCFCAAIAAoAhQiAiAAKAIAQX9qaiACbTYCCCAAQQA7ASAgAEEAOwEiIAAgAEEoajYCJCAAIAE7ASggAEF/OwEqIABBADYCLAuXBAEMfyMEIQ8jBEEQaiQEIA8hDCABQRhqIgcoAgAiCi8BACIFIAEoAggiBCACQX9qaiICIAIgBG9rIgtqIAEoAgBKBH9BACEFQYCAgIAEIQJBgICAgAQhBEEABUGAgICABCECQYCAgIAEIQQgByEGA0AgCiAFIAsgDBCdBiEFIAEoAhAEQCADIAVqIAEoAgRMBEACQCAFIARIBH8gDCgCAAUgBCAFRiAMKAIAIgkgAkhxBH8gCQUMAgsLIQIgBiEIIAUhBAsLBSAGIAggBSAESCIGGyEIIAUgBCAGGyEECyAKQQRqIgYoAgAiCi8BACIFIAtqIAEoAgBMDQALIAgEfyAIIgUoAgAvAQAFQQAhBUEACwshCCABKAIQQQFGBEAgCyAHKAIAIgkvAQBKBH8gCSEGA38gCyAGKAIEIgYvAQBKBH8MAQUgBgsLBSAJCyIOBEAgBCEGIAchCgN/IA4vAQAgC2shDQNAIA0gCUEEaiIEKAIAIgcvAQBOBEAgByEJIAQhCgwBCwsgAyAJIA0gCyAMEJ0GIgdqIAEoAgROIAcgBkpyBH8gBQUCfyAHIAZIIAwoAgAiBCACSHIEQCAEIQIFIAUgAiAERiANIAhIcUUNARoLIA0hCCAHIQYgCgsLIQQgDigCBCIOBH8gBCEFDAEFIAQhBSAGCwshBAsLIAAgBTYCCCAAIAg2AgAgACAENgIEIA8kBAsZAEF/IAAoAgwiACABKAIMIgFKIAAgAUgbC4UCAQN/IAAgASACIAMQvQkCQAJAIAAoAggiBEUNACADIAAoAgRqIgMgASgCBEoNACABKAIcIgVFDQAgBSAAKAIAIgA7AQAgBSADOwECIAEgBSgCBDYCHCAAIAQoAgAiAy8BAEoEQCADQQRqIgMhBCADKAIAIQMLIAQgBTYCACAAIAJqIQYgA0EEaiIEKAIAIgAEQAJAIAMhAiAEIQMDQCAGIAAvAQBIBEAgAiEADAILIAMgASgCHDYCACABIAI2AhwgAEEEaiIDKAIAIgQEQCAAIQIgBCEADAELCwsFIAMhAAsgBSAANgIEIAYgAC8BAEoEQCAAIAY7AQALDAELIABBADYCCAsLRQECfyAALwEGIgIgAS8BBiIDSgR/QX8FIAIgA0gEf0EBBUF/IAAvAQQiACABLwEEIgFIIABB//8DcSABQf//A3FKGwsLC2ABAX8gABDeBEH/AXFBHkYEQAJAIABBARChAiAAKAIEIAAoAghIBEADQCAAEKsBQf8BcSIBQQ9xQQ9GIAFB8AFxQfABRnINAiAAKAIEIAAoAghIDQALCwsFIAAQ4QQaCwuwAQEEfyABQQAQhwICQAJAIAEoAgQiAyABKAIITg0AA0ACQCABEN4EQf8BcUEbSgR/A0AgARDBCSABEN4EQf8BcUEbSg0ACyABKAIEBSADCyEFIAEQqwEiBkH/AXEhBCAGQf8BcUEMRgRAIAEQqwFB/wFxQYACciEECyACIARGDQAgASgCBCIDIAEoAghIDQEMAgsLIAAgASADIAUgA2sQ5wIMAQsgACABQQBBABDnAgsLfQEEfyMEIQQjBEEQaiQEIAQhAyACQYCAAkHrCAJ/QesAIQYgAUEAEIcCIAYLIAFBAhDNASIFQdcJShsgBUHriAJKG2oiAkF/SiACIAVIcQRAIAMgASkCADcCACADIAEoAgg2AgggACADIAIQ7wMFIABBAEEAEIgCCyAEJAQLzAIBCn8jBCEFIwRBQGskBCAFQTBqIQQgBUEkaiEIIAVBGGohByAFIQkgBUEMaiIDIAFB8ABqIgYpAgA3AgAgAyAGKAIINgIIIANBABCHAgJ/AkACQAJAIAMQqwFBGHRBGHUOBAACAgECCyADIAIQoQIgAxCrAUH/AXEMAgsgA0ECEM0BIQogA0ECEM0BIQYgCkEATA0AA0ACQCADEKsBIQwgBiACTCADQQIQzQEiBiACSnENACALQQFqIgsgCkgNAQwCCwsgDEH/AXEMAQsgBEEAQQAQiAJBfwshAiAHIAFBNGoiBikCADcCACAHIAYoAgg2AgggBCABQeQAaiIBKQIANwIAIAQgASgCCDYCCCAJIAQgAhDvAyAIIAcpAgA3AgAgCCAHKAIINgIIIAQgCSkCADcCACAEIAkoAgg2AgggACAIIAQQoAYgBSQEC1IBA38jBCEDIwRBEGokBCADIQQCQAJAIAAgARCrAyICIAAQqgNGDQAgAigCACABRw0ADAELIAQgAUF/EHggACACIAQQ3wQhAgsgAyQEIAJBBGoLwAEBBH8jBCEFIwRB4ABqJAQgBUEwaiIDQgA3AgQgA0IANwIMIANCADcCFCADQgA3AhwgA0IANwIkIANBADYCLCADQQE2AgAgBSIEQgA3AgAgBEIANwIIIARCADcCECAEQgA3AhggBEIANwIgIARCADcCKAJ/AkAgACABIAMQ4wRFDQAgAiADKAIsQQ5sEFUiAzYCACAEIAM2AiggACABIAQQ4wRFDQAgBCgCLAwBCyACQQA2AgBBAAshBiAFJAQgBgu2DgIVfwp9IwQhESMEQRBqJAQgESEPIAAoAgQhAyAAIAEQnwYhASACQQA2AgAgAUEASARAQQAhAQUCQCABIANqIgMQTCIBQRB0QRB1QQBKBEAgA0EKaiIWIAFBEHRBEHVBAXQiEGoiBhBMIQEgBkF+ahBMQf//A3EiEiAQQQFyakEObBBVIghFBEBBACEBDAILIBJBAWohCkEAIQNBACEAIAZBAmogAUH//wNxaiEBA0AgA0H/AXEEQCADQX9qQRh0QRh1IQMFIAFBAWohBiABLAAAIgBBCHEEfyAGLAAAIQMgAUECagVBACEDIAYLIQELIAUgEGpBDmwgCGogADoADCAFQQFqIgUgCkcNAAtBACEFQQAhAwNAIAUgEGoiBkEObCAIai0ADCIEQQJxBEAgAUEBaiEAQQAgAS0AACIBayABIARBEHFFGyADaiEDBSAEQRBxBH8gAQUgAS0AASABLQAAQQh0ckEQdEEQdSADaiEDIAFBAmoLIQALIAZBDmwgCGogAzsBACAFQQFqIgUgCkcEQCAAIQEMAQsLQQAhBUEAIQEDQCAFIBBqIgZBDmwgCGotAAwiBEEEcQRAIABBAWohA0EAIAAtAAAiAGsgACAEQSBxRRsgAWohAQUgBEEgcQR/IAAFIAAtAAEgAC0AAEEIdHJBEHRBEHUgAWohASAAQQJqCyEDCyAGQQ5sIAhqIAE7AQIgBUEBaiIFIApHBEAgAyEADAELC0EAIQBBACEBQQAhA0EAIQoDQCAAIBBqIgRBDmwgCGosAAwhFCAEQQ5sIAhqLgEAIQUgBEEObCAIai4BAiEGIAAgE0YEfyAABEAgCCAHIA0gFSAOIAogASADIAwgCxCeBiEHCyAUQQFxIg8EQCAFIQ4gBiEKBSAEQQFqIgFBDmwgCGouAQAhDiABQQ5sIAhqLAAMQQFxBH8gAEEBaiEAIAYhAyABQQ5sIAhqLgECIQogBQUgBSAOakEBdSEOIAYiAyABQQ5sIAhqLgECakEBdSEKIAULIQELIAdBDmwgCGpBASAOIApBAEEAEIkCIAwhBSALIQYgFiAJQQF0ahBMQf//A3FBAWohEyAHQQFqIQcgD0EBcyEVQQAhDSAJQQFqBQJ/IA1BAEchBCAHQQFqIQ8gB0EObCAIaiENIBRBAXFFBEAgBEUEQEEBIQ0gCQwCCyANQQMgBSAMakEBdSAGIAtqQQF1IAwgCxCJAiAPIQdBASENIAkMAQsgBARAIA1BAyAFIAYgDCALEIkCBSANQQIgBSAGQQBBABCJAgsgCyEGIA8hB0EAIQ0gDCEFIAkLCyEEIABBAWohCSAAIBJIBEAgBSEMIAYhCyAJIQAgBCEJDAELCyAIIAcgDSAVIA4gCiABIAMgBSAGEJ4GIQEgCCEDBSABQf//A3FB//8DRgRAAkAgA0EKaiEJQQAhAQNAAkAgD0EANgIAAn8gCRBMIRcgCUECahBMIQMgCUEEaiELIBcLQf//A3EiDEECcQR/IAxBAXEEfyALEExBEHRBEHWyIR0gCUEGahBMQRB0QRB1siEeIAlBCGoFIAssAACyIR0gCSwABbIhHiAJQQZqCwVDAAAAACEdQwAAAAAhHiALCyEEIAxBCHEEfyAEEExBEHRBEHWyQwAAgDiUIhghGUMAAAAAIRpDAAAAACEbIARBAmoFAn8gDEHAAHEEQCAEEExBEHRBEHWyQwAAgDiUIRlDAAAAACEaQwAAAAAhGyAEQQJqEExBEHRBEHWyQwAAgDiUIRggBEEEagwBCyAMQYABcQR/IAQQTEEQdEEQdbJDAACAOJQhGSAEQQJqEExBEHRBEHWyQwAAgDiUIRogBEEEahBMQRB0QRB1skMAAIA4lCEbIARBBmoQTEEQdEEQdbJDAACAOJQhGCAEQQhqBUMAAIA/IRlDAAAAACEaQwAAAAAhG0MAAIA/IRggBAsLCyEJIBogGpQgGSAZlJKRISAgGCAYlCAbIBuUkpEhISAAIANB//8DcSAPEKQGIgtBAEoEQCAPKAIAIQdBACEDA0AgA0EObCAHaiIELgEAsiEcIAQgICAdIBkgHJQgGyADQQ5sIAdqIgQuAQKyIh+UkpKUqDsBACAEICEgHiAaIByUIBggH5SSkpSoOwECIANBDmwgB2oiBC4BBLIhHCAEICAgHSAZIByUIBsgA0EObCAHaiIELgEGsiIflJKSlKg7AQQgBCAhIB4gGiAclCAYIB+UkpKUqDsBBiADQQFqIgMgC0cNAAsgASALaiIEQQ5sEFUiA0UNASABQQBKBEAgAyAOIAFBDmwQShoLIAFBDmwgA2ogByALQQ5sEEoaIAoEQCAGEEALIAcQQCADIQUgAyEGIAMhDiAEIQEFIAohAwsgDEEgcUUNAiADIQoMAQsLIAoEQCAFEEALIAcQQEEAIQEMAwsFQQAhAUEAIQMLCyACIAM2AgALCyARJAQgAQuGAgIIfwF9IwQhBiMEQRBqJAQgBiEEIAFBAUoEQEEBIQMDQCADQRRsIABqKAIAIQkgA0EUbCAAaioCBCEKIAQgA0EUbCAAaiICKQIINwIAIAQgAigCEDYCCCADIQIDQCAKIAJBf2oiBUEUbCAAaioCBF0EQCACQRRsIABqIgcgBUEUbCAAaiIIKQIANwIAIAcgCCkCCDcCCCAHIAgoAhA2AhAgAkEBSgR/IAUhAgwCBSAFCyECCwsgAiADRwRAIAJBFGwgAGogCTYCACACQRRsIABqIAo4AgQgAkEUbCAAaiICIAQpAgA3AgggAiAEKAIINgIQCyADQQFqIgMgAUcNAAsLIAYkBAssAQF/IAAgARCrAyICIAAQqgNGBH9BAAUgASACKAIARgR/IAIoAgQFQQALCwt3AQJ/IAAoAgQiAQRAIAAgASgCADYCBAUCfyAAKAIIIgEEQCABQX9qIQIgACgCACEBBUEAQcS1AxBVIgFFDQEaIAEgACgCADYCACAAIAE2AgAgAEHQDzYCCEHPDyECCyAAIAI2AgggAUEEaiACQRxsagshAQsgAQsnAQF/IAAoAgAiAARAA0AgACgCACEBIAAQQCABBEAgASEADAELCwsLzAgCCH8LfSAEQwAAgD+SIREgAwRAIAKyIRYgAkEASiEKIAFBfGohCQNAIAMqAgQhDSADKgIIIhRDAAAAAFsEQCANIBZdBEAgDUMAAAAAYARAIAAgDagiBSADIA0gBCANIBEQjgEgCSAFQQFqIAMgDSAEIA0gERCOAQUgCUEAIAMgDSAEIA0gERCOAQsLBQJAIAMqAgwhEiADKgIUIg4gBF4hBSAOIAQgBRshEyADKgIYIg8gEV0hBiAPIBEgBhshFSANIBQgDiAEk5SSIA0gBRsiDkMAAAAAYCANIBQgDyAEk5SSIBQgDZIiECAGGyIPQwAAAABgcQRAIA4gFl0gDyAWXXEEQCAOqCIGIA+oIgdGBEAgBkECdCAAaiIFIAUqAgAgFSATkyINQwAAgD8gDiAGsiIOkyAPIA6TkkMAAAA/lJMgAyoCEJSUkjgCACAGQQJ0IAFqIgUgBSoCACANIAMqAhCUkjgCAAwDCyAOIA9eBEAgByEFIBKMIRIgESAVIASTkyEUIBEgEyAEk5MhFSAQIQ0gDiEQIA8hDgUgBiEFIAchBiATIRQgDyEQCyAFQQJ0IABqIgcgByoCAEMAAIA/IA4gBbKTQwAAgD+SQwAAAD+UkyADKgIQIg8gEiAFQQFqIgeyIA2TlCAEkiITIBSTlCIOlJI4AgAgEiAPlCENIAYgB0oEQCANQwAAAD+UIRcgByEFA0AgBUECdCAAaiIIIBcgDpIgCCoCAJI4AgAgDSAOkiEOIAVBAWoiBSAGRw0ACwsgBkECdCAAaiIFIA9DAACAPyAQIAayk0MAAAAAkkMAAAA/lJOUIBUgEiAGIAdrspQgE5KTlCAOkiAFKgIAkjgCACAGQQJ0IAFqIgUgFSAUkyAPlCAFKgIAkjgCAAwCCwsgCgRAQQAhBQNAIAWyIg4gDZMgFJUgBJIhEiAFQQFqIgayIg8gDZMgFJUgBJIhEyANIA5dIgcgECAPXiIIcQRAIAAgBSADIA0gBCAOIBIQjgEgACAFIAMgDiASIA8gExCOASAAIAUgAyAPIBMgECAREI4BBQJAIBAgDl0iCyANIA9eIgxxBEAgACAFIAMgDSAEIA8gExCOASAAIAUgAyAPIBMgDiASEI4BIAAgBSADIA4gEiAQIBEQjgEMAQsgByAQIA5ecQRAIAAgBSADIA0gBCAOIBIQjgEgACAFIAMgDiASIBAgERCOAQwBCyALIA0gDl5xBEAgACAFIAMgDSAEIA4gEhCOASAAIAUgAyAOIBIgECAREI4BDAELIAggDSAPXXEEQCAAIAUgAyANIAQgDyATEI4BIAAgBSADIA8gEyAQIBEQjgEMAQsgDCAQIA9dcQRAIAAgBSADIA0gBCAPIBMQjgEgACAFIAMgDyATIBAgERCOAQUgACAFIAMgDSAEIBAgERCOAQsLCyACIAZHBEAgBiEFDAELCwsLCyADKAIAIgMNAAsLC5EBAQR9IAAQygkhACABKgIIIAEqAgAiBpMgASoCDCIHIAEqAgQiBZOVIQQgAARAIAAgBDgCCCAAQwAAgD8gBJVDAAAAACAEQwAAAABcGzgCDCAAIAYgAyAFkyAElJIgArKTOAIEIABDAACAP0MAAIC/IAEoAhAbOAIQIAAgBTgCFCAAIAc4AhggAEEANgIACyAAC4cFAgx/A30jBCEJIwRBoARqJAQgCSENIAlBiARqIgZCADcCACAGQQA2AgggCUGEBGoiB0EANgIAIAAoAgAiCEHAAEoEQCAIQQN0QQRyEFUhBSAAKAIAIQgFIA0hBQsgCEECdCAFaiEKIAJBFGwgAWogBCAAKAIEIgJqskMAAIA/kjgCBCACQQBKBEAgBEEARyEPIApBBGohEEEAIQIgBCELA0AgC7IhESAFQQAgCEECdBBqGiAKQQAgACgCAEECdEEEahBqGiACBEAgByEEA0AgAioCGCARXwRAIAQgAigCADYCACACQwAAAAA4AhAgAiAGKAIENgIAIAYgAjYCBAUgAiEECyAEKAIAIgINAAsLIAEqAgQiEiARQwAAgD+SIhNfBEAgDEUgD3EhBAN/IBIgASoCDFwEQCAGIAEgAyAREM0JIgIEQCAEBEAgAioCGCARXQRAIAIgETgCGAsLIAIgBygCADYCACAHIAI2AgALCyABQRRqIQIgASoCGCISIBNfBH8gAiEBDAEFIAILCyEBCyAHKAIAIgIEQCAFIBAgACgCACACIBEQzAkLIAAoAgAiAkEASgRAQQAhAkMAAAAAIRIDfyAAKAIMIAIgACgCCCAMbGpqIAJBAnQgBWoqAgAgEiACQQJ0IApqKgIAkiISkotDAAB/Q5RDAAAAP5KoIgRB/wEgBEH/AUgbOgAAIAJBAWoiAiAAKAIAIgRIDQAgBAshAgsgBygCACIOBEAgDiEEA0AgBCAEKgIIIAQqAgSSOAIEIAQoAgAiBA0ACwsgC0EBaiELIAxBAWoiDCAAKAIESARAIAIhCCAOIQIMAQsLCyAGEMsJIAUgDUcEQCAFEEALIAkkBAuRAwILfwJ9IAWMIRMgA0EASiILBH8DQCAIQQJ0IAJqKAIAIAlqIQkgCEEBaiIIIANHDQALIAlBFGxBFGoFQRQLEFUiCgRAIAsEQEEAIQgDQCAQQQN0IAFqIQ0gEUECdCACaiISKAIAIg5BAEoEQCAOQX9qIg9BA3QgDWoqAgQhBSAOIQlBACELA0AgBSALQQN0IA1qKgIEIhRcBEAgCEEUbCAKaiAFIBReIgk2AhAgCEEUbCAKaiAPIAsgCRtBA3QgDWoiDCoCACAElEMAAAAAkjgCACAIQRRsIApqIAwqAgQgE5RDAAAAAJI4AgQgCEEUbCAKaiALIA8gCRtBA3QgDWoiDCoCACAElEMAAAAAkjgCCCAIQRRsIApqIAwqAgQgE5RDAAAAAJI4AgwgCEEBaiEIIBIoAgAhCQsgC0EBaiIMIAlIBEAgCyEPIBQhBSAMIQsMAQsLCyAOIBBqIRAgEUEBaiIRIANHDQALBUEAIQgLIAogCBDkBCAKIAgQyAkgACAKIAggBiAHEM4JIAoQQAsLjAUCCn8CfSMEIQ0jBEEQaiQEIA0iB0EANgIAIAIgApQhECABQQBKIg4EQAJAA0AgCEEObCAAaiwADEEBRiAGaiEGIAhBAWoiCCABRw0ACyAEIAY2AgAgBgRAIAMgBkECdBBVIgY2AgAgBkUEQCAEQQA2AgAMAgtBACEGA0ACQCALQQFGBEAgBygCAEEDdBBVIglFDQELIAdBADYCACAOBH9BACEFQX8hCEMAAAAAIQJDAAAAACEPA0AgBUEObCAAaiEKAkACQAJAAkACQCAFQQ5sIABqLAAMQQFrDgQAAQIDBAsgCEF/SgRAIAMoAgAgCEECdGogBygCACAGazYCAAsgCi4BALIhAiAFQQ5sIABqLgECsiEPIAcgBygCACIGQQFqNgIAIAkgBiACIA8Q8AMgCEEBaiEIDAMLIAouAQCyIQIgBUEObCAAai4BArIhDyAHIAcoAgAiCkEBajYCACAJIAogAiAPEPADDAILIAkgByACIA8gBUEObCAAai4BBLIgBUEObCAAai4BBrIgCi4BALIgBUEObCAAaiIMLgECsiAQQQAQowYgCi4BALIhAiAMLgECsiEPDAELIAkgByACIA8gBUEObCAAai4BBLIgBUEObCAAai4BBrIgBUEObCAAai4BCLIgBUEObCAAai4BCrIgCi4BALIgBUEObCAAaiIMLgECsiAQQQAQogYgCi4BALIhAiAMLgECsiEPCyAFQQFqIgUgAUcNAAsgBygCAAVBfyEIQQALIQUgAygCACAIQQJ0aiAFIAZrNgIAIAtBAWoiC0ECSQ0BDAMLC0EAEEAgAygCABBAIANBADYCACAEQQA2AgALQQAhCQsFIARBADYCAAsgDSQEIAkLawEDfyMEIQcjBEEQaiQEIAdBBGoiCEEANgIAIAciCUEANgIAIAEgAkMzM7M+IAQgAyADIAReG5UgByAIENAJIgEEQCAAIAEgCSgCACIAIAgoAgAgAyAEIAUgBhDPCSAAEEAgARBACyAHJAQLpQUBCX8jBCEMIwRBEGokBCAMIgZCADcDACABQQBKBEAgAiAEa0EASCELIAJBAWogBGshByAAIQoDQCAGQQAgBBBqGgJ/AkACQAJAAkACQCAEQQJrDgQAAQIDBAsgCwR/QQAhBUEABUEAIQBBACEFA38gACADbCAKaiIILAAAIglB/wFxIABBB3EgBmotAABrIAVqIQUgAEECakEHcSAGaiAJOgAAIAggBUEBdjoAACAAQQFqIgAgB0cNACAHCwsMBAsgCwR/QQAhBUEABUEAIQBBACEFA38gACADbCAKaiIILAAAIglB/wFxIABBB3EgBmotAABrIAVqIQUgAEEDakEHcSAGaiAJOgAAIAggBUEDbjoAACAAQQFqIgAgB0cNACAHCwsMAwsgCwR/QQAhBUEABUEAIQBBACEFA38gACADbCAKaiIILAAAIglB/wFxIABBB3EgBmotAABrIAVqIQUgAEEEakEHcSAGaiAJOgAAIAggBUECdjoAACAAQQFqIgAgB0cNACAHCwsMAgsgCwR/QQAhBUEABUEAIQBBACEFA38gACADbCAKaiIILAAAIglB/wFxIABBB3EgBmotAABrIAVqIQUgAEEFakEHcSAGaiAJOgAAIAggBUEFbjoAACAAQQFqIgAgB0cNACAHCwsMAQsgCwR/QQAhBUEABUEAIQBBACEFA38gACADbCAKaiIILAAAIglB/wFxIABBB3EgBmotAABrIAVqIQUgACAEakEHcSAGaiAJOgAAIAggBSAEbjoAACAAQQFqIgAgB0cNACAHCwsLIgAgAkgEQANAIAAgA2wgCmogBSAAQQdxIAZqLQAAayIFIARuOgAAIABBAWoiACACRw0ACwsgCkEBaiEKIA1BAWoiDSABRw0ACwsgDCQEC5MFAQl/IwQhDCMEQRBqJAQgDCIGQgA3AwAgAkEASgRAIAEgBGtBAEghCyABQQFqIARrIQcgACEKA0AgBkEAIAQQahoCfwJAAkACQAJAAkAgBEECaw4EAAECAwQLIAsEf0EAIQVBAAVBACEAQQAhBQN/IAAgCmoiCCwAACIJQf8BcSAAQQdxIAZqLQAAayAFaiEFIABBAmpBB3EgBmogCToAACAIIAVBAXY6AAAgAEEBaiIAIAdH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IgMgARCNByACIAEgAxCMByACQRBqIgMgAikCADcCACAAIAEgAxD7AiACJAQLBQAQwQMLDgAQbygCjAJBBHFBAEcLJAEBf0GgsgQoAgAiAEG4NWooAgAEfyAAQZY2aiwAAEUFQQALCxMAQaCyBCgCAEHQM2ooAgBBAEcLFAAgAEEAEMMDBH9BABCCAgVBAAsLQAEBf0GgsgQoAgAhABCVBwR/IABBgTRqLAAABH9BAQUgAEHQM2ooAgAEf0EABSAAQd8zaiwAAEEARwsLBUEACwspAQF+IAEgAq0gA61CIIaEIAQgAEEBcUGUBGoROAAiBUIgiKcQICAFpwsHAEHPABADCwcAQcsAEAMLBwBByAAQAwsHAEHGABADCwcAQcUAEAMLBwBBwwAQAwsHAEHCABADCwcAQcEAEAMLRQECf0GgsgQoAgAiAEHQM2ooAgAiAQR/An8gASAAQawzaigCACgCiAJGBEBBASAAQfwzaigCACABRw0BGgtBAAsFQQALCwYAQT8QAwsGAEE7EAMLBgBBOhADCwYAQTkQAwsGAEE4EAMLBgBBNhADCwYAQTMQAwsGAEEyEAMLBgBBMRADCwYAQTAQAwsGAEEuEAMLBgBBLRADCxYAQaCyBCgCAEG03gBqIABBAXE2AgALBgBBKRADCwYAQSgQAwsGAEEnEAMLBgBBJBADCxYAQaCyBCgCAEG43gBqIABBAXE2AgALCABBHxADQgALCABBHhADQQALEgBBoLIEKAIAQZQ6aiAANgIACwgAQRcQA0EACwgAQRYQA0EACwgAQRUQA0EACwgAQRQQA0EACwgAQRIQA0EACwgAQREQA0EACwgAQRAQA0EACwgAQQ8QA0EACxAAQaCyBCgCAEGUOmooAgALCABBDhADQQALCABBDRADQQALCABBCxADQQALCABBChADQQALCABBCRADQQALCABBCBADQQALIAEBf0GgsgQoAgAiAUGEB2ogAEEDdGogASkC4AE3AgALCwBBAxADQwAAAAALDwBBARADRAAAAAAAAAAACw8AQQAQA0QAAAAAAAAAAAsmACABIAIgAyAEIAUgBiAHIAggCSAKIAsgDCAAQQFxQbALahFQAAskACABIAIgAyAEIAUgBiAHIAggCSAKIAsgAEEDcUGsC2oRMQALIgAgASACIAMgBCAFIAYgByAIIAkgCiAAQQNxQagLahE2AAsgACABIAIgAyAEIAUgBiAHIAggCSAAQQNxQaQLahEZAAsiACABIAIgAyAEIAUgBiAHIAggCSAKIABBAXFBogtqEU8AC5YBAQJ/QaCyBCgCACEDIAJDAAAAAF0EQCADKgIwIQILAkACQCABIANB6AFqaiwAAEUEQCABIANB4gdqaiwAAEUNAQsgA0HECGogAUECdGoqAgAgAiAClGBFDQAgA0HgAWoiBBCKAUUNACADQYQHaiABQQN0aiIBEIoBRQ0AIAAgBCABEEIMAQsgAEMAAAAAQwAAAAAQMgsLHgAgASACIAMgBCAFIAYgByAIIABBA3FBngtqEU4ACyAAIAEgAiADIAQgBSAGIAcgCCAJIABBA3FBmgtqETIACx4AIAEgAiADIAQgBSAGIAcgCCAAQQFxQZgLahFNAAscACABIAIgAyAEIAUgBiAHIABBB3FBkAtqESoACx4AIAEgAiADIAQgBSAGIAcgCCAAQQFxQY4LahEzAAscACABIAIgAyAEIAUgBiAHIABBA3FBigtqESsACxoAIAEgAiADIAQgBSAGIABBD3FB+gpqERoACx4AIAEgAiADIAQgBSAGIAcgCCAAQQFxQfgKahFMAAscACABIAIgAyAEIAUgBiAHIABBAXFB9gpqEUsACxoAIAEgAiADIAQgBSAGIABBA3FB8gpqESwACxgAIAEgAiADIAQgBSAAQQ9xQeIKahEtAAscACABIAIgAyAEIAUgBiAHIABBAXFB4ApqESgACxoAIAEgAiADIAQgBSAGIABBA3FB3ApqESkACxgAIAEgAiADIAQgBSAAQQNxQdgKahEnAAsWACABIAIgAyAEIABBH3FBuApqEQYACyAAIAEgAiADIAQgBSAGIAcgCCAJIABBAXFBtgpqEUoACxwAIAEgAiADIAQgBSAGIAcgAEEBcUG0CmoRSQALHAAgASACIAMgBCAFIAYgByAAQQFxQbIKahFIAAsaACABIAIgAyAEIAUgBiAAQQNxQa4KahEjAAsYACABIAIgAyAEIAUgAEEDcUGqCmoRDwALOwEBfyAAQaCyBCgCACIAQag1aigCACIBQQBKBH8gAEGcNWogAUF/ahB8QRxqBSAAQeABagspAgA3AgALHAAgASACIAMgBCAFIAYgByAAQQFxQagKahFHAAsWACABIAIgAyAEIABBA3FBpApqETQACxUAIAEgAiADIABB/wBxQaQJahEHAAseACABIAIgAyAEIAUgBiAHIAggAEEBcUGiCWoRMAALGgAgASACIAMgBCAFIAYgAEEBcUGgCWoRJgALGgAgASACIAMgBCAFIAYgAEEBcUGeCWoRLgALGAAgASACIAMgBCAFIABBA3FBmglqES8ACxYAIAEgAiADIAQgAEEDcUGWCWoRCgALHgAgASACIAMgBCAFIAYgByAIIABBAXFBlAlqESQACxoAIAEgAiADIAQgBSAGIABBAXFBkglqETUACxQAIAEgAiADIABBD3FBgglqETcACxYAIAEgAiADIAQgAEEDcUH+BmoRDgALFAAgASACIAMgAEEBcUH8BmoREQALHAAgASACIAMgBCAFIAYgByAAQQFxQfoGahFGAAsUACABIAIgAyAAQQFxQfgGahFFAAsUACABIAIgAyAAQQFxQe4EahEYAAsaACABIAIgAyAEIAUgBiAAQQNxQeoEahENAAsiACABIAIgAyAEIAUgBiAHIAggCSAKIABBAXFBkgRqEUQACyAAIAEgAiADIAQgBSAGIAcgCCAJIABBB3FBigRqERcACx4AIAEgAiADIAQgBSAGIAcgCCAAQQ9xQfoDahETAAsWACAAQaCyBCgCAEHdB2pqLAAAQQBHCxwAIAEgAiADIAQgBSAGIAcgAEEfcUHaA2oRFAALGgAgASACIAMgBCAFIAYgAEEfcUG6A2oRFQALGAAgASACIAMgBCAFIABBD3FBqgNqERIACxYAIAEgAiADIAQgAEEfcUGKA2oRCQALGgAgASACIAMgBCAFIAYgAEEBcUGIA2oRQwALGAAgASACIAMgBCAFIABBAXFBhgNqEUIACxYAIAEgAiADIAQgAEEBcUGEA2oRQQALHAAgASACIAMgBCAFIAYgByAAQQFxQYIDahFAAAsYACABIAIgAyAEIAUgAEEBcUHAAmoRPwALFgAgASACIAMgBCAAQQFxQb4CahE+AAseACABIAIgAyAEIAUgBiAHIAggAEEBcUG8AmoRPQALFgAgASACIAMgBCAAQQFxQboCahE8AAsUACABIAIgAyAAQQNxQbYCahEiAAsaACABIAIgAyAEIAUgBiAAQQFxQbQCahEWAAsWACABIAIgAyAEIABBAXFBsgFqESUACxQAIAEgAiAD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EJ4FBQJAIAAgASgCABCIAUUEQCAAKAIIIgAoAgAoAhghBSAAIAEgAiADIAQgBUEPcUHiCmoRLQAMAQsgASgCECACRwRAIAEoAhQgAkcEQCABIAM2AiAgASgCLEEERg0CIAFBADoANCABQQA6ADUgACgCCCIAKAIAKAIUIQMgACABIAIgAkEBIAQgA0EPcUH6CmoRGgAgAQJ/AkAgASwANQR/IAEsADQNAUEBBUEACyEAIAEgAjYCFCABIAEoAihBAWo2AiggASgCJEEBRgRAIAEoAhhBAkYEQCABQQE6ADYgAA0CQQQMAwsLIAANAEEEDAELQQMLNgIsDAILCyADQQFGBEAgAUEBNgIgCwsLC0QBAX8gACABKAIIEIgBBEAgASACIAMgBBCdBQUgACgCCCIAKAIAKAIUIQYgACABIAIgAyAEIAUgBkEPcUH6CmoRGgALCxgAIAAgASgCCBCIAQRAIAEgAiADEJ8FCwuPAQAgACABKAIIEIgBBEAgASACIAMQngUFIAAgASgCABCIAQRAAkAgASgCECACRwRAIAEoAhQgAkcEQCABIAM2AiAgASACNgIUIAEgASgCKEEBajYCKCABKAIkQQFGBEAgASgCGEECRgRAIAFBAToANgsLIAFBBDYCLAwCCwsgA0EBRgRAIAFBATYCIAsLCwsLGgAgACABKAIIEIgBBEAgASACIAMgBBCdBQsLyQEBA38jBCEEIwRBQGskBCAEIQMgACABEIgBBH9BAQUgAQR/IAFB0P4BEJQEIgEEfyADQgA3AgQgA0IANwIMIANCADcCFCADQgA3AhwgA0IANwIkIANCADcCLCADQQA2AjQgAyABNgIAIAMgADYCCCADQX82AgwgA0EBNgIwIAEoAgAoAhwhACABIAMgAigCAEEBIABBH3FBuApqEQYAIAMoAhhBAUYEfyACIAMoAhA2AgBBAQVBAAsFQQALBUEACwshBSAEJAQgBQt4AQN/IwQhASMEQRBqJAQgASEAAn9BAEGktwQoAgBB37femgFGDQAaQcMEESEAQaS3BEHft96aATYCAEEACwRAQYqaAyAAENICBQJ/An9BAEGotwQoAgAiACgCBEHOlZoSRw0AGiAAKAIACyECIAEkBCACCw8LQQALowICB38BfiMEIQIjBEEwaiQEIAJBGGohASACQRBqIQMgAiEEIAJB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RwRAIAYgCCAKQQFqENQHNgIACwsgAEHUN2oiBigCACIIQf////8HRwRAIAIoAugCIgJBf0cEQCAHIAggAkEBahDUBzYCAAsLIAFBADYCACAGQf////8HNgIAIARB/////wc2AgALIABBkDZqQf////8HNgIAIABB7DJqIgQoAgAEQEEAIQEDQCAEIAEQUygCACICIAIsAHo6AHsgAkEAOwGEASACQQA6AHogAkEAOgB8IAFBAWoiASAEKAIARw0ACwsgAygCACIBBEAgASwAe0UEQEEAEK4FCwsgAEGQM2oQyAMgAEGoNWpBABCtBSADKAIAQQAQnwQgBUMAAMhDQwAAyEMQMiAFQQQQnARB0JACQQBBABD+ARogAEEBOgACIAkkBAsxAQF/IwQhAyMEQRBqJAQgAyACEMAFIAAgASgCAEEBQeyIAiADQZ8DEQkAEF0gAyQECy0BAX8jBCEDIwRBEGokBCADIAA2AgAgAyABEH4QhAIgAyACEJMDEIQCIAMkBAszAQF/IwQhBCMEQSBqJAQgBCACIAMQhQ8gACABKAIAQQJB5IgCIARBnwMRCQAQXSAEJAQLSwEDfyMEIQAjBEEQaiQEIAAhAkG4sgQoAgAiA0E0aiIEIAEQoAUgA0HEAGoiARBWRQRAIAIgASADQcgAaiAEEIYPIAIQMQsgACQEC+oBAQh/IwQhBCMEQSBqJAQgBEEQaiEFIARBBGohASAEIQJBuLIEKAIAIgNBQGsiABBWBH8gA0E0aiICIQAgAkELagUgAiAAIANByABqEIQPIAEgAhCcASADQTRqIgBBC2oiBiwAAEEASARAAn8gACgCACEIIAVBADoAACAICyAFEJsBIANBADYCOAUgBUEAOgAAIAAgBRCbASAGQQA6AAALIABBABD8ASAAIAEpAgA3AgAgACABKAIINgIIIAFCADcCACABQQA2AgggARA8IAIQMSAGCywAAEEASARAIAMoAjQhAAsgBCQEIAAL7AMBAn8gABDjEDYCACAAQQRqIgFCADcCACABQQA2AgggAUGztwRBs7cEEFoQkQEgAEEQaiIBQgA3AgAgAUEANgIIIAFBs7cEQbO3BBBaEJEBIABBHGoQgQEgAEEgahCBASAAQSRqEIEBIABBKGoQgQEgAEEsahCBASAAQTBqEIEBIABBNGoiAUIANwIAIAFBADYC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CCAAQZTaAGoiAUEANgIEIAFBADYCACABQQA2AgggAEGs2gBqEGggAEEAOgAAIABBADoAAiAAQQA6AAEgAEHEMWpBADYCACAAQcwxakMAAAAAOAIAIABByDFqQwAAAAA4AgAgAEEBOgADQdwAEFUhASACIAIsABA6AAAgARDoCSAAIAE2ApQBIABB2DJqRAAAAAAAAAAAOQMAIABB4DJqQQA2AgAgAEHoMmpBfzYCACAAQeQyakF/NgIAIABB5DNqQQA2AgAgAEHoM2pBADYCACAAQagzaiIBQgA3AwAgAUIANwMIIAFCADcDECABQQA6ABggAEHEM2oiAUIANwIAIAFCADcCCCABQgA3AhAgAUEANgIYIAFBADoAHCACQwAAgL9DAACAvxAyIAUgAikDADcCACAAQYQ0akEANgIAIABBiDRqQQA2AgAgAEGMNGpDAAAAADgCACAAQfQzaiIBQgA3AgAgAUEANgIIIAFBADsBDCAAQbQ1aiIBQgA3AgAgAUIANwIIIAFCADcCECABQgA3AhggAUIANwIgIAFBADYCKCACEGEgAyACKQIANwIAIAMgAikCCDcCCCAAQYw2akEANgIAIABB8DVqIgFCADcDACABQgA3AwggAUIANwMQIAFBADoAGCAAQZA2akH/////BzYCACAAQZQ2akEAOgAAIABBlTZqQQA6AAAgAEGWNmpBAToAACAAQZw2akEANgIAIABBsDZqQQA6AAAgAEGxNmpBADoAACAAQbQ2akEANgIAIABBuDZqQQA2AgAgAEGXNmpBADYAACAAQcQ2akF/NgIAIABBwDZqQX82AgAgAEG8NmpBfzYCACAAQcQ3akEANgIAIABBwDdqQQA2AgAgAEHMN2pB/////wc2AgAgAEHIN2pB/////wc2AgAgAEHUN2pB/////wc2AgAgAEHQN2pB/////wc2AgAgAEHYN2pBADoAACAAQaA4akMAAAAAOAIAIABB0DhqQaufAjYCACAAQcg5akG4nwI2AgAgAEGUOmpBADYCACAAQZk6akEAOgAAIABBmDpqQQA6AAAgAEGcOmpBADYCACAAQaA6akF/NgIAIABBpDpqQX82AgAgAEHwOmoiAUIANwMAIAFCADcDCCABQQA2AhAgAEGEO2pBfzYCACAAQZQ7akIANwIAIABBuDtqQQA2AgAgAkMAAAAA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IAI3AgggACACNwIAIAFDAAAAAEMAAAAAEDIgACABKQMAIgI3AiggACACNwIgIABCADcCMCAAQgA3AjggAEIANwJAIAEQYSAAIAEpAgA3AlggACABKQIINwJgIAAgASkCADcCSCAAIAEpAgg3AlAgAEEANgJ0IABBADYCcCAAQQA2AmggAEEBNgJsIABBADoAeCAAQQA6AHkgAEEAOgB6IAFDAAAAAEMAAAAAEDIgACABKQMANwJ8IABBADYCkAEgAEEBNgKYASAAQQE2ApQBIABBfzYCoAEgAEF/NgKcASAAQQA2AqQBIABDAAAAADgCqAEgAEMAAIC/OAKsASAAQgA3AuABIABBADYC6AEgARDwAiAAIAEoAgA2AuwBIAEQ8AIgACABKAIANgLwASABEPACIAAgASgCADYC9AEgAEEANgL4ASABJAQLCQAgACABELMPCwUAEIEHCwcAIAAQsg8LBwAgABCwDwsjACMEIQAjBEEQaiQEIABBnOQCNgIAQZ3jAiAAEMUDIAAkBAssACAALAALQQBIBEAgACgCACEACyAABEAgABCsAiIABEAgABBzCwVBABBzCwsqAQJ/An8jBCEBIwRBEGokBEGruQJBBEGg3QFBvNcCQQhBBRACIAELJAQLJgAgACwAC0EASAR/IAAoAgAFIAALEKwCIgAEQCAAIAEgAhCXBQsLogcCBX8BfiMEIQUjBEEQaiQEIAUhAyAAQQxqEDsgAEEUahA7IABBHGoQOyAAQSRqEDsgAEEsahA7IABBNGoQOyAAQdAAahA7IABB2ABqEDsgAEHgAGoQOyAAQegAahA7IABB8ABqEDsgAEG4AWoQOyAAQcABahA7IABByAFqEKsTIABBxANqIgYiBEEANgIEIARBADYCACAEQQA2AgggAEHQA2oQYSAAQeADahBhIABB8ANqEGEgAEGABGoQYSAAQZAEahBhIABBoARqEGEgAEG4BGoQvwggAEHcBGoQaCAAQQA2AuwEIABBADYC6AQgAEEANgLwBCAAQYAFaiIHIAFB0DFqENIFIABBtAZqIQQgAEGUBmohAQNAIAEQYSABQRBqIgEgBEcNAAsgACACEPgGNgIAIABBBGoiASACQQAQ9AE2AgAgBiABEH8gAEEANgIIIANDAAAAAEMAAAAAEDIgACADKQMANwIMIANDAAAAAEMAAAAAEDIgACADKQMAIgg3AhwgACAINwIUIANDAAAAAEMAAAAAEDIgACADKQMAIgg3AiwgACAINwIkIANDAAAAAEMAAAAAEDIgACADKQMANwI0IABDAAAAADgCPCAAQUBrQwAAAAA4AgAgACACEFpBAWo2AkQgACAAQcqQAhBgNgJIIABBADYCTCADQwAAAABDAAAAABAyIAAgAykDADcCUCADQ///f39D//9/fxAyIAAgAykDADcCYCADQwAAAD9DAAAAPxAyIAAgAykDADcCaCADQwAAAABDAAAAABAyIAAgAykDADcCcCAAQgA3AnggAEEAOwGAASAAQQA6AIIBIABBfzoAgwEgAEEAOwGEASAAQX87AYYBIABBfzsBiAEgAEEANgKMASAAQX82ApQBIABBfzYCkAEgAEEAOgCYASAAQQA2ApwBIABBfzYCoAEgAEEANgKoASAAQQA2AqQBIABBDzYCtAEgAEEPNgKwASAAQQ82AqwBIAND//9/f0P//39/EDIgACADKQMAIgg3AsABIAAgCDcCuAEgAEF/NgKwBCAAQwAAAAA4ArQEIABDAACAPzgC9AQgAEF/NgL4BCAAIAc2AvwEIAAgACgCADYCrAUgAEEANgKQBiAAQQA2AowGIABCADcC+AUgAEIANwKABiADEGEgACADKQIANwKkBiAAIAMpAgg3AqwGIAAgAykCADcClAYgACADKQIINwKcBiAAQQA2AogGIAUkBAsLACAAIAEgAhCuDwsLACAAIAEgAhCsDwsSAEGgsgQoAgBBrDNqKAIAEHMLFwBBoLIEKAIAQawzaigCACAAIAEQlwULLgEBfyMEIQIjBEEQaiQEIAIgABA4QaCyBCgCAEGsM2ooAgAgAiABEJgFIAIkBAsiAQF/IwQhAiMEQRBqJAQgAiAAEDgQbyACIAEQ1gIgAiQECx4BAX8jBCEBIwRBEGokBCABIAAQOCABEMMKIAEkBAsqAQJ/An8jBCEBIwRBEGokBEHWtwJBBUHA3QFBpeUCQQRBBRACIAELJAQLCwAgACABIAIQqg8LIAEBfyMEIQIjBEEQaiQEIAIgABA4IAIgARCcBCACJAQLKgECfwJ/IwQhASMEQRBqJARBs7cCQQRB4N0BQbzXAkEGQQIQAiABCyQECwsAIAAgASACEKMPCwkAIAAgARCiDwsJACAAIAEQoQ8L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Li4uLlgtICAgWC5YICAgLSAgICAgICAgICBYLlggICAgICAgICAgLVguLi4uLlggICAgICAgICAgLSAgICAgICAgICBYLi4uLi5YLSAgICBYLi5YICAgICAgICAgLS0tICAgICAgICAgLVhYWC5YWFgtICBYLi4uWCAgLSAgICAgICAgIFguLi5YICAgICAgICAgLVguLi4uWCAgICAgICAgICAgLSAgICAgICAgICAgWC4uLi5YLSAgICBYLi5YICAgICAgICAgWCAgICAgICAgICAgLSAgWC5YICAtIFguLi4uLlggLSAgICAgICAgWC4uLi4uWCAgICAgICAgLVguLi5YICAgICAgICAgICAgLSAgICAgICAgICAgIFguLi5YLSAgICBYLi5YICAgICAgICAgWFggICAgICAgICAgLSAgWC5YICAtWC4uLi4uLi5YLSAgICAgICBYLi4uLi4uLlggICAgICAgLVguLlguWCAgICAgICAgICAgLSAgICAgICAgICAgWC5YLi5YLSAgICBYLi5YICAgICAgICAgWC5YICAgICAgICAgLSAgWC5YICAtWFhYWC5YWFhYLSAgICAgICBYWFhYLlhYWFggICAgICAgLVguWCBYLlggICAgICAgICAgLSAgICAgICAgICBYLlggWC5YLSAgICBYLi5YWFggICAgICAgWC4uWCAgICAgICAgLSAgWC5YICAtICAgWC5YICAgLSAgICAgICAgICBYLlggICAgICAgICAgLVhYICAgWC5YICAgICAgICAgLSAgICAgICAgIFguWCAgIFhYLSAgICBYLi5YLi5YWFggICAgWC4uLlggICAgICAgLSAgWC5YICAtICAgWC5YICAgLSAgICBYWCAgICBYLlggICAgWFggICAgLSAgICAgIFguWCAgICAgICAgLSAgICAgICAgWC5YICAgICAgLSAgICBYLi5YLi5YLi5YWCAgWC4uLi5YICAgICAgLSAgWC5YICAtICAgWC5YICAgLSAgIFguWCAgICBYLlggICAgWC5YICAgLSAgICAgICBYLlggICAgICAgLSAgICAgICBYLlggICAgICAgLSAgICBYLi5YLi5YLi5YLlggWC4uLi4uWCAgICAgLSAgWC5YICAtICAgWC5YICAgLSAgWC4uWCAgICBYLlggICAgWC4uWCAgLSAgICAgICAgWC5YICAgICAgLSAgICAgIFguWCAgICAgICAgLVhYWCBYLi5YLi5YLi5YLi5YWC4uLi4uLlggICAgLSAgWC5YICAtICAgWC5YICAgLSBYLi4uWFhYWFhYLlhYWFhYWC4uLlggLSAgICAgICAgIFguWCAgIFhYLVhYICAgWC5YICAgICAgICAgLVguLlhYLi4uLi4uLi5YLi5YWC4uLi4uLi5YICAgLSAgWC5YICAtICAgWC5YICAgLVguLi4uLi4uLi4uLi4uLi4uLi4uLi5YLSAgICAgICAgICBYLlggWC5YLVguWCBYLlggICAgICAgICAgLVguLi5YLi4uLi4uLi4uLi5YWC4uLi4uLi4uWCAgLSAgWC5YICAtICAgWC5YICAgLSBYLi4uWFhYWFhYLlhYWFhYWC4uLlggLSAgICAgICAgICAgWC5YLi5YLVguLlguWCAgICAgICAgICAgLSBYLi4uLi4uLi4uLi4uLi5YWC4uLi4uLi4uLlggLVhYWC5YWFgtICAgWC5YICAgLSAgWC4uWCAgICBYLlggICAgWC4uWCAgLSAgICAgICAgICAgIFguLi5YLVguLi5YICAgICAgICAgICAgLSAgWC4uLi4uLi4uLi4uLi5YWC4uLi4uLi4uLi5YLVguLi4uLlgtICAgWC5YICAgLSAgIFguWCAgICBYLlggICAgWC5YICAgLSAgICAgICAgICAgWC4uLi5YLVguLi4uWCAgICAgICAgICAgLSAgWC4uLi4uLi4uLi4uLi5YWC4uLi4uLlhYWFhYLVhYWFhYWFgtICAgWC5YICAgLSAgICBYWCAgICBYLlggICAgWFggICAgLSAgICAgICAgICBYLi4uLi5YLVguLi4uLlggICAgICAgICAgLSAgIFguLi4uLi4uLi4uLi5YWC4uLlguLlggICAgLS0tLS0tLS0tICAgWC5YICAgLSAgICAgICAgICBYLlggICAgICAgICAgLSAgICAgICAgICBYWFhYWFhYLVhYWFhYWFggICAgICAgICAgLSAgIFguLi4uLi4uLi4uLlggWC4uWCBYLi5YICAgLSAgICAgICAtWFhYWC5YWFhYLSAgICAgICBYWFhYLlhYWFggICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAgICBYLi4uLi4uLi4uLlggWC5YICBYLi5YICAgLSAgICAgICAtWC4uLi4uLi5YLSAgICAgICBYLi4uLi4uLlggICAgICAgLSAgICBYWCAgICAgICAgICAgWFggICAgLSAgICAgICAgICAgLSAgICBYLi4uLi4uLi4uLlggWFggICAgWC4uWCAgLSAgICAgICAtIFguLi4uLlggLSAgICAgICAgWC4uLi4uWCAgICAgICAgLSAgIFguWCAgICAgICAgICAgWC5YICAgLSAgICAgICAgICAgLSAgICAgWC4uLi4uLi4uWCAgICAgICAgWC4uWCAgICAgICAgICAtICBYLi4uWCAgLSAgICAgICAgIFguLi5YICAgICAgICAgLSAgWC4uWCAgICAgICAgICAgWC4uWCAgLSAgICAgICAgICAgLSAgICAgWC4uLi4uLi4uWCAgICAgICAgIFhYICAgICAgICAgICAtICAgWC5YICAgLSAgICAgICAgICBYLlggICAgICAgICAgLSBYLi4uWFhYWFhYWFhYWFhYWC4uLlggLSAgICAgICAgICAgLSAgICAgWFhYWFhYWFhYWCAgLS0tLS0tLS0tLS0tICAgICAgICAtICAgIFggICAgLSAgICAgICAgICAgWCAgICAgICAgICAgLVguLi4uLi4uLi4uLi4uLi4uLi4uLi5YLSAgICAgICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tICAgICAgICAgICAgICAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBYLi4uWFhYWFhYWFhYWFhYWC4uLlggLSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSAgWC4uWCAgICAgICAgICAgWC4uWCAgLSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSAgIFguWCAgICAgICAgICAgWC5YICAgLSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSAgICBYWCAgICAgICAgICAgWFggICAgLSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgAEHQKgvMXTddKSMjIyMjIyNoVjBxcycvIyMjWyksIyMvbDokI1E2PiMjNVtuNDI+Yy1USGAtPj4jL2U+MTFOTlY9QnYoKjouRj91dSMoZ1JVLm8wWEdIYCR2aExHMWh4dDk/V2AjLDVMc0NwIy1pPi5yJDwkNnBEPkxiJzs5Q3JjNnRnWG1LVmVVMmNENEVvM1IvMio+XWIoTUM7JGpQZlkuO2heYElXTTk8TGgyVGxTK2YtcyRvNlE8QldIYFlpVS54ZkxxJE47JDBpUi9HWDpVKGpjVzJwL1cqcT8tcW1uVUNJO2pIU0FpRldNLlIqa1VAQz1HSD9hOXdwOGYkZS4tNF5RZzEpUS1HTChsZihyLzdHclJnd1YlTVM9QyNgOE5EPlFvI3QnWCModiNZOXcwIzFEJENJZjtXJyNwV1VQWE91eFh1VShIOU0oMTxxLVVFMzEjXi1WJzhJUlVvN1FmLi9MPj1LZSQkJzVGJSldMF4jMFhAVS5hPHI6UUx0RnNMY0w2IyNsT2opIy5ZNTwtUiZLZ0x3cUpmTGdOJjtRP2dJXiNEWTJ1TGlAXnJNbDl0PWNXcTYjI3dlZz4kRkJqVlFUU0RnRUtuSVM3RU05PlpZOXcwI0w7Pj4jTXgmNE12dC8vTFtNa0EjV0BsSy5OJ1swIzdSTF8mI3crRiVIdEc5TSNYTGBOJi4sR000UGc7LTxuTEVOaHZ4Pi1Wc00uTTBySmZMSDJlVE1gKm9KTUhSQ2BOa2ZpbU0ySixXLWpYUzopcjB3SyNARmdlJFU+YHcnTjdHIyQjZkIjJEVeJCM6OTpoaytlT2UtLTZ4KUY3KkUlPzc2JV5HTUhlUFctWjVsJyZHaUYjJDk1NjpyUz9kQSNmaUs6KVlyK2AmIzBqQCdEYkcmI14kUEcuTGwrRE5hPFhDTUtFVipOKUxOL04qYj0lUTZwaWEtWGc4SSQ8TVImLFZkSmUkPCg3RztDa2wnJmhGOzskPF89WChiLlJTJSUpIyMjTVBCdXVFMVY6diZjWCYjMm0jKCZjVl1gazlPaExNYm4lcyRHMixCJEJmRDNYKnNwNSNsLCRSI114X1gxeEtYJWI1VSpbcjVpTWZVbzlVYE45OWhHKXRtKy9VczlwRylYUHVgPDBzLSlXVHQoZ0NSeElnKCU2c2ZoPWt0TUtuM2opPDY8YjVTa18vMCheXUFhTiMocC9MPiZWWj4xaSVoMVM5dTVvQFlhYVckZStiPFRXRm4vWjpPaChDeDIkbE5Fb05eZSkjQ0ZZQEBJO0JPUSpzUndadFp4UmNVN3VXNkNYb3cwaSg/JFFbY2pPZFtQNGQpXT5ST1BPcHhUTzdTdHdpMTo6aUIxcSlDXz1kVjI2SjsyLF03b3AkXXVRckBfVjckcV4lbFF3dHVIWV09RFgsbjNMIzBQSERPNGY5PmRDQE8+SEJ1S1BwUCpFLE4rYjNMI2xwUi9NclRFSC5JQVFrLmE+RFsuZTttYy54XUlwLlBIXicvYXFVTy8kMVd4TG9XMFtpTEE8UVQ7NUhLRCtAcVEnTlEoM19QTGhFNDhSLnFBUFN3UTAvV0s/WixbeD8tSjtqUVRXQTBYQEtKKF9ZOE4tOi9NNzQ6Ly1acEtyVXNzP2QjZFpxXURBYmtVKkpxa0wrbndYQEA0N2A1Pnc9NGgoOS5gR0NSVXhIUGVSYDVNam9sKGRVV3haYSg+U1RyUGtySmlXeGA1VTdGIy5nKmpyb2hHZ2BjZzpsU1R2RVkvRVZfN0g0UTlbWiVjbnY7SlFZWjVxLmw3WmVhczpIT0laT0I/RzxOYWxkJHFzXUBdTDxKN2JSKj5ndjpbN01JMmspLicyKCQ1Rk5QJkVRKCwpVV1XXStmaDE4LnZzYWkwMCk7RDNANGt1NVA/RFA4YUp0KztxVU1dPStiJzhAO21WaUJLeDBERVstYXVHbDg6UEomRGorTTZPQ11PXigoIyNdYDBpKWRyVDstN1hgPS1IM1tpZ1VuUEctTlpsby4ja0BoIz1PcmskbT5hPiQtP1RtJFVWKD8jUDZZWSMnLyMjI3hlN3EuNzNySTMqcFAvJDE+czkpVyxKck03U05dJy80QyN2JFVgMCNWLlswPnhRc0gkZkVtUE1nWTJ1N0toKEclc2lJZkxTb1MrTUsyZVRNJD01LE04cGBBLjtfUiUjdVtLIyR4NEFHOC5rSy9IU0I9PS0nSWUvUVR0Rz8tLipeTi00Qi9aTV8zWWxRQzcocDdxKSZdKGA2X2MpJC8qSkwoTC1eKF0kd0lNYGRQdE9kR0EsVTM6dzJNLTA8cS1dTF8/XikxdncnLixNUnNxVnIuTDthTiYjL0VnSilQQmNbLWY+K1dvbVgydTdscU0yaUV1bU1UY3NGPy1hVD1aLTk3VUVuWGdsRW4xSy1ibkVPYGd1RnQoYyU9O0FtX1FzQGpMb29JJk5YO10wI2o0I0YxNDtnbDgtR1FwZ3docnE4Jz1sX2YtYjQ5J1VPcWtMdTctIyNvRFkyTCh0ZStNY2gmZ0xZdEosTUV0SmZMaCd4J009JENTLVpaJVBdOGJaPiNTP1lZIyVRJnEnM15GdyY/RClVRE5yb2NNM0E3Ni8vb0w/I2g3Z2w4NVtxVy9ORE9rJTE2aWo7KzoxYSdpTklkYi1vdTguUCp3LHY1I0VJJFRXUz5Qb3QtUipIJy1TRXBBOmcpZitPJCUlYGtBI0c9OFJNbUcxJk9gPnRvOGJDXVQmJCxuLkxvTz4yOXNwM2R0LTUyVSVWTSNxNydESHBnKyNaOSVIW0s8TCVhMkUtZ3JXVk0zQDI9LWsyMnRMXTQkIyM2V2UnOFVKQ0tFW2RfPSV3STsnNlgtR3NMWDRqXlNnSiQjI1Iqdyx2UDN3SyNpaVcmIypoXkQmUj9qcDcrL3UmIyhBUCMjWFU4YyRmU1lXLUo5NV8tRHBbZzl3Y08mI00taDFPY0psYy0qdnB3MHhVWCYjT1FGS05YQFFJJ0lvUHA3bmIsUVUvL01RJlpEa0tQKVg8V1NWTCg2OHVWbCYjYydbMCMoczFYJnhtJFklQjcqSzplREEzMjNqOTk4R1hiQSNwd01zLWpnRCQ5UUlTQi1BXyhhTjR4b0ZNXkBDNThEMCtRK3EzbjAjM1UxSW5EakY2ODItU2pNWEpLKShoJGh4dWFfS111bDkyJSdCT1UmI0JSUmgtc2xnOEtEbHI6JUw3MUthOi5BOyVZVUxqRFBtTDxMWXM4aSNYd0pPWWFLUEtjMWg6JzlLZSxnKWIpLDc4PUkzOUI7eGlZJGJnR3ctJi5aaTlJblhEdVlhJUcqZjJCcTdtbjleI3AxdnYlIyhXaS07L1o1aG87IzI6OyVkJiN4OXY2OEM1Zz9udFgwWClwVGA7JXBCM3E3bWdHTikzJShQOG5UZDVMN0dlQS1HTEArJUozdTI6KFlmPmV0YGU7KWYjS204JitEQyRJNDY+I0tyXV11LVs9OTl0dHMxLnFiI3E3MmcxV0pPODFxK2VOJzAzJ2VNPiYxWHhZLWNhRW5PaiUybjgpKSw/SUxSNV4uSWJuPC1YLU1xN1thODJMcTpGJiNjZStTOXdzQ0sqeGA1NjlFOGV3J0hlXWg6c0lbMkxNJFtndWthM1pSZDY6dCVJRzo7JCVZaUo6TnE9P2VBdzsvOm5uRHEwKENZY01wRylxTE40JCMjJko8aiRVcEs8UTRhMV1NdXBXXi1zal8kJVtISyUnRiMjIyNRUlpKOjpZM0VHbDQnQCVGa2lBT2cjcFsjI09gZ3VrVGZCSGFnTDxMSHclcSZPVjAjI0Y9Ni86Y2hJbTBAZUNQOFhdOmtGSSVobDhoZ09AUmNCaFMtQFFiJCUrbT1oUERMZyolSzhsbih3Y2YzLydEVy0kLmxSP25bbkNILWVYT09OVEpsaDouUllGJTMncDZzcTpVSU1BOTQ1Jl5IRlM4N0AkRVAyaUc8LWxDTyQlY2B1S0dEM3JDJHgwQkw4YUZuLS1ga2UlI0hNUCd2aDEvUiZPX0o5J3VtLC48dHhbQCV3c0prJmJVVDJgMHVNdjdnZyNxcC9pai5MNTYnaGw7LnM1Q1VyeGpPTTctIyMubCtBdSdBJk86LVQ3MkxdUGAmPTtjdHAnWFNjWCpyVS4+LVhUdCwlT1ZVNClTMStSLSNkZzAvTm4/S3UxXjBmJEIqUDpSb3d3bS1gMFBLallERE0nM11kMzlWWkhFbDQsLmonXVBrLU0uaF4mOjBGQUNtJG1hcS0mc2d3MHQ3LzYoXnh0ayVMdUg4OEZqLWVrbT5HQSNfPjU2OHg2KE9GUmwtSVpwYCZiLF9QJyRNPEpucTc5VnNKVy9tV1MqUFVpcTc2O10vTk1fPmhMYnhmYyRtamAsTzsmJVcybWBaaDovKVVldHc6YUolXUs5aDpUY0ZddV8tU2o5LFZLM00uKicmMERbQ2FdSjlncDgsa0FXXSUoP0ElUiRmPC0+WnRzJ15rbj0tXkBjNCUtcFk2cUklSiUxSUd4ZkxVOUNQOGNiUGxYdik7Qz1iKSw8Mm1PdlA4dXAsVVZmMzgzOWFjQVdBVy1XPyNhby9eIyVLWW84ZlJVTE5kMi4+JW1dVUs6biVyJCdzd11KOzVwQW9PXyMybU8zbiwnPUg1KGV0SGcqYCtSTGd2Pj00VThndUQkSSVEOlc+LXI1ViolaipXOkt2ZWouTHAkPE0tU0daJzorUV9rK3V2T1NMaUVvKDxhRC9LPENDY2AnTHg+Jz87KytPJz4oKWpMUi1edTY4UEhtOFpGV2UrZWo4aDo5cjZMKjAvL2MmaUgmUjhwUmJBI0tqbSV1cFYxZzphXyNVcjdGdUEjKHRSaCMuWTVLK0A/MzwtOG0wJFBFbjtKOnJoNj9JNnVHPC1gd01VJ2lyY3AwTGFFX090bE1iJjEjNlQuI0ZES3UjMUx3JXUlK0dNK1gnZT9ZTGZqTVtWTzBNYnVGcDc7PlEmI1dJbykwQEYlcTdjIzRYQVhOLVUmVkI8SEZGKnFMKCQvViw7KGtYWmVqV09gPFs1Pz9ld1koKjk9JXdEYzssdTwnOXQzVy0oSDF0aDMrR111Y1Fda0xzN2RmKCQvKkpMXUAqdDdCdV9HM183bXA3PGlhUWpPQC5rTGc7eDNCMGxxcDdIZixeWmU3LSMjQC9jNThNbygzO2tucDAlKUE3Py1XK2VJJ284KWI8bktudydIbzhDPVk+cHFCPjBpZSZqaFpbP2lMUkBAX0F2QS1pUUMoPWtzUlpSVnA3YC49K05wQkMlcmgmM11SOjhYRG1FNV5WOE8oeDw8YUcvMU4kI0ZYJDBWNVk2eCdhRXJJM0kkN3glRWB2PC1CWSwpJS0/UHNmKmw/JUMzLm1NKD0vTTA6SnhHJz83V2hIJW8nYTwtODBnME5CeG9PKEdIPGRNXW4uKyVxQGpIP2YuVXNKMkdncyY0PC1lNDcmS2wrZi8vOUBgYis/LlRlTl8mQjhTcz92O15Ucms7ZiNZdkprbCZ3JF0+LStrPycoPFM6Njh0cSpXb0RmWnUnO21NPzhYW21hOFclKmAtPTtELihuYzcvOylnOlQxPV5KJCZCUlYoLWxUbU5CNnhxQltAMCpvLmVyTSo8U1dGXXUyPXN0LSooNnY+Xl0oSC5hUkVaU2ksIzE6W0lYYVpGT208LXVpI3FVcTIkIyNSaTt1NzVPSyMoUnRhVy1LLUZgUytjRl11TmAtS01RJXJQL1hyaS5MUmNCIyM9WUwzQmdNLzNNRD9AZiYxJ0JXLSlKdTxMMjVnbDh1aFZtMWhMJCMjKjgjIyMnQTMvTGtLVysoXnJXWD81V184ZylhKG0mSzhQPiNibW1XQ01rayYjVFJgQyw1ZD5nKUY7dCw0OkBfbDhHLzVoNHZVZCUmJTk1MDpWWEQnUWRXb1ktRiRCdFV3bWZlJFlxTCc4KFBXWChQP15AUG8zJCMjYE1Tcz9EV0JaL1M+KzQlPmZYLFZXdi93J0tEYExQNUliSDtyVFY+bjNjRUs4VSNiWF1sLS9WK15sajM7dmxNYiZbNVlROCNwZWtYOUpQM1hVQzcyTCwsPytOaSZjbzdBcG5PKjVOSywoKFctaTokLGtwJ1VEQU8oRzBTcTdNVmpKc2JJdSknWiwqWz5icjVmWF46RlBBV3ItbTJLZ0w8TFVOMDk4a1RGJiNsdm81OD0vdmpEbzsuOylLYSpoTFIjL2s9cktieHVWYD5RX25ONic4dVRHJiMxVDVnKXVMdjo4NzNVcFRMZ0grI0ZncEgnX28xNzgwUGg4S214UUo4I0g3Mkw0QDc2OEBUbSZRaDRDQi81T3ZtQSYsUSZRYlVvaSRhXyUzTTAxSCk0eDdJXiZLUVZndEZuVis7W1BjPlttNGsvLyxdMT8jYFZZW0pyKjMmJnNsUmZMaVZaSjpdPz1LM1N3PVskPXVSQj8zeGs0OEBhZWc8Wic8JCM0SCk2LD5lMGpUNidOIyhxJS5PPT8yU111KihtPC1WOEonKDEpR11bNjhoVyQ1J3FbR0MmNWpgVEU/bSdlc0ZHTlJNKWosZmZaPy1xeDg7LT5nNHQqOkNJUC9bUWFwNy85JyMoMXNhbzd3LS5xTlVka0opdENGJiNCXjt4R3ZuMnI5RkVQRkZGY0xALmlGTmtUdmUkbSUjUXZRUzhVQCkyWiszSzpBS001aXNaODgrZEtRKVc2PkolQ0w8S0U+YC5kKihCYC1uOEQ5b0s8VXBdYyRYJCgsKU04WnQ3L1tyZGtxVGdsLTBjdUdNdic/Pi1YVjFxWyctNWsnY0FaNjllO0RfPyRaUFAmc14rN10pJCokI0BRWWk5LDVQJiM5ciskJUNFPTY4Pks4cjA9ZFNDJSUoQHA3Lm03amlsUTAyJzAtVldBZzxhLycnM3UuPTRMJFkpNmsvSzpfWzM9Jmp2TDxMMEMvMid2Ol47LURJQlcsQjRFNjg6a1o7JT84KFE4Qkg9a082NUJXP3hTRyYjQHVVLERTKiw/LisobygjMXZDUzgjQ0hGPlRsR1cnYilUcTdWVDlxXipeJCQuOiZOQEAkJilXSHRQbSo1X3JPMCZlJUsmIy0zMGooRTQjJ1piLm8vKFRwbSQ+SydmQFtQdkZsLGhmSU5UTlU2dScwcGFvNyVYVXA5XTUuPiVoYDhfPVZZYnh1ZWwuTlRTc0pmTGFjRnUzQidsUVN1L202LU9xZW04VCtvRS0tJDBhL2tddWo5RXdzRz4ldmVSKmh2XkJGcFFqOksnI1NKLHNCLScjXShqLkxnOTJyVHctKm4lQC87MzlyckpGLGwjcVYlT3J0QmVDNi8sO3FCM2ViTldbPyxIcWoyTC4xTlAmR2pVUj0xRDhRYVMzVXAmQCo5d1A/K2xvN2I/QCUnazRgcDBaJDIyJUszK2lDWmo/WEpONE5tJitZRl11QC1XJFUlVkVRLywsPj4jKUQ8aCNgKWgwOjxRNjkwOXVhKyZWVSVuMjpjRzNGSi0lQEJqLURnTHJgSHcmSEFLaktqc2VLPC94S1QqKUIsTjlYM11rcmMxMnQncGdUVihMdi10TFt4Z18lPU1fcTdhXng/N1ViZD4jJThjWSNZWj89LGBXZHh1L2FlJiN3NilSODl0SSM2QHMnKDZCZjdhJj9TPV5aSV9rUyZhaWAmPXRFNzJMX0QsO15SKTdbJHM8RWgjYyYpcS5NWEklI3Y5Uk9hNUZaTyVzRjdxN053YiYjcHRVSjphcUplJFNsNjglLkQjIyNFQz48Py1hRiYjUk5Rdj5vOGxLTiU1LyQodmRmcTcrZWJBI3UxcF1vdlVLVyZZJXFdJz4kMUAtW3hmbiQ3WlRwN21NLEcsS283YSZHdSVHW1JNeEpzWzBNTSV3Y2kuTEZESykoPGNgUThOKWpFSUYqKz9QMmE4ZyUpJHFdbzJhSDhDJjxTaWJDL3EsKGU6djstYiM2WyROdERaODRKZTJLTnZCIyRQNT90UTNudCgwZD1qLkxRZi4vTGwzMysoO3EzTC13PThkWCQjV0YmdUlKQC1iZkk+JTpfaTJCNUNzUjgmOVomIz1tUEVubTBmYDwmYylRTDV1SiMldSVsSmorRC1yO0JvRiYjNERvUzk3aDVnKUUjbzomUzR3ZURGLDleSG9lYGgqTCtfYSpOckxXLTFwR18mMlVkQjg2ZSVCLzo9PilONHhlVy4qd2Z0LTskJzU4LUVTcXI8Yj9VSShfJUBbUDQ2PiNVYCc2QVFdbSY2L2BaPiNTP1lZI1ZjO3I3VTImMzI2ZD13JkgjIyMjP1RaYCo0PyYuTUs/TFA4VnhnPiRbUVhjJVFKdjkyLihEYipCKWdiKkJNOWRNKmhKTUFvKmMmI2Iwdj1QamVyXSRnRyZKWERmLT4nU3R2VTc1MDVsOSRBRnZnWVJJXiY8XmI2OD9qI3E5UVg0U00nUk8jJnNMMUlNLnJKZkxVQWoyMjFdZCMjRFc9bTgzdTU7J2JZeCwqU2wwaEwoVzs7JGRvQiZPL1RROihaXnhCZExqTDxMbmk7JydYLmAkIzgrMUdEOmskWVVXc2JuOG9naDZyeFoyWjldJW5kKz5WIyo4VV83MkxoKzJROENqMGk6NmhwJiRDLzpwKEhLPlQ4WVtnSFE0YDQpJyRBYihOb2YlVic4aEwmIzxORWR0ZyhuJz1TMUEoUTEvSSY0KFslZE1gLEl1JzE6X2hMPlNmRDA3JjZEPGZwOGRITTcvZyt0bFBOOUoqckthUGN0Jj8ndUJDZW1eam4lOV9LKTwsQzVLM3M9NWcmR21KYipbU1lxN0s7VFJMR0NzTS0kJDtTJTpZQHI3QUswcHBycEw8THJoLHE3ZS8lS1dLOjUwSV4rbSd2aWAzPyVacCs8LWQrJEwtU3Y6QC5vMTluJHMwJjM5O2tuO1MlQlNxKiQzV29KU0NMd2VWW2FaJ01RSWpPPDc7WC1YOyYrZE1MdnUjXlVzR0VDOVdFY1tYKHdJNyMyLihGMGpWKmVaZjwtUXYzSi1jK0o1QWxyQiMkcChINjhMdkVBJ3EzbjAjbSxbYCo4RnQpRmNZZ0V1ZF1DV2ZtNjgsKGFMQSRARUZUZ0xYb0JxL1VQbHA3OmRbLztyX2l4PTpURmBTNUgtYjxMSSZIWShLPWgjKV1MayRLMTRsVmZtOngkSDwzXlFsPE1gJE9oYXBCbmt1cCdEI0wkUGJfYE4qZ10yZTtYL0R0Zyxic2omSyMyWy06aVlyJ193Z0gpTlVJUjhhMW4jUz9ZZWonaDheNThVYlpkK15GS0QqVEA7NkE3YVFDW0s4ZC0odjZHSSR4OlQ8JidHcDVVZj5ATS4qSjo7JC1ydjI5J01dOHFNdi10THAsJzg4NmlhQz1IYipZSm9LSiwoaiVLPUhgSy52OUhnZ3FCSWladSdRdkJULiM9KTB1a3J1ViYuKTM9KF4xYG8qUGo0PC08YU4oKF43KCcjWjB3SyM1R1hAN3VdW2AqU140MzkzM0E0cmxdW2AqTzRDZ0xFbF12JDFRM0FlRjM3ZGJYaywuKXZqI3gnZGA7cWdiUVIlRlcsMig/TE89cyVTYzY4JU5QJyMjQW90bDh4PUJFI2oxVUQoWzMkTShdVUkyTFgzUnBLTkA7LyNmJ2YvJl9tdCZGKVhkRjw5dDQpUWEuKmtUTHdRJyhUVEI5LnhIJz4jTUorZ0xxOS0jI0BIdVpQTjBddTpoNy5ULi5HOjskL1VzaihUN2BROHRUNzJMbllsPC1xeDg7LUhWN1EtJlhkeCUxYSxoQz0wdStIbHNWPm51SVFMLTU8Tj8pTkJTKVFOKl9JLD8mKTInSU0lTDNJKVgoKGUvZGwyJjgnPE06XiNNKlErW1QuWHJpLkxZUzN2JWZGYDY4aDtiLVhbL0VuJ0NSLnE3RSlwJy9rbGUySE0sdTteJU9LQy1OK0xsJUY5Q0Y8TmYnXiN0MkwsOzI3VzowT0A2IyNVNlc3OiRySmZMV0hqJCMpd29xQmVmSVouUEs8Yip0N2VkO3AqX207NEV4SyNoQCZdPl8+QGtYUXRNYWNmRC5tLVZBYjg7SVJlTTMkd2YwJydocmEqc281NjgnSXAmdlJzODQ5J01SWVNwJTp0Omg1cVNnd3BFciRCPlEsO3MoQyMkKWBzdlF1RiQjIy1ELCMjLGc2OEAyW1Q7LlhTZE45UWUpcnB0Ll9LLSM1d0Ypc1AnIyNwI0MwYyUtR2IlaGQrPC1qJ0FpKngmJkhNa1RdQydPU2wjIzVSR1tKWGFITjtkJ3VBI3guX1U7LmBQVUAoWjNkdDRyMTUyQDp2LCdSLlNqJ3cjMDwtO2tQSSlGZkomI0FZSiYjLy8pPi1rPW09KlhuSyQ+PSk3MkxdMEklPi5HNjkwYTokIyM8LCk7Pzs3MiM/eDkrZDteVic5O2pZQDspYnIjcV5ZUXB4OlgjVGUkWl4nPS09YkdoTGY6RDYmYk53WjktWkQjbl45SGhMTXI1RzsnXWQmNid3WW1URm1MPExEKUZeJVt0Qyc4Oys5RSNDJGclIzVZPnE5d0k+UCg5bUlbPmtDLWVrTEMvUiZDSCtzJ0I7Sy1NNiRFQiVpczAwOitBNFs3eGtzLkxyTmswJkUpd0lMWUZAMkwnME5iJCtwdjwoMi43NjgvRnJZJmgkXjNpJkArRyVKVCc8LSx2YDM7XylJOU1eQUVdQ04/Q2wyQVpnKyU0aVRwVDM8bi0mJUglYjxGRGoyTTxoSD0mRWg8MkxlbiRiKmFUWD0tOFF4TilrMTFJTTFjXmolOXM8TDxORlNvKUI/KzwtKEd4c0YsXi1FaEAkNGRYaE4kKyNyeEs4J2plJ0Q3a2BlOykycFl3UEEnX3A5JkBeMThtbDFeW0BnNHQqW0pPYSpbPVFwNyhxSl9vT0xeKCc3ZkImSHEtOnNmLHNOajh4cV4+JFU0T11HS3gnbTkpYkBwN1lzdkszd15ZUi1DZFEqOklyPCgkdSYpIygmP0w5UmczSCk0ZmlFcF5pSTlPOEtuVGosXUg/RCpyNydNO1B3WjlLMEVeayYtY3BJOy5wLzZfdndvRk1WPC0+IyVYaS5MeFZuclUoNCY4L1ArOmhMU0tqJCNVJV00OXQnSTpyZ01pJ0ZMQGE6MFktdUFbMzknLCh2Ym1hKmhVJTwtU1JGYFR0OjU0MlJfVlYkcEBbcDhEVltBLD8xODM5RldkRjxUZGRGPDlBaC02Jjl0V29EbGhdJjFTcEdNcT5UaTFPKkgmIyhBTDhbX1AlLk0+dl4tKSlxT1QqRjVDcTBgWWUlKyRCNmk6N0AwSVg8TitUKzBNbE1CUFEqVmo+U3NEPFU0SkhZOGtEMikyZlUvTSMkZS4pVDQsXz04aExpbVsmKTs/VWtLJy14PycoOnNpSWZMPCRwRk1gaTw/JVcobUdESE0lPmlXUCwjI1BgJS9MPGVYaTpAWjlDLjdvPUAocFhkQU8vTkxROGxQbCtIUE9RYTh3RDg9XkdsUGE4VEtJMUNqaHNDVFNMSk0nL1dsPi1TKHF3JXNmL0AlI0I2Oy9VN0tddVpiaV5PY14ybjxiaFBtVWtNdz4ldDwpJ21FVkUnJ25gV25KcmEkXlRLdlg1Qj47X2FTRUsnLChod2EwOmk0Rz8uQmNpLihYWz9iKigkLD0tbjwuUSVgKFg9PytAQW0qSnMwJj0zYmg4S11tTDxMb05zJzYsJzg1YDA/dC8nX1U1OUBdZGRGPCNMZEY8ZVdkRjxPdU4vNDVyWTwtTEAmIytmbT42OT1MYixPY1pWLyk7VFRtOFZJOz8lT3RKPChiNG1xN002OnU/S1JkRjxnUkAyTD1GTlUtPGJbKDljL01MM207Wlskb0YzZylHQVdxcEFSYz08Uk91N2NMNWw7LVtBXSUvK2ZzZDtsI1NhZlQvZipXXTA9TyckKFRiPFspKkBlNzc1Ui06WW9iJWcqPmwqOnhQP1liLjUpJXdfST83dWs1SkMrRlMobSNpJ2suJ2EwaSk5PDdiJ2ZzJzU5aHEkKjVVaHYjI3BpXjgraElFQkZgbnZvYDsnbDAuXlMxPC13VUsyL0NvaDU4S0toTGpNPVNPKnJmT2ArcUNgVy1Pbi49QUo1Nj4+aTJAMkxINkE6JjVxYD85STNAQCcwNCZwMi9MVmEqVC00PC1pMztNOVV2WmQrTjc+YiplSXdnOkNDKWM8Pm5PJiM8SUdlO19fLnRoalpsPCV3KFdrMnhtcDRRQEkjSTksREZddTctUD0uLV86WUpdYVNAVj82KkMoKWRPcDc6V0wsYiYzUmcvLmNtTTkmcl4+JCg+LlotSSZKKFEwSGQ1USU3Q28tYmAtYzxOKDZyQGlwK0F1cks8bTg2UUl0aCojdjstT0JxaStMN3dERS1JcjhLWydtK0REU0x3SyYvLj8tViVVXyUzOnFLTnUkX2IqQi1rcDdOYUQnUWRXUVBLWXFbQD5QKWhJOypfRl11YFJiWy5qOF9RLzwmPnV1K1ZzSCRzTTlUQSU/KSh2bUo4MCksUDdFPil0akQlMkw9LXQjZktbJWB2PVE4PEZmTmtnZ15vSWJhaCojOC9RdCRGJjpLKi0oTi8nKzF2TUIsdSgpLWEuVlVVKiNbZSVnQUFPKFM+V2xBMik7U2E+Z1htOFlCYDFkQEsjbl03Ni1hJFUsbUY8ZlhdaWRxZCk8MyxdSjdKbVc0YDZddWtzPTQtNzJMKGpFays6YkowTV5xLThEbV9aPzBvbFAxQzlTYSZIW2QmYyRvb1FVal1FeGQqM1pNQC1XR1cyJXMnLEItX00lPiVVbDojLyd4b0ZNOVFYLSQuUU4nPlslJFokdUY2cEE2S2kyTzU6OHcqdlAxPC0xYFtHLCktbSM+MGBQJiNlYiMuM2kpcnRCNjEobyckP1gzQjwvUjkwO2VaXSVOY3E7LVRsXSNGPjJRZnReYWVfNXRLTDlNVWU5YipzTEVROTVDJmA9Rz9ATWo9d2gqJzNFPj0tPClHdCpJdyknUUc6YEBJd09mNyZdMWknUzAxQitFdi9OYWMjOVM7PTtZUXBnXzZVYCprVlkzOXhLLFsvNkFqNzonMUJtLV8xRVlmYTErbyZvNGhwN0tOX1EoT2xJb0BTJTtqVmRuMCcxPFZjNTI9dWAzXm8tbjEnZzR2NThIaiY2X3Q3JCMjP00pYzwkYmdRXydTWSgoLXhrQSNZKCxwJ0g5cklWWS1iLCclYkNQRjcuSjxVcF4sKGRVMVZZKjUjV2tUVT5oMTl3LFdRaExJKTNTI2YkMihlYixqcipiOzNWd10qN05IJSRjNFZzLGVEOT5YVzg/Tl1vKygqcGdDJS83MkxWLXU8SHAsM0BlXjlVQjFKK2FrOS1UTi9taEtQZytBSllkJE1sdkFGX2pDSyouTy1eKDYzYWRNVC0+VyVpZXdTOFc2bTJydENwbydSUzFSODQ9QHBhVEt0KT49JSYxWykqdnAndSt4LFZyd047Jl1rdU85SkRiZz1wTyRKKi5qVmU7dSdtMGRyOWwsPCp3TUsqT2U9ZzhsVl9LRUJGa08nb1VdXj1bLTc5MiNvaywpaV1sUjhxUTJvQTh3Y1JDWl43dy9Oamg7Py5zdFg/UTE+UzFxNEJuJClLMTwtckdkTyckV3IuTGMuQ0cpJC8qSkw0dE5SLyxTVk8zLGFVdydESk46KVNzO3dHbjlBMzJpanclRkwrWjBGbi5VOTtyZVNxKWJtSTMyVT09NUFMdUcmI1ZmMTM5OC9wVm8xKmMtKGFZMTY4bzxgSnNTYmstLDFOOyQ+MDpPVWFzKDM6OFo5NzJMU2ZGOGViPWMtOz5TUHc3LjZobjNtYDleWGtuKHIucVNbMDtUJSZRYz0rU1RSeFgncTFCTmszJipldTI7JjhxJCZ4PlEjUTdeVGYrNjwoZCVaVm1qMmJEaSUuM0wybis0VyckUGlEREcpZyxyJSs/LCRAP3VvdTV0U2UyYU5fQVFVKjxoYGUtR0k3KT9PSzJBLmQ3X2MpP3dRNUFTQERMM3IjN2ZTa2dsNi0rK0Q6J0EsdXE3U3ZsQiRwY3BIJ3EzbjAjXyVkWSN4Q3ByLWw8RjBOUkAtIyNGRVY2TlRGNiMjJGw4NE4xdz9BTz4nSUFPVVJRIyNWXkZ2LVhGYkdNN0ZsKE48M0RoTEdGJXEuMXJDJCM6VF9fJlBpNjglMHhpXyZbcUZKKDc3al8mSldvRi5WNzM1JlQsW1IqOnhGUipLNT4+I2BiVy0/NE5lXyY2TmVfJjZOZV8mbmBrci0jR0pjTTZYO3VNNlg7dU0oLmEuLl4yVGtMJW9SKCM7dS5UJWZBciU0dEo4Jj48MT1HSFpfK205LyNIMUZeUiNTQyMqTj1CQTkoRD92W1VpRlk+Pl44cCxLS0YuV11MMjl1TGtMbHUvKzRUPFhvSUImaHg9VDFQY0RhQiY7SEgrLUFGcj8obTlIWlYpRktTOEpDdztTRD02W14vRFpVTGBFVURmXUdHbEcmPnckKUYuL15uMytybG8rREI7NXNJWUdOaytpMXQtNjlKZy0tMHBhbzdTbSNLKXBkSFcmO0x1RE5IQEg+Iy9YLVRJKDtQPiMsR2M+IzBTdT4jNGAxPyM4bEM/Izx4VT8jQC5pPyNEOiVAI0hGN0AjTFJJQCNQX1tAI1RrbkAjWHcqQSNdLT1BI2E5T0EjZDxGJiMqO0cjIy5HWSMjMlNsIyM2YCgkIzpsOiQjPnhMJCNCLmAkI0Y6ciQjSkYuJSNOUkAlI1JfUiUjVmtlJSNad3clI18tNCYjM15SaCVTZmxyLWsnTVMubz8uNS9zV2VsL3dwRU0wJTMnLzEpS15mMS1kPkcyMSZ2KDM1PlZgMzlWN0E0PW9ueDRBMU9ZNUVJMDs2SWJncjZNJEhTN1E8KTU4QzV3LDtXb0EqI1slVCojYDFnKiNkPSMrI2hJNSsjbFVHKyNwYlkrI3RubCsjeCQpLCMmMTssIyo9TSwjLklgLCMyVXIsIzZiLi0jO3dbSCNpUXRBI21eMEIjcWpCQiN1dlRCIyMtaEIjJzkkQyMrRTZDIy9RSEMjM15aQyM3am1DIzt2KUQjPyw8RCNDOE5EI0dEYUQjS1BzRCNPXS9FI2cxQTUjS0EqMSNnQzE3I01HZDsjOCgwMiNMLWQzI3JXTTQjSGdhMSMsPHcwI1QuajwjTyMnMiNDWU4xI3FhXjojXzRtMyNvQC89I2VHOD0jdDhKNSNgKzc4IzR1SS0jbTNCMiNTQls4I1EwQDgjaVsqOSNpT244IzFObTsjXnNOOSNxaDw5Izo9eC0jUDtLMiMkJVg5I2JDKy4jUmc7PCNtTj0uI01URi4jUlpPLiMyPyk0I1kjKC8jWykxLyNiO0wvI2RBVS8jMFN2OyNsWSQwI25gLTAjc2Y2MCMoRjI0I3dySDAjJS9lMCNUbUQ8IyVKU01Gb3ZlOkNUQkVYSTo8ZWgyZylCLDNoMl5HM2k7I2QzakQ+KTRrTVlENGxWdWA0bWA6JjVuaVVBNUAoQTVCQTFdUEJCOnhsQkNDPTJDRExYTUNFVXRpQ2YmMGcyJ3ROP1BHVDRDUEdUNENQR1Q0Q1BHVDRDUEdUNENQR1Q0Q1BHVDRDUEdUNENQR1Q0Q1BHVDRDUEdUNENQR1Q0Q1BHVDRDUC1xZWtDYC45a0VnXitGJGt3VmlGSlRCJjVLVEImNUtUQiY1S1RCJjVLVEImNUtUQiY1S1RCJjVLVEImNUtUQiY1S1RCJjVLVEImNUtUQiY1S1RCJjVLVEImNUtUQiY1byxePC0yOFpJJ08/O3hwTz87eHBPPzt4cE8/O3hwTz87eHBPPzt4cE8/O3hwTz87eHBPPzt4cE8/O3hwTz87eHBPPzt4cE8/O3hwTz87eHA7N3EtI2xMWUk6eHZEPSMAQaaIAQsKQEAAAEBBAACYQQBBuogBC74BUEEAAAAAAADgQAAAgEEAAIA/AAAAQQAA+EEAAAAAAAC4QQAAuEEAADBBAAAwQQAAqEEAAAAAAAAQQQAAuEEAAIBAAAAwQQAAXEIAAJBBAAC4QQAAEEEAADBBAACAQAAAkkIAAAAAAACIQQAAiEEAAABBAAAAQQAAXEIAAAAAAACIQQAAiEEAAABBAAAAQQAAtkIAAAAAAACIQQAAsEEAAKBAAAAAACAA/wAAIG8gADD/MPAx/zEA/+//AE6vnwBBgIoBCxQgAP8AACBvIAAw/zDwMf8xAP/v/wBBoooBC4UnAQACAAQAAQABAAEAAQACAAEAAwACAAEAAgACAAEAAQABAAEAAQAFAAIAAQACAAMAAwADAAIAAgAEAAEAAQABAAIAAQAFAAIAAwABAAIAAQACAAEAAQACAAEAAQACAAIAAQAEAAEAAQABAAEABQAKAAEAAgATAAIAAQACAAEAAgABAAIAAQACAAEABQABAAYAAwACAAEAAgACAAEAAQABAAQACAAFAAEAAQAEAAEAAQADAAEAAgABAAUAAQACAAEAAQABAAoAAQABAAUAAgAEAAYAAQAEAAIAAgACAAwAAgABAAEABgABAAEAAQAEAAEAAQAEAAYABQABAAQAAgACAAQACgAHAAEAAQAEAAIABAACAAEABAADAAYACgAMAAUABwACAA4AAgAJAAEAAQAGAAcACgAEAAcADQABAAUABAAIAAQAAQABAAIAHAAFAAYAAQABAAUAAgAFABQAAgACAAkACAALAAIACQARAAEACAAGAAgAGwAEAAYACQAUAAsAGwAGAEQAAgACAAEAAQABAAIAAQACAAIABwAGAAsAAwADAAEAAQADAAEAAgABAAEAAQABAAEAAwABAAEACAADAAQAAQAFAAcAAgABAAQABAAIAAQAAgABAAIAAQABAAQABQAGAAMABgACAAwAAwABAAMACQACAAQAAwAEAAEABQADAAMAAQADAAcAAQAFAAEAAQABAAEAAgADAAQABQACAAMAAgAGAAEAAQACAAEABwABAAcAAwAEAAUADwACAAIAAQAFAAMAFgATAAIAAQABAAEAAQACAAUAAQABAAEABgABAAEADAAIAAIACQASABYABAABAAEABQABABAAAQACAAcACgAPAAEAAQAGAAIABAABAAIABAABAAYAAQABAAMAAgAEAAEABgAEAAUAAQACAAEAAQACAAEACgADAAEAAwACAAEACQADAAIABQAHAAIAEwAEAAMABgABAAEAAQABAAEABAADAAIAAQABAAEAAgAFAAMAAQABAAEAAgACAAEAAQACAAEAAQACAAEAAwABAAEAAQADAAcAAQAEAAEAAQACAAEAAQACAAEAAgAEAAQAAwAIAAEAAQABAAIAAQADAAUAAQADAAEAAwAEAAYAAgACAA4ABAAGAAYACwAJAAEADwADAAEAHAAFAAIABQAFAAMAAQADAAQABQAEAAYADgADAAIAAwAFABUAAgAHABQACgABAAIAEwACAAQAHAAcAAIAAwACAAEADgAEAAEAGgAcACoADAAoAAMANABPAAUADgARAAMAAgACAAsAAwAEAAYAAwABAAgAAgAXAAQABQAIAAoABAACAAcAAwAFAAEAAQAGAAMAAQACAAIAAgAFABwAAQABAAcABwAUAAUAAwAdAAMAEQAaAAEACAAEABsAAwAGAAsAFwAFAAMABAAGAA0AGAAQAAYABQAKABkAIwAHAAMAAgADAAMADgADAAYAAgAGAAEABAACAAMACAACAAEAAQADAAMAAwAEAAEAAQANAAIAAgAEAAUAAgABAA4ADgABAAIAAgABAAQABQACAAMAAQAOAAMADAADABEAAgAQAAUAAQACAAEACAAJAAMAEwAEAAIAAgAEABEAGQAVABQAHABLAAEACgAdAGcABAABAAIAAQABAAQAAgAEAAEAAgADABgAAgACAAIAAQABAAIAAQADAAgAAQABAAEAAgABAAEAAwABAAEAAQAGAAEABQADAAEAAQABAAMABAABAAEABQACAAEABQAGAA0ACQAQAAEAAQABAAEAAwACAAMAAgAEAAUAAgAFAAIAAgADAAcADQAHAAIAAgABAAEAAQABAAIAAwADAAIAAQAGAAQACQACAAEADgACAA4AAgABABIAAwAEAA4ABAALACkADwAXAA8AFwCwAAEAAwAEAAEAAQABAAEABQADAAEAAgADAAcAAwABAAEAAgABAAIABAAEAAYAAgAEAAEACQAHAAEACgAFAAgAEAAdAAEAAQACAAIAAwABAAMABQACAAQABQAEAAEAAQACAAIAAwADAAcAAQAGAAoAAQARAAEALAAEAAYAAgABAAEABgAFAAQAAgAKAAEABgAJAAIACAABABgAAQACAA0ABwAIAAgAAgABAAQAAQADAAEAAwADAAUAAgAFAAoACQAEAAkADAACAAEABgABAAoAAQABAAcABwAEAAoACAADAAEADQAEAAMAAQAGAAEAAwAFAAIAAQACABEAEAAFAAIAEAAGAAEABAACAAEAAwADAAYACAAFAAsACwABAAMAAwACAAQABgAKAAkABQAHAAQABwAEAAcAAQABAAQAAgABAAMABgAIAAcAAQAGAAsABQAFAAMAGAAJAAQAAgAHAA0ABQABAAgAUgAQAD0AAQABAAEABAACAAIAEAAKAAMACAABAAEABgAEAAIAAQADAAEAAQABAAQAAwAIAAQAAgACAAEAAQABAAEAAQAGAAMABQABAAEABAAGAAkAAgABAAEAAQACAAEABwACAAEABgABAAUABAAEAAMAAQAIAAEAAwADAAEAAwACAAIAAgACAAMAAQAGAAEAAgABAAIAAQADAAcAAQAIAAIAAQACAAEABQACAAUAAwAFAAoAAQACAAEAAQADAAIABQALAAMACQADAAUAAQABAAUACQABAAIAAQAFAAcACQAJAAgAAQADAAMAAwAGAAgAAgADAAIAAQABACAABgABAAIADwAJAAMABwANAAEAAwAKAA0AAgAOAAEADQAKAAIAAQADAAoABAAPAAIADwAPAAoAAQADAAkABgAJACAAGQAaAC8ABwADAAIAAwABAAYAAwAEAAMAAgAIAAUABAABAAkABAACAAIAEwAKAAYAAgADAAgAAQACAAIABAACAAEACQAEAAQABAAGAAQACAAJAAIAAwABAAEAAQABAAMABQAFAAEAAwAIAAQABgACAAEABAAMAAEABQADAAcADQACAAUACAABAAYAAQACAAUADgAGAAEABQACAAQACAAPAAUAAQAXAAYAPgACAAoAAQABAAgAAQACAAIACgAEAAIAAgAJAAIAAQABAAMAAgADAAEABQADAAMAAgABAAMACAABAAEAAQALAAMAAQABAAQAAwAHAAEADgABAAIAAwAMAAUAAgAFAAEABgAHAAUABwAOAAsAAQADAAEACAAJAAwAAgABAAsACAAEAAQAAgAGAAoACQANAAEAAQADAAEABQABAAMAAgAEAAQAAQASAAIAAwAOAAsABAAdAAQAAgAHAAEAAwANAAkAAgACAAUAAwAFABQABwAQAAgABQBIACIABgAEABYADAAMABwALQAkAAkABwAnAAkAvwABAAEAAQAEAAsACAAEAAkAAgADABYAAQABAAEAAQAEABEAAQAHAAcAAQALAB8ACgACAAQACAACAAMAAgABAAQAAgAQAAQAIAACAAMAEwANAAQACQABAAUAAgAOAAgAAQABAAMABgATAAYABQABABAABgACAAoACAAFAAEAAgADAAEABQAFAAEACwAGAAYAAQADAAMAAgAGAAMACAABAAEABAAKAAcABQAHAAcABQAIAAkAAgABAAMABAABAAEAAwABAAMAAwACAAYAEAABAAQABgADAAEACgAGAAEAAwAPAAIACQACAAoAGQANAAkAEAAGAAIAAgAKAAsABAADAAkAAQACAAYABgAFAAQAHgAoAAEACgAHAAwADgAhAAYAAwAGAAcAAwABAAMAAQALAA4ABAAJAAUADAALADEAEgAzAB8AjAAfAAIAAgABAAUAAQAIAAEACgABAAQABAADABgAAQAKAAEAAwAGAAYAEAADAAQABQACAAEABAACADkACgAGABYAAgAWAAMABwAWAAYACgALACQAEgAQACEAJAACAAUABQABAAEAAQAEAAoAAQAEAA0AAgAHAAUAAgAJAAMABAABAAcAKwADAAcAAwAJAA4ABwAJAAEACwABAAEAAwAHAAQAEgANAAEADgABAAMABgAKAEkAAgACAB4ABgABAAsAEgATAA0AFgADAC4AKgAlAFkABwADABAAIgACAAIAAwAJAAEABwABAAEAAQACAAIABAAKAAcAAwAKAAMACQAFABwACQACAAYADQAHAAMAAQADAAoAAgAHAAIACwADAAYAFQA2AFUAAgABAAQAAgACAAEAJwADABUAAgACAAUAAQABAAEABAABAAEAAwAEAA8AAQADAAIABAAEAAIAAwAIAAIAFAABAAgABwANAAQAAQAaAAYAAgAJACIABAAVADQACgAEAAQAAQAFAAwAAgALAAEABwACAB4ADAAsAAIAHgABAAEAAwAGABAACQARACcAUgACAAIAGAAHAAEABwADABAACQAOACwAAgABAAIAAQACAAMABQACAAQAAQAGAAcABQADAAIABgABAAsABQALAAIAAQASABMACAABAAMAGAAdAAIAAQADAAUAAgACAAEADQAGAAUAAQAuAAsAAwAFAAEAAQAFAAgAAgAKAAYADAAGAAMABwALAAIABAAQAA0AAgAFAAEAAQACAAIABQACABwABQACABcACgAIAAQABAAWACcAXwAmAAgADgAJAAUAAQANAAUABAADAA0ADAALAAEACQABABsAJQACAAUABAAEAD8A0wBfAAIAAgACAAEAAwAFAAIAAQABAAIAAgABAAEAAQADAAIABAABAAIAAQABAAUAAgACAAEAAQACAAMAAQADAAEAAQABAAMAAQAEAAIAAQADAAYAAQABAAMABwAPAAUAAwACAAUAAwAJAAsABAACABYAAQAGAAMACAAHAAEABAAcAAQAEAADAAMAGQAEAAQAGwAbAAEABAABAAIAAgAHAAEAAwAFAAIAHAAIAAIADgABAAgABgAQABkAAwADAAMADgADAAMAAQABAAIAAQAEAAYAAwAIAAQAAQABAAEAAgADAAYACgAGAAIAAwASAAMAAgAFAAUABAADAAEABQACAAUABAAXAAcABgAMAAYABAARAAsACQAFAAEAAQAKAAUADAABAAEACwAaACEABwADAAYAAQARAAcAAQAFAAwAAQALAAIABAABAAgADgARABcAAQACAAEABwAIABAACwAJAAYABQACAAYABAAQAAIACAAOAAEACwAIAAkAAQABAAEACQAZAAQACwATAAcAAgAPAAIADAAIADQABwAFABMAAgAQAAQAJAAIAAEAEAAIABgAGgAEAAYAAgAJAAUABAAkAAMAHAAMABkADwAlABsAEQAMADsAJgAFACAAfwABAAIACQARAA4ABAABAAIAAQABAAgACwAyAAQADgACABMAEAAEABEABQAEAAUAGgAMAC0AAgAXAC0AaAAeAAwACAADAAoAAgACAAMAAwABAAQAFAAHAAIACQAGAA8AAgAUAAEAAwAQAAQACwAPAAYAhgACAAUAOwABAAIAAgACAAEACQARAAMAGgCJAAoA0wA7AAEAAgAEAAEABAABAAEAAQACAAYAAgADAAEAAQACAAMAAgADAAEAAwAEAAQAAgADAAMAAQAEAAMAAQAHAAIAAgADAAEAAgABAAMAAwADAAIAAgADAAIAAQADAA4ABgABAAMAAgAJAAYADwAbAAkAIgCRAAEAAQACAAEAAQABAAEAAgABAAEAAQABAAIAAgACAAMAAQACAAEAAQABAAIAAwAFAAgAAwAFAAIABAABAAMAAgACAAIADAAEAAEAAQABAAoABAAFAAEAFAAEABAAAQAPAAkABQAMAAIACQACAAUABAACABoAEwAHAAEAGgAEAB4ADAAPACoAAQAGAAgArAABAAEABAACAAEAAQALAAIAAgAEAAIAAQACAAEACgAIAAEAAgABAAQABQABAAIABQABAAgABAABAAMABAACAAEABgACAAEAAwAEAAEAAgABAAEAAQABAAwABQAHAAIABAADAAEAAQABAAMAAwAGAAEAAgACAAMAAwADAAIAAQACAAwADgALAAYABgAEAAwAAgAIAAEABwAKAAEAIwAHAAQADQAPAAQAAwAXABUAHAA0AAUAGgAFAAYAAQAHAAoAAgAHADUAAwACAAEAAQABAAIAowAUAgEACgALAAEAAwADAAQACAACAAgABgACAAIAFwAWAAQAAgACAAQAAgABAAMAAQADAAMABQAJAAgAAgABAAIACAABAAoAAgAMABUAFAAPAGkAAgADAAEAAQADAAIAAwABAAEAAgAFAAEABAAPAAsAEwABAAEAAQABAAUABAAFAAEAAQACAAUAAwAFAAwAAQACAAUAAQALAAEAAQAPAAkAAQAEAAUAAwAaAAgAAgABAAMAAQABAA8AEwACAAwAAQACAAUAAgAHAAIAEwACABQABgAaAAcABQACAAIABwAiABUADQBGAAIAgAABAAEAAgABAAEAAgABAAEAAwACAAIAAgAPAAEABAABAAMABAAqAAoABgABADEAVQAIAAEAAgABAAEABAAEAAIAAwAGAAEABQAHAAQAAwDTAAQAAQACAAEAAgAFAAEAAgAEAAIAAgAGAAUABgAKAAMABAAwAGQABgACABAAKAEFABsAgwECAAIAAwAHABAACAAFACYADwAnABUACQAKAAMABwA7AA0AGwAVAC8ABQAVAAYAQbCxAQvDHiAA/wAAMP8w8DH/MQD/7/8AAAEAAgAEAAEAAQABAAEAAgABAAYAAgACAAEACAAFAAcACwABAAIACgAKAAgAAgAEABQAAgALAAgAAgABAAIAAQAGAAIAAQAHAAUAAwAHAAEAAQANAAcACQABAAQABgABAAIAAQAKAAEAAQAJAAIAAgAEAAUABgAOAAEAAQAJAAMAEgAFAAQAAgACAAoABwABAAEAAQADAAIABAADABcAAgAKAAwAAgAOAAIABAANAAEABgAKAAMAAQAHAA0ABgAEAA0ABQACAAMAEQACAAIABQAHAAYABAABAAcADgAQAAYADQAJAA8AAQABAAcAEAAEAAcAAQATAAkAAgAHAA8AAgAGAAUADQAZAAQADgANAAsAGQABAAEAAQACAAEAAgACAAMACgALAAMAAwABAAEABAAEAAIAAQAEAAkAAQAEAAMABQAFAAIABwAMAAsADwAHABAABAAFABAAAgABAAEABgADAAMAAQABAAIABwAGAAYABwABAAQABwAGAAEAAQACAAEADAADAAMACQAFAAgAAQALAAEAAgADABIAFAAEAAEAAwAGAAEABwADAAUABQAHAAIAAgAMAAMAAQAEAAIAAwACAAMACwAIAAcABAARAAEACQAZAAEAAQAEAAIAAgAEAAEAAgAHAAEAAQABAAMAAQACAAYAEAABAAIAAQABAAMADAAUAAIABQAUAAgABwAGAAIAAQABAAEAAQAGAAIAAQACAAoAAQABAAYAAQADAAEAAgABAAQAAQAMAAQAAQADAAEAAQABAAEAAQAKAAQABwAFAA0AAQAPAAEAAQAeAAsACQABAA8AJgAOAAEAIAARABQAAQAJAB8AAgAVAAkABAAxABYAAgABAA0AAQALAC0AIwArADcADAATAFMAAQADAAIAAwANAAIAAQAHAAMAEgADAA0ACAABAAgAEgAFAAMABwAZABgACQAYACgAAwARABgAAgABAAYAAgADABAADwAGAAcAAwAMAAEACQAHAAMAAwADAA8AFQAFABAABAAFAAwACwALAAMABgADAAIAHwADAAIAAQABABcABgAGAAEABAACAAYABQACAAEAAQADAAMAFgACAAYAAgADABEAAwACAAQABQABAAkABQABAAEABgAPAAwAAwARAAIADgACAAgAAQAXABAABAACABcACAAPABcAFAAMABkAEwAvAAsAFQBBAC4ABAADAAEABQAGAAEAAgAFABoAAgABAAEAAwALAAEAAQABAAIAAQACAAMAAQABAAoAAgADAAEAAQABAAMABgADAAIAAgAGAAYACQACAAIAAgAGAAIABQAKAAIABAABAAIAAQACAAIAAwABAAEAAwABAAIACQAXAAkAAgABAAEAAQABAAUAAwACAAEACgAJAAYAAQAKAAIAHwAZAAMABwAFACgAAQAPAAYAEQAHABsAtAABAAMAAgACAAEAAQABAAYAAwAKAAcAAQADAAYAEQAIAAYAAgACAAEAAwAFAAUACAAQAA4ADwABAAEABAABAAIAAQABAAEAAwACAAcABQAGAAIABQAKAAEABAACAAkAAQABAAsABgABACwAAQADAAcACQAFAAEAAwABAAEACgAHAAEACgAEAAIABwAVAA8ABwACAAUAAQAIAAMABAABAAMAAQAGAAEABAACAAEABAAKAAgAAQAEAAUAAQAFAAoAAgAHAAEACgABAAEAAwAEAAsACgAdAAQABwADAAUAAgADACEABQACABMAAwABAAQAAgAGAB8ACwABAAMAAwADAAEACAAKAAkADAALAAwACAADAA4ACAAGAAsAAQAEACkAAwABAAIABwANAAEABQAGAAIABgAMAAwAFgAFAAkABAAIAAkACQAiAAYAGAABAAEAFAAJAAkAAwAEAAEABwACAAIAAgAGAAIAHAAFAAMABgABAAQABgAHAAQAAgABAAQAAgANAAYABAAEAAMAAQAIAAgAAwACAAEABQABAAIAAgADAAEACwALAAcAAwAGAAoACAAGABAAEAAWAAcADAAGABUABQAEAAYABgADAAYAAQADAAIAAQACAAgAHQABAAoAAQAGAA0ABgAGABMAHwABAA0ABAAEABYAEQAaACEACgAEAA8ADAAZAAYAQwAKAAIAAwABAAYACgACAAYAAgAJAAEACQAEAAQAAQACABAAAgAFAAkAAgADAAgAAQAIAAMACQAEAAgABgAEAAgACwADAAIAAQABAAMAGgABAAcABQABAAsAAQAFAAMABQACAA0ABgAnAAUAAQAFAAIACwAGAAoABQABAA8ABQADAAYAEwAVABYAAgAEAAEABgABAAgAAQAEAAgAAgAEAAIAAgAJAAIAAQABAAEABAADAAYAAwAMAAcAAQAOAAIABAAKAAIADQABABEABwADAAIAAQADAAIADQAHAA4ADAADAAEAHQACAAgACQAPAA4ACQAOAAEAAwABAAYABQAJAAsAAwAmACsAFAAHAAcACAAFAA8ADAATAA8AUQAIAAcAAQAFAEkADQAlABwACAAIAAEADwASABQApQAcAAEABgALAAgABAAOAAcADwABAAMAAwAGAAQAAQAHAA4AAQABAAsAHgABAAUAAQAEAA4AAQAEAAIABwA0AAIABgAdAAMAAQAJAAEAFQADAAUAAQAaAAMACwAOAAsAAQARAAUAAQACAAEAAwACAAgAAQACAAkADAABAAEAAgADAAgAAwAYAAwABwAHAAUAEQADAAMAAwABABcACgAEAAQABgADAAEAEAARABYAAwAKABUAEAAQAAYABAAKAAIAAQABAAIACAAIAAYABQADAAMAAwAnABkADwABAAEAEAAGAAcAGQAPAAYABgAMAAEAFgANAAEABAAJAAUADAACAAkAAQAMABwACAADAAUACgAWADwAAQACACgABAA9AD8ABAABAA0ADAABAAQAHwAMAAEADgBZAAUAEAAGAB0ADgACAAUAMQASABIABQAdACEALwABABEAAQATAAwAAgAJAAcAJwAMAAMABwAMACcAAwABAC4ABAAMAAMACAAJAAUAHwAPABIAAwACAAIAQgATAA0AEQAFAAMALgB8AA0AOQAiAAIABQAEAAUACAABAAEAAQAEAAMAAQARAAUAAwAFAAMAAQAIAAUABgADABsAAwAaAAcADAAHAAIAEQADAAcAEgBOABAABAAkAAEAAgABAAYAAgABACcAEQAHAAQADQAEAAQABAABAAoABAACAAQABgADAAoAAQATAAEAGgACAAQAIQACAEkALwAHAAMACAACAAQADwASAAEAHQACACkADgABABUAEAApAAcAJwAZAA0ALAACAAIACgABAA0ABwABAAcAAwAFABQABAAIAAIAMQABAAoABgABAAYABwAKAAcACwAQAAMADAAUAAQACgADAAEAAgALAAIAHAAJAAIABAAHAAIADwABABsAAQAcABEABAAFAAoABwADABgACgALAAYAGgADAAIABwACAAIAMQAQAAoAEAAPAAQABQAbAD0AHgAOACYAFgACAAcABQABAAMADAAXABgAEQARAAMAAwACAAQAAQAGAAIABwAFAAEAAQAFAAEAAQAJAAQAAQADAAYAAQAIAAIACAAEAA4AAwAFAAsABAABAAMAIAABABMABAABAA0ACwAFAAIAAQAIAAYACAABAAYABQANAAMAFwALAAUAAwAQAAMACQAKAAEAGAADAMYANAAEAAIAAgAFAA4ABQAEABYABQAUAAQACwAGACkAAQAFAAIAAgALAAUAAgAcACMACAAWAAMAEgADAAoABwAFAAMABAABAAUAAwAIAAkAAwAGAAIAEAAWAAQABQAFAAMAAwASABcAAgAGABcABQAbAAgAAQAhAAIADAArABAABQACAAMABgABABQABAACAAkABwABAAsAAgAKAAMADgAfAAkAAwAZABIAFAACAAUABQAaAA4AAQALABEADAAoABMACQAGAB8AUwACAAcACQATAE4ADAAOABUATAAMAHEATwAiAAQAAQABAD0AEgBVAAoAAgACAA0AHwALADIABgAhAJ8AswAGAAYABwAEAAQAAgAEAAIABQAIAAcAFAAgABYAAQADAAoABgAHABwABQAKAAkAAgBNABMADQACAAUAAQAEAAQABwAEAA0AAwAJAB8AEQADABoAAgAGAAYABQAEAAEABwALAAMABAACAAEABgACABQABAABAAkAAgAGAAMABwABAAEAAQAUAAIAAwABAAYAAgADAAYAAgAEAAgAAQAFAA0ACAAEAAsAFwABAAoABgACAAEAAwAVAAIAAgAEABgAHwAEAAoACgACAAUAwAAPAAQAEAAHAAkAMwABAAIAAQABAAUAAQABAAIAAQADAAUAAwABAAMABAABAAMAAQADAAMACQAIAAEAAgACAAIABAAEABIADABcAAIACgAEAAMADgAFABkAEAAqAAQADgAEAAIAFQAFAH4AHgAfAAIAAQAFAA0AAwAWAAUABgAGABQADAABAA4ADABXAAMAEwABAAgAAgAJAAkAAwADABcAAgADAAcABgADAAEAAgADAAkAAQADAAEABgADAAIAAQADAAsAAwABAAYACgADAAIAAwABAAIAAQAFAAEAAQALAAMABgAEAAEABwACAAEAAgAFAAUAIgAEAA4AEgAEABMABwAFAAgAAgAGAE8AAQAFAAIADgAIAAIACQACAAEAJAAcABAABAABAAEAAQACAAwABgAqACcAEAAXAAcADwAPAAMAAgAMAAcAFQBAAAYACQAcAAgADAADAAMAKQA7ABgAMwA3ADkAJgEJAAkAAgAGAAIADwABAAIADQAmAFoACQAJAAkAAwALAAcAAQABAAEABQAGAAMAAgABAAIAAgADAAgAAQAEAAQAAQAFAAcAAQAEAAMAFAAEAAkAAQABAAEABQAFABEAAQAFAAIABgACAAQAAQAEAAUABwADABIACwALACAABwAFAAQABwALAH8ACAAEAAMAAwABAAoAAQABAAYAFQAOAAEAEAABAAcAAQADAAYACQBBADMABAADAA0AAwAKAAEAAQAMAAkAFQBuAAMAEwAYAAEAAQAKAD4ABAABAB0AKgBOABwAFAASAFIABgADAA8ABgBUADoA/QAPAJsACAEPABUACQAOAAcAOgAoACcAQYDQAQsQIAD/AAAELwXgLf8tQKafpgBBoNABCyAgAP8AAgEDARABEQEoASkBaAFpAaABoQGvAbABoB75HgBB0NABC3YBAAAASJUAAEiVAAABAAAAS5UAAEuVAAACAAAASJUAAEiVAAACAAAAS5UAAEuVAAAEAAAASJUAAEiVAAAEAAAAS5UAAEuVAAAIAAAATpUAAE6VAAAIAAAAU5UAAFOVAAAEAAAAWJUAAFiVAAAIAAAAWJUAAFuVAEHS0QELJoA/zczMPQrXIzxvEoM6F7fROKzFJze9N4Y1lb/WM3fMKzJfcIkwAEGA0gELkgKZlwAAnZcAAKGXAACllwAAW5cAAFuXAABblwAAW5cAAGGXAABplwAAcZcAAHmXAACBlwAAiZcAAJGXAAB5lwAALZcAAC2XAAAtlwAALZcAADGXAAA3lwAAPZcAAEOXAABJlwAAT5cAAFWXAABDlwAA/wAA////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AADDDwAAwwAADLsBAAzDAgAMwwMADMMEAAzTAAAAAAoAAABkAAAA6AMAABAnAACghgEAQEIPAICWmAAA4fUF/////////////////////////////////////////////////////////////////wABAgMEBQYHCAn/////////CgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiP///////8KCwwNDg8QERITFBUWFxgZGhscHR4fICEiI/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AQZDsAQsYEQAKABEREQAAAAAFAAAAAAAACQAAAAALAEGw7AELIREADwoREREDCgcAARMJCwsAAAkGCwAACwAGEQAAABEREQBB4ewBCwELAEHq7AELGBEACgoREREACgAAAgAJCwAAAAkACwAACwBBm+0BCwEMAEGn7QELFQwAAAAADAAAAAAJDAAAAAAADAAADABB1e0BCwEOAEHh7QELFQ0AAAAEDQAAAAAJDgAAAAAADgAADgBBj+4BCwEQAEGb7gELHg8AAAAADwAAAAAJEAAAAAAAEAAAEAAAEgAAABISEgBB0u4BCw4SAAAAEhISAAAAAAAACQBBg+8BCwELAEGP7wELFQoAAAAACgAAAAAJCwAAAAAACwAACwBBve8BCwEMAEHJ7wELvgIMAAAAAAwAAAAACQwAAAAAAAwAAAwAADAxMjM0NTY3ODlBQkNERUYDAAAABAAAAAQAAAAGAAAAg/miAERObgD8KRUA0VcnAN009QBi28AAPJmVAEGQQwBjUf4Au96rALdhxQA6biQA0k1CAEkG4AAJ6i4AHJLRAOsd/gApsRwA6D6nAPU1ggBEuy4AnOmEALQmcABBfl8A1pE5AFODOQCc9DkAi1+EACj5vQD4HzsA3v+XAA+YBQARL+8AClqLAG0fbQDPfjYACcsnAEZPtwCeZj8ALepfALondQDl68cAPXvxAPc5BwCSUooA+2vqAB+xXwAIXY0AMANWAHv8RgDwq2sAILzPADb0mgDjqR0AXmGRAAgb5gCFmWUAoBRfAI1AaACA2P8AJ3NNAAYGMQDKVhUAyahzAHviYABrjMAAQZPyAQttQPsh+T8AAAAALUR0PgAAAICYRvg8AAAAYFHMeDsAAACAgxvwOQAAAEAgJXo4AAAAgCKC4zYAAAAAHfNpNThj7T7aD0k/Xph7P9oPyT9pN6wxaCEiM7QPFDNoIaIzAAAAAAAA8D8AAAAAAAD4PwBBiPMBCwgG0M9D6/1MPgBBm/MBC/4HQAO44j9AhwAAqasAAPCHAADCqwAAAAAAAAEAAADAeQAAAAAAAECHAAABrAAAQIcAADGsAABAhwAAaqwAAECHAACNrAAAQIcAAJysAADUhwAAuawAAAgAAAD4eQAAQIcAANGsAADUhwAA6KwAAAAAAAAQegAAQIcAAPasAABAhwAAEK0AAGiHAABsrQAAGHoAAAAAAABAhwAAh60AAECHAAC7rQAAQIcAANGtAABAhwAA8q0AAECHAAAXrgAAQIcAADauAABAhwAAnq4AAECHAAC9rgAAQIcAANquAABAhwAA+a4AAECHAAAWrwAAQIcAADWvAABAhwAAUq8AAECHAABxrwAAQIcAAI6vAABAhwAAra8AAECHAADKrwAAQIcAAOmvAABAhwAABrAAAECHAAAlsAAAQIcAAEywAABAhwAAYrAAAECHAAB4sAAAQIcAAJewAABAhwAAv7AAANSHAADVsAAAAAAAAAh7AABAhwAA87AAAECHAAAusQAAQIcAAESxAADUhwAAerEAAAAAAAAwewAAQIcAAIOxAADUhwAAi7EAAAEAAABIewAAQIcAAJWxAADUhwAArLIAAAAAAABgewAAQIcAAMWyAADUhwAA67IAAAAAAAB4ewAAQIcAAPmyAADUhwAACbMAAAAAAACQewAAQIcAABezAADUhwAAJLMAAAAAAACoewAAQIcAAC6zAADUhwAAN7MAAAAAAADAewAAQIcAAEuzAADUhwAAn7UAAAAAAABIewAA1IcAAKi1AAABAAAA2HkAANSHAAC0tQAAAQAAAHh7AADUhwAARLoAAAEAAACoewAA1IcAAFq6AAAAAAAAGHwAAECHAABpugAA1IcAAG29AAABAAAAGHwAANSHAADnvgAAAQAAADB7AADUhwAA8b4AAAEAAABQfAAAQIcAAAG/AADUhwAAD78AAAEAAABofAAAQIcAACC/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cm9sbGJhckdyYWJIb3ZlcmVkAFNjcm9sbGJhckdyYWJBY3RpdmUAQ2hlY2tNYXJrAFNsaWRlckdyYWIAU2xpZGVyR3JhYkFjdGl2ZQBCdXR0b25Ib3ZlcmVkAEJ1dHRvbkFjdGl2ZQBIZWFkZXIASGVhZGVySG92ZXJlZABIZWFkZXJBY3RpdmUAU2VwYXJhdG9ySG92ZXJlZABTZXBhcmF0b3JBY3RpdmUAUmVzaXplR3JpcABSZXNpemVHcmlwSG92ZXJlZABSZXNpemVHcmlwQWN0aXZlAFRhYgBUYWJIb3ZlcmVkAFRhYkFjdGl2ZQBUYWJVbmZvY3VzZWQAVGFiVW5mb2N1c2VkQWN0aXZlAFBsb3RMaW5lc0hvdmVyZWQAUGxvdEhpc3RvZ3JhbUhvdmVyZWQAVGV4dFNlbGVjdGVkQmcARHJhZ0Ryb3BUYXJnZXQATmF2SGlnaGxpZ2h0AE5hdldpbmRvd2luZ0hpZ2hsaWdodABOYXZXaW5kb3dpbmdEaW1CZwBNb2RhbFdpbmRvd0RpbUJnAFVua25vd24AIyNUb29sdGlwXyUwMmQAIyNNZW51XyUwMmQAIyNQb3B1cF8lMDh4AHdpbmRvd19jb250ZXh0AHZvaWRfY29udGV4dABjb2x1bW5zACNTb3VyY2VFeHRlcm4ACiUqcyUuKnMAJSpzJS4qcwAgJS4qcwAKAGFiAExvZyBUbyBUVFkATG9nIFRvIEZpbGUATG9nIFRvIENsaXBib2FyZABEZWZhdWx0IERlcHRoAHJiAHd0AERlYXIgSW1HdWkgTWV0cmljcwABRGVhciBJbUd1aSAlcwBBcHBsaWNhdGlvbiBhdmVyYWdlICUuM2YgbXMvZnJhbWUgKCUuMWYgRlBTKQAlZCB2ZXJ0aWNlcywgJWQgaW5kaWNlcyAoJWQgdHJpYW5nbGVzKQAlZCBhY3RpdmUgd2luZG93cyAoJWQgdmlzaWJsZSkAJWQgYWN0aXZlIGFsbG9jYXRpb25zAFdpbmRvd3MARHJhd0xpc3QAQWN0aXZlIERyYXdMaXN0cyAoJWQpAFBvcHVwcwBQb3B1cHMgKCVkKQBQb3B1cElEOiAlMDh4LCBXaW5kb3c6ICclcyclcyVzAE5VTEwAIENoaWxkV2luZG93ACBDaGlsZE1lbnUAVGFiQmFycwBUYWIgQmFycyAoJWQpAEludGVybmFsIHN0YXRlAE5vbmUATW91c2UATmF2AE5hdktleWJvYXJkAE5hdkdhbWVwYWQASG92ZXJlZFdpbmRvdzogJyVzJwBIb3ZlcmVkUm9vdFdpbmRvdzogJyVzJwBIb3ZlcmVkSWQ6IDB4JTA4WC8weCUwOFggKCUuMmYgc2VjKSwgQWxsb3dPdmVybGFwOiAlZABBY3RpdmVJZDogMHglMDhYLzB4JTA4WCAoJS4yZiBzZWMpLCBBbGxvd092ZXJsYXA6ICVkLCBTb3VyY2U6ICVzAEFjdGl2ZUlkV2luZG93OiAnJXMnAE1vdmluZ1dpbmRvdzogJyVzJwBOYXZXaW5kb3c6ICclcycATmF2SWQ6IDB4JTA4WCwgTmF2TGF5ZXI6ICVkAE5hdklucHV0U291cmNlOiAlcwBOYXZBY3RpdmU6ICVkLCBOYXZWaXNpYmxlOiAlZABOYXZBY3RpdmF0ZUlkOiAweCUwOFgsIE5hdklucHV0SWQ6IDB4JTA4WABOYXZEaXNhYmxlSGlnaGxpZ2h0OiAlZCwgTmF2RGlzYWJsZU1vdXNlSG92ZXI6ICVkAE5hdldpbmRvd2luZ1RhcmdldDogJyVzJwBEcmFnRHJvcDogJWQsIFNvdXJjZUlkID0gMHglMDhYLCBQYXlsb2FkICIlcyIgKCVkIGJ5dGVzKQBUb29scwBTaG93IHdpbmRvd3MgYmVnaW4gb3JkZXIAU2hvdyB3aW5kb3dzIHJlY3RhbmdsZXMAT3V0ZXJSZWN0AE91dGVyUmVjdENsaXBwZWQASW5uZXJSZWN0AElubmVyQ2xpcFJlY3QAV29ya1JlY3QAQ29udGVudHMAQ29udGVudHNSZWdpb25SZWN0ACMjcmVjdHNfdHlwZQAnJXMnOgAoJTYuMWYsJTYuMWYpICglNi4xZiwlNi4xZikgU2l6ZSAoJTYuMWYsJTYuMWYpICVzAFNob3cgY2xpcHBpbmcgcmVjdGFuZ2xlIHdoZW4gaG92ZXJpbmcgSW1EcmF3Q21kIG5vZGUAIyNCYWNrZ3JvdW5kACMjRm9yZWdyb3VuZAAlcy8lc18lMDhYACVzLyUwOFgAI1JFU0laRQAjQ09MTEFQU0UAI0NMT1NFACMjI05hdldpbmRvd2luZ0xpc3QAKFBvcHVwKQAoTWFp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ZiwgVjogJS4zZiwgQTogJS4zZgAlM2QAUjolM2QARzolM2QAQjolM2QAQTolM2QASDolM2QAUzolM2QAVjolM2QAJTAuM2YAUjolMC4zZgBHOiUwLjNmAEI6JTAuM2YAQTolMC4zZgBIOiUwLjNmAFM6JTAuM2YAVjolMC4zZgAjI1gAIyNZACMjWgAjI1cAUkdCAEhTVgBIZXgAMC4uMjU1ADAuMDAuLjEuMDAAQ29weSBhcy4uACglLjNmZiwgJS4zZmYsICUuM2ZmLCAlLjNmZikAKCVkLCVkLCVkLCVkKQAweCUwMlglMDJYJTAyWAAweCUwMlglMDJYJTAyWCUwMlgACiMjACMjAD4AI1RyZWVQdXNoACVkOiAlOC40ZwolZDogJTguNGcAJWQ6ICU4LjRnAHRydWUAZmFsc2UAJXM6ICVzACVzOiAlZAAlJXM6ICVzACVzOiAlLjNmACMjTWFpbk1lbnVCYXIAIyNtZW51YmFyACMjPAAjIz4AIyN2ACUuKnMAKgAxLjcxAElNR1VJX1ZFUlNJT04ASU1HVUlfQ0hFQ0tWRVJTSU9OAEltR3VpSU9TaXplAEltR3VpU3R5bGVTaXplAEltVmVjMlNpemUASW1WZWM0U2l6ZQBJbURyYXdWZXJ0U2l6ZQBJbURyYXdJZHhTaXplAEltRHJhd1ZlcnRQb3NPZmZzZXQASW1EcmF3VmVydFVWT2Zmc2V0AEltRHJhd1ZlcnRDb2xPZmZzZXQAQ3JlYXRlQ29udGV4dABEZXN0cm95Q29udGV4dABHZXRDdXJyZW50Q29udGV4dABTZXRDdXJyZW50Q29udGV4dABEZWJ1Z0NoZWNrVmVyc2lvbkFuZERhdGFMYXlvdXQAR2V0SU8AR2V0U3R5bGUAR2V0RHJhd0RhdGEATmV3RnJhbWUAUmVuZGVyAEVuZEZyYW1lAFNob3dEZW1vV2luZG93AFNob3dBYm91dFdpbmRvdwBTaG93TWV0cmljc1dpbmRvdwBTaG93U3R5bGVFZGl0b3IAU2hvd1N0eWxlU2VsZWN0b3IAU2hvd0ZvbnRTZWxlY3RvcgBTaG93VXNlckd1aWRlAEdldFZlcnNpb24AU3R5bGVDb2xvcnNEYXJrAFN0eWxlQ29sb3JzQ2xhc3NpYwBTdHlsZUNvbG9yc0xpZ2h0AEJlZ2luAEVuZABCZWdpbkNoaWxkAEVuZENoaWxkAEdldENvbnRlbnRSZWdpb25NYXgAR2V0Q29udGVudFJlZ2lvbkF2YWlsAEdldFdpbmRvd0NvbnRlbnRSZWdpb25NaW4AR2V0V2luZG93Q29udGVudFJlZ2lvbk1heABHZXRXaW5kb3dDb250ZW50UmVnaW9uV2lkdGgAR2V0V2luZG93RHJhd0xpc3QAR2V0V2luZG93UG9zAEdldFdpbmRvd1NpemUAR2V0V2luZG93V2lkdGgAR2V0V2luZG93SGVpZ2h0AElzV2luZG93Q29sbGFwc2VkAElzV2luZG93QXBwZWFyaW5nAFNldFdpbmRvd0ZvbnRTY2FsZQBTZXROZXh0V2luZG93UG9zAFNldE5leHRXaW5kb3dTaXplAFNldE5leHRXaW5kb3dTaXplQ29uc3RyYWludHMAU2V0TmV4dFdpbmRvd0NvbnRlbnRTaXplAFNldE5leHRXaW5kb3dDb2xsYXBzZWQAU2V0TmV4dFdpbmRvd0ZvY3VzAFNldE5leHRXaW5kb3dCZ0FscGhhAFNldFdpbmRvd1BvcwBTZXRXaW5kb3dTaXplAFNldFdpbmRvd0NvbGxhcHNlZABTZXRXaW5kb3dGb2N1cwBTZXRXaW5kb3dOYW1lUG9zAFNldFdpbmRvd05hbWVTaXplAFNldFdpbmRvd05hbWVDb2xsYXBzZWQAU2V0V2luZG93TmFtZUZvY3VzAEdldFNjcm9sbFgAR2V0U2Nyb2xsWQBHZXRTY3JvbGxNYXhYAEdldFNjcm9sbE1heFkAU2V0U2Nyb2xsWABTZXRTY3JvbGxZAFNldFNjcm9sbEhlcmVZAFNldFNjcm9sbEZyb21Qb3NZAFNldFN0YXRlU3RvcmFnZQBHZXRTdGF0ZVN0b3JhZ2UAUHVzaEZvbnQAUG9wRm9udABQdXNoU3R5bGVDb2xvcgBQb3BTdHlsZUNvbG9yAFB1c2hTdHlsZVZhcgBQb3BTdHlsZVZhcgBHZXRTdHlsZUNvbG9yVmVjNABHZXRGb250AEdldEZvbnRTaXplAEdldEZvbnRUZXhVdldoaXRlUGl4ZWwAR2V0Q29sb3JVMzJfQQBHZXRDb2xvclUzMl9CAEdldENvbG9yVTMyX0MAUHVzaEl0ZW1XaWR0aABQb3BJdGVtV2lkdGgAU2V0TmV4dEl0ZW1XaWR0aABDYWxjSXRlbVdpZHRoAFB1c2hUZXh0V3JhcFBvcwBQb3BUZXh0V3JhcFBvcwBQdXNoQWxsb3dLZXlib2FyZEZvY3VzAFBvcEFsbG93S2V5Ym9hcmRGb2N1cwBQdXNoQnV0dG9uUmVwZWF0AFBvcEJ1dHRvblJlcGVhdABTZXBhcmF0b3IAU2FtZUxpbmUATmV3TGluZQBTcGFjaW5nAER1bW15AEluZGVudABVbmluZGVudABCZWdpbkdyb3VwAEVuZEdyb3VwAEdldEN1cnNvclBvcwBHZXRDdXJzb3JQb3NYAEdldEN1cnNvclBvc1kAU2V0Q3Vyc29yUG9zAFNldEN1cnNvclBvc1gAU2V0Q3Vyc29yUG9zWQBHZXRDdXJzb3JTdGFydFBvcwBHZXRDdXJzb3JTY3JlZW5Qb3MAU2V0Q3Vyc29yU2NyZWVuUG9zAEFsaWduVGV4dFRvRnJhbWVQYWRkaW5nAEdldFRleHRMaW5lSGVpZ2h0AEdldFRleHRMaW5lSGVpZ2h0V2l0aFNwYWNpbmcAR2V0RnJhbWVIZWlnaHQAR2V0RnJhbWVIZWlnaHRXaXRoU3BhY2luZwBDb2x1bW5zAE5leHRDb2x1bW4AR2V0Q29sdW1uSW5kZXgAR2V0Q29sdW1uV2lkdGgAU2V0Q29sdW1uV2lkdGgAR2V0Q29sdW1uT2Zmc2V0AFNldENvbHVtbk9mZnNldABHZXRDb2x1bW5zQ291bnQAUHVzaElEAFBvcElEAEdldElEAFRleHRVbmZvcm1hdHRlZABUZXh0AFRleHRWAFRleHRDb2xvcmVkAFRleHRDb2xvcmVkVgBUZXh0RGlzYWJsZWQAVGV4dERpc2FibGVkVgBUZXh0V3JhcHBlZABUZXh0V3JhcHBlZFYATGFiZWxUZXh0AExhYmVsVGV4dFYAQnVsbGV0VGV4dABCdWxsZXRUZXh0VgBCdWxsZXQAQnV0dG9uAFNtYWxsQnV0dG9uAEFycm93QnV0dG9uAEludmlzaWJsZUJ1dHRvbgBJbWFnZQBJbWFnZUJ1dHRvbgBDaGVja2JveABDaGVja2JveEZsYWdzAFJhZGlvQnV0dG9uX0EAUmFkaW9CdXR0b25fQgBQbG90TGluZXMAUGxvdEhpc3RvZ3JhbQBQcm9ncmVzc0JhcgBCZWdpbkNvbWJvAEVuZENvbWJvAENvbWJvAERyYWdGbG9hdABEcmFnRmxvYXQyAERyYWdGbG9hdDMARHJhZ0Zsb2F0NABEcmFnRmxvYXRSYW5nZTIARHJhZ0ludABEcmFnSW50MgBEcmFnSW50MwBEcmFnSW50NABEcmFnSW50UmFuZ2UyAERyYWdTY2FsYXIASW5wdXRUZXh0AElucHV0VGV4dFdpdGhIaW50AElucHV0VGV4dE11bHRpbGluZQBJbnB1dEZsb2F0AElucHV0RmxvYXQyAElucHV0RmxvYXQzAElucHV0RmxvYXQ0AElucHV0SW50AElucHV0SW50MgBJbnB1dEludDMASW5wdXRJbnQ0AElucHV0RG91YmxlAElucHV0U2NhbGFyAFNsaWRlckZsb2F0AFNsaWRlckZsb2F0MgBTbGlkZXJGbG9hdDMAU2xpZGVyRmxvYXQ0AFNsaWRlckFuZ2xlAFNsaWRlckludABTbGlkZXJJbnQyAFNsaWRlckludDMAU2xpZGVySW50NABTbGlkZXJTY2FsYXIAVlNsaWRlckZsb2F0AFZTbGlkZXJJbnQAVlNsaWRlclNjYWxhcgBDb2xvckVkaXQzAENvbG9yRWRpdDQAQ29sb3JQaWNrZXIzAENvbG9yUGlja2VyNABDb2xvckJ1dHRvbgBTZXRDb2xvckVkaXRPcHRpb25zAFRyZWVOb2RlX0EAVHJlZU5vZGVfQgBUcmVlTm9kZV9DAFRyZWVOb2RlRXhfQQBUcmVlTm9kZUV4X0IAVHJlZU5vZGVFeF9DAFRyZWVQdXNoX0EAVHJlZVB1c2hfQgBUcmVlUG9wAFRyZWVBZHZhbmNlVG9MYWJlbFBvcwBHZXRUcmVlTm9kZVRvTGFiZWxTcGFjaW5nAENvbGxhcHNpbmdIZWFkZXJfQQBDb2xsYXBzaW5nSGVhZGVyX0IAU2V0TmV4dEl0ZW1PcGVuAFNlbGVjdGFibGVfQQBTZWxlY3RhYmxlX0IATGlzdEJveF9BAExpc3RCb3hfQgBMaXN0Qm94SGVhZGVyX0EATGlzdEJveEhlYWRlcl9CAExpc3RCb3hGb290ZXIAVmFsdWVfQQBWYWx1ZV9CAFZhbHVlX0MAVmFsdWVfRABTZXRUb29sdGlwAEJlZ2luVG9vbHRpcABFbmRUb29sdGlwAEJlZ2luTWFpbk1lbnVCYXIARW5kTWFpbk1lbnVCYXIAQmVnaW5NZW51QmFyAEVuZE1lbnVCYXIAQmVnaW5NZW51AEVuZE1lbnUATWVudUl0ZW1fQQBNZW51SXRlbV9CAE9wZW5Qb3B1cABPcGVuUG9wdXBPbkl0ZW1DbGljawBCZWdpblBvcHVwAEJlZ2luUG9wdXBNb2RhbABCZWdpblBvcHVwQ29udGV4dEl0ZW0AQmVnaW5Qb3B1cENvbnRleHRXaW5kb3cAQmVnaW5Qb3B1cENvbnRleHRWb2lkAEVuZFBvcHVwAElzUG9wdXBPcGVuAENsb3NlQ3VycmVudFBvcHVwAEJlZ2luVGFiQmFyAEVuZFRhYkJhcgBCZWdpblRhYkl0ZW0ARW5kVGFiSXRlbQBTZXRUYWJJdGVtQ2xvc2VkAExvZ1RvVFRZAExvZ1RvRmlsZQBMb2dUb0NsaXBib2FyZABMb2dGaW5pc2gATG9nQnV0dG9ucwBMb2dUZXh0AEJlZ2luRHJhZ0Ryb3BTb3VyY2UAU2V0RHJhZ0Ryb3BQYXlsb2FkAEVuZERyYWdEcm9wU291cmNlAEJlZ2luRHJhZ0Ryb3BUYXJnZXQAQWNjZXB0RHJhZ0Ryb3BQYXlsb2FkAEVuZERyYWdEcm9wVGFyZ2V0AEdldERyYWdEcm9wUGF5bG9hZABQdXNoQ2xpcFJlY3QAUG9wQ2xpcFJlY3QAU2V0SXRlbURlZmF1bHRGb2N1cwBTZXRLZXlib2FyZEZvY3VzSGVyZQBJc0l0ZW1Ib3ZlcmVkAElzSXRlbUFjdGl2ZQBJc0l0ZW1FZGl0ZWQASXNJdGVtRm9jdXNlZABJc0l0ZW1DbGlja2VkAElzSXRlbVZpc2libGUASXNJdGVtQWN0aXZhdGVkAElzSXRlbURlYWN0aXZhdGVkAElzSXRlbURlYWN0aXZhdGVkQWZ0ZXJFZGl0AElzQW55SXRlbUhvdmVyZWQASXNBbnlJdGVtQWN0aXZlAElzQW55SXRlbUZvY3VzZWQAR2V0SXRlbVJlY3RNaW4AR2V0SXRlbVJlY3RNYXgAR2V0SXRlbVJlY3RTaXplAFNldEl0ZW1BbGxvd092ZXJsYXAASXNXaW5kb3dGb2N1c2VkAElzV2luZG93SG92ZXJlZABJc1JlY3RWaXNpYmxlX0EASXNSZWN0VmlzaWJsZV9CAEdldFRpbWUAR2V0RnJhbWVDb3VudABHZXRCYWNrZ3JvdW5kRHJhd0xpc3QAR2V0Rm9yZWdyb3VuZERyYXdMaXN0AEdldERyYXdMaXN0U2hhcmVkRGF0YQBHZXRTdHlsZUNvbG9yTmFtZQBDYWxjVGV4dFNpemUAQ2FsY0xpc3RDbGlwcGluZwBCZWdpbkNoaWxkRnJhbWUARW5kQ2hpbGRGcmFtZQBDb2xvckNvbnZlcnRVMzJUb0Zsb2F0NABDb2xvckNvbnZlcnRGbG9hdDRUb1UzMgBDb2xvckNvbnZlcnRSR0J0b0hTVgBDb2xvckNvbnZlcnRIU1Z0b1JHQgBHZXRLZXlJbmRleABJc0tleURvd24ASXNLZXlQcmVzc2VkAElzS2V5UmVsZWFzZWQAR2V0S2V5UHJlc3NlZEFtb3VudABJc01vdXNlRG93bgBJc0FueU1vdXNlRG93bgBJc01vdXNlQ2xpY2tlZABJc01vdXNlRG91YmxlQ2xpY2tlZABJc01vdXNlUmVsZWFzZWQASXNNb3VzZURyYWdnaW5nAElzTW91c2VIb3ZlcmluZ1JlY3QASXNNb3VzZVBvc1ZhbGlkAEdldE1vdXNlUG9zAEdldE1vdXNlUG9zT25PcGVuaW5nQ3VycmVudFBvcHVwAEdldE1vdXNlRHJhZ0RlbHRhAFJlc2V0TW91c2VEcmFnRGVsdGEAR2V0TW91c2VDdXJzb3IAU2V0TW91c2VDdXJzb3IAQ2FwdHVyZUtleWJvYXJkRnJvbUFwcABDYXB0dXJlTW91c2VGcm9tQXBwAEdldENsaXBib2FyZFRleHQAU2V0Q2xpcGJvYXJkVGV4dABMb2FkSW5pU2V0dGluZ3NGcm9tTWVtb3J5AFNhdmVJbmlTZXR0aW5nc1RvTWVtb3J5AFNldEFsbG9jYXRvckZ1bmN0aW9ucwBNZW1BbGxvYwBNZW1GcmVlAGlpaQBOMTBlbXNjcmlwdGVuM3ZhbEUAdmlpaWkATlN0M19fMjEyYmFzaWNfc3RyaW5nSWNOU18xMWNoYXJfdHJhaXRzSWNFRU5TXzlhbGxvY2F0b3JJY0VFRUUATlN0M19fMjIxX19iYXNpY19zdHJpbmdfY29tbW9uSUxiMUVFRQBpaWlmaQB4AHkAMjNpbXBvcnRfbWF5YmVfbnVsbF92YWx1ZUk2SW1WZWMyRQBpaWlpaQBpaWlmAGlpaWZmAGlpaWkAMTJhY2Nlc3NfdmFsdWVJZkxtMUVFAHZpZmZmaWlpAHoAdwA2SW1WZWMyAHZpaWZpaQAxMmFjY2Vzc192YWx1ZUlpTG0xRUUAaWlpaWZpAFAyMEltRHJhd0xpc3RTaGFyZWREYXRhADIwSW1EcmF3TGlzdFNoYXJlZERhdGEAUDEwSW1EcmF3TGlzdAAxMEltRHJhd0xpc3QAZGkAaWlpaWlpACVzADIzaW1wb3J0X21heWJlX251bGxfdmFsdWVJTlN0M19fMjEyYmFzaWNfc3RyaW5nSWNOUzBfMTFjaGFyX3RyYWl0c0ljRUVOUzBfOWFsbG9jYXRvckljRUVFRUUAMjRpbXBvcnRfbWF5YmVfbnVsbF9zdHJpbmcAMjNhY2Nlc3NfbWF5YmVfbnVsbF92YWx1ZUliTG0xRUUAdmlpZmkAdmlpaQBpaWlpaWlpADEyYWNjZXNzX3ZhbHVlSWZMbTRFRQAyM2FjY2Vzc19tYXliZV9udWxsX3ZhbHVlSWZMbTRFRQAxMmFjY2Vzc192YWx1ZUlmTG0zRUUAaWlpaWlpaWlpaQBzZXQATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJZEVFADIzaW1wb3J0X21heWJlX251bGxfdmFsdWVJZEUAbGVuZ3RoAGFsbG9jYXRvcjxUPjo6YWxsb2NhdGUoc2l6ZV90IG4pICduJyBleGNlZWRzIG1heGltdW0gc3VwcG9ydGVkIHNpemUATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJZkVFADIzaW1wb3J0X21heWJlX251bGxfdmFsdWVJZkUATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJakVFADIzaW1wb3J0X21heWJlX251bGxfdmFsdWVJakUATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJaUVFADIzaW1wb3J0X21heWJlX251bGxfdmFsdWVJaUUATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJdEVFADIzaW1wb3J0X21heWJlX251bGxfdmFsdWVJdEUATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJc0VFADIzaW1wb3J0X21heWJlX251bGxfdmFsdWVJc0UATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJaEVFADIzaW1wb3J0X21heWJlX251bGxfdmFsdWVJaEUATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJYUVFADIzaW1wb3J0X21heWJlX251bGxfdmFsdWVJYUUAaWlpaWlpaWlpADEyYWNjZXNzX3ZhbHVlSWlMbTRFRQAxMmFjY2Vzc192YWx1ZUlpTG0zRUUAMTJhY2Nlc3NfdmFsdWVJaUxtMkVFACUuMGYgZGVnADEyYWNjZXNzX3ZhbHVlSWZMbTJFRQBpaWlpaWlpaQBpaWlpZGRpaQAxMmFjY2Vzc192YWx1ZUlkTG0xRUUAUDI2SW1HdWlJbnB1dFRleHRDYWxsYmFja0RhdGEAMjZJbUd1aUlucHV0VGV4dENhbGxiYWNrRGF0YQBpaWlpaWlpaWlpaQB2aWZpaQB2aWlpaWlpaWlpaQAxMmFjY2Vzc192YWx1ZUlqTG0xRUUAMTJhY2Nlc3NfdmFsdWVJYkxtMUVFAHZpaWlpaWlpAG51bWJlcgB2aWlmAGZpaQBpaQB2aWkAUDZJbUZvbnQANkltRm9udABQSzZJbVZlYzQANkltVmVjNABUT0RPOiAlcwoAYXV0byBFbXNjcmlwdGVuQmluZGluZ0luaXRpYWxpemVyX0ltR3VpOjpFbXNjcmlwdGVuQmluZGluZ0luaXRpYWxpemVyX0ltR3VpKCk6Oihhbm9ueW1vdXMgY2xhc3MpOjpvcGVyYXRvcigpKCkgY29uc3QAYXV0byBFbXNjcmlwdGVuQmluZGluZ0luaXRpYWxpemVyX0ltR3VpOjpFbXNjcmlwdGVuQmluZGluZ0luaXRpYWxpemVyX0ltR3VpKCk6Oihhbm9ueW1vdXMgY2xhc3MpOjpvcGVyYXRvcigpKGVtc2NyaXB0ZW46OnZhbCkgY29uc3QAdmlmZgB2aWlpaWkAUDIxSW1HdWlTaXplQ2FsbGJhY2tEYXRhADIxSW1HdWlTaXplQ2FsbGJhY2tEYXRhAHZpZgBmaQBzdHJpbmcAUDEwSW1HdWlTdHlsZQAxMEltR3VpU3R5bGUAdmkAUDEwSW1EcmF3RGF0YQAxMEltRHJhd0RhdGEAUDdJbUd1aUlPADdJbUd1aUlPAFAxNldyYXBJbUd1aUNvbnRleHQAMTZXcmFwSW1HdWlDb250ZXh0AEltR3VpU3R5bGUAQWxwaGEAV2luZG93UGFkZGluZwBXaW5kb3dSb3VuZGluZwBXaW5kb3dCb3JkZXJTaXplAFdpbmRvd01pblNpemUAV2luZG93VGl0bGVBbGlnbgBXaW5kb3dNZW51QnV0dG9uUG9zaXRpb24AQ2hpbGRSb3VuZGluZwBDaGlsZEJvcmRlclNpemUAUG9wdXBSb3VuZGluZwBQb3B1cEJvcmRlclNpemUARnJhbWVQYWRkaW5nAEZyYW1lUm91bmRpbmcARnJhbWVCb3JkZXJTaXplAEl0ZW1TcGFjaW5nAEl0ZW1Jbm5lclNwYWNpbmcAVG91Y2hFeHRyYVBhZGRpbmcASW5kZW50U3BhY2luZwBDb2x1bW5zTWluU3BhY2luZwBTY3JvbGxiYXJTaXplAFNjcm9sbGJhclJvdW5kaW5nAEdyYWJNaW5TaXplAEdyYWJSb3VuZGluZwBUYWJSb3VuZGluZwBUYWJCb3JkZXJTaXplAEJ1dHRvblRleHRBbGlnbgBTZWxlY3RhYmxlVGV4dEFsaWduAERpc3BsYXlXaW5kb3dQYWRkaW5nAERpc3BsYXlTYWZlQXJlYVBhZGRpbmcATW91c2VDdXJzb3JTY2FsZQBBbnRpQWxpYXNlZExpbmVzAEFudGlBbGlhc2VkRmlsbABDdXJ2ZVRlc3NlbGxhdGlvblRvbABfZ2V0QXRfQ29sb3JzAF9zZXRBdF9Db2xvcnMAU2NhbGVBbGxTaXplcwBQNkltVmVjNABQSzZJbVZlYzIAdgBQSzEwSW1HdWlTdHlsZQBJbUd1aUlPAENvbmZpZ0ZsYWdzAEJhY2tlbmRGbGFncwBEaXNwbGF5U2l6ZQBEZWx0YVRpbWUASW5pU2F2aW5nUmF0ZQBJbmlGaWxlbmFtZQBMb2dGaWxlbmFtZQBNb3VzZURvdWJsZUNsaWNrVGltZQBNb3VzZURvdWJsZUNsaWNrTWF4RGlzdABNb3VzZURyYWdUaHJlc2hvbGQAX2dldEF0X0tleU1hcABfc2V0QXRfS2V5TWFwAEtleVJlcGVhdERlbGF5AEtleVJlcGVhdFJhdGUAVXNlckRhdGEARm9udHMARm9udEdsb2JhbFNjYWxlAEZvbnRBbGxvd1VzZXJTY2FsaW5nAEZvbnREZWZhdWx0AERpc3BsYXlGcmFtZWJ1ZmZlclNjYWxlAE1vdXNlRHJhd0N1cnNvcgBDb25maWdNYWNPU1hCZWhhdmlvcnMAQ29uZmlnSW5wdXRUZXh0Q3Vyc29yQmxpbmsAQ29uZmlnV2luZG93c1Jlc2l6ZUZyb21FZGdlcwBDb25maWdXaW5kb3dzTW92ZUZyb21UaXRsZUJhck9ubHkAQmFja2VuZFBsYXRmb3JtTmFtZQBCYWNrZW5kUmVuZGVyZXJOYW1lAEJhY2tlbmRQbGF0Zm9ybVVzZXJEYXRhAEJhY2tlbmRSZW5kZXJlclVzZXJEYXRhAEJhY2tlbmRMYW5ndWFnZVVzZXJEYXRhAEdldENsaXBib2FyZFRleHRGbgBTZXRDbGlwYm9hcmRUZXh0Rm4AQ2xpcGJvYXJkVXNlckRhdGEATW91c2VQb3MAX2dldEF0X01vdXNlRG93bgBfc2V0QXRfTW91c2VEb3duAE1vdXNlV2hlZWwAS2V5Q3RybABLZXlTaGlmdABLZXlBbHQAS2V5U3VwZXIAX2dldEF0X0tleXNEb3duAF9zZXRBdF9LZXlzRG93bgBfZ2V0QXRfTmF2SW5wdXRzAF9zZXRBdF9OYXZJbnB1dHMAQWRkSW5wdXRDaGFyYWN0ZXIAQWRkSW5wdXRDaGFyYWN0ZXJzVVRGOABDbGVhcklucHV0Q2hhcmFjdGVycwBXYW50Q2FwdHVyZU1vdXNlAFdhbnRDYXB0dXJlS2V5Ym9hcmQAV2FudFRleHRJbnB1dABXYW50U2V0TW91c2VQb3MAV2FudFNhdmVJbmlTZXR0aW5ncwBOYXZBY3RpdmUATmF2VmlzaWJsZQBGcmFtZXJhdGUATWV0cmljc1JlbmRlclZlcnRpY2VzAE1ldHJpY3NSZW5kZXJJbmRpY2VzAE1ldHJpY3NSZW5kZXJXaW5kb3dzAE1ldHJpY3NBY3RpdmVXaW5kb3dzAE1ldHJpY3NBY3RpdmVBbGxvY2F0aW9ucwBNb3VzZURlbHRhAF9nZXRBdF9Nb3VzZUNsaWNrZWRQb3MAX2dldEF0X01vdXNlRG93bkR1cmF0aW9uAF9nZXRBdF9LZXlzRG93bkR1cmF0aW9uAF9nZXRBdF9OYXZJbnB1dHNEb3duRHVyYXRpb24AUEs3SW1HdWlJTwBpaWlpZgBmaWlpAFAxMUltRm9udEF0bGFzADExSW1Gb250QXRsYXMASW1Gb250QXRsYXMAQWRkRm9udERlZmF1bHQAQWRkRm9udEZyb21NZW1vcnlUVEYAQ2xlYXJUZXhEYXRhAENsZWFySW5wdXREYXRhAENsZWFyRm9udHMAQ2xlYXIAQnVpbGQASXNCdWlsdABHZXRUZXhEYXRhQXNBbHBoYTgAR2V0VGV4RGF0YUFzUkdCQTMyAEdldEdseXBoUmFuZ2VzRGVmYXVsdABHZXRHbHlwaFJhbmdlc0tvcmVhbgBHZXRHbHlwaFJhbmdlc0phcGFuZXNlAEdldEdseXBoUmFuZ2VzQ2hpbmVzZUZ1bGwAR2V0R2x5cGhSYW5nZXNDaGluZXNlU2ltcGxpZmllZENvbW1vbgBHZXRHbHlwaFJhbmdlc0N5cmlsbGljAEdldEdseXBoUmFuZ2VzVGhhaQBHZXRHbHlwaFJhbmdlc1ZpZXRuYW1lc2UATG9ja2VkAEZsYWdzAFRleElEAFRleERlc2lyZWRXaWR0aABUZXhHbHlwaFBhZGRpbmcAVGV4V2lkdGgAVGV4SGVpZ2h0AFRleFV2U2NhbGUAVGV4VXZXaGl0ZVBpeGVsAEl0ZXJhdGVGb250cwBwaXhlbHMAd2lkdGgAaGVpZ2h0AGJ5dGVzX3Blcl9waXhlbABpaWlpZmlpAEZvbnREYXRhAGJ1ZmZlcgBieXRlT2Zmc2V0AGJ5dGVMZW5ndGgAVE9ETzogRm9udERhdGEgJXp1ICV6dQoARm9udERhdGFPd25lZEJ5QXRsYXMARm9udE5vAFNpemVQaXhlbHMAT3ZlcnNhbXBsZUgAT3ZlcnNhbXBsZVYAUGl4ZWxTbmFwSABHbHlwaEV4dHJhU3BhY2luZwBHbHlwaE9mZnNldABHbHlwaFJhbmdlcwBHbHlwaE1pbkFkdmFuY2VYAEdseXBoTWF4QWR2YW5jZVgATWVyZ2VNb2RlAFJhc3Rlcml6ZXJGbGFncwBSYXN0ZXJpemVyTXVsdGlwbHkATmFtZQBQSzExSW1Gb250QXRsYXMASW1Gb250AEZvbnRTaXplAFNjYWxlAERpc3BsYXlPZmZzZXQASXRlcmF0ZUdseXBocwBGYWxsYmFja0dseXBoAEZhbGxiYWNrQWR2YW5jZVgARmFsbGJhY2tDaGFyAENvbmZpZ0RhdGFDb3VudABJdGVyYXRlQ29uZmlnRGF0YQBBc2NlbnQARGVzY2VudABNZXRyaWNzVG90YWxTdXJmYWNlAENsZWFyT3V0cHV0RGF0YQBCdWlsZExvb2t1cFRhYmxlAEZpbmRHbHlwaABGaW5kR2x5cGhOb0ZhbGxiYWNrAFNldEZhbGxiYWNrQ2hhcgBHZXRDaGFyQWR2YW5jZQBJc0xvYWRlZABHZXREZWJ1Z05hbWUAQ2FsY1RleHRTaXplQQBDYWxjV29yZFdyYXBQb3NpdGlvbkEAUmVuZGVyQ2hhcgB2aWlpZmlpaQBpaWlmaWYAaWlpZmZmaWlpADx1bmtub3duPgBQSzZJbUZvbnQAUEsxMUltRm9udEdseXBoADExSW1Gb250R2x5cGgAUEsxMkltRm9udENvbmZpZwAxMkltRm9udENvbmZpZwBQMTFJbUZvbnRHbHlwaABJbUZvbnRDb25maWcARHN0Rm9udABhdXRvIEVtc2NyaXB0ZW5CaW5kaW5nSW5pdGlhbGl6ZXJfSW1Gb250Q29uZmlnOjpFbXNjcmlwdGVuQmluZGluZ0luaXRpYWxpemVyX0ltRm9udENvbmZpZygpOjooYW5vbnltb3VzIGNsYXNzKTo6b3BlcmF0b3IoKShJbUZvbnRDb25maWcgJiwgZW1zY3JpcHRlbjo6dmFsKSBjb25zdABhdXRvIEVtc2NyaXB0ZW5CaW5kaW5nSW5pdGlhbGl6ZXJfSW1Gb250Q29uZmlnOjpFbXNjcmlwdGVuQmluZGluZ0luaXRpYWxpemVyX0ltRm9udENvbmZpZygpOjooYW5vbnltb3VzIGNsYXNzKTo6b3BlcmF0b3IoKShjb25zdCBJbUZvbnRDb25maWcgJikgY29uc3QAUDEySW1Gb250Q29uZmlnAEltRm9udEdseXBoAENvZGVwb2ludABBZHZhbmNlWABYMABZMABYMQBZMQBVMABWMABVMQBWMQBJbURyYXdEYXRhAEl0ZXJhdGVEcmF3TGlzdHMAVmFsaWQAQ21kTGlzdHNDb3VudABUb3RhbElkeENvdW50AFRvdGFsVnR4Q291bnQARGlzcGxheVBvcwBGcmFtZWJ1ZmZlclNjYWxlAERlSW5kZXhBbGxCdWZmZXJzAFNjYWxlQ2xpcFJlY3RzAFBLMTBJbURyYXdEYXRhAFBLMTBJbURyYXdMaXN0AEltRHJhd0xpc3QASXRlcmF0ZURyYXdDbWRzAElkeEJ1ZmZlcgBWdHhCdWZmZXIAUHVzaENsaXBSZWN0RnVsbFNjcmVlbgBQdXNoVGV4dHVyZUlEAFBvcFRleHR1cmVJRABHZXRDbGlwUmVjdE1pbgBHZXRDbGlwUmVjdE1heABBZGRMaW5lAEFkZFJlY3QAQWRkUmVjdEZpbGxlZABBZGRSZWN0RmlsbGVkTXVsdGlDb2xvcgBBZGRRdWFkAEFkZFF1YWRGaWxsZWQAQWRkVHJpYW5nbGUAQWRkVHJpYW5nbGVGaWxsZWQAQWRkQ2lyY2xlAEFkZENpcmNsZUZpbGxlZABBZGRUZXh0X0EAQWRkVGV4dF9CAEFkZEltYWdlAEFkZEltYWdlUXVhZABBZGRJbWFnZVJvdW5kZWQAQWRkUG9seWxpbmUAQWRkQ29udmV4UG9seUZpbGxlZABBZGRCZXppZXJDdXJ2ZQBQYXRoQ2xlYXIAUGF0aExpbmVUbwBQYXRoTGluZVRvTWVyZ2VEdXBsaWNhdGUAUGF0aEZpbGxDb252ZXgAUGF0aFN0cm9rZQBQYXRoQXJjVG8AUGF0aEFyY1RvRmFzdABQYXRoQmV6aWVyQ3VydmVUbwBQYXRoUmVjdABDaGFubmVsc1NwbGl0AENoYW5uZWxzTWVyZ2UAQ2hhbm5lbHNTZXRDdXJyZW50AEFkZENhbGxiYWNrAEFkZERyYXdDbWQAQ2xlYXJGcmVlTWVtb3J5AFByaW1SZXNlcnZlAFByaW1SZWN0AFByaW1SZWN0VVYAUHJpbVF1YWRVVgBQcmltV3JpdGVWdHgAUHJpbVdyaXRlSWR4AFByaW1WdHgAVXBkYXRlQ2xpcFJlY3QAVXBkYXRlVGV4dHVyZUlEAHZpaWlpaWlpaWlpaQB2aWlpaWZpAHZpaWlmZmZpAHZpaWlpZgB2aWlpaWlpaWZpAHZpaWlpaWlpaWZpAHZpaWlpaWlpaWlpaWkAdmlpaWZpaWlmaQAyM2ltcG9ydF9tYXliZV9udWxsX3ZhbHVlSTZJbVZlYzRFAHZpaWlmaWkAdmlpaWZpaWYAdmlpaWlpaQB2aWlpaWlpZgB2aWlpaWlpaWYAdmlpaWlpaWlpAHZpaWlpaWZpAHZpaWlpaWZpZgB2aWlpaWlmAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SWNFRQBQSzlJbURyYXdDbWQAOUltRHJhd0NtZABJbURyYXdDbWQARWxlbUNvdW50AENsaXBSZWN0AFRleHR1cmVJZABWdHhPZmZzZXQASWR4T2Zmc2V0AFA5SW1EcmF3Q21kAEltR3VpTGlzdENsaXBwZXIAU3RhcnRQb3NZAEl0ZW1zSGVpZ2h0AEl0ZW1zQ291bnQAU3RlcE5vAERpc3BsYXlTdGFydABEaXNwbGF5RW5kAFN0ZXAAUDE2SW1HdWlMaXN0Q2xpcHBlcgAxNkltR3VpTGlzdENsaXBwZXIAdmlpaWYAUEsxNkltR3VpTGlzdENsaXBwZXIASW1HdWlTaXplQ2FsbGJhY2tEYXRhAFBvcwBDdXJyZW50U2l6ZQBEZXNpcmVkU2l6ZQBQSzIxSW1HdWlTaXplQ2FsbGJhY2tEYXRhAEltR3VpSW5wdXRUZXh0Q2FsbGJhY2tEYXRhAEV2ZW50RmxhZwBFdmVudENoYXIARXZlbnRLZXkAQnVmAEJ1ZlRleHRMZW4AQnVmU2l6ZQBCdWZEaXJ0eQBDdXJzb3JQb3MAU2VsZWN0aW9uU3RhcnQAU2VsZWN0aW9uRW5kAERlbGV0ZUNoYXJzAEluc2VydENoYXJzAEhhc1NlbGVjdGlvbgBQSzI2SW1HdWlJbnB1dFRleHRDYWxsYmFja0RhdGEASW1WZWM0AFNldABDb3B5AEVxdWFscwBJbVZlYzIAUDZJbVZlYzIAV3JhcEltR3VpQ29udGV4dABQSzE2V3JhcEltR3VpQ29udGV4dABtYWxsaW5mbwBhcmVuYQBvcmRibGtzAHNtYmxrcwBoYmxrcwBoYmxraGQAdXNtYmxrcwBmc21ibGtzAHVvcmRibGtzAGZvcmRibGtzAGtlZXBjb3N0AHZvaWQAYm9vbABzdGQ6OnN0cmluZwBzdGQ6OmJhc2ljX3N0cmluZzx1bnNpZ25lZCBjaGFyPgBzdGQ6OndzdHJpbmcAZW1zY3JpcHRlbjo6dmFsAGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHNpZ25lZCBjaGFyPgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1bnNpZ25lZCBjaGFyPgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxzaG9ydD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dW5zaWduZWQgc2hvcnQ+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGludD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dW5zaWduZWQgaW50PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxpbnQ4X3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVpbnQ4X3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGludDE2X3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVpbnQxNl90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxpbnQzMl90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1aW50MzJfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8bG9uZyBkb3VibGU+AE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SWVFRQBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxkb3VibGU+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGZsb2F0PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1bnNpZ25lZCBsb25nPgBOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0ltRUUAZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8bG9uZz4ATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJbEVFAGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGNoYXI+AE5TdDNfXzIxMmJhc2ljX3N0cmluZ0l3TlNfMTFjaGFyX3RyYWl0c0l3RUVOU185YWxsb2NhdG9ySXdFRUVFAE5TdDNfXzIxMmJhc2ljX3N0cmluZ0loTlNfMTFjaGFyX3RyYWl0c0loRUVOU185YWxsb2NhdG9ySWhFRUVFAGRvdWJsZQBmbG9hdAB1bnNpZ25lZCBsb25nAGxvbmcAdW5zaWduZWQgaW50AGludAB1bnNpZ25lZCBzaG9ydABzaG9ydAB1bnNpZ25lZCBjaGFyAHNpZ25lZCBjaGFyAGNoYXIAcndhAGluZmluaXR5AAABAgQHAwYFAC0rICAgMFgweAAobnVsbCkALTBYKzBYIDBYLTB4KzB4IDB4AGluZgBJTkYAbmFuAE5BTgAuAHRlcm1pbmF0aW5nIHdpdGggJXMgZXhjZXB0aW9uIG9mIHR5cGUgJXM6ICVzAHRlcm1pbmF0aW5nIHdpdGggJXMgZXhjZXB0aW9uIG9mIHR5cGUgJXMAdGVybWluYXRpbmcgd2l0aCAlcyBmb3JlaWduIGV4Y2VwdGlvbgB0ZXJtaW5hdGluZwB1bmNhdWdodABTdDlleGNlcHRpb24ATjEwX19jeHhhYml2MTE2X19zaGltX3R5cGVfaW5mb0UAU3Q5dHlwZV9pbmZvAE4xMF9fY3h4YWJpdjEyMF9fc2lfY2xhc3NfdHlwZV9pbmZvRQBOMTBfX2N4eGFiaXYxMTdfX2NsYXNzX3R5cGVfaW5mb0UAcHRocmVhZF9vbmNlIGZhaWx1cmUgaW4gX19jeGFfZ2V0X2dsb2JhbHNfZmFzdCgpAGNhbm5vdCBjcmVhdGUgcHRocmVhZCBrZXkgZm9yIF9fY3hhX2dldF9nbG9iYWxzKCkAY2Fubm90IHplcm8gb3V0IHRocmVhZCB2YWx1ZSBmb3IgX19jeGFfZ2V0X2dsb2JhbHMoKQB0ZXJtaW5hdGVfaGFuZGxlciB1bmV4cGVjdGVkbHkgcmV0dXJuZWQAU3QxMWxvZ2ljX2Vycm9yAFN0MTJsZW5ndGhfZXJyb3IATjEwX19jeHhhYml2MTE5X19wb2ludGVyX3R5cGVfaW5mb0UATjEwX19jeHhhYml2MTE3X19wYmFzZV90eXBlX2luZm9FAE4xMF9fY3h4YWJpdjEyM19fZnVuZGFtZW50YWxfdHlwZV9pbmZvRQB2AFB2AERuAGIAYwBoAGEAcwB0AGkAagBsAG0AZgBkAE4xMF9fY3h4YWJpdjEyMV9fdm1pX2NsYXNzX3R5cGVfaW5mb0U=";if(!isDataURI(wasmBinaryFile)){wasmBinaryFile=locateFile(wasmBinaryFile);}function getBinary(){try{if(Module["wasmBinary"]){return new Uint8Array(Module["wasmBinary"])}var binary=tryParseAsDataURI(wasmBinaryFile);if(binary){return binary}if(Module["readBinary"]){return Module["readBinary"](wasmBinaryFile)}else{throw"both async and sync fetching of the wasm failed"}}catch(err){abort(err);}}function getBinaryPromise(){if(!Module["wasmBinary"]&&(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)&&typeof fetch==="function"){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){if(!response["ok"]){throw"failed to load wasm binary file at '"+wasmBinaryFile+"'"}return response["arrayBuffer"]()}).catch(function(){return getBinary()})}return new Promise(function(resolve,reject){resolve(getBinary());})}function createWasm(env){var info={"env":env,"global":{"NaN":NaN,Infinity:Infinity},"global.Math":Math,"asm2wasm":asm2wasmImports};function receiveInstance(instance,module){var exports=instance.exports;Module["asm"]=exports;removeRunDependency();}addRunDependency();function receiveInstantiatedSource(output){receiveInstance(output["instance"]);}function instantiateArrayBuffer(receiver){return getBinaryPromise().then(function(binary){return WebAssembly.instantiate(binary,info)}).then(receiver,function(reason){err("failed to asynchronously prepare wasm: "+reason);abort(reason);})}function instantiateAsync(){if(!Module["wasmBinary"]&&typeof WebAssembly.instantiateStreaming==="function"&&!isDataURI(wasmBinaryFile)&&typeof fetch==="function"){return WebAssembly.instantiateStreaming(fetch(wasmBinaryFile,{credentials:"same-origin"}),info).then(receiveInstantiatedSource,function(reason){err("wasm streaming compile failed: "+reason);err("falling back to ArrayBuffer instantiation");instantiateArrayBuffer(receiveInstantiatedSource);})}else{return instantiateArrayBuffer(receiveInstantiatedSource)}}if(Module["instantiateWasm"]){try{return Module["instantiateWasm"](info,receiveInstance)}catch(e){err("Module.instantiateWasm callback failed with error: "+e);return false}}instantiateAsync();return {}}Module["asm"]=function(global,env,providedBuffer){env["memory"]=wasmMemory;env["table"]=wasmTable=new WebAssembly.Table({"initial":1458,"maximum":1458,"element":"anyfunc"});env["__memory_base"]=1024;env["__table_base"]=0;var exports=createWasm(env);return exports};__ATINIT__.push({func:function(){globalCtors();}});function ___cxa_allocate_exception(size){return _malloc(size)}function ___cxa_throw(ptr,type,destructor){throw ptr}function ___lock(){}var SYSCALLS={buffers:[null,[],[]],printChar:function(stream,curr){var buffer=SYSCALLS.buffers[stream];if(curr===0||curr===10){(stream===1?out:err)(UTF8ArrayToString(buffer,0));buffer.length=0;}else{buffer.push(curr);}},varargs:0,get:function(varargs){SYSCALLS.varargs+=4;var ret=HEAP32[SYSCALLS.varargs-4>>2];return ret},getStr:function(){var ret=UTF8ToString(SYSCALLS.get());return ret},get64:function(){var low=SYSCALLS.get(),high=SYSCALLS.get();return low},getZero:function(){SYSCALLS.get();}};function ___syscall140(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(),offset_high=SYSCALLS.get(),offset_low=SYSCALLS.get(),result=SYSCALLS.get(),whence=SYSCALLS.get();return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return -e.errno}}function ___syscall145(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(),iov=SYSCALLS.get(),iovcnt=SYSCALLS.get();return SYSCALLS.doReadv(stream,iov,iovcnt)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return -e.errno}}function ___syscall146(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.get(),iov=SYSCALLS.get(),iovcnt=SYSCALLS.get();var ret=0;for(var i=0;i<iovcnt;i++){var ptr=HEAP32[iov+i*8>>2];var len=HEAP32[iov+(i*8+4)>>2];for(var j=0;j<len;j++){SYSCALLS.printChar(stream,HEAPU8[ptr+j]);}ret+=len;}return ret}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return -e.errno}}function ___setErrNo(value){if(Module["___errno_location"])HEAP32[Module["___errno_location"]()>>2]=value;return value}function ___syscall221(which,varargs){SYSCALLS.varargs=varargs;try{return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return -e.errno}}function ___syscall5(which,varargs){SYSCALLS.varargs=varargs;try{var pathname=SYSCALLS.getStr(),flags=SYSCALLS.get(),mode=SYSCALLS.get();var stream=FS.open(pathname,flags,mode);return stream.fd}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return -e.errno}}function ___syscall54(which,varargs){SYSCALLS.varargs=varargs;try{return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return -e.errno}}function ___syscall6(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD();return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return -e.errno}}function ___unlock(){}function getShiftFromSize(size){switch(size){case 1:return 0;case 2:return 1;case 4:return 2;case 8:return 3;default:throw new TypeError("Unknown type size: "+size)}}function embind_init_charCodes(){var codes=new Array(256);for(var i=0;i<256;++i){codes[i]=String.fromCharCode(i);}embind_charCodes=codes;}var embind_charCodes=undefined;function readLatin1String(ptr){var ret="";var c=ptr;while(HEAPU8[c]){ret+=embind_charCodes[HEAPU8[c++]];}return ret}var awaitingDependencies={};var registeredTypes={};var typeDependencies={};var char_0=48;var char_9=57;function makeLegalFunctionName(name){if(undefined===name){return "_unknown"}name=name.replace(/[^a-zA-Z0-9_]/g,"$");var f=name.charCodeAt(0);if(f>=char_0&&f<=char_9){return "_"+name}else{return name}}function createNamedFunction(name,body){name=makeLegalFunctionName(name);return new Function("body","return function "+name+"() {\n"+'    "use strict";'+"    return body.apply(this, arguments);\n"+"};\n")(body)}function extendError(baseErrorType,errorName){var errorClass=createNamedFunction(errorName,function(message){this.name=errorName;this.message=message;var stack=new Error(message).stack;if(stack!==undefined){this.stack=this.toString()+"\n"+stack.replace(/^Error(:[^\n]*)?\n/,"");}});errorClass.prototype=Object.create(baseErrorType.prototype);errorClass.prototype.constructor=errorClass;errorClass.prototype.toString=function(){if(this.message===undefined){return this.name}else{return this.name+": "+this.message}};return errorClass}var BindingError=undefined;function throwBindingError(message){throw new BindingError(message)}var InternalError=undefined;function throwInternalError(message){throw new InternalError(message)}function whenDependentTypesAreResolved(myTypes,dependentTypes,getTypeConverters){myTypes.forEach(function(type){typeDependencies[type]=dependentTypes;});function onComplete(typeConverters){var myTypeConverters=getTypeConverters(typeConverters);if(myTypeConverters.length!==myTypes.length){throwInternalError("Mismatched type converter count");}for(var i=0;i<myTypes.length;++i){registerType(myTypes[i],myTypeConverters[i]);}}var typeConverters=new Array(dependentTypes.length);var unregisteredTypes=[];var registered=0;dependentTypes.forEach(function(dt,i){if(registeredTypes.hasOwnProperty(dt)){typeConverters[i]=registeredTypes[dt];}else{unregisteredTypes.push(dt);if(!awaitingDependencies.hasOwnProperty(dt)){awaitingDependencies[dt]=[];}awaitingDependencies[dt].push(function(){typeConverters[i]=registeredTypes[dt];++registered;if(registered===unregisteredTypes.length){onComplete(typeConverters);}});}});if(0===unregisteredTypes.length){onComplete(typeConverters);}}function registerType(rawType,registeredInstance,options){options=options||{};if(!("argPackAdvance"in registeredInstance)){throw new TypeError("registerType registeredInstance requires argPackAdvance")}var name=registeredInstance.name;if(!rawType){throwBindingError('type "'+name+'" must have a positive integer typeid pointer');}if(registeredTypes.hasOwnProperty(rawType)){if(options.ignoreDuplicateRegistrations){return}else{throwBindingError("Cannot register type '"+name+"' twice");}}registeredTypes[rawType]=registeredInstance;delete typeDependencies[rawType];if(awaitingDependencies.hasOwnProperty(rawType)){var callbacks=awaitingDependencies[rawType];delete awaitingDependencies[rawType];callbacks.forEach(function(cb){cb();});}}function __embind_register_bool(rawType,name,size,trueValue,falseValue){var shift=getShiftFromSize(size);name=readLatin1String(name);registerType(rawType,{name:name,"fromWireType":function(wt){return !!wt},"toWireType":function(destructors,o){return o?trueValue:falseValue},"argPackAdvance":8,"readValueFromPointer":function(pointer){var heap;if(size===1){heap=HEAP8;}else if(size===2){heap=HEAP16;}else if(size===4){heap=HEAP32;}else{throw new TypeError("Unknown boolean type size: "+name)}return this["fromWireType"](heap[pointer>>shift])},destructorFunction:null});}function ClassHandle_isAliasOf(other){if(!(this instanceof ClassHandle)){return false}if(!(other instanceof ClassHandle)){return false}var leftClass=this.$$.ptrType.registeredClass;var left=this.$$.ptr;var rightClass=other.$$.ptrType.registeredClass;var right=other.$$.ptr;while(leftClass.baseClass){left=leftClass.upcast(left);leftClass=leftClass.baseClass;}while(rightClass.baseClass){right=rightClass.upcast(right);rightClass=rightClass.baseClass;}return leftClass===rightClass&&left===right}function shallowCopyInternalPointer(o){return {count:o.count,deleteScheduled:o.deleteScheduled,preservePointerOnDelete:o.preservePointerOnDelete,ptr:o.ptr,ptrType:o.ptrType,smartPtr:o.smartPtr,smartPtrType:o.smartPtrType}}function throwInstanceAlreadyDeleted(obj){function getInstanceTypeName(handle){return handle.$$.ptrType.registeredClass.name}throwBindingError(getInstanceTypeName(obj)+" instance already deleted");}function ClassHandle_clone(){if(!this.$$.ptr){throwInstanceAlreadyDeleted(this);}if(this.$$.preservePointerOnDelete){this.$$.count.value+=1;return this}else{var clone=Object.create(Object.getPrototypeOf(this),{$$:{value:shallowCopyInternalPointer(this.$$)}});clone.$$.count.value+=1;clone.$$.deleteScheduled=false;return clone}}function runDestructor(handle){var $$=handle.$$;if($$.smartPtr){$$.smartPtrType.rawDestructor($$.smartPtr);}else{$$.ptrType.registeredClass.rawDestructor($$.ptr);}}function ClassHandle_delete(){if(!this.$$.ptr){throwInstanceAlreadyDeleted(this);}if(this.$$.deleteScheduled&&!this.$$.preservePointerOnDelete){throwBindingError("Object already scheduled for deletion");}this.$$.count.value-=1;var toDelete=0===this.$$.count.value;if(toDelete){runDestructor(this);}if(!this.$$.preservePointerOnDelete){this.$$.smartPtr=undefined;this.$$.ptr=undefined;}}function ClassHandle_isDeleted(){return !this.$$.ptr}var delayFunction=undefined;var deletionQueue=[];function flushPendingDeletes(){while(deletionQueue.length){var obj=deletionQueue.pop();obj.$$.deleteScheduled=false;obj["delete"]();}}function ClassHandle_deleteLater(){if(!this.$$.ptr){throwInstanceAlreadyDeleted(this);}if(this.$$.deleteScheduled&&!this.$$.preservePointerOnDelete){throwBindingError("Object already scheduled for deletion");}deletionQueue.push(this);if(deletionQueue.length===1&&delayFunction){delayFunction(flushPendingDeletes);}this.$$.deleteScheduled=true;return this}function init_ClassHandle(){ClassHandle.prototype["isAliasOf"]=ClassHandle_isAliasOf;ClassHandle.prototype["clone"]=ClassHandle_clone;ClassHandle.prototype["delete"]=ClassHandle_delete;ClassHandle.prototype["isDeleted"]=ClassHandle_isDeleted;ClassHandle.prototype["deleteLater"]=ClassHandle_deleteLater;}function ClassHandle(){}var registeredPointers={};function ensureOverloadTable(proto,methodName,humanName){if(undefined===proto[methodName].overloadTable){var prevFunc=proto[methodName];proto[methodName]=function(){if(!proto[methodName].overloadTable.hasOwnProperty(arguments.length)){throwBindingError("Function '"+humanName+"' called with an invalid number of arguments ("+arguments.length+") - expects one of ("+proto[methodName].overloadTable+")!");}return proto[methodName].overloadTable[arguments.length].apply(this,arguments)};proto[methodName].overloadTable=[];proto[methodName].overloadTable[prevFunc.argCount]=prevFunc;}}function exposePublicSymbol(name,value,numArguments){if(Module.hasOwnProperty(name)){if(undefined===numArguments||undefined!==Module[name].overloadTable&&undefined!==Module[name].overloadTable[numArguments]){throwBindingError("Cannot register public name '"+name+"' twice");}ensureOverloadTable(Module,name,name);if(Module.hasOwnProperty(numArguments)){throwBindingError("Cannot register multiple overloads of a function with the same number of arguments ("+numArguments+")!");}Module[name].overloadTable[numArguments]=value;}else{Module[name]=value;if(undefined!==numArguments){Module[name].numArguments=numArguments;}}}function RegisteredClass(name,constructor,instancePrototype,rawDestructor,baseClass,getActualType,upcast,downcast){this.name=name;this.constructor=constructor;this.instancePrototype=instancePrototype;this.rawDestructor=rawDestructor;this.baseClass=baseClass;this.getActualType=getActualType;this.upcast=upcast;this.downcast=downcast;this.pureVirtualFunctions=[];}function upcastPointer(ptr,ptrClass,desiredClass){while(ptrClass!==desiredClass){if(!ptrClass.upcast){throwBindingError("Expected null or instance of "+desiredClass.name+", got an instance of "+ptrClass.name);}ptr=ptrClass.upcast(ptr);ptrClass=ptrClass.baseClass;}return ptr}function constNoSmartPtrRawPointerToWireType(destructors,handle){if(handle===null){if(this.isReference){throwBindingError("null is not a valid "+this.name);}return 0}if(!handle.$$){throwBindingError('Cannot pass "'+_embind_repr(handle)+'" as a '+this.name);}if(!handle.$$.ptr){throwBindingError("Cannot pass deleted object as a pointer of type "+this.name);}var handleClass=handle.$$.ptrType.registeredClass;var ptr=upcastPointer(handle.$$.ptr,handleClass,this.registeredClass);return ptr}function genericPointerToWireType(destructors,handle){var ptr;if(handle===null){if(this.isReference){throwBindingError("null is not a valid "+this.name);}if(this.isSmartPointer){ptr=this.rawConstructor();if(destructors!==null){destructors.push(this.rawDestructor,ptr);}return ptr}else{return 0}}if(!handle.$$){throwBindingError('Cannot pass "'+_embind_repr(handle)+'" as a '+this.name);}if(!handle.$$.ptr){throwBindingError("Cannot pass deleted object as a pointer of type "+this.name);}if(!this.isConst&&handle.$$.ptrType.isConst){throwBindingError("Cannot convert argument of type "+(handle.$$.smartPtrType?handle.$$.smartPtrType.name:handle.$$.ptrType.name)+" to parameter type "+this.name);}var handleClass=handle.$$.ptrType.registeredClass;ptr=upcastPointer(handle.$$.ptr,handleClass,this.registeredClass);if(this.isSmartPointer){if(undefined===handle.$$.smartPtr){throwBindingError("Passing raw pointer to smart pointer is illegal");}switch(this.sharingPolicy){case 0:if(handle.$$.smartPtrType===this){ptr=handle.$$.smartPtr;}else{throwBindingError("Cannot convert argument of type "+(handle.$$.smartPtrType?handle.$$.smartPtrType.name:handle.$$.ptrType.name)+" to parameter type "+this.name);}break;case 1:ptr=handle.$$.smartPtr;break;case 2:if(handle.$$.smartPtrType===this){ptr=handle.$$.smartPtr;}else{var clonedHandle=handle["clone"]();ptr=this.rawShare(ptr,__emval_register(function(){clonedHandle["delete"]();}));if(destructors!==null){destructors.push(this.rawDestructor,ptr);}}break;default:throwBindingError("Unsupporting sharing policy");}}return ptr}function nonConstNoSmartPtrRawPointerToWireType(destructors,handle){if(handle===null){if(this.isReference){throwBindingError("null is not a valid "+this.name);}return 0}if(!handle.$$){throwBindingError('Cannot pass "'+_embind_repr(handle)+'" as a '+this.name);}if(!handle.$$.ptr){throwBindingError("Cannot pass deleted object as a pointer of type "+this.name);}if(handle.$$.ptrType.isConst){throwBindingError("Cannot convert argument of type "+handle.$$.ptrType.name+" to parameter type "+this.name);}var handleClass=handle.$$.ptrType.registeredClass;var ptr=upcastPointer(handle.$$.ptr,handleClass,this.registeredClass);return ptr}function simpleReadValueFromPointer(pointer){return this["fromWireType"](HEAPU32[pointer>>2])}function RegisteredPointer_getPointee(ptr){if(this.rawGetPointee){ptr=this.rawGetPointee(ptr);}return ptr}function RegisteredPointer_destructor(ptr){if(this.rawDestructor){this.rawDestructor(ptr);}}function RegisteredPointer_deleteObject(handle){if(handle!==null){handle["delete"]();}}function downcastPointer(ptr,ptrClass,desiredClass){if(ptrClass===desiredClass){return ptr}if(undefined===desiredClass.baseClass){return null}var rv=downcastPointer(ptr,ptrClass,desiredClass.baseClass);if(rv===null){return null}return desiredClass.downcast(rv)}function getInheritedInstanceCount(){return Object.keys(registeredInstances).length}function getLiveInheritedInstances(){var rv=[];for(var k in registeredInstances){if(registeredInstances.hasOwnProperty(k)){rv.push(registeredInstances[k]);}}return rv}function setDelayFunction(fn){delayFunction=fn;if(deletionQueue.length&&delayFunction){delayFunction(flushPendingDeletes);}}function init_embind(){Module["getInheritedInstanceCount"]=getInheritedInstanceCount;Module["getLiveInheritedInstances"]=getLiveInheritedInstances;Module["flushPendingDeletes"]=flushPendingDeletes;Module["setDelayFunction"]=setDelayFunction;}var registeredInstances={};function getBasestPointer(class_,ptr){if(ptr===undefined){throwBindingError("ptr should not be undefined");}while(class_.baseClass){ptr=class_.upcast(ptr);class_=class_.baseClass;}return ptr}function getInheritedInstance(class_,ptr){ptr=getBasestPointer(class_,ptr);return registeredInstances[ptr]}function makeClassHandle(prototype,record){if(!record.ptrType||!record.ptr){throwInternalError("makeClassHandle requires ptr and ptrType");}var hasSmartPtrType=!!record.smartPtrType;var hasSmartPtr=!!record.smartPtr;if(hasSmartPtrType!==hasSmartPtr){throwInternalError("Both smartPtrType and smartPtr must be specified");}record.count={value:1};return Object.create(prototype,{$$:{value:record}})}function RegisteredPointer_fromWireType(ptr){var rawPointer=this.getPointee(ptr);if(!rawPointer){this.destructor(ptr);return null}var registeredInstance=getInheritedInstance(this.registeredClass,rawPointer);if(undefined!==registeredInstance){if(0===registeredInstance.$$.count.value){registeredInstance.$$.ptr=rawPointer;registeredInstance.$$.smartPtr=ptr;return registeredInstance["clone"]()}else{var rv=registeredInstance["clone"]();this.destructor(ptr);return rv}}function makeDefaultHandle(){if(this.isSmartPointer){return makeClassHandle(this.registeredClass.instancePrototype,{ptrType:this.pointeeType,ptr:rawPointer,smartPtrType:this,smartPtr:ptr})}else{return makeClassHandle(this.registeredClass.instancePrototype,{ptrType:this,ptr:ptr})}}var actualType=this.registeredClass.getActualType(rawPointer);var registeredPointerRecord=registeredPointers[actualType];if(!registeredPointerRecord){return makeDefaultHandle.call(this)}var toType;if(this.isConst){toType=registeredPointerRecord.constPointerType;}else{toType=registeredPointerRecord.pointerType;}var dp=downcastPointer(rawPointer,this.registeredClass,toType.registeredClass);if(dp===null){return makeDefaultHandle.call(this)}if(this.isSmartPointer){return makeClassHandle(toType.registeredClass.instancePrototype,{ptrType:toType,ptr:dp,smartPtrType:this,smartPtr:ptr})}else{return makeClassHandle(toType.registeredClass.instancePrototype,{ptrType:toType,ptr:dp})}}function init_RegisteredPointer(){RegisteredPointer.prototype.getPointee=RegisteredPointer_getPointee;RegisteredPointer.prototype.destructor=RegisteredPointer_destructor;RegisteredPointer.prototype["argPackAdvance"]=8;RegisteredPointer.prototype["readValueFromPointer"]=simpleReadValueFromPointer;RegisteredPointer.prototype["deleteObject"]=RegisteredPointer_deleteObject;RegisteredPointer.prototype["fromWireType"]=RegisteredPointer_fromWireType;}function RegisteredPointer(name,registeredClass,isReference,isConst,isSmartPointer,pointeeType,sharingPolicy,rawGetPointee,rawConstructor,rawShare,rawDestructor){this.name=name;this.registeredClass=registeredClass;this.isReference=isReference;this.isConst=isConst;this.isSmartPointer=isSmartPointer;this.pointeeType=pointeeType;this.sharingPolicy=sharingPolicy;this.rawGetPointee=rawGetPointee;this.rawConstructor=rawConstructor;this.rawShare=rawShare;this.rawDestructor=rawDestructor;if(!isSmartPointer&&registeredClass.baseClass===undefined){if(isConst){this["toWireType"]=constNoSmartPtrRawPointerToWireType;this.destructorFunction=null;}else{this["toWireType"]=nonConstNoSmartPtrRawPointerToWireType;this.destructorFunction=null;}}else{this["toWireType"]=genericPointerToWireType;}}function replacePublicSymbol(name,value,numArguments){if(!Module.hasOwnProperty(name)){throwInternalError("Replacing nonexistant public symbol");}if(undefined!==Module[name].overloadTable&&undefined!==numArguments){Module[name].overloadTable[numArguments]=value;}else{Module[name]=value;Module[name].argCount=numArguments;}}function embind__requireFunction(signature,rawFunction){signature=readLatin1String(signature);function makeDynCaller(dynCall){var args=[];for(var i=1;i<signature.length;++i){args.push("a"+i);}var name="dynCall_"+signature+"_"+rawFunction;var body="return function "+name+"("+args.join(", ")+") {\n";body+="    return dynCall(rawFunction"+(args.length?", ":"")+args.join(", ")+");\n";body+="};\n";return new Function("dynCall","rawFunction",body)(dynCall,rawFunction)}var fp;if(Module["FUNCTION_TABLE_"+signature]!==undefined){fp=Module["FUNCTION_TABLE_"+signature][rawFunction];}else if(typeof FUNCTION_TABLE!=="undefined"){fp=FUNCTION_TABLE[rawFunction];}else{var dc=Module["dynCall_"+signature];if(dc===undefined){dc=Module["dynCall_"+signature.replace(/f/g,"d")];if(dc===undefined){throwBindingError("No dynCall invoker for signature: "+signature);}}fp=makeDynCaller(dc);}if(typeof fp!=="function"){throwBindingError("unknown function pointer with signature "+signature+": "+rawFunction);}return fp}var UnboundTypeError=undefined;function getTypeName(type){var ptr=___getTypeName(type);var rv=readLatin1String(ptr);_free(ptr);return rv}function throwUnboundTypeError(message,types){var unboundTypes=[];var seen={};function visit(type){if(seen[type]){return}if(registeredTypes[type]){return}if(typeDependencies[type]){typeDependencies[type].forEach(visit);return}unboundTypes.push(type);seen[type]=true;}types.forEach(visit);throw new UnboundTypeError(message+": "+unboundTypes.map(getTypeName).join([", "]))}function __embind_register_class(rawType,rawPointerType,rawConstPointerType,baseClassRawType,getActualTypeSignature,getActualType,upcastSignature,upcast,downcastSignature,downcast,name,destructorSignature,rawDestructor){name=readLatin1String(name);getActualType=embind__requireFunction(getActualTypeSignature,getActualType);if(upcast){upcast=embind__requireFunction(upcastSignature,upcast);}if(downcast){downcast=embind__requireFunction(downcastSignature,downcast);}rawDestructor=embind__requireFunction(destructorSignature,rawDestructor);var legalFunctionName=makeLegalFunctionName(name);exposePublicSymbol(legalFunctionName,function(){throwUnboundTypeError("Cannot construct "+name+" due to unbound types",[baseClassRawType]);});whenDependentTypesAreResolved([rawType,rawPointerType,rawConstPointerType],baseClassRawType?[baseClassRawType]:[],function(base){base=base[0];var baseClass;var basePrototype;if(baseClassRawType){baseClass=base.registeredClass;basePrototype=baseClass.instancePrototype;}else{basePrototype=ClassHandle.prototype;}var constructor=createNamedFunction(legalFunctionName,function(){if(Object.getPrototypeOf(this)!==instancePrototype){throw new BindingError("Use 'new' to construct "+name)}if(undefined===registeredClass.constructor_body){throw new BindingError(name+" has no accessible constructor")}var body=registeredClass.constructor_body[arguments.length];if(undefined===body){throw new BindingError("Tried to invoke ctor of "+name+" with invalid number of parameters ("+arguments.length+") - expected ("+Object.keys(registeredClass.constructor_body).toString()+") parameters instead!")}return body.apply(this,arguments)});var instancePrototype=Object.create(basePrototype,{constructor:{value:constructor}});constructor.prototype=instancePrototype;var registeredClass=new RegisteredClass(name,constructor,instancePrototype,rawDestructor,baseClass,getActualType,upcast,downcast);var referenceConverter=new RegisteredPointer(name,registeredClass,true,false,false);var pointerConverter=new RegisteredPointer(name+"*",registeredClass,false,false,false);var constPointerConverter=new RegisteredPointer(name+" const*",registeredClass,false,true,false);registeredPointers[rawType]={pointerType:pointerConverter,constPointerType:constPointerConverter};replacePublicSymbol(legalFunctionName,constructor);return [referenceConverter,pointerConverter,constPointerConverter]});}function heap32VectorToArray(count,firstElement){var array=[];for(var i=0;i<count;i++){array.push(HEAP32[(firstElement>>2)+i]);}return array}function runDestructors(destructors){while(destructors.length){var ptr=destructors.pop();var del=destructors.pop();del(ptr);}}function __embind_register_class_constructor(rawClassType,argCount,rawArgTypesAddr,invokerSignature,invoker,rawConstructor){var rawArgTypes=heap32VectorToArray(argCount,rawArgTypesAddr);invoker=embind__requireFunction(invokerSignature,invoker);whenDependentTypesAreResolved([],[rawClassType],function(classType){classType=classType[0];var humanName="constructor "+classType.name;if(undefined===classType.registeredClass.constructor_body){classType.registeredClass.constructor_body=[];}if(undefined!==classType.registeredClass.constructor_body[argCount-1]){throw new BindingError("Cannot register multiple constructors with identical number of parameters ("+(argCount-1)+") for class '"+classType.name+"'! Overload resolution is currently only performed using the parameter count, not actual type info!")}classType.registeredClass.constructor_body[argCount-1]=function unboundTypeHandler(){throwUnboundTypeError("Cannot construct "+classType.name+" due to unbound types",rawArgTypes);};whenDependentTypesAreResolved([],rawArgTypes,function(argTypes){classType.registeredClass.constructor_body[argCount-1]=function constructor_body(){if(arguments.length!==argCount-1){throwBindingError(humanName+" called with "+arguments.length+" arguments, expected "+(argCount-1));}var destructors=[];var args=new Array(argCount);args[0]=rawConstructor;for(var i=1;i<argCount;++i){args[i]=argTypes[i]["toWireType"](destructors,arguments[i-1]);}var ptr=invoker.apply(null,args);runDestructors(destructors);return argTypes[0]["fromWireType"](ptr)};return []});return []});}function new_(constructor,argumentList){if(!(constructor instanceof Function)){throw new TypeError("new_ called with constructor type "+typeof constructor+" which is not a function")}var dummy=createNamedFunction(constructor.name||"unknownFunctionName",function(){});dummy.prototype=constructor.prototype;var obj=new dummy;var r=constructor.apply(obj,argumentList);return r instanceof Object?r:obj}function craftInvokerFunction(humanName,argTypes,classType,cppInvokerFunc,cppTargetFunc){var argCount=argTypes.length;if(argCount<2){throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!");}var isClassMethodFunc=argTypes[1]!==null&&classType!==null;var needsDestructorStack=false;for(var i=1;i<argTypes.length;++i){if(argTypes[i]!==null&&argTypes[i].destructorFunction===undefined){needsDestructorStack=true;break}}var returns=argTypes[0].name!=="void";var argsList="";var argsListWired="";for(var i=0;i<argCount-2;++i){argsList+=(i!==0?", ":"")+"arg"+i;argsListWired+=(i!==0?", ":"")+"arg"+i+"Wired";}var invokerFnBody="return function "+makeLegalFunctionName(humanName)+"("+argsList+") {\n"+"if (arguments.length !== "+(argCount-2)+") {\n"+"throwBindingError('function "+humanName+" called with ' + arguments.length + ' arguments, expected "+(argCount-2)+" args!');\n"+"}\n";if(needsDestructorStack){invokerFnBody+="var destructors = [];\n";}var dtorStack=needsDestructorStack?"destructors":"null";var args1=["throwBindingError","invoker","fn","runDestructors","retType","classParam"];var args2=[throwBindingError,cppInvokerFunc,cppTargetFunc,runDestructors,argTypes[0],argTypes[1]];if(isClassMethodFunc){invokerFnBody+="var thisWired = classParam.toWireType("+dtorStack+", this);\n";}for(var i=0;i<argCount-2;++i){invokerFnBody+="var arg"+i+"Wired = argType"+i+".toWireType("+dtorStack+", arg"+i+"); // "+argTypes[i+2].name+"\n";args1.push("argType"+i);args2.push(argTypes[i+2]);}if(isClassMethodFunc){argsListWired="thisWired"+(argsListWired.length>0?", ":"")+argsListWired;}invokerFnBody+=(returns?"var rv = ":"")+"invoker(fn"+(argsListWired.length>0?", ":"")+argsListWired+");\n";if(needsDestructorStack){invokerFnBody+="runDestructors(destructors);\n";}else{for(var i=isClassMethodFunc?1:2;i<argTypes.length;++i){var paramName=i===1?"thisWired":"arg"+(i-2)+"Wired";if(argTypes[i].destructorFunction!==null){invokerFnBody+=paramName+"_dtor("+paramName+"); // "+argTypes[i].name+"\n";args1.push(paramName+"_dtor");args2.push(argTypes[i].destructorFunction);}}}if(returns){invokerFnBody+="var ret = retType.fromWireType(rv);\n"+"return ret;\n";}invokerFnBody+="}\n";args1.push(invokerFnBody);var invokerFunction=new_(Function,args1).apply(null,args2);return invokerFunction}function __embind_register_class_function(rawClassType,methodName,argCount,rawArgTypesAddr,invokerSignature,rawInvoker,context,isPureVirtual){var rawArgTypes=heap32VectorToArray(argCount,rawArgTypesAddr);methodName=readLatin1String(methodName);rawInvoker=embind__requireFunction(invokerSignature,rawInvoker);whenDependentTypesAreResolved([],[rawClassType],function(classType){classType=classType[0];var humanName=classType.name+"."+methodName;if(isPureVirtual){classType.registeredClass.pureVirtualFunctions.push(methodName);}function unboundTypesHandler(){throwUnboundTypeError("Cannot call "+humanName+" due to unbound types",rawArgTypes);}var proto=classType.registeredClass.instancePrototype;var method=proto[methodName];if(undefined===method||undefined===method.overloadTable&&method.className!==classType.name&&method.argCount===argCount-2){unboundTypesHandler.argCount=argCount-2;unboundTypesHandler.className=classType.name;proto[methodName]=unboundTypesHandler;}else{ensureOverloadTable(proto,methodName,humanName);proto[methodName].overloadTable[argCount-2]=unboundTypesHandler;}whenDependentTypesAreResolved([],rawArgTypes,function(argTypes){var memberFunction=craftInvokerFunction(humanName,argTypes,classType,rawInvoker,context);if(undefined===proto[methodName].overloadTable){memberFunction.argCount=argCount-2;proto[methodName]=memberFunction;}else{proto[methodName].overloadTable[argCount-2]=memberFunction;}return []});return []});}function validateThis(this_,classType,humanName){if(!(this_ instanceof Object)){throwBindingError(humanName+' with invalid "this": '+this_);}if(!(this_ instanceof classType.registeredClass.constructor)){throwBindingError(humanName+' incompatible with "this" of type '+this_.constructor.name);}if(!this_.$$.ptr){throwBindingError("cannot call emscripten binding method "+humanName+" on deleted object");}return upcastPointer(this_.$$.ptr,this_.$$.ptrType.registeredClass,classType.registeredClass)}function __embind_register_class_property(classType,fieldName,getterReturnType,getterSignature,getter,getterContext,setterArgumentType,setterSignature,setter,setterContext){fieldName=readLatin1String(fieldName);getter=embind__requireFunction(getterSignature,getter);whenDependentTypesAreResolved([],[classType],function(classType){classType=classType[0];var humanName=classType.name+"."+fieldName;var desc={get:function(){throwUnboundTypeError("Cannot access "+humanName+" due to unbound types",[getterReturnType,setterArgumentType]);},enumerable:true,configurable:true};if(setter){desc.set=function(){throwUnboundTypeError("Cannot access "+humanName+" due to unbound types",[getterReturnType,setterArgumentType]);};}else{desc.set=function(v){throwBindingError(humanName+" is a read-only property");};}Object.defineProperty(classType.registeredClass.instancePrototype,fieldName,desc);whenDependentTypesAreResolved([],setter?[getterReturnType,setterArgumentType]:[getterReturnType],function(types){var getterReturnType=types[0];var desc={get:function(){var ptr=validateThis(this,classType,humanName+" getter");return getterReturnType["fromWireType"](getter(getterContext,ptr))},enumerable:true};if(setter){setter=embind__requireFunction(setterSignature,setter);var setterArgumentType=types[1];desc.set=function(v){var ptr=validateThis(this,classType,humanName+" setter");var destructors=[];setter(setterContext,ptr,setterArgumentType["toWireType"](destructors,v));runDestructors(destructors);};}Object.defineProperty(classType.registeredClass.instancePrototype,fieldName,desc);return []});return []});}function __embind_register_constant(name,type,value){name=readLatin1String(name);whenDependentTypesAreResolved([],[type],function(type){type=type[0];Module[name]=type["fromWireType"](value);return []});}var emval_free_list=[];var emval_handle_array=[{},{value:undefined},{value:null},{value:true},{value:false}];function __emval_decref(handle){if(handle>4&&0===--emval_handle_array[handle].refcount){emval_handle_array[handle]=undefined;emval_free_list.push(handle);}}function count_emval_handles(){var count=0;for(var i=5;i<emval_handle_array.length;++i){if(emval_handle_array[i]!==undefined){++count;}}return count}function get_first_emval(){for(var i=5;i<emval_handle_array.length;++i){if(emval_handle_array[i]!==undefined){return emval_handle_array[i]}}return null}function init_emval(){Module["count_emval_handles"]=count_emval_handles;Module["get_first_emval"]=get_first_emval;}function __emval_register(value){switch(value){case undefined:{return 1}case null:{return 2}case true:{return 3}case false:{return 4}default:{var handle=emval_free_list.length?emval_free_list.pop():emval_handle_array.length;emval_handle_array[handle]={refcount:1,value:value};return handle}}}function __embind_register_emval(rawType,name){name=readLatin1String(name);registerType(rawType,{name:name,"fromWireType":function(handle){var rv=emval_handle_array[handle].value;__emval_decref(handle);return rv},"toWireType":function(destructors,value){return __emval_register(value)},"argPackAdvance":8,"readValueFromPointer":simpleReadValueFromPointer,destructorFunction:null});}function _embind_repr(v){if(v===null){return "null"}var t=typeof v;if(t==="object"||t==="array"||t==="function"){return v.toString()}else{return ""+v}}function floatReadValueFromPointer(name,shift){switch(shift){case 2:return function(pointer){return this["fromWireType"](HEAPF32[pointer>>2])};case 3:return function(pointer){return this["fromWireType"](HEAPF64[pointer>>3])};default:throw new TypeError("Unknown float type: "+name)}}function __embind_register_float(rawType,name,size){var shift=getShiftFromSize(size);name=readLatin1String(name);registerType(rawType,{name:name,"fromWireType":function(value){return value},"toWireType":function(destructors,value){if(typeof value!=="number"&&typeof value!=="boolean"){throw new TypeError('Cannot convert "'+_embind_repr(value)+'" to '+this.name)}return value},"argPackAdvance":8,"readValueFromPointer":floatReadValueFromPointer(name,shift),destructorFunction:null});}function __embind_register_function(name,argCount,rawArgTypesAddr,signature,rawInvoker,fn){var argTypes=heap32VectorToArray(argCount,rawArgTypesAddr);name=readLatin1String(name);rawInvoker=embind__requireFunction(signature,rawInvoker);exposePublicSymbol(name,function(){throwUnboundTypeError("Cannot call "+name+" due to unbound types",argTypes);},argCount-1);whenDependentTypesAreResolved([],argTypes,function(argTypes){var invokerArgsArray=[argTypes[0],null].concat(argTypes.slice(1));replacePublicSymbol(name,craftInvokerFunction(name,invokerArgsArray,null,rawInvoker,fn),argCount-1);return []});}function integerReadValueFromPointer(name,shift,signed){switch(shift){case 0:return signed?function readS8FromPointer(pointer){return HEAP8[pointer]}:function readU8FromPointer(pointer){return HEAPU8[pointer]};case 1:return signed?function readS16FromPointer(pointer){return HEAP16[pointer>>1]}:function readU16FromPointer(pointer){return HEAPU16[pointer>>1]};case 2:return signed?function readS32FromPointer(pointer){return HEAP32[pointer>>2]}:function readU32FromPointer(pointer){return HEAPU32[pointer>>2]};default:throw new TypeError("Unknown integer type: "+name)}}function __embind_register_integer(primitiveType,name,size,minRange,maxRange){name=readLatin1String(name);if(maxRange===-1){maxRange=4294967295;}var shift=getShiftFromSize(size);var fromWireType=function(value){return value};if(minRange===0){var bitshift=32-8*size;fromWireType=function(value){return value<<bitshift>>>bitshift};}var isUnsignedType=name.indexOf("unsigned")!=-1;registerType(primitiveType,{name:name,"fromWireType":fromWireType,"toWireType":function(destructors,value){if(typeof value!=="number"&&typeof value!=="boolean"){throw new TypeError('Cannot convert "'+_embind_repr(value)+'" to '+this.name)}if(value<minRange||value>maxRange){throw new TypeError('Passing a number "'+_embind_repr(value)+'" from JS side to C/C++ side to an argument of type "'+name+'", which is outside the valid range ['+minRange+", "+maxRange+"]!")}return isUnsignedType?value>>>0:value|0},"argPackAdvance":8,"readValueFromPointer":integerReadValueFromPointer(name,shift,minRange!==0),destructorFunction:null});}function __embind_register_memory_view(rawType,dataTypeIndex,name){var typeMapping=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array];var TA=typeMapping[dataTypeIndex];function decodeMemoryView(handle){handle=handle>>2;var heap=HEAPU32;var size=heap[handle];var data=heap[handle+1];return new TA(heap["buffer"],data,size)}name=readLatin1String(name);registerType(rawType,{name:name,"fromWireType":decodeMemoryView,"argPackAdvance":8,"readValueFromPointer":decodeMemoryView},{ignoreDuplicateRegistrations:true});}function __embind_register_std_string(rawType,name){name=readLatin1String(name);var stdStringIsUTF8=name==="std::string";registerType(rawType,{name:name,"fromWireType":function(value){var length=HEAPU32[value>>2];var str;if(stdStringIsUTF8){var endChar=HEAPU8[value+4+length];var endCharSwap=0;if(endChar!=0){endCharSwap=endChar;HEAPU8[value+4+length]=0;}var decodeStartPtr=value+4;for(var i=0;i<=length;++i){var currentBytePtr=value+4+i;if(HEAPU8[currentBytePtr]==0){var stringSegment=UTF8ToString(decodeStartPtr);if(str===undefined)str=stringSegment;else{str+=String.fromCharCode(0);str+=stringSegment;}decodeStartPtr=currentBytePtr+1;}}if(endCharSwap!=0)HEAPU8[value+4+length]=endCharSwap;}else{var a=new Array(length);for(var i=0;i<length;++i){a[i]=String.fromCharCode(HEAPU8[value+4+i]);}str=a.join("");}_free(value);return str},"toWireType":function(destructors,value){if(value instanceof ArrayBuffer){value=new Uint8Array(value);}var getLength;var valueIsOfTypeString=typeof value==="string";if(!(valueIsOfTypeString||value instanceof Uint8Array||value instanceof Uint8ClampedArray||value instanceof Int8Array)){throwBindingError("Cannot pass non-string to std::string");}if(stdStringIsUTF8&&valueIsOfTypeString){getLength=function(){return lengthBytesUTF8(value)};}else{getLength=function(){return value.length};}var length=getLength();var ptr=_malloc(4+length+1);HEAPU32[ptr>>2]=length;if(stdStringIsUTF8&&valueIsOfTypeString){stringToUTF8(value,ptr+4,length+1);}else{if(valueIsOfTypeString){for(var i=0;i<length;++i){var charCode=value.charCodeAt(i);if(charCode>255){_free(ptr);throwBindingError("String has UTF-16 code units that do not fit in 8 bits");}HEAPU8[ptr+4+i]=charCode;}}else{for(var i=0;i<length;++i){HEAPU8[ptr+4+i]=value[i];}}}if(destructors!==null){destructors.push(_free,ptr);}return ptr},"argPackAdvance":8,"readValueFromPointer":simpleReadValueFromPointer,destructorFunction:function(ptr){_free(ptr);}});}function __embind_register_std_wstring(rawType,charSize,name){name=readLatin1String(name);var getHeap,shift;if(charSize===2){getHeap=function(){return HEAPU16};shift=1;}else if(charSize===4){getHeap=function(){return HEAPU32};shift=2;}registerType(rawType,{name:name,"fromWireType":function(value){var HEAP=getHeap();var length=HEAPU32[value>>2];var a=new Array(length);var start=value+4>>shift;for(var i=0;i<length;++i){a[i]=String.fromCharCode(HEAP[start+i]);}_free(value);return a.join("")},"toWireType":function(destructors,value){var HEAP=getHeap();var length=value.length;var ptr=_malloc(4+length*charSize);HEAPU32[ptr>>2]=length;var start=ptr+4>>shift;for(var i=0;i<length;++i){HEAP[start+i]=value.charCodeAt(i);}if(destructors!==null){destructors.push(_free,ptr);}return ptr},"argPackAdvance":8,"readValueFromPointer":simpleReadValueFromPointer,destructorFunction:function(ptr){_free(ptr);}});}function __embind_register_void(rawType,name){name=readLatin1String(name);registerType(rawType,{isVoid:true,name:name,"argPackAdvance":0,"fromWireType":function(){return undefined},"toWireType":function(destructors,o){return undefined}});}function requireHandle(handle){if(!handle){throwBindingError("Cannot use deleted val. handle = "+handle);}return emval_handle_array[handle].value}function requireRegisteredType(rawType,humanName){var impl=registeredTypes[rawType];if(undefined===impl){throwBindingError(humanName+" has unknown type "+getTypeName(rawType));}return impl}function __emval_as(handle,returnType,destructorsRef){handle=requireHandle(handle);returnType=requireRegisteredType(returnType,"emval::as");var destructors=[];var rd=__emval_register(destructors);HEAP32[destructorsRef>>2]=rd;return returnType["toWireType"](destructors,handle)}function __emval_lookupTypes(argCount,argTypes,argWireTypes){var a=new Array(argCount);for(var i=0;i<argCount;++i){a[i]=requireRegisteredType(HEAP32[(argTypes>>2)+i],"parameter "+i);}return a}function __emval_call(handle,argCount,argTypes,argv){handle=requireHandle(handle);var types=__emval_lookupTypes(argCount,argTypes);var args=new Array(argCount);for(var i=0;i<argCount;++i){var type=types[i];args[i]=type["readValueFromPointer"](argv);argv+=type["argPackAdvance"];}var rv=handle.apply(undefined,args);return __emval_register(rv)}var emval_symbols={};function getStringOrSymbol(address){var symbol=emval_symbols[address];if(symbol===undefined){return readLatin1String(address)}else{return symbol}}var emval_methodCallers=[];function __emval_call_void_method(caller,handle,methodName,args){caller=emval_methodCallers[caller];handle=requireHandle(handle);methodName=getStringOrSymbol(methodName);caller(handle,methodName,null,args);}function __emval_addMethodCaller(caller){var id=emval_methodCallers.length;emval_methodCallers.push(caller);return id}function __emval_get_method_caller(argCount,argTypes){var types=__emval_lookupTypes(argCount,argTypes);var retType=types[0];var signatureName=retType.name+"_$"+types.slice(1).map(function(t){return t.name}).join("_")+"$";var params=["retType"];var args=[retType];var argsList="";for(var i=0;i<argCount-1;++i){argsList+=(i!==0?", ":"")+"arg"+i;params.push("argType"+i);args.push(types[1+i]);}var functionName=makeLegalFunctionName("methodCaller_"+signatureName);var functionBody="return function "+functionName+"(handle, name, destructors, args) {\n";var offset=0;for(var i=0;i<argCount-1;++i){functionBody+="    var arg"+i+" = argType"+i+".readValueFromPointer(args"+(offset?"+"+offset:"")+");\n";offset+=types[i+1]["argPackAdvance"];}functionBody+="    var rv = handle[name]("+argsList+");\n";for(var i=0;i<argCount-1;++i){if(types[i+1]["deleteObject"]){functionBody+="    argType"+i+".deleteObject(arg"+i+");\n";}}if(!retType.isVoid){functionBody+="    return retType.toWireType(destructors, rv);\n";}functionBody+="};\n";params.push(functionBody);var invokerFunction=new_(Function,params).apply(null,args);return __emval_addMethodCaller(invokerFunction)}function __emval_get_property(handle,key){handle=requireHandle(handle);key=requireHandle(key);return __emval_register(handle[key])}function __emval_incref(handle){if(handle>4){emval_handle_array[handle].refcount+=1;}}function __emval_new_array(){return __emval_register([])}function __emval_new_cstring(v){return __emval_register(getStringOrSymbol(v))}function __emval_new_object(){return __emval_register({})}function __emval_run_destructors(handle){var destructors=emval_handle_array[handle].value;runDestructors(destructors);__emval_decref(handle);}function __emval_set_property(handle,key,value){handle=requireHandle(handle);key=requireHandle(key);value=requireHandle(value);handle[key]=value;}function __emval_strictly_equals(first,second){first=requireHandle(first);second=requireHandle(second);return first===second}function __emval_take_value(type,argv){type=requireRegisteredType(type,"_emval_take_value");var v=type["readValueFromPointer"](argv);return __emval_register(v)}function __emval_typeof(handle){handle=requireHandle(handle);return __emval_register(typeof handle)}function _abort(){Module["abort"]();}function _emscripten_get_heap_size(){return HEAP8.length}function _emscripten_memcpy_big(dest,src,num){HEAPU8.set(HEAPU8.subarray(src,src+num),dest);}function abortOnCannotGrowMemory(requestedSize){abort("OOM");}function _emscripten_resize_heap(requestedSize){abortOnCannotGrowMemory();}embind_init_charCodes();BindingError=Module["BindingError"]=extendError(Error,"BindingError");InternalError=Module["InternalError"]=extendError(Error,"InternalError");init_ClassHandle();init_RegisteredPointer();init_embind();UnboundTypeError=Module["UnboundTypeError"]=extendError(Error,"UnboundTypeError");init_emval();function intArrayToString(array){var ret=[];for(var i=0;i<array.length;i++){var chr=array[i];if(chr>255){chr&=255;}ret.push(String.fromCharCode(chr));}return ret.join("")}var decodeBase64=typeof atob==="function"?atob:function(input){var keyStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var output="";var chr1,chr2,chr3;var enc1,enc2,enc3,enc4;var i=0;input=input.replace(/[^A-Za-z0-9\+\/\=]/g,"");do{enc1=keyStr.indexOf(input.charAt(i++));enc2=keyStr.indexOf(input.charAt(i++));enc3=keyStr.indexOf(input.charAt(i++));enc4=keyStr.indexOf(input.charAt(i++));chr1=enc1<<2|enc2>>4;chr2=(enc2&15)<<4|enc3>>2;chr3=(enc3&3)<<6|enc4;output=output+String.fromCharCode(chr1);if(enc3!==64){output=output+String.fromCharCode(chr2);}if(enc4!==64){output=output+String.fromCharCode(chr3);}}while(i<input.length);return output};function intArrayFromBase64(s){if(typeof ENVIRONMENT_IS_NODE==="boolean"&&ENVIRONMENT_IS_NODE){var buf;try{buf=Buffer.from(s,"base64");}catch(_){buf=new Buffer(s,"base64");}return new Uint8Array(buf.buffer,buf.byteOffset,buf.byteLength)}try{var decoded=decodeBase64(s);var bytes=new Uint8Array(decoded.length);for(var i=0;i<decoded.length;++i){bytes[i]=decoded.charCodeAt(i);}return bytes}catch(_){throw new Error("Converting base64 string to bytes failed.")}}function tryParseAsDataURI(filename){if(!isDataURI(filename)){return}return intArrayFromBase64(filename.slice(dataURIPrefix.length))}var asmGlobalArg={};var asmLibraryArg={"e":abort,"G":setTempRet0,"v":___cxa_allocate_exception,"t":___cxa_throw,"R":___lock,"x":___setErrNo,"F":___syscall140,"E":___syscall145,"w":___syscall146,"p":___syscall221,"D":___syscall5,"C":___syscall54,"B":___syscall6,"u":___unlock,"W":__embind_register_bool,"h":__embind_register_class,"q":__embind_register_class_constructor,"c":__embind_register_class_function,"b":__embind_register_class_property,"A":__embind_register_constant,"V":__embind_register_emval,"z":__embind_register_float,"d":__embind_register_function,"m":__embind_register_integer,"i":__embind_register_memory_view,"y":__embind_register_std_string,"U":__embind_register_std_wstring,"T":__embind_register_void,"g":__emval_as,"S":__emval_call,"l":__emval_call_void_method,"s":__emval_decref,"k":__emval_get_method_caller,"j":__emval_get_property,"r":__emval_incref,"Q":__emval_new_array,"P":__emval_new_cstring,"O":__emval_new_object,"N":__emval_run_destructors,"o":__emval_set_property,"M":__emval_strictly_equals,"f":__emval_take_value,"L":__emval_typeof,"n":_abort,"K":_emscripten_get_heap_size,"J":_emscripten_memcpy_big,"I":_emscripten_resize_heap,"H":abortOnCannotGrowMemory,"a":DYNAMICTOP_PTR};var asm=Module["asm"](asmGlobalArg,asmLibraryArg,buffer);Module["asm"]=asm;var ___getTypeName=Module["___getTypeName"]=function(){return Module["asm"]["X"].apply(null,arguments)};var _free=Module["_free"]=function(){return Module["asm"]["Y"].apply(null,arguments)};var _malloc=Module["_malloc"]=function(){return Module["asm"]["Z"].apply(null,arguments)};var globalCtors=Module["globalCtors"]=function(){return Module["asm"]["yb"].apply(null,arguments)};var dynCall_d=Module["dynCall_d"]=function(){return Module["asm"]["_"].apply(null,arguments)};var dynCall_di=Module["dynCall_di"]=function(){return Module["asm"]["$"].apply(null,arguments)};var dynCall_f=Module["dynCall_f"]=function(){return Module["asm"]["aa"].apply(null,arguments)};var dynCall_fi=Module["dynCall_fi"]=function(){return Module["asm"]["ba"].apply(null,arguments)};var dynCall_fii=Module["dynCall_fii"]=function(){return Module["asm"]["ca"].apply(null,arguments)};var dynCall_fiii=Module["dynCall_fiii"]=function(){return Module["asm"]["da"].apply(null,arguments)};var dynCall_i=Module["dynCall_i"]=function(){return Module["asm"]["ea"].apply(null,arguments)};var dynCall_ii=Module["dynCall_ii"]=function(){return Module["asm"]["fa"].apply(null,arguments)};var dynCall_iidiiii=Module["dynCall_iidiiii"]=function(){return Module["asm"]["ga"].apply(null,arguments)};var dynCall_iif=Module["dynCall_iif"]=function(){return Module["asm"]["ha"].apply(null,arguments)};var dynCall_iiff=Module["dynCall_iiff"]=function(){return Module["asm"]["ia"].apply(null,arguments)};var dynCall_iifif=Module["dynCall_iifif"]=function(){return Module["asm"]["ja"].apply(null,arguments)};var dynCall_iii=Module["dynCall_iii"]=function(){return Module["asm"]["ka"].apply(null,arguments)};var dynCall_iiiddii=Module["dynCall_iiiddii"]=function(){return Module["asm"]["la"].apply(null,arguments)};var dynCall_iiif=Module["dynCall_iiif"]=function(){return Module["asm"]["ma"].apply(null,arguments)};var dynCall_iiiff=Module["dynCall_iiiff"]=function(){return Module["asm"]["na"].apply(null,arguments)};var dynCall_iiifffiii=Module["dynCall_iiifffiii"]=function(){return Module["asm"]["oa"].apply(null,arguments)};var dynCall_iiifi=Module["dynCall_iiifi"]=function(){return Module["asm"]["pa"].apply(null,arguments)};var dynCall_iiifif=Module["dynCall_iiifif"]=function(){return Module["asm"]["qa"].apply(null,arguments)};var dynCall_iiii=Module["dynCall_iiii"]=function(){return Module["asm"]["ra"].apply(null,arguments)};var dynCall_iiiiddii=Module["dynCall_iiiiddii"]=function(){return Module["asm"]["sa"].apply(null,arguments)};var dynCall_iiiif=Module["dynCall_iiiif"]=function(){return Module["asm"]["ta"].apply(null,arguments)};var dynCall_iiiifi=Module["dynCall_iiiifi"]=function(){return Module["asm"]["ua"].apply(null,arguments)};var dynCall_iiiifii=Module["dynCall_iiiifii"]=function(){return Module["asm"]["va"].apply(null,arguments)};var dynCall_iiiii=Module["dynCall_iiiii"]=function(){return Module["asm"]["wa"].apply(null,arguments)};var dynCall_iiiiii=Module["dynCall_iiiiii"]=function(){return Module["asm"]["xa"].apply(null,arguments)};var dynCall_iiiiiii=Module["dynCall_iiiiiii"]=function(){return Module["asm"]["ya"].apply(null,arguments)};var dynCall_iiiiiiii=Module["dynCall_iiiiiiii"]=function(){return Module["asm"]["za"].apply(null,arguments)};var dynCall_iiiiiiiii=Module["dynCall_iiiiiiiii"]=function(){return Module["asm"]["Aa"].apply(null,arguments)};var dynCall_iiiiiiiiii=Module["dynCall_iiiiiiiiii"]=function(){return Module["asm"]["Ba"].apply(null,arguments)};var dynCall_iiiiiiiiiii=Module["dynCall_iiiiiiiiiii"]=function(){return Module["asm"]["Ca"].apply(null,arguments)};var dynCall_jiji=Module["dynCall_jiji"]=function(){return Module["asm"]["Da"].apply(null,arguments)};var dynCall_v=Module["dynCall_v"]=function(){return Module["asm"]["Ea"].apply(null,arguments)};var dynCall_vf=Module["dynCall_vf"]=function(){return Module["asm"]["Fa"].apply(null,arguments)};var dynCall_vff=Module["dynCall_vff"]=function(){return Module["asm"]["Ga"].apply(null,arguments)};var dynCall_vfffiii=Module["dynCall_vfffiii"]=function(){return Module["asm"]["Ha"].apply(null,arguments)};var dynCall_vfii=Module["dynCall_vfii"]=function(){return Module["asm"]["Ia"].apply(null,arguments)};var dynCall_vi=Module["dynCall_vi"]=function(){return Module["asm"]["Ja"].apply(null,arguments)};var dynCall_vif=Module["dynCall_vif"]=function(){return Module["asm"]["Ka"].apply(null,arguments)};var dynCall_viff=Module["dynCall_viff"]=function(){return Module["asm"]["La"].apply(null,arguments)};var dynCall_vifffiii=Module["dynCall_vifffiii"]=function(){return Module["asm"]["Ma"].apply(null,arguments)};var dynCall_vifi=Module["dynCall_vifi"]=function(){return Module["asm"]["Na"].apply(null,arguments)};var dynCall_vifii=Module["dynCall_vifii"]=function(){return Module["asm"]["Oa"].apply(null,arguments)};var dynCall_vii=Module["dynCall_vii"]=function(){return Module["asm"]["Pa"].apply(null,arguments)};var dynCall_viif=Module["dynCall_viif"]=function(){return Module["asm"]["Qa"].apply(null,arguments)};var dynCall_viifffi=Module["dynCall_viifffi"]=function(){return Module["asm"]["Ra"].apply(null,arguments)};var dynCall_viifffiii=Module["dynCall_viifffiii"]=function(){return Module["asm"]["Sa"].apply(null,arguments)};var dynCall_viifi=Module["dynCall_viifi"]=function(){return Module["asm"]["Ta"].apply(null,arguments)};var dynCall_viifii=Module["dynCall_viifii"]=function(){return Module["asm"]["Ua"].apply(null,arguments)};var dynCall_viifiif=Module["dynCall_viifiif"]=function(){return Module["asm"]["Va"].apply(null,arguments)};var dynCall_viifiii=Module["dynCall_viifiii"]=function(){return Module["asm"]["Wa"].apply(null,arguments)};var dynCall_viifiiifi=Module["dynCall_viifiiifi"]=function(){return Module["asm"]["Xa"].apply(null,arguments)};var dynCall_viii=Module["dynCall_viii"]=function(){return Module["asm"]["Ya"].apply(null,arguments)};var dynCall_viiif=Module["dynCall_viiif"]=function(){return Module["asm"]["Za"].apply(null,arguments)};var dynCall_viiifffi=Module["dynCall_viiifffi"]=function(){return Module["asm"]["_a"].apply(null,arguments)};var dynCall_viiifi=Module["dynCall_viiifi"]=function(){return Module["asm"]["$a"].apply(null,arguments)};var dynCall_viiifii=Module["dynCall_viiifii"]=function(){return Module["asm"]["ab"].apply(null,arguments)};var dynCall_viiifiif=Module["dynCall_viiifiif"]=function(){return Module["asm"]["bb"].apply(null,arguments)};var dynCall_viiifiii=Module["dynCall_viiifiii"]=function(){return Module["asm"]["cb"].apply(null,arguments)};var dynCall_viiifiiifi=Module["dynCall_viiifiiifi"]=function(){return Module["asm"]["db"].apply(null,arguments)};var dynCall_viiii=Module["dynCall_viiii"]=function(){return Module["asm"]["eb"].apply(null,arguments)};var dynCall_viiiif=Module["dynCall_viiiif"]=function(){return Module["asm"]["fb"].apply(null,arguments)};var dynCall_viiiifi=Module["dynCall_viiiifi"]=function(){return Module["asm"]["gb"].apply(null,arguments)};var dynCall_viiiifif=Module["dynCall_viiiifif"]=function(){return Module["asm"]["hb"].apply(null,arguments)};var dynCall_viiiii=Module["dynCall_viiiii"]=function(){return Module["asm"]["ib"].apply(null,arguments)};var dynCall_viiiiif=Module["dynCall_viiiiif"]=function(){return Module["asm"]["jb"].apply(null,arguments)};var dynCall_viiiiifi=Module["dynCall_viiiiifi"]=function(){return Module["asm"]["kb"].apply(null,arguments)};var dynCall_viiiiifif=Module["dynCall_viiiiifif"]=function(){return Module["asm"]["lb"].apply(null,arguments)};var dynCall_viiiiii=Module["dynCall_viiiiii"]=function(){return Module["asm"]["mb"].apply(null,arguments)};var dynCall_viiiiiif=Module["dynCall_viiiiiif"]=function(){return Module["asm"]["nb"].apply(null,arguments)};var dynCall_viiiiiifi=Module["dynCall_viiiiiifi"]=function(){return Module["asm"]["ob"].apply(null,arguments)};var dynCall_viiiiiii=Module["dynCall_viiiiiii"]=function(){return Module["asm"]["pb"].apply(null,arguments)};var dynCall_viiiiiiif=Module["dynCall_viiiiiiif"]=function(){return Module["asm"]["qb"].apply(null,arguments)};var dynCall_viiiiiiifi=Module["dynCall_viiiiiiifi"]=function(){return Module["asm"]["rb"].apply(null,arguments)};var dynCall_viiiiiiii=Module["dynCall_viiiiiiii"]=function(){return Module["asm"]["sb"].apply(null,arguments)};var dynCall_viiiiiiiifi=Module["dynCall_viiiiiiiifi"]=function(){return Module["asm"]["tb"].apply(null,arguments)};var dynCall_viiiiiiiii=Module["dynCall_viiiiiiiii"]=function(){return Module["asm"]["ub"].apply(null,arguments)};var dynCall_viiiiiiiiii=Module["dynCall_viiiiiiiiii"]=function(){return Module["asm"]["vb"].apply(null,arguments)};var dynCall_viiiiiiiiiii=Module["dynCall_viiiiiiiiiii"]=function(){return Module["asm"]["wb"].apply(null,arguments)};var dynCall_viiiiiiiiiiii=Module["dynCall_viiiiiiiiiiii"]=function(){return Module["asm"]["xb"].apply(null,arguments)};Module["asm"]=asm;Module["then"]=function(func){if(Module["calledRun"]){func(Module);}else{var old=Module["onRuntimeInitialized"];Module["onRuntimeInitialized"]=function(){if(old)old();func(Module);};}return Module};function ExitStatus(status){this.name="ExitStatus";this.message="Program terminated with exit("+status+")";this.status=status;}ExitStatus.prototype=new Error;ExitStatus.prototype.constructor=ExitStatus;dependenciesFulfilled=function runCaller(){if(!Module["calledRun"])run();if(!Module["calledRun"])dependenciesFulfilled=runCaller;};function run(args){args=args||Module["arguments"];if(runDependencies>0){return}preRun();if(runDependencies>0)return;if(Module["calledRun"])return;function doRun(){if(Module["calledRun"])return;Module["calledRun"]=true;if(ABORT)return;ensureInitRuntime();preMain();if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();postRun();}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout(function(){setTimeout(function(){Module["setStatus"]("");},1);doRun();},1);}else{doRun();}}Module["run"]=run;function abort(what){if(Module["onAbort"]){Module["onAbort"](what);}if(what!==undefined){out(what);err(what);what=JSON.stringify(what);}else{what="";}ABORT=true;throw"abort("+what+"). Build with -s ASSERTIONS=1 for more info."}Module["abort"]=abort;if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()();}}Module["noExitRuntime"]=true;run();


      return Module
    }
    );
    })();
    module.exports = Module;
    });
    var bindImgui_1 = bindImgui.bind;

    var bindImgui$1 = /*#__PURE__*/Object.freeze({
        'default': bindImgui,
        __moduleExports: bindImgui,
        bind: bindImgui_1
    });

    //-----------------------------------------------------------------------------
    //---- Implement STB libraries in a namespace to avoid linkage conflicts (defaults to global namespace)
    //#define IMGUI_STB_NAMESPACE     ImGuiStb
    //---- Define constructor and implicit cast operators to convert back<>forth from your math types and ImVec2/ImVec4.
    // This will be inlined as part of ImVec2 and ImVec4 class declarations.
    /*
    #define IM_VEC2_CLASS_EXTRA                                                 \
            ImVec2(const MyVec2& f) { x = f.x; y = f.y; }                       \
            operator MyVec2() const { return MyVec2(x,y); }

    #define IM_VEC4_CLASS_EXTRA                                                 \
            ImVec4(const MyVec4& f) { x = f.x; y = f.y; z = f.z; w = f.w; }     \
            operator MyVec4() const { return MyVec4(x,y,z,w); }
    */
    //---- Use 32-bit vertex indices (instead of default 16-bit) to allow meshes with more than 64K vertices. Render function needs to support it.
    //#define ImDrawIdx unsigned int
    //---- Tip: You can add extra functions within the ImGui:: namespace, here or in your own headers files.
    /*
    namespace ImGui
    {
        void MyFunction(const char* name, const MyMatrix44& v);
    }
    */

    function imgui (value) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                bindImgui(value).then((value) => {
                    exports.bind = value;
                    resolve();
                });
            });
        });
    }
    function import_Scalar(sca) {
        if (Array.isArray(sca)) {
            return [sca[0]];
        }
        if (typeof sca === "function") {
            return [sca()];
        }
        return [sca.x];
    }
    function export_Scalar(tuple, sca) {
        if (Array.isArray(sca)) {
            sca[0] = tuple[0];
            return;
        }
        if (typeof sca === "function") {
            sca(tuple[0]);
            return;
        }
        sca.x = tuple[0];
    }
    function import_Vector2(vec) {
        if (Array.isArray(vec)) {
            return [vec[0], vec[1]];
        }
        return [vec.x, vec.y];
    }
    function export_Vector2(tuple, vec) {
        if (Array.isArray(vec)) {
            vec[0] = tuple[0];
            vec[1] = tuple[1];
            return;
        }
        vec.x = tuple[0];
        vec.y = tuple[1];
    }
    function import_Vector3(vec) {
        if (Array.isArray(vec)) {
            return [vec[0], vec[1], vec[2]];
        }
        return [vec.x, vec.y, vec.z];
    }
    function export_Vector3(tuple, vec) {
        if (Array.isArray(vec)) {
            vec[0] = tuple[0];
            vec[1] = tuple[1];
            vec[2] = tuple[2];
            return;
        }
        vec.x = tuple[0];
        vec.y = tuple[1];
        vec.z = tuple[2];
    }
    function import_Vector4(vec) {
        if (Array.isArray(vec)) {
            return [vec[0], vec[1], vec[2], vec[3] || 0];
        }
        return [vec.x, vec.y, vec.z, vec.w];
    }
    function export_Vector4(tuple, vec) {
        if (Array.isArray(vec)) {
            vec[0] = tuple[0];
            vec[1] = tuple[1];
            vec[2] = tuple[2];
            vec[3] = tuple[3];
            return;
        }
        vec.x = tuple[0];
        vec.y = tuple[1];
        vec.z = tuple[2];
        vec.w = tuple[3];
    }
    function import_Color3(col) {
        if (Array.isArray(col)) {
            return [col[0], col[1], col[2]];
        }
        if ("r" in col) {
            return [col.r, col.g, col.b];
        }
        return [col.x, col.y, col.z];
    }
    function export_Color3(tuple, col) {
        if (Array.isArray(col)) {
            col[0] = tuple[0];
            col[1] = tuple[1];
            col[2] = tuple[2];
            return;
        }
        if ("r" in col) {
            col.r = tuple[0];
            col.g = tuple[1];
            col.b = tuple[2];
            return;
        }
        col.x = tuple[0];
        col.y = tuple[1];
        col.z = tuple[2];
    }
    function import_Color4(col) {
        if (Array.isArray(col)) {
            return [col[0], col[1], col[2], col[3]];
        }
        if ("r" in col) {
            return [col.r, col.g, col.b, col.a];
        }
        return [col.x, col.y, col.z, col.w];
    }
    function export_Color4(tuple, col) {
        if (Array.isArray(col)) {
            col[0] = tuple[0];
            col[1] = tuple[1];
            col[2] = tuple[2];
            return;
        }
        if ("r" in col) {
            col.r = tuple[0];
            col.g = tuple[1];
            col.b = tuple[2];
            return;
        }
        col.x = tuple[0];
        col.y = tuple[1];
        col.z = tuple[2];
    }
    const IMGUI_VERSION = "1.71"; // bind.IMGUI_VERSION;
    const IMGUI_VERSION_NUM = 17100; // bind.IMGUI_VERSION_NUM;
    // #define IMGUI_CHECKVERSION()        ImGui::DebugCheckVersionAndDataLayout(IMGUI_VERSION, sizeof(ImGuiIO), sizeof(ImGuiStyle), sizeof(ImVec2), sizeof(ImVec4), sizeof(ImDrawVert))
    function IMGUI_CHECKVERSION() { return DebugCheckVersionAndDataLayout(IMGUI_VERSION, exports.bind.ImGuiIOSize, exports.bind.ImGuiStyleSize, exports.bind.ImVec2Size, exports.bind.ImVec4Size, exports.bind.ImDrawVertSize, exports.bind.ImDrawIdxSize); }
    function IM_ASSERT(_EXPR) { if (!_EXPR) {
        throw new Error();
    } }
    function IM_ARRAYSIZE(_ARR) {
        if (_ARR instanceof ImStringBuffer) {
            return _ARR.size;
        }
        else {
            return _ARR.length;
        }
    }
    class ImStringBuffer {
        constructor(size, buffer = "") {
            this.size = size;
            this.buffer = buffer;
        }
    }
    (function (ImGuiWindowFlags) {
        ImGuiWindowFlags[ImGuiWindowFlags["None"] = 0] = "None";
        ImGuiWindowFlags[ImGuiWindowFlags["NoTitleBar"] = 1] = "NoTitleBar";
        ImGuiWindowFlags[ImGuiWindowFlags["NoResize"] = 2] = "NoResize";
        ImGuiWindowFlags[ImGuiWindowFlags["NoMove"] = 4] = "NoMove";
        ImGuiWindowFlags[ImGuiWindowFlags["NoScrollbar"] = 8] = "NoScrollbar";
        ImGuiWindowFlags[ImGuiWindowFlags["NoScrollWithMouse"] = 16] = "NoScrollWithMouse";
        ImGuiWindowFlags[ImGuiWindowFlags["NoCollapse"] = 32] = "NoCollapse";
        ImGuiWindowFlags[ImGuiWindowFlags["AlwaysAutoResize"] = 64] = "AlwaysAutoResize";
        ImGuiWindowFlags[ImGuiWindowFlags["NoBackground"] = 128] = "NoBackground";
        ImGuiWindowFlags[ImGuiWindowFlags["NoSavedSettings"] = 256] = "NoSavedSettings";
        ImGuiWindowFlags[ImGuiWindowFlags["NoMouseInputs"] = 512] = "NoMouseInputs";
        ImGuiWindowFlags[ImGuiWindowFlags["MenuBar"] = 1024] = "MenuBar";
        ImGuiWindowFlags[ImGuiWindowFlags["HorizontalScrollbar"] = 2048] = "HorizontalScrollbar";
        ImGuiWindowFlags[ImGuiWindowFlags["NoFocusOnAppearing"] = 4096] = "NoFocusOnAppearing";
        ImGuiWindowFlags[ImGuiWindowFlags["NoBringToFrontOnFocus"] = 8192] = "NoBringToFrontOnFocus";
        ImGuiWindowFlags[ImGuiWindowFlags["AlwaysVerticalScrollbar"] = 16384] = "AlwaysVerticalScrollbar";
        ImGuiWindowFlags[ImGuiWindowFlags["AlwaysHorizontalScrollbar"] = 32768] = "AlwaysHorizontalScrollbar";
        ImGuiWindowFlags[ImGuiWindowFlags["AlwaysUseWindowPadding"] = 65536] = "AlwaysUseWindowPadding";
        ImGuiWindowFlags[ImGuiWindowFlags["NoNavInputs"] = 262144] = "NoNavInputs";
        ImGuiWindowFlags[ImGuiWindowFlags["NoNavFocus"] = 524288] = "NoNavFocus";
        ImGuiWindowFlags[ImGuiWindowFlags["UnsavedDocument"] = 1048576] = "UnsavedDocument";
        ImGuiWindowFlags[ImGuiWindowFlags["NoNav"] = 786432] = "NoNav";
        ImGuiWindowFlags[ImGuiWindowFlags["NoDecoration"] = 43] = "NoDecoration";
        ImGuiWindowFlags[ImGuiWindowFlags["NoInputs"] = 786944] = "NoInputs";
        // [Internal]
        ImGuiWindowFlags[ImGuiWindowFlags["NavFlattened"] = 8388608] = "NavFlattened";
        ImGuiWindowFlags[ImGuiWindowFlags["ChildWindow"] = 16777216] = "ChildWindow";
        ImGuiWindowFlags[ImGuiWindowFlags["Tooltip"] = 33554432] = "Tooltip";
        ImGuiWindowFlags[ImGuiWindowFlags["Popup"] = 67108864] = "Popup";
        ImGuiWindowFlags[ImGuiWindowFlags["Modal"] = 134217728] = "Modal";
        ImGuiWindowFlags[ImGuiWindowFlags["ChildMenu"] = 268435456] = "ChildMenu";
    })(exports.WindowFlags || (exports.WindowFlags = {}));
    (function (ImGuiInputTextFlags) {
        ImGuiInputTextFlags[ImGuiInputTextFlags["None"] = 0] = "None";
        ImGuiInputTextFlags[ImGuiInputTextFlags["CharsDecimal"] = 1] = "CharsDecimal";
        ImGuiInputTextFlags[ImGuiInputTextFlags["CharsHexadecimal"] = 2] = "CharsHexadecimal";
        ImGuiInputTextFlags[ImGuiInputTextFlags["CharsUppercase"] = 4] = "CharsUppercase";
        ImGuiInputTextFlags[ImGuiInputTextFlags["CharsNoBlank"] = 8] = "CharsNoBlank";
        ImGuiInputTextFlags[ImGuiInputTextFlags["AutoSelectAll"] = 16] = "AutoSelectAll";
        ImGuiInputTextFlags[ImGuiInputTextFlags["EnterReturnsTrue"] = 32] = "EnterReturnsTrue";
        ImGuiInputTextFlags[ImGuiInputTextFlags["CallbackCompletion"] = 64] = "CallbackCompletion";
        ImGuiInputTextFlags[ImGuiInputTextFlags["CallbackHistory"] = 128] = "CallbackHistory";
        ImGuiInputTextFlags[ImGuiInputTextFlags["CallbackAlways"] = 256] = "CallbackAlways";
        ImGuiInputTextFlags[ImGuiInputTextFlags["CallbackCharFilter"] = 512] = "CallbackCharFilter";
        ImGuiInputTextFlags[ImGuiInputTextFlags["AllowTabInput"] = 1024] = "AllowTabInput";
        ImGuiInputTextFlags[ImGuiInputTextFlags["CtrlEnterForNewLine"] = 2048] = "CtrlEnterForNewLine";
        ImGuiInputTextFlags[ImGuiInputTextFlags["NoHorizontalScroll"] = 4096] = "NoHorizontalScroll";
        ImGuiInputTextFlags[ImGuiInputTextFlags["AlwaysInsertMode"] = 8192] = "AlwaysInsertMode";
        ImGuiInputTextFlags[ImGuiInputTextFlags["ReadOnly"] = 16384] = "ReadOnly";
        ImGuiInputTextFlags[ImGuiInputTextFlags["Password"] = 32768] = "Password";
        ImGuiInputTextFlags[ImGuiInputTextFlags["NoUndoRedo"] = 65536] = "NoUndoRedo";
        ImGuiInputTextFlags[ImGuiInputTextFlags["CharsScientific"] = 131072] = "CharsScientific";
        ImGuiInputTextFlags[ImGuiInputTextFlags["CallbackResize"] = 262144] = "CallbackResize";
        // [Internal]
        ImGuiInputTextFlags[ImGuiInputTextFlags["Multiline"] = 1048576] = "Multiline";
        ImGuiInputTextFlags[ImGuiInputTextFlags["NoMarkEdited"] = 2097152] = "NoMarkEdited";
    })(exports.InputTextFlags || (exports.InputTextFlags = {}));
    (function (ImGuiTreeNodeFlags) {
        ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["None"] = 0] = "None";
        ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["Selected"] = 1] = "Selected";
        ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["Framed"] = 2] = "Framed";
        ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["AllowItemOverlap"] = 4] = "AllowItemOverlap";
        ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["NoTreePushOnOpen"] = 8] = "NoTreePushOnOpen";
        ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["NoAutoOpenOnLog"] = 16] = "NoAutoOpenOnLog";
        ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["DefaultOpen"] = 32] = "DefaultOpen";
        ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["OpenOnDoubleClick"] = 64] = "OpenOnDoubleClick";
        ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["OpenOnArrow"] = 128] = "OpenOnArrow";
        ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["Leaf"] = 256] = "Leaf";
        ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["Bullet"] = 512] = "Bullet";
        ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["FramePadding"] = 1024] = "FramePadding";
        //SpanAllAvailWidth  = 1 << 11,  // FIXME: TODO: Extend hit box horizontally even if not framed
        //NoScrollOnOpen     = 1 << 12,  // FIXME: TODO: Disable automatic scroll on TreePop() if node got just open and contents is not visible
        ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["NavLeftJumpsBackHere"] = 8192] = "NavLeftJumpsBackHere";
        ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["CollapsingHeader"] = 26] = "CollapsingHeader";
    })(exports.TreeNodeFlags || (exports.TreeNodeFlags = {}));
    (function (ImGuiSelectableFlags) {
        ImGuiSelectableFlags[ImGuiSelectableFlags["None"] = 0] = "None";
        ImGuiSelectableFlags[ImGuiSelectableFlags["DontClosePopups"] = 1] = "DontClosePopups";
        ImGuiSelectableFlags[ImGuiSelectableFlags["SpanAllColumns"] = 2] = "SpanAllColumns";
        ImGuiSelectableFlags[ImGuiSelectableFlags["AllowDoubleClick"] = 4] = "AllowDoubleClick";
        ImGuiSelectableFlags[ImGuiSelectableFlags["Disabled"] = 8] = "Disabled"; // Cannot be selected, display greyed out text
    })(exports.SelectableFlags || (exports.SelectableFlags = {}));
    (function (ImGuiComboFlags) {
        ImGuiComboFlags[ImGuiComboFlags["None"] = 0] = "None";
        ImGuiComboFlags[ImGuiComboFlags["PopupAlignLeft"] = 1] = "PopupAlignLeft";
        ImGuiComboFlags[ImGuiComboFlags["HeightSmall"] = 2] = "HeightSmall";
        ImGuiComboFlags[ImGuiComboFlags["HeightRegular"] = 4] = "HeightRegular";
        ImGuiComboFlags[ImGuiComboFlags["HeightLarge"] = 8] = "HeightLarge";
        ImGuiComboFlags[ImGuiComboFlags["HeightLargest"] = 16] = "HeightLargest";
        ImGuiComboFlags[ImGuiComboFlags["NoArrowButton"] = 32] = "NoArrowButton";
        ImGuiComboFlags[ImGuiComboFlags["NoPreview"] = 64] = "NoPreview";
        ImGuiComboFlags[ImGuiComboFlags["HeightMask_"] = 30] = "HeightMask_";
    })(exports.ImGuiComboFlags || (exports.ImGuiComboFlags = {}));
    (function (ImGuiTabBarFlags) {
        ImGuiTabBarFlags[ImGuiTabBarFlags["None"] = 0] = "None";
        ImGuiTabBarFlags[ImGuiTabBarFlags["Reorderable"] = 1] = "Reorderable";
        ImGuiTabBarFlags[ImGuiTabBarFlags["AutoSelectNewTabs"] = 2] = "AutoSelectNewTabs";
        ImGuiTabBarFlags[ImGuiTabBarFlags["TabListPopupButton"] = 4] = "TabListPopupButton";
        ImGuiTabBarFlags[ImGuiTabBarFlags["NoCloseWithMiddleMouseButton"] = 8] = "NoCloseWithMiddleMouseButton";
        ImGuiTabBarFlags[ImGuiTabBarFlags["NoTabListScrollingButtons"] = 16] = "NoTabListScrollingButtons";
        ImGuiTabBarFlags[ImGuiTabBarFlags["NoTooltip"] = 32] = "NoTooltip";
        ImGuiTabBarFlags[ImGuiTabBarFlags["FittingPolicyResizeDown"] = 64] = "FittingPolicyResizeDown";
        ImGuiTabBarFlags[ImGuiTabBarFlags["FittingPolicyScroll"] = 128] = "FittingPolicyScroll";
        ImGuiTabBarFlags[ImGuiTabBarFlags["FittingPolicyMask_"] = 192] = "FittingPolicyMask_";
        ImGuiTabBarFlags[ImGuiTabBarFlags["FittingPolicyDefault_"] = 64] = "FittingPolicyDefault_";
    })(exports.TabBarFlags || (exports.TabBarFlags = {}));
    (function (ImGuiTabItemFlags) {
        ImGuiTabItemFlags[ImGuiTabItemFlags["ImGuiTabItemFlags_None"] = 0] = "ImGuiTabItemFlags_None";
        ImGuiTabItemFlags[ImGuiTabItemFlags["ImGuiTabItemFlags_UnsavedDocument"] = 1] = "ImGuiTabItemFlags_UnsavedDocument";
        ImGuiTabItemFlags[ImGuiTabItemFlags["ImGuiTabItemFlags_SetSelected"] = 2] = "ImGuiTabItemFlags_SetSelected";
        ImGuiTabItemFlags[ImGuiTabItemFlags["ImGuiTabItemFlags_NoCloseWithMiddleMouseButton"] = 4] = "ImGuiTabItemFlags_NoCloseWithMiddleMouseButton";
        ImGuiTabItemFlags[ImGuiTabItemFlags["ImGuiTabItemFlags_NoPushId"] = 8] = "ImGuiTabItemFlags_NoPushId"; // Don't call PushID(tab->ID)/PopID() on BeginTabItem()/EndTabItem()
    })(exports.TabItemFlags || (exports.TabItemFlags = {}));
    (function (ImGuiFocusedFlags) {
        ImGuiFocusedFlags[ImGuiFocusedFlags["None"] = 0] = "None";
        ImGuiFocusedFlags[ImGuiFocusedFlags["ChildWindows"] = 1] = "ChildWindows";
        ImGuiFocusedFlags[ImGuiFocusedFlags["RootWindow"] = 2] = "RootWindow";
        ImGuiFocusedFlags[ImGuiFocusedFlags["AnyWindow"] = 4] = "AnyWindow";
        ImGuiFocusedFlags[ImGuiFocusedFlags["RootAndChildWindows"] = 3] = "RootAndChildWindows";
    })(exports.ImGuiFocusedFlags || (exports.ImGuiFocusedFlags = {}));
    (function (ImGuiHoveredFlags) {
        ImGuiHoveredFlags[ImGuiHoveredFlags["None"] = 0] = "None";
        ImGuiHoveredFlags[ImGuiHoveredFlags["ChildWindows"] = 1] = "ChildWindows";
        ImGuiHoveredFlags[ImGuiHoveredFlags["RootWindow"] = 2] = "RootWindow";
        ImGuiHoveredFlags[ImGuiHoveredFlags["AnyWindow"] = 4] = "AnyWindow";
        ImGuiHoveredFlags[ImGuiHoveredFlags["AllowWhenBlockedByPopup"] = 8] = "AllowWhenBlockedByPopup";
        //AllowWhenBlockedByModal     = 1 << 4,   // Return true even if a modal popup window is normally blocking access to this item/window. FIXME-TODO: Unavailable yet.
        ImGuiHoveredFlags[ImGuiHoveredFlags["AllowWhenBlockedByActiveItem"] = 32] = "AllowWhenBlockedByActiveItem";
        ImGuiHoveredFlags[ImGuiHoveredFlags["AllowWhenOverlapped"] = 64] = "AllowWhenOverlapped";
        ImGuiHoveredFlags[ImGuiHoveredFlags["AllowWhenDisabled"] = 128] = "AllowWhenDisabled";
        ImGuiHoveredFlags[ImGuiHoveredFlags["RectOnly"] = 104] = "RectOnly";
        ImGuiHoveredFlags[ImGuiHoveredFlags["RootAndChildWindows"] = 3] = "RootAndChildWindows";
    })(exports.ImGuiHoveredFlags || (exports.ImGuiHoveredFlags = {}));
    (function (ImGuiDragDropFlags) {
        // BeginDragDropSource() flags
        ImGuiDragDropFlags[ImGuiDragDropFlags["None"] = 0] = "None";
        ImGuiDragDropFlags[ImGuiDragDropFlags["SourceNoPreviewTooltip"] = 1] = "SourceNoPreviewTooltip";
        ImGuiDragDropFlags[ImGuiDragDropFlags["SourceNoDisableHover"] = 2] = "SourceNoDisableHover";
        ImGuiDragDropFlags[ImGuiDragDropFlags["SourceNoHoldToOpenOthers"] = 4] = "SourceNoHoldToOpenOthers";
        ImGuiDragDropFlags[ImGuiDragDropFlags["SourceAllowNullID"] = 8] = "SourceAllowNullID";
        ImGuiDragDropFlags[ImGuiDragDropFlags["SourceExtern"] = 16] = "SourceExtern";
        ImGuiDragDropFlags[ImGuiDragDropFlags["SourceAutoExpirePayload"] = 32] = "SourceAutoExpirePayload";
        // AcceptDragDropPayload() flags
        ImGuiDragDropFlags[ImGuiDragDropFlags["AcceptBeforeDelivery"] = 1024] = "AcceptBeforeDelivery";
        ImGuiDragDropFlags[ImGuiDragDropFlags["AcceptNoDrawDefaultRect"] = 2048] = "AcceptNoDrawDefaultRect";
        ImGuiDragDropFlags[ImGuiDragDropFlags["AcceptNoPreviewTooltip"] = 4096] = "AcceptNoPreviewTooltip";
        ImGuiDragDropFlags[ImGuiDragDropFlags["AcceptPeekOnly"] = 3072] = "AcceptPeekOnly";
    })(exports.ImGuiDragDropFlags || (exports.ImGuiDragDropFlags = {}));
    // Standard Drag and Drop payload types. You can define you own payload types using 12-characters long strings. Types starting with '_' are defined by Dear ImGui.
    const IMGUI_PAYLOAD_TYPE_COLOR_3F = "_COL3F"; // float[3]     // Standard type for colors, without alpha. User code may use this type.
    const IMGUI_PAYLOAD_TYPE_COLOR_4F = "_COL4F"; // float[4]     // Standard type for colors. User code may use this type.
    (function (ImGuiDataType) {
        ImGuiDataType[ImGuiDataType["S8"] = 0] = "S8";
        ImGuiDataType[ImGuiDataType["U8"] = 1] = "U8";
        ImGuiDataType[ImGuiDataType["S16"] = 2] = "S16";
        ImGuiDataType[ImGuiDataType["U16"] = 3] = "U16";
        ImGuiDataType[ImGuiDataType["S32"] = 4] = "S32";
        ImGuiDataType[ImGuiDataType["U32"] = 5] = "U32";
        ImGuiDataType[ImGuiDataType["S64"] = 6] = "S64";
        ImGuiDataType[ImGuiDataType["U64"] = 7] = "U64";
        ImGuiDataType[ImGuiDataType["Float"] = 8] = "Float";
        ImGuiDataType[ImGuiDataType["Double"] = 9] = "Double";
        ImGuiDataType[ImGuiDataType["COUNT"] = 10] = "COUNT";
    })(exports.ImGuiDataType || (exports.ImGuiDataType = {}));
    (function (ImGuiDir) {
        ImGuiDir[ImGuiDir["None"] = -1] = "None";
        ImGuiDir[ImGuiDir["Left"] = 0] = "Left";
        ImGuiDir[ImGuiDir["Right"] = 1] = "Right";
        ImGuiDir[ImGuiDir["Up"] = 2] = "Up";
        ImGuiDir[ImGuiDir["Down"] = 3] = "Down";
        ImGuiDir[ImGuiDir["COUNT"] = 4] = "COUNT";
    })(exports.ImGuiDir || (exports.ImGuiDir = {}));
    (function (ImGuiKey) {
        ImGuiKey[ImGuiKey["Tab"] = 0] = "Tab";
        ImGuiKey[ImGuiKey["LeftArrow"] = 1] = "LeftArrow";
        ImGuiKey[ImGuiKey["RightArrow"] = 2] = "RightArrow";
        ImGuiKey[ImGuiKey["UpArrow"] = 3] = "UpArrow";
        ImGuiKey[ImGuiKey["DownArrow"] = 4] = "DownArrow";
        ImGuiKey[ImGuiKey["PageUp"] = 5] = "PageUp";
        ImGuiKey[ImGuiKey["PageDown"] = 6] = "PageDown";
        ImGuiKey[ImGuiKey["Home"] = 7] = "Home";
        ImGuiKey[ImGuiKey["End"] = 8] = "End";
        ImGuiKey[ImGuiKey["Insert"] = 9] = "Insert";
        ImGuiKey[ImGuiKey["Delete"] = 10] = "Delete";
        ImGuiKey[ImGuiKey["Backspace"] = 11] = "Backspace";
        ImGuiKey[ImGuiKey["Space"] = 12] = "Space";
        ImGuiKey[ImGuiKey["Enter"] = 13] = "Enter";
        ImGuiKey[ImGuiKey["Escape"] = 14] = "Escape";
        ImGuiKey[ImGuiKey["A"] = 15] = "A";
        ImGuiKey[ImGuiKey["C"] = 16] = "C";
        ImGuiKey[ImGuiKey["V"] = 17] = "V";
        ImGuiKey[ImGuiKey["X"] = 18] = "X";
        ImGuiKey[ImGuiKey["Y"] = 19] = "Y";
        ImGuiKey[ImGuiKey["Z"] = 20] = "Z";
        ImGuiKey[ImGuiKey["COUNT"] = 21] = "COUNT";
    })(exports.Key || (exports.Key = {}));
    (function (ImGuiNavInput) {
        // Gamepad Mapping
        ImGuiNavInput[ImGuiNavInput["Activate"] = 0] = "Activate";
        ImGuiNavInput[ImGuiNavInput["Cancel"] = 1] = "Cancel";
        ImGuiNavInput[ImGuiNavInput["Input"] = 2] = "Input";
        ImGuiNavInput[ImGuiNavInput["Menu"] = 3] = "Menu";
        ImGuiNavInput[ImGuiNavInput["DpadLeft"] = 4] = "DpadLeft";
        ImGuiNavInput[ImGuiNavInput["DpadRight"] = 5] = "DpadRight";
        ImGuiNavInput[ImGuiNavInput["DpadUp"] = 6] = "DpadUp";
        ImGuiNavInput[ImGuiNavInput["DpadDown"] = 7] = "DpadDown";
        ImGuiNavInput[ImGuiNavInput["LStickLeft"] = 8] = "LStickLeft";
        ImGuiNavInput[ImGuiNavInput["LStickRight"] = 9] = "LStickRight";
        ImGuiNavInput[ImGuiNavInput["LStickUp"] = 10] = "LStickUp";
        ImGuiNavInput[ImGuiNavInput["LStickDown"] = 11] = "LStickDown";
        ImGuiNavInput[ImGuiNavInput["FocusPrev"] = 12] = "FocusPrev";
        ImGuiNavInput[ImGuiNavInput["FocusNext"] = 13] = "FocusNext";
        ImGuiNavInput[ImGuiNavInput["TweakSlow"] = 14] = "TweakSlow";
        ImGuiNavInput[ImGuiNavInput["TweakFast"] = 15] = "TweakFast";
        // [Internal] Don't use directly! This is used internally to differentiate keyboard from gamepad inputs for behaviors that require to differentiate them.
        // Keyboard behavior that have no corresponding gamepad mapping (e.g. CTRL+TAB) may be directly reading from io.KeyDown[] instead of io.NavInputs[].
        ImGuiNavInput[ImGuiNavInput["KeyMenu_"] = 16] = "KeyMenu_";
        ImGuiNavInput[ImGuiNavInput["KeyTab_"] = 17] = "KeyTab_";
        ImGuiNavInput[ImGuiNavInput["KeyLeft_"] = 18] = "KeyLeft_";
        ImGuiNavInput[ImGuiNavInput["KeyRight_"] = 19] = "KeyRight_";
        ImGuiNavInput[ImGuiNavInput["KeyUp_"] = 20] = "KeyUp_";
        ImGuiNavInput[ImGuiNavInput["KeyDown_"] = 21] = "KeyDown_";
        ImGuiNavInput[ImGuiNavInput["COUNT"] = 22] = "COUNT";
        ImGuiNavInput[ImGuiNavInput["InternalStart_"] = 16] = "InternalStart_";
    })(exports.NavInput || (exports.NavInput = {}));
    (function (ImGuiConfigFlags) {
        ImGuiConfigFlags[ImGuiConfigFlags["None"] = 0] = "None";
        ImGuiConfigFlags[ImGuiConfigFlags["NavEnableKeyboard"] = 1] = "NavEnableKeyboard";
        ImGuiConfigFlags[ImGuiConfigFlags["NavEnableGamepad"] = 2] = "NavEnableGamepad";
        ImGuiConfigFlags[ImGuiConfigFlags["NavEnableSetMousePos"] = 4] = "NavEnableSetMousePos";
        ImGuiConfigFlags[ImGuiConfigFlags["NavNoCaptureKeyboard"] = 8] = "NavNoCaptureKeyboard";
        ImGuiConfigFlags[ImGuiConfigFlags["NoMouse"] = 16] = "NoMouse";
        ImGuiConfigFlags[ImGuiConfigFlags["NoMouseCursorChange"] = 32] = "NoMouseCursorChange";
        ImGuiConfigFlags[ImGuiConfigFlags["IsSRGB"] = 1048576] = "IsSRGB";
        ImGuiConfigFlags[ImGuiConfigFlags["IsTouchScreen"] = 2097152] = "IsTouchScreen"; // Application is using a touch screen instead of a mouse.
    })(exports.ImGuiConfigFlags || (exports.ImGuiConfigFlags = {}));
    (function (ImGuiCol) {
        ImGuiCol[ImGuiCol["Text"] = 0] = "Text";
        ImGuiCol[ImGuiCol["TextDisabled"] = 1] = "TextDisabled";
        ImGuiCol[ImGuiCol["WindowBg"] = 2] = "WindowBg";
        ImGuiCol[ImGuiCol["ChildBg"] = 3] = "ChildBg";
        ImGuiCol[ImGuiCol["PopupBg"] = 4] = "PopupBg";
        ImGuiCol[ImGuiCol["Border"] = 5] = "Border";
        ImGuiCol[ImGuiCol["BorderShadow"] = 6] = "BorderShadow";
        ImGuiCol[ImGuiCol["FrameBg"] = 7] = "FrameBg";
        ImGuiCol[ImGuiCol["FrameBgHovered"] = 8] = "FrameBgHovered";
        ImGuiCol[ImGuiCol["FrameBgActive"] = 9] = "FrameBgActive";
        ImGuiCol[ImGuiCol["TitleBg"] = 10] = "TitleBg";
        ImGuiCol[ImGuiCol["TitleBgActive"] = 11] = "TitleBgActive";
        ImGuiCol[ImGuiCol["TitleBgCollapsed"] = 12] = "TitleBgCollapsed";
        ImGuiCol[ImGuiCol["MenuBarBg"] = 13] = "MenuBarBg";
        ImGuiCol[ImGuiCol["ScrollbarBg"] = 14] = "ScrollbarBg";
        ImGuiCol[ImGuiCol["ScrollbarGrab"] = 15] = "ScrollbarGrab";
        ImGuiCol[ImGuiCol["ScrollbarGrabHovered"] = 16] = "ScrollbarGrabHovered";
        ImGuiCol[ImGuiCol["ScrollbarGrabActive"] = 17] = "ScrollbarGrabActive";
        ImGuiCol[ImGuiCol["CheckMark"] = 18] = "CheckMark";
        ImGuiCol[ImGuiCol["SliderGrab"] = 19] = "SliderGrab";
        ImGuiCol[ImGuiCol["SliderGrabActive"] = 20] = "SliderGrabActive";
        ImGuiCol[ImGuiCol["Button"] = 21] = "Button";
        ImGuiCol[ImGuiCol["ButtonHovered"] = 22] = "ButtonHovered";
        ImGuiCol[ImGuiCol["ButtonActive"] = 23] = "ButtonActive";
        ImGuiCol[ImGuiCol["Header"] = 24] = "Header";
        ImGuiCol[ImGuiCol["HeaderHovered"] = 25] = "HeaderHovered";
        ImGuiCol[ImGuiCol["HeaderActive"] = 26] = "HeaderActive";
        ImGuiCol[ImGuiCol["Separator"] = 27] = "Separator";
        ImGuiCol[ImGuiCol["SeparatorHovered"] = 28] = "SeparatorHovered";
        ImGuiCol[ImGuiCol["SeparatorActive"] = 29] = "SeparatorActive";
        ImGuiCol[ImGuiCol["ResizeGrip"] = 30] = "ResizeGrip";
        ImGuiCol[ImGuiCol["ResizeGripHovered"] = 31] = "ResizeGripHovered";
        ImGuiCol[ImGuiCol["ResizeGripActive"] = 32] = "ResizeGripActive";
        ImGuiCol[ImGuiCol["Tab"] = 33] = "Tab";
        ImGuiCol[ImGuiCol["TabHovered"] = 34] = "TabHovered";
        ImGuiCol[ImGuiCol["TabActive"] = 35] = "TabActive";
        ImGuiCol[ImGuiCol["TabUnfocused"] = 36] = "TabUnfocused";
        ImGuiCol[ImGuiCol["TabUnfocusedActive"] = 37] = "TabUnfocusedActive";
        ImGuiCol[ImGuiCol["PlotLines"] = 38] = "PlotLines";
        ImGuiCol[ImGuiCol["PlotLinesHovered"] = 39] = "PlotLinesHovered";
        ImGuiCol[ImGuiCol["PlotHistogram"] = 40] = "PlotHistogram";
        ImGuiCol[ImGuiCol["PlotHistogramHovered"] = 41] = "PlotHistogramHovered";
        ImGuiCol[ImGuiCol["TextSelectedBg"] = 42] = "TextSelectedBg";
        ImGuiCol[ImGuiCol["DragDropTarget"] = 43] = "DragDropTarget";
        ImGuiCol[ImGuiCol["NavHighlight"] = 44] = "NavHighlight";
        ImGuiCol[ImGuiCol["NavWindowingHighlight"] = 45] = "NavWindowingHighlight";
        ImGuiCol[ImGuiCol["NavWindowingDimBg"] = 46] = "NavWindowingDimBg";
        ImGuiCol[ImGuiCol["ModalWindowDimBg"] = 47] = "ModalWindowDimBg";
        ImGuiCol[ImGuiCol["COUNT"] = 48] = "COUNT";
    })(exports.ImGuiCol || (exports.ImGuiCol = {}));
    (function (ImGuiStyleVar) {
        // Enum name ......................// Member in ImGuiStyle structure (see ImGuiStyle for descriptions)
        ImGuiStyleVar[ImGuiStyleVar["Alpha"] = 0] = "Alpha";
        ImGuiStyleVar[ImGuiStyleVar["WindowPadding"] = 1] = "WindowPadding";
        ImGuiStyleVar[ImGuiStyleVar["WindowRounding"] = 2] = "WindowRounding";
        ImGuiStyleVar[ImGuiStyleVar["WindowBorderSize"] = 3] = "WindowBorderSize";
        ImGuiStyleVar[ImGuiStyleVar["WindowMinSize"] = 4] = "WindowMinSize";
        ImGuiStyleVar[ImGuiStyleVar["WindowTitleAlign"] = 5] = "WindowTitleAlign";
        // WindowMenuButtonPosition, // ImGuiDir WindowMenuButtonPosition
        ImGuiStyleVar[ImGuiStyleVar["ChildRounding"] = 6] = "ChildRounding";
        ImGuiStyleVar[ImGuiStyleVar["ChildBorderSize"] = 7] = "ChildBorderSize";
        ImGuiStyleVar[ImGuiStyleVar["PopupRounding"] = 8] = "PopupRounding";
        ImGuiStyleVar[ImGuiStyleVar["PopupBorderSize"] = 9] = "PopupBorderSize";
        ImGuiStyleVar[ImGuiStyleVar["FramePadding"] = 10] = "FramePadding";
        ImGuiStyleVar[ImGuiStyleVar["FrameRounding"] = 11] = "FrameRounding";
        ImGuiStyleVar[ImGuiStyleVar["FrameBorderSize"] = 12] = "FrameBorderSize";
        ImGuiStyleVar[ImGuiStyleVar["ItemSpacing"] = 13] = "ItemSpacing";
        ImGuiStyleVar[ImGuiStyleVar["ItemInnerSpacing"] = 14] = "ItemInnerSpacing";
        ImGuiStyleVar[ImGuiStyleVar["IndentSpacing"] = 15] = "IndentSpacing";
        ImGuiStyleVar[ImGuiStyleVar["ScrollbarSize"] = 16] = "ScrollbarSize";
        ImGuiStyleVar[ImGuiStyleVar["ScrollbarRounding"] = 17] = "ScrollbarRounding";
        ImGuiStyleVar[ImGuiStyleVar["GrabMinSize"] = 18] = "GrabMinSize";
        ImGuiStyleVar[ImGuiStyleVar["GrabRounding"] = 19] = "GrabRounding";
        ImGuiStyleVar[ImGuiStyleVar["TabRounding"] = 20] = "TabRounding";
        ImGuiStyleVar[ImGuiStyleVar["ButtonTextAlign"] = 21] = "ButtonTextAlign";
        ImGuiStyleVar[ImGuiStyleVar["SelectableTextAlign"] = 22] = "SelectableTextAlign";
        ImGuiStyleVar[ImGuiStyleVar["Count_"] = 23] = "Count_";
        ImGuiStyleVar[ImGuiStyleVar["COUNT"] = 23] = "COUNT";
    })(exports.StyleVar || (exports.StyleVar = {}));
    (function (ImGuiBackendFlags) {
        ImGuiBackendFlags[ImGuiBackendFlags["None"] = 0] = "None";
        ImGuiBackendFlags[ImGuiBackendFlags["HasGamepad"] = 1] = "HasGamepad";
        ImGuiBackendFlags[ImGuiBackendFlags["HasMouseCursors"] = 2] = "HasMouseCursors";
        ImGuiBackendFlags[ImGuiBackendFlags["HasSetMousePos"] = 4] = "HasSetMousePos";
        ImGuiBackendFlags[ImGuiBackendFlags["RendererHasVtxOffset"] = 8] = "RendererHasVtxOffset";
    })(exports.ImGuiBackendFlags || (exports.ImGuiBackendFlags = {}));
    (function (ImGuiColorEditFlags) {
        ImGuiColorEditFlags[ImGuiColorEditFlags["None"] = 0] = "None";
        ImGuiColorEditFlags[ImGuiColorEditFlags["NoAlpha"] = 2] = "NoAlpha";
        ImGuiColorEditFlags[ImGuiColorEditFlags["NoPicker"] = 4] = "NoPicker";
        ImGuiColorEditFlags[ImGuiColorEditFlags["NoOptions"] = 8] = "NoOptions";
        ImGuiColorEditFlags[ImGuiColorEditFlags["NoSmallPreview"] = 16] = "NoSmallPreview";
        ImGuiColorEditFlags[ImGuiColorEditFlags["NoInputs"] = 32] = "NoInputs";
        ImGuiColorEditFlags[ImGuiColorEditFlags["NoTooltip"] = 64] = "NoTooltip";
        ImGuiColorEditFlags[ImGuiColorEditFlags["NoLabel"] = 128] = "NoLabel";
        ImGuiColorEditFlags[ImGuiColorEditFlags["NoSidePreview"] = 256] = "NoSidePreview";
        ImGuiColorEditFlags[ImGuiColorEditFlags["NoDragDrop"] = 512] = "NoDragDrop";
        // User Options (right-click on widget to change some of them). You can set application defaults using SetColorEditOptions(). The idea is that you probably don't want to override them in most of your calls, let the user choose and/or call SetColorEditOptions() during startup.
        ImGuiColorEditFlags[ImGuiColorEditFlags["AlphaBar"] = 65536] = "AlphaBar";
        ImGuiColorEditFlags[ImGuiColorEditFlags["AlphaPreview"] = 131072] = "AlphaPreview";
        ImGuiColorEditFlags[ImGuiColorEditFlags["AlphaPreviewHalf"] = 262144] = "AlphaPreviewHalf";
        ImGuiColorEditFlags[ImGuiColorEditFlags["HDR"] = 524288] = "HDR";
        ImGuiColorEditFlags[ImGuiColorEditFlags["DisplayRGB"] = 1048576] = "DisplayRGB";
        ImGuiColorEditFlags[ImGuiColorEditFlags["DisplayHSV"] = 2097152] = "DisplayHSV";
        ImGuiColorEditFlags[ImGuiColorEditFlags["DisplayHex"] = 4194304] = "DisplayHex";
        ImGuiColorEditFlags[ImGuiColorEditFlags["Uint8"] = 8388608] = "Uint8";
        ImGuiColorEditFlags[ImGuiColorEditFlags["Float"] = 16777216] = "Float";
        ImGuiColorEditFlags[ImGuiColorEditFlags["PickerHueBar"] = 33554432] = "PickerHueBar";
        ImGuiColorEditFlags[ImGuiColorEditFlags["PickerHueWheel"] = 67108864] = "PickerHueWheel";
        ImGuiColorEditFlags[ImGuiColorEditFlags["InputRGB"] = 134217728] = "InputRGB";
        ImGuiColorEditFlags[ImGuiColorEditFlags["InputHSV"] = 268435456] = "InputHSV";
        // Defaults Options. You can set application defaults using SetColorEditOptions(). The intent is that you probably don't want to
        // override them in most of your calls. Let the user choose via the option menu and/or call SetColorEditOptions() once during startup.
        ImGuiColorEditFlags[ImGuiColorEditFlags["_OptionsDefault"] = 177209344] = "_OptionsDefault";
        // [Internal] Masks
        ImGuiColorEditFlags[ImGuiColorEditFlags["_DisplayMask"] = 7340032] = "_DisplayMask";
        ImGuiColorEditFlags[ImGuiColorEditFlags["_DataTypeMask"] = 25165824] = "_DataTypeMask";
        ImGuiColorEditFlags[ImGuiColorEditFlags["_PickerMask"] = 100663296] = "_PickerMask";
        ImGuiColorEditFlags[ImGuiColorEditFlags["_InputMask"] = 402653184] = "_InputMask";
    })(exports.ImGuiColorEditFlags || (exports.ImGuiColorEditFlags = {}));
    (function (ImGuiMouseCursor) {
        ImGuiMouseCursor[ImGuiMouseCursor["None"] = -1] = "None";
        ImGuiMouseCursor[ImGuiMouseCursor["Arrow"] = 0] = "Arrow";
        ImGuiMouseCursor[ImGuiMouseCursor["TextInput"] = 1] = "TextInput";
        ImGuiMouseCursor[ImGuiMouseCursor["ResizeAll"] = 2] = "ResizeAll";
        ImGuiMouseCursor[ImGuiMouseCursor["ResizeNS"] = 3] = "ResizeNS";
        ImGuiMouseCursor[ImGuiMouseCursor["ResizeEW"] = 4] = "ResizeEW";
        ImGuiMouseCursor[ImGuiMouseCursor["ResizeNESW"] = 5] = "ResizeNESW";
        ImGuiMouseCursor[ImGuiMouseCursor["ResizeNWSE"] = 6] = "ResizeNWSE";
        ImGuiMouseCursor[ImGuiMouseCursor["Hand"] = 7] = "Hand";
        ImGuiMouseCursor[ImGuiMouseCursor["Count_"] = 8] = "Count_";
        ImGuiMouseCursor[ImGuiMouseCursor["COUNT"] = 8] = "COUNT";
    })(exports.MouseCursor || (exports.MouseCursor = {}));
    (function (ImGuiCond) {
        ImGuiCond[ImGuiCond["Always"] = 1] = "Always";
        ImGuiCond[ImGuiCond["Once"] = 2] = "Once";
        ImGuiCond[ImGuiCond["FirstUseEver"] = 4] = "FirstUseEver";
        ImGuiCond[ImGuiCond["Appearing"] = 8] = "Appearing";
    })(exports.ImGuiCond || (exports.ImGuiCond = {}));
    (function (ImDrawCornerFlags) {
        ImDrawCornerFlags[ImDrawCornerFlags["TopLeft"] = 1] = "TopLeft";
        ImDrawCornerFlags[ImDrawCornerFlags["TopRight"] = 2] = "TopRight";
        ImDrawCornerFlags[ImDrawCornerFlags["BotLeft"] = 4] = "BotLeft";
        ImDrawCornerFlags[ImDrawCornerFlags["BotRight"] = 8] = "BotRight";
        ImDrawCornerFlags[ImDrawCornerFlags["Top"] = 3] = "Top";
        ImDrawCornerFlags[ImDrawCornerFlags["Bot"] = 12] = "Bot";
        ImDrawCornerFlags[ImDrawCornerFlags["Left"] = 5] = "Left";
        ImDrawCornerFlags[ImDrawCornerFlags["Right"] = 10] = "Right";
        ImDrawCornerFlags[ImDrawCornerFlags["All"] = 15] = "All";
    })(exports.wCornerFlags || (exports.wCornerFlags = {}));
    (function (ImDrawListFlags) {
        ImDrawListFlags[ImDrawListFlags["None"] = 0] = "None";
        ImDrawListFlags[ImDrawListFlags["AntiAliasedLines"] = 1] = "AntiAliasedLines";
        ImDrawListFlags[ImDrawListFlags["AntiAliasedFill"] = 2] = "AntiAliasedFill";
    })(exports.wListFlags || (exports.wListFlags = {}));
    class ImVec2 {
        constructor(x = 0.0, y = 0.0) {
            this.x = x;
            this.y = y;
        }
        Set(x, y) {
            this.x = x;
            this.y = y;
            return this;
        }
        Copy(other) {
            this.x = other.x;
            this.y = other.y;
            return this;
        }
        Equals(other) {
            if (this.x !== other.x) {
                return false;
            }
            if (this.y !== other.y) {
                return false;
            }
            return true;
        }
    }
    ImVec2.ZERO = new ImVec2(0.0, 0.0);
    ImVec2.UNIT = new ImVec2(1.0, 1.0);
    ImVec2.UNIT_X = new ImVec2(1.0, 0.0);
    ImVec2.UNIT_Y = new ImVec2(0.0, 1.0);
    class ImVec4 {
        constructor(x = 0.0, y = 0.0, z = 0.0, w = 1.0) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
        Set(x, y, z, w) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
            return this;
        }
        Copy(other) {
            this.x = other.x;
            this.y = other.y;
            this.z = other.z;
            this.w = other.w;
            return this;
        }
        Equals(other) {
            if (this.x !== other.x) {
                return false;
            }
            if (this.y !== other.y) {
                return false;
            }
            if (this.z !== other.z) {
                return false;
            }
            if (this.w !== other.w) {
                return false;
            }
            return true;
        }
    }
    ImVec4.ZERO = new ImVec4(0.0, 0.0, 0.0, 0.0);
    ImVec4.UNIT = new ImVec4(1.0, 1.0, 1.0, 1.0);
    ImVec4.UNIT_X = new ImVec4(1.0, 0.0, 0.0, 0.0);
    ImVec4.UNIT_Y = new ImVec4(0.0, 1.0, 0.0, 0.0);
    ImVec4.UNIT_Z = new ImVec4(0.0, 0.0, 1.0, 0.0);
    ImVec4.UNIT_W = new ImVec4(0.0, 0.0, 0.0, 1.0);
    ImVec4.BLACK = new ImVec4(0.0, 0.0, 0.0, 1.0);
    ImVec4.WHITE = new ImVec4(1.0, 1.0, 1.0, 1.0);
    //-----------------------------------------------------------------------------
    // Helpers
    //-----------------------------------------------------------------------------
    // Lightweight std::vector<> like class to avoid dragging dependencies (also: windows implementation of STL with debug enabled is absurdly slow, so let's bypass it so our code runs fast in debug).
    // Our implementation does NOT call C++ constructors/destructors. This is intentional and we do not require it. Do not use this class as a straight std::vector replacement in your code!
    class ImVector extends Array {
        constructor() {
            super(...arguments);
            this.Data = this;
            // public:
            // int                         Size;
            // int                         Capacity;
            // T*                          Data;
            // typedef T                   value_type;
            // typedef value_type*         iterator;
            // typedef const value_type*   const_iterator;
            // inline ImVector()           { Size = Capacity = 0; Data = NULL; }
            // inline ~ImVector()          { if (Data) ImGui::MemFree(Data); }
            // inline bool                 empty() const                   { return Size == 0; }
            // inline int                  size() const                    { return Size; }
            // inline int                  capacity() const                { return Capacity; }
            // inline value_type&          operator[](int i)               { IM_ASSERT(i < Size); return Data[i]; }
            // inline const value_type&    operator[](int i) const         { IM_ASSERT(i < Size); return Data[i]; }
            // inline void                 clear()                         { if (Data) { Size = Capacity = 0; ImGui::MemFree(Data); Data = NULL; } }
            // inline iterator             begin()                         { return Data; }
            // inline const_iterator       begin() const                   { return Data; }
            // inline iterator             end()                           { return Data + Size; }
            // inline const_iterator       end() const                     { return Data + Size; }
            // inline value_type&          front()                         { IM_ASSERT(Size > 0); return Data[0]; }
            // inline const value_type&    front() const                   { IM_ASSERT(Size > 0); return Data[0]; }
            // inline value_type&          back()                          { IM_ASSERT(Size > 0); return Data[Size - 1]; }
            // inline const value_type&    back() const                    { IM_ASSERT(Size > 0); return Data[Size - 1]; }
            // inline void                 swap(ImVector<T>& rhs)          { int rhs_size = rhs.Size; rhs.Size = Size; Size = rhs_size; int rhs_cap = rhs.Capacity; rhs.Capacity = Capacity; Capacity = rhs_cap; value_type* rhs_data = rhs.Data; rhs.Data = Data; Data = rhs_data; }
            // inline int                  _grow_capacity(int size) const  { int new_capacity = Capacity ? (Capacity + Capacity/2) : 8; return new_capacity > size ? new_capacity : size; }
            // inline void                 resize(int new_size)            { if (new_size > Capacity) reserve(_grow_capacity(new_size)); Size = new_size; }
            // inline void                 resize(int new_size, const T& v){ if (new_size > Capacity) reserve(_grow_capacity(new_size)); if (new_size > Size) for (int n = Size; n < new_size; n++) Data[n] = v; Size = new_size; }
            // inline void                 reserve(int new_capacity)
            // {
            //     if (new_capacity <= Capacity)
            //         return;
            //     T* new_data = (value_type*)ImGui::MemAlloc((size_t)new_capacity * sizeof(T));
            //     if (Data)
            //         memcpy(new_data, Data, (size_t)Size * sizeof(T));
            //     ImGui::MemFree(Data);
            //     Data = new_data;
            //     Capacity = new_capacity;
            // }
            // inline void                 push_back(const value_type& v)  { if (Size == Capacity) reserve(_grow_capacity(Size + 1)); Data[Size++] = v; }
            // inline void                 pop_back()                      { IM_ASSERT(Size > 0); Size--; }
            // inline void                 push_front(const value_type& v) { if (Size == 0) push_back(v); else insert(Data, v); }
            // inline iterator             erase(const_iterator it)                        { IM_ASSERT(it >= Data && it < Data+Size); const ptrdiff_t off = it - Data; memmove(Data + off, Data + off + 1, ((size_t)Size - (size_t)off - 1) * sizeof(value_type)); Size--; return Data + off; }
            // inline iterator             erase(const_iterator it, const_iterator it_last){ IM_ASSERT(it >= Data && it < Data+Size && it_last > it && it_last <= Data+Size); const ptrdiff_t count = it_last - it; const ptrdiff_t off = it - Data; memmove(Data + off, Data + off + count, ((size_t)Size - (size_t)off - count) * sizeof(value_type)); Size -= (int)count; return Data + off; }
            // inline iterator             erase_unsorted(const_iterator it)               { IM_ASSERT(it >= Data && it < Data+Size);  const ptrdiff_t off = it - Data; if (it < Data+Size-1) memcpy(Data + off, Data + Size - 1, sizeof(value_type)); Size--; return Data + off; }
            // inline iterator             insert(const_iterator it, const value_type& v)  { IM_ASSERT(it >= Data && it <= Data+Size); const ptrdiff_t off = it - Data; if (Size == Capacity) reserve(_grow_capacity(Size + 1)); if (off < (int)Size) memmove(Data + off + 1, Data + off, ((size_t)Size - (size_t)off) * sizeof(value_type)); Data[off] = v; Size++; return Data + off; }
            // inline bool                 contains(const value_type& v) const             { const T* data = Data;  const T* data_end = Data + Size; while (data < data_end) if (*data++ == v) return true; return false; }
        }
        get Size() { return this.length; }
        empty() { return this.length === 0; }
        clear() { this.length = 0; }
        pop_back() { return this.pop(); }
        push_back(value) { this.push(value); }
    }
    // Helper: Parse and apply text filters. In format "aaaaa[,bbbb][,ccccc]"
    class ImGuiTextFilter {
        // IMGUI_API           ImGuiTextFilter(const char* default_filter = "");
        constructor(default_filter = "") {
            // [Internal]
            // struct TextRange
            // {
            //     const char* b;
            //     const char* e;
            //     TextRange() { b = e = NULL; }
            //     TextRange(const char* _b, const char* _e) { b = _b; e = _e; }
            //     const char* begin() const { return b; }
            //     const char* end() const { return e; }
            //     bool empty() const { return b == e; }
            //     char front() const { return *b; }
            //     static bool is_blank(char c) { return c == ' ' || c == '\t'; }
            //     void trim_blanks() { while (b < e && is_blank(*b)) b++; while (e > b && is_blank(*(e-1))) e--; }
            //     IMGUI_API void split(char separator, ImVector<TextRange>& out);
            // };
            // char                InputBuf[256];
            this.InputBuf = new ImStringBuffer(256);
            // ImVector<TextRange> Filters;
            // int                 CountGrep;
            this.CountGrep = 0;
            if (default_filter) {
                // ImStrncpy(InputBuf, default_filter, IM_ARRAYSIZE(InputBuf));
                this.InputBuf.buffer = default_filter;
                this.Build();
            }
            else {
                // InputBuf[0] = 0;
                this.InputBuf.buffer = "";
                this.CountGrep = 0;
            }
        }
        // IMGUI_API bool      Draw(const char* label = "Filter (inc,-exc)", float width = 0.0f);    // Helper calling InputText+Build
        Draw(label = "Filter (inc,-exc)", width = 0.0) {
            if (width !== 0.0)
                exports.bind.PushItemWidth(width);
            const value_changed = InputText(label, this.InputBuf, IM_ARRAYSIZE(this.InputBuf));
            if (width !== 0.0)
                exports.bind.PopItemWidth();
            if (value_changed)
                this.Build();
            return value_changed;
        }
        // IMGUI_API bool      PassFilter(const char* text, const char* text_end = NULL) const;
        PassFilter(text, text_end = null) {
            // if (Filters.empty())
            //     return true;
            // if (text == NULL)
            //     text = "";
            // for (int i = 0; i != Filters.Size; i++)
            // {
            //     const TextRange& f = Filters[i];
            //     if (f.empty())
            //         continue;
            //     if (f.front() == '-')
            //     {
            //         // Subtract
            //         if (ImStristr(text, text_end, f.begin()+1, f.end()) != NULL)
            //             return false;
            //     }
            //     else
            //     {
            //         // Grep
            //         if (ImStristr(text, text_end, f.begin(), f.end()) != NULL)
            //             return true;
            //     }
            // }
            // Implicit * grep
            if (this.CountGrep === 0)
                return true;
            return false;
        }
        // IMGUI_API void      Build();
        Build() {
            // Filters.resize(0);
            // TextRange input_range(InputBuf, InputBuf+strlen(InputBuf));
            // input_range.split(',', Filters);
            this.CountGrep = 0;
            // for (int i = 0; i != Filters.Size; i++)
            // {
            //     Filters[i].trim_blanks();
            //     if (Filters[i].empty())
            //         continue;
            //     if (Filters[i].front() != '-')
            //         CountGrep += 1;
            // }
        }
        // void                Clear() { InputBuf[0] = 0; Build(); }
        Clear() { this.InputBuf.buffer = ""; this.Build(); }
        // bool                IsActive() const { return !Filters.empty(); }
        IsActive() { return false; }
    }
    // Helper: Text buffer for logging/accumulating text
    class ImGuiTextBuffer {
        constructor() {
            // ImVector<char>      Buf;
            this.Buf = "";
            // ImGuiTextBuffer()   { Buf.push_back(0); }
            // inline char         operator[](int i) { return Buf.Data[i]; }
            // const char*         begin() const { return &Buf.front(); }
            // const char*         end() const { return &Buf.back(); }      // Buf is zero-terminated, so end() will point on the zero-terminator
            // int                 size() const { return Buf.Size - 1; }
            // bool                empty() { return Buf.Size <= 1; }
            // void                clear() { Buf.clear(); Buf.push_back(0); }
            // void                reserve(int capacity) { Buf.reserve(capacity); }
            // const char*         c_str() const { return Buf.Data; }
            // IMGUI_API void      appendf(const char* fmt, ...) IM_FMTARGS(2);
            // IMGUI_API void      appendfv(const char* fmt, va_list args) IM_FMTLIST(2);
        }
        begin() { return this.Buf; }
        size() { return this.Buf.length; }
        clear() { this.Buf = ""; }
        append(text) { this.Buf += text; }
    }
    // Helper: Simple Key->value storage
    // Typically you don't have to worry about this since a storage is held within each Window.
    // We use it to e.g. store collapse state for a tree (Int 0/1), store color edit options.
    // This is optimized for efficient reading (dichotomy into a contiguous buffer), rare writing (typically tied to user interactions)
    // You can use it as custom user storage for temporary values. Declare your own storage if, for example:
    // - You want to manipulate the open/close state of a particular sub-tree in your interface (tree node uses Int 0/1 to store their state).
    // - You want to store custom debug data easily without adding or editing structures in your code (probably not efficient, but convenient)
    // Types are NOT stored, so it is up to you to make sure your Key don't collide with different types.
    class ImGuiStorage {
    }
    // Helpers macros to generate 32-bits encoded colors
    const IM_COL32_R_SHIFT = 0;
    const IM_COL32_G_SHIFT = 8;
    const IM_COL32_B_SHIFT = 16;
    const IM_COL32_A_SHIFT = 24;
    const IM_COL32_A_MASK = 0xFF000000;
    function IM_COL32(R, G, B, A = 255) {
        return ((A << IM_COL32_A_SHIFT) | (B << IM_COL32_B_SHIFT) | (G << IM_COL32_G_SHIFT) | (R << IM_COL32_R_SHIFT)) >>> 0;
    }
    const IM_COL32_WHITE = IM_COL32(255, 255, 255, 255); // Opaque white = 0xFFFFFFFF
    const IM_COL32_BLACK = IM_COL32(0, 0, 0, 255); // Opaque black
    const IM_COL32_BLACK_TRANS = IM_COL32(0, 0, 0, 0); // Transparent black = 0x00000000
    // ImColor() helper to implicity converts colors to either ImU32 (packed 4x1 byte) or ImVec4 (4x1 float)
    // Prefer using IM_COL32() macros if you want a guaranteed compile-time ImU32 for usage with ImDrawList API.
    // **Avoid storing ImColor! Store either u32 of ImVec4. This is not a full-featured color class. MAY OBSOLETE.
    // **None of the ImGui API are using ImColor directly but you can use it as a convenience to pass colors in either ImU32 or ImVec4 formats. Explicitly cast to ImU32 or ImVec4 if needed.
    class ImColor {
        constructor(r = 0.0, g = 0.0, b = 0.0, a = 1.0) {
            // ImVec4              Value;
            this.Value = new ImVec4();
            if (typeof (r) === "number") {
                if (r > 255 && g === 0.0 && b === 0.0 && a === 1.0) {
                    this.Value.x = Math.max(0.0, Math.min(1.0, ((r >> IM_COL32_R_SHIFT) & 0xFF) / 255));
                    this.Value.y = Math.max(0.0, Math.min(1.0, ((r >> IM_COL32_G_SHIFT) & 0xFF) / 255));
                    this.Value.z = Math.max(0.0, Math.min(1.0, ((r >> IM_COL32_B_SHIFT) & 0xFF) / 255));
                    this.Value.w = Math.max(0.0, Math.min(1.0, ((r >> IM_COL32_A_SHIFT) & 0xFF) / 255));
                }
                else if (r <= 1.0 && g <= 1.0 && b <= 1.0 && a <= 1.0) {
                    this.Value.x = Math.max(0.0, r);
                    this.Value.y = Math.max(0.0, g);
                    this.Value.z = Math.max(0.0, b);
                    this.Value.w = Math.max(0.0, a);
                }
                else {
                    this.Value.x = Math.max(0.0, Math.min(1.0, r / 255));
                    this.Value.y = Math.max(0.0, Math.min(1.0, g / 255));
                    this.Value.z = Math.max(0.0, Math.min(1.0, b / 255));
                    if (a <= 1.0) {
                        this.Value.w = Math.max(0.0, a);
                    }
                    else {
                        this.Value.w = Math.max(0.0, Math.min(1.0, a / 255));
                    }
                }
            }
            else {
                this.Value.Copy(r);
            }
        }
        // inline operator ImU32() const                                   { return ImGui::ColorConvertFloat4ToU32(Value); }
        toImU32() { return ColorConvertFloat4ToU32(this.Value); }
        // inline operator ImVec4() const                                  { return Value; }
        toImVec4() { return this.Value; }
        // FIXME-OBSOLETE: May need to obsolete/cleanup those helpers.
        // inline void    SetHSV(float h, float s, float v, float a = 1.0f){ ImGui::ColorConvertHSVtoRGB(h, s, v, Value.x, Value.y, Value.z); Value.w = a; }
        SetHSV(h, s, v, a = 1.0) {
            const ref_r = [this.Value.x];
            const ref_g = [this.Value.y];
            const ref_b = [this.Value.z];
            ColorConvertHSVtoRGB(h, s, v, ref_r, ref_g, ref_b);
            this.Value.x = ref_r[0];
            this.Value.y = ref_g[0];
            this.Value.z = ref_b[0];
            this.Value.w = a;
        }
        // static ImColor HSV(float h, float s, float v, float a = 1.0f)   { float r,g,b; ImGui::ColorConvertHSVtoRGB(h, s, v, r, g, b); return ImColor(r,g,b,a); }
        static HSV(h, s, v, a = 1.0) {
            const color = new ImColor();
            color.SetHSV(h, s, v, a);
            return color;
        }
    }
    const ImGuiInputTextDefaultSize = 128;
    // Shared state of InputText(), passed to callback when a ImGuiInputTextFlags_Callback* flag is used and the corresponding callback is triggered.
    class ImGuiInputTextCallbackData {
        constructor(native, UserData) {
            this.native = native;
            this.UserData = UserData;
        }
        // ImGuiInputTextFlags EventFlag;      // One of ImGuiInputTextFlags_Callback* // Read-only
        get EventFlag() { return this.native.EventFlag; }
        // ImGuiInputTextFlags Flags;          // What user passed to InputText()      // Read-only
        get Flags() { return this.native.Flags; }
        // void*               UserData;       // What user passed to InputText()      // Read-only
        // public get UserData(): any { return this.native.UserData; }
        // CharFilter event:
        // ImWchar             EventChar;      // Character input                      // Read-write (replace character or set to zero)
        get EventChar() { return this.native.EventChar; }
        set EventChar(value) { this.native.EventChar = value; }
        // Completion,History,Always events:
        // If you modify the buffer contents make sure you update 'BufTextLen' and set 'BufDirty' to true.
        // ImGuiKey            EventKey;       // Key pressed (Up/Down/TAB)            // Read-only
        get EventKey() { return this.native.EventKey; }
        // char*               Buf;            // Current text buffer                  // Read-write (pointed data only, can't replace the actual pointer)
        get Buf() { return this.native.Buf; }
        set Buf(value) { this.native.Buf = value; }
        // int                 BufTextLen;     // Current text length in bytes         // Read-write
        get BufTextLen() { return this.native.BufTextLen; }
        set BufTextLen(value) { this.native.BufTextLen = value; }
        // int                 BufSize;        // Maximum text length in bytes         // Read-only
        get BufSize() { return this.native.BufSize; }
        // bool                BufDirty;       // Set if you modify Buf/BufTextLen!!   // Write
        set BufDirty(value) { this.native.BufDirty = value; }
        // int                 CursorPos;      //                                      // Read-write
        get CursorPos() { return this.native.CursorPos; }
        set CursorPos(value) { this.native.CursorPos = value; }
        // int                 SelectionStart; //                                      // Read-write (== to SelectionEnd when no selection)
        get SelectionStart() { return this.native.SelectionStart; }
        set SelectionStart(value) { this.native.SelectionStart = value; }
        // int                 SelectionEnd;   //                                      // Read-write
        get SelectionEnd() { return this.native.SelectionEnd; }
        set SelectionEnd(value) { this.native.SelectionEnd = value; }
        // NB: Helper functions for text manipulation. Calling those function loses selection.
        // IMGUI_API void    DeleteChars(int pos, int bytes_count);
        DeleteChars(pos, bytes_count) { return this.native.DeleteChars(pos, bytes_count); }
        // IMGUI_API void    InsertChars(int pos, const char* text, const char* text_end = NULL);
        InsertChars(pos, text, text_end = null) { return this.native.InsertChars(pos, text_end !== null ? text.substring(0, text_end) : text); }
        // bool              HasSelection() const { return SelectionStart != SelectionEnd; }
        HasSelection() { return this.native.HasSelection(); }
    }
    // Resizing callback data to apply custom constraint. As enabled by SetNextWindowSizeConstraints(). Callback is called during the next Begin().
    // NB: For basic min/max size constraint on each axis you don't need to use the callback! The SetNextWindowSizeConstraints() parameters are enough.
    class ImGuiSizeCallbackData {
        constructor(native, UserData) {
            this.native = native;
            this.UserData = UserData;
        }
        get Pos() { return this.native.Pos; }
        get CurrentSize() { return this.native.CurrentSize; }
        get DesiredSize() { return this.native.DesiredSize; }
    }
    class ImGuiListClipper {
        get StartPosY() { return this.native.StartPosY; }
        get ItemsHeight() { return this.native.ItemsHeight; }
        get ItemsCount() { return this.native.ItemsCount; }
        get StepNo() { return this.native.StepNo; }
        get DisplayStart() { return this.native.DisplayStart; }
        get DisplayEnd() { return this.native.DisplayEnd; }
        // items_count:  Use -1 to ignore (you can call Begin later). Use INT_MAX if you don't know how many items you have (in which case the cursor won't be advanced in the final step).
        // items_height: Use -1.0f to be calculated automatically on first step. Otherwise pass in the distance between your items, typically GetTextLineHeightWithSpacing() or GetFrameHeightWithSpacing().
        // If you don't specify an items_height, you NEED to call Step(). If you specify items_height you may call the old Begin()/End() api directly, but prefer calling Step().
        // ImGuiListClipper(int items_count = -1, float items_height = -1.0f)  { Begin(items_count, items_height); } // NB: Begin() initialize every fields (as we allow user to call Begin/End multiple times on a same instance if they want).
        constructor(items_count = -1, items_height = -1.0) {
            this.native = new exports.bind.ImGuiListClipper(items_count, items_height);
        }
        // ~ImGuiListClipper()                                                 { IM_ASSERT(ItemsCount == -1); }      // Assert if user forgot to call End() or Step() until false.
        delete() {
            if (this.native) {
                this.native.delete();
                delete this.native;
            }
        }
        // IMGUI_API bool Step();                                              // Call until it returns false. The DisplayStart/DisplayEnd fields will be set and you can process/draw those items.
        Step() {
            if (!this.native) {
                throw new Error();
            }
            const busy = this.native.Step();
            if (!busy) {
                this.delete();
            }
            return busy;
        }
        // IMGUI_API void Begin(int items_count, float items_height = -1.0f);  // Automatically called by constructor if you passed 'items_count' or by Step() in Step 1.
        Begin(items_count, items_height = -1.0) {
            if (!this.native) {
                this.native = new undefined(items_count, items_height);
            }
            this.native.Begin(items_count, items_height);
        }
        // IMGUI_API void End();                                               // Automatically called on the last call of Step() that returns false.
        End() {
            if (!this.native) {
                throw new Error();
            }
            this.native.End();
            this.delete();
        }
    }
    // Special Draw callback value to request renderer back-end to reset the graphics/render state.
    // The renderer back-end needs to handle this special value, otherwise it will crash trying to call a function at this address.
    // This is useful for example if you submitted callbacks which you know have altered the render state and you want it to be restored.
    // It is not done by default because they are many perfectly useful way of altering render state for imgui contents (e.g. changing shader/blending settings before an Image call).
    const ImDrawCallback_ResetRenderState = -1;
    // Typically, 1 command = 1 GPU draw call (unless command is a callback)
    // Pre 1.71 back-ends will typically ignore the VtxOffset/IdxOffset fields. When 'io.BackendFlags & ImGuiBackendFlags_RendererHasVtxOffset'
    // is enabled, those fields allow us to render meshes larger than 64K vertices while keeping 16-bits indices.
    class ImDrawCmd {
        constructor(native) {
            this.native = native;
            // ImDrawCallback  UserCallback;           // If != NULL, call the function instead of rendering the vertices. clip_rect and texture_id will be set normally.
            this.UserCallback = null; // TODO
            // void*           UserCallbackData;       // The draw callback code can access this.
            this.UserCallbackData = null; // TODO
        }
        // unsigned int    ElemCount;              // Number of indices (multiple of 3) to be rendered as triangles. Vertices are stored in the callee ImDrawList's vtx_buffer[] array, indices in idx_buffer[].
        get ElemCount() { return this.native.ElemCount; }
        // ImVec4          ClipRect;               // Clipping rectangle (x1, y1, x2, y2)
        get ClipRect() { return this.native.ClipRect; }
        // ImTextureID     TextureId;              // User-provided texture ID. Set by user in ImfontAtlas::SetTexID() for fonts or passed to Image*() functions. Ignore if never using images or multiple fonts atlas.
        get TextureId() {
            return ImGuiContext.getTexture(this.native.TextureId);
        }
        // unsigned int    VtxOffset;              // Start offset in vertex buffer. Pre-1.71 or without ImGuiBackendFlags_RendererHasVtxOffset: always 0. With ImGuiBackendFlags_RendererHasVtxOffset: may be >0 to support meshes larger than 64K vertices with 16-bits indices.
        get VtxOffset() { return this.native.VtxOffset; }
        // unsigned int    IdxOffset;              // Start offset in index buffer. Always equal to sum of ElemCount drawn so far.
        get IdxOffset() { return this.native.IdxOffset; }
    }
    // Vertex index 
    // (to allow large meshes with 16-bits indices: set 'io.BackendFlags |= ImGuiBackendFlags_RendererHasVtxOffset' and handle ImDrawCmd::VtxOffset in the renderer back-end)
    // (to use 32-bits indices: override with '#define ImDrawIdx unsigned int' in imconfig.h)
    // #ifndef ImDrawIdx
    // typedef unsigned short ImDrawIdx;
    // #endif
    const ImDrawIdxSize = 2; // bind.ImDrawIdxSize;
    // Vertex layout
    // #ifndef IMGUI_OVERRIDE_DRAWVERT_STRUCT_LAYOUT
    const ImDrawVertSize = 20; // bind.ImDrawVertSize;
    const ImDrawVertPosOffset = 0; // bind.ImDrawVertPosOffset;
    const ImDrawVertUVOffset = 8; // bind.ImDrawVertUVOffset;
    const ImDrawVertColOffset = 16; // bind.ImDrawVertColOffset;
    class ImDrawVert {
        constructor(buffer, byteOffset = 0) {
            this.pos = new Float32Array(buffer, byteOffset + exports.bind.ImDrawVertPosOffset, 2);
            this.uv = new Float32Array(buffer, byteOffset + exports.bind.ImDrawVertUVOffset, 2);
            this.col = new Uint32Array(buffer, byteOffset + exports.bind.ImDrawVertColOffset, 1);
        }
    }
    // #else
    // You can override the vertex format layout by defining IMGUI_OVERRIDE_DRAWVERT_STRUCT_LAYOUT in imconfig.h
    // The code expect ImVec2 pos (8 bytes), ImVec2 uv (8 bytes), ImU32 col (4 bytes), but you can re-order them or add other fields as needed to simplify integration in your engine.
    // The type has to be described within the macro (you can either declare the struct or use a typedef)
    // NOTE: IMGUI DOESN'T CLEAR THE STRUCTURE AND DOESN'T CALL A CONSTRUCTOR SO ANY CUSTOM FIELD WILL BE UNINITIALIZED. IF YOU ADD EXTRA FIELDS (SUCH AS A 'Z' COORDINATES) YOU WILL NEED TO CLEAR THEM DURING RENDER OR TO IGNORE THEM.
    // IMGUI_OVERRIDE_DRAWVERT_STRUCT_LAYOUT;
    // #endif
    // Draw channels are used by the Columns API to "split" the render list into different channels while building, so items of each column can be batched together.
    // You can also use them to simulate drawing layers and submit primitives in a different order than how they will be rendered.
    class ImDrawChannel {
    }
    class ImDrawListSharedData {
        constructor(native) {
            this.native = native;
        }
    }
    // Draw command list
    // This is the low-level list of polygons that ImGui functions are filling. At the end of the frame, all command lists are passed to your ImGuiIO::RenderDrawListFn function for rendering.
    // Each ImGui window contains its own ImDrawList. You can use ImGui::GetWindowDrawList() to access the current window draw list and draw custom primitives.
    // You can interleave normal ImGui:: calls and adding primitives to the current draw list.
    // All positions are generally in pixel coordinates (top-left at (0,0), bottom-right at io.DisplaySize), however you are totally free to apply whatever transformation matrix to want to the data (if you apply such transformation you'll want to apply it to ClipRect as well)
    // Important: Primitives are always added to the list and not culled (culling is done at higher-level by ImGui:: functions), if you use this API a lot consider coarse culling your drawn objects.
    class ImDrawList {
        constructor(native) {
            this.native = native;
        }
        IterateDrawCmds(callback) {
            this.native.IterateDrawCmds((draw_cmd, ElemStart) => {
                callback(new ImDrawCmd(draw_cmd), ElemStart);
            });
        }
        // This is what you have to render
        // ImVector<ImDrawCmd>     CmdBuffer;          // Draw commands. Typically 1 command = 1 GPU draw call, unless the command is a callback.
        // ImVector<ImDrawIdx>     IdxBuffer;          // Index buffer. Each command consume ImDrawCmd::ElemCount of those
        get IdxBuffer() { return this.native.IdxBuffer; }
        // ImVector<ImDrawVert>    VtxBuffer;          // Vertex buffer.
        get VtxBuffer() { return this.native.VtxBuffer; }
        // ImDrawListFlags         Flags;              // Flags, you may poke into these to adjust anti-aliasing settings per-primitive.
        get Flags() { return this.native.Flags; }
        set Flags(value) { this.native.Flags = value; }
        // [Internal, used while building lists]
        // const ImDrawListSharedData* _Data;          // Pointer to shared draw data (you can use ImGui::GetDrawListSharedData() to get the one from current ImGui context)
        // const char*             _OwnerName;         // Pointer to owner window's name for debugging
        // unsigned int            _VtxCurrentIdx;     // [Internal] == VtxBuffer.Size
        // ImDrawVert*             _VtxWritePtr;       // [Internal] point within VtxBuffer.Data after each add command (to avoid using the ImVector<> operators too much)
        // ImDrawIdx*              _IdxWritePtr;       // [Internal] point within IdxBuffer.Data after each add command (to avoid using the ImVector<> operators too much)
        // ImVector<ImVec4>        _ClipRectStack;     // [Internal]
        // ImVector<ImTextureID>   _TextureIdStack;    // [Internal]
        // ImVector<ImVec2>        _Path;              // [Internal] current path building
        // int                     _ChannelsCurrent;   // [Internal] current channel number (0)
        // int                     _ChannelsCount;     // [Internal] number of active channels (1+)
        // ImVector<ImDrawChannel> _Channels;          // [Internal] draw channels for columns API (not resized down so _ChannelsCount may be smaller than _Channels.Size)
        // ImDrawList(const ImDrawListSharedData* shared_data) { _Data = shared_data; _OwnerName = NULL; Clear(); }
        // ~ImDrawList() { ClearFreeMemory(); }
        // IMGUI_API void  PushClipRect(ImVec2 clip_rect_min, ImVec2 clip_rect_max, bool intersect_with_current_clip_rect = false);  // Render-level scissoring. This is passed down to your render function but not used for CPU-side coarse clipping. Prefer using higher-level ImGui::PushClipRect() to affect logic (hit-testing and widget culling)
        PushClipRect(clip_rect_min, clip_rect_max, intersect_with_current_clip_rect = false) {
            this.native.PushClipRect(clip_rect_min, clip_rect_max, intersect_with_current_clip_rect);
        }
        // IMGUI_API void  PushClipRectFullScreen();
        PushClipRectFullScreen() { this.native.PushClipRectFullScreen(); }
        // IMGUI_API void  PopClipRect();
        PopClipRect() { this.native.PopClipRect(); }
        // IMGUI_API void  PushTextureID(ImTextureID texture_id);
        PushTextureID(texture_id) {
            this.native.PushTextureID(ImGuiContext.setTexture(texture_id));
        }
        // IMGUI_API void  PopTextureID();
        PopTextureID() { this.native.PopTextureID(); }
        // inline ImVec2   GetClipRectMin() const { const ImVec4& cr = _ClipRectStack.back(); return ImVec2(cr.x, cr.y); }
        GetClipRectMin(out = new ImVec2()) {
            return this.native.GetClipRectMin(out);
        }
        // inline ImVec2   GetClipRectMax() const { const ImVec4& cr = _ClipRectStack.back(); return ImVec2(cr.z, cr.w); }
        GetClipRectMax(out = new ImVec2()) {
            return this.native.GetClipRectMax(out);
        }
        // Primitives
        // IMGUI_API void  AddLine(const ImVec2& a, const ImVec2& b, ImU32 col, float thickness = 1.0f);
        AddLine(a, b, col, thickness = 1.0) {
            this.native.AddLine(a, b, col, thickness);
        }
        // IMGUI_API void  AddRect(const ImVec2& a, const ImVec2& b, ImU32 col, float rounding = 0.0f, int rounding_corners_flags = ImDrawCornerFlags_All, float thickness = 1.0f);   // a: upper-left, b: lower-right, rounding_corners_flags: 4-bits corresponding to which corner to round
        AddRect(a, b, col, rounding = 0.0, rounding_corners_flags = exports.wCornerFlags.All, thickness = 1.0) {
            this.native.AddRect(a, b, col, rounding, rounding_corners_flags, thickness);
        }
        // IMGUI_API void  AddRectFilled(const ImVec2& a, const ImVec2& b, ImU32 col, float rounding = 0.0f, int rounding_corners_flags = ImDrawCornerFlags_All);                     // a: upper-left, b: lower-right
        AddRectFilled(a, b, col, rounding = 0.0, rounding_corners_flags = exports.wCornerFlags.All) {
            this.native.AddRectFilled(a, b, col, rounding, rounding_corners_flags);
        }
        // IMGUI_API void  AddRectFilledMultiColor(const ImVec2& a, const ImVec2& b, ImU32 col_upr_left, ImU32 col_upr_right, ImU32 col_bot_right, ImU32 col_bot_left);
        AddRectFilledMultiColor(a, b, col_upr_left, col_upr_right, col_bot_right, col_bot_left) {
            this.native.AddRectFilledMultiColor(a, b, col_upr_left, col_upr_right, col_bot_right, col_bot_left);
        }
        // IMGUI_API void  AddQuad(const ImVec2& a, const ImVec2& b, const ImVec2& c, const ImVec2& d, ImU32 col, float thickness = 1.0f);
        AddQuad(a, b, c, d, col, thickness = 1.0) {
            this.native.AddQuad(a, b, c, d, col, thickness);
        }
        // IMGUI_API void  AddQuadFilled(const ImVec2& a, const ImVec2& b, const ImVec2& c, const ImVec2& d, ImU32 col);
        AddQuadFilled(a, b, c, d, col) {
            this.native.AddQuadFilled(a, b, c, d, col);
        }
        // IMGUI_API void  AddTriangle(const ImVec2& a, const ImVec2& b, const ImVec2& c, ImU32 col, float thickness = 1.0f);
        AddTriangle(a, b, c, col, thickness = 1.0) {
            this.native.AddTriangle(a, b, c, col, thickness);
        }
        // IMGUI_API void  AddTriangleFilled(const ImVec2& a, const ImVec2& b, const ImVec2& c, ImU32 col);
        AddTriangleFilled(a, b, c, col) {
            this.native.AddTriangleFilled(a, b, c, col);
        }
        // IMGUI_API void  AddCircle(const ImVec2& centre, float radius, ImU32 col, int num_segments = 12, float thickness = 1.0f);
        AddCircle(centre, radius, col, num_segments = 12, thickness = 1.0) {
            this.native.AddCircle(centre, radius, col, num_segments, thickness);
        }
        // IMGUI_API void  AddCircleFilled(const ImVec2& centre, float radius, ImU32 col, int num_segments = 12);
        AddCircleFilled(centre, radius, col, num_segments = 12) {
            this.native.AddCircleFilled(centre, radius, col, num_segments);
        }
        AddText(...args) {
            if (args[0] instanceof ImFont) {
                const font = args[0];
                const font_size = args[1];
                const pos = args[2];
                const col = args[3];
                const text_begin = args[4];
                const text_end = args[5] || null;
                const wrap_width = args[6] = 0.0;
                const cpu_fine_clip_rect = args[7] || null;
                this.native.AddText_B(font.native, font_size, pos, col, text_end !== null ? text_begin.substring(0, text_end) : text_begin, wrap_width, cpu_fine_clip_rect);
            }
            else {
                const pos = args[0];
                const col = args[1];
                const text_begin = args[2];
                const text_end = args[3] || null;
                this.native.AddText_A(pos, col, text_end !== null ? text_begin.substring(0, text_end) : text_begin);
            }
        }
        // IMGUI_API void  AddImage(ImTextureID user_texture_id, const ImVec2& a, const ImVec2& b, const ImVec2& uv_a = ImVec2(0,0), const ImVec2& uv_b = ImVec2(1,1), ImU32 col = 0xFFFFFFFF);
        AddImage(user_texture_id, a, b, uv_a = ImVec2.ZERO, uv_b = ImVec2.UNIT, col = 0xFFFFFFFF) {
            this.native.AddImage(ImGuiContext.setTexture(user_texture_id), a, b, uv_a, uv_b, col);
        }
        // IMGUI_API void  AddImageQuad(ImTextureID user_texture_id, const ImVec2& a, const ImVec2& b, const ImVec2& c, const ImVec2& d, const ImVec2& uv_a = ImVec2(0,0), const ImVec2& uv_b = ImVec2(1,0), const ImVec2& uv_c = ImVec2(1,1), const ImVec2& uv_d = ImVec2(0,1), ImU32 col = 0xFFFFFFFF);
        AddImageQuad(user_texture_id, a, b, c, d, uv_a = ImVec2.ZERO, uv_b = ImVec2.UNIT_X, uv_c = ImVec2.UNIT, uv_d = ImVec2.UNIT_Y, col = 0xFFFFFFFF) {
            this.native.AddImageQuad(ImGuiContext.setTexture(user_texture_id), a, b, c, d, uv_a, uv_b, uv_c, uv_d, col);
        }
        // IMGUI_API void  AddImageRounded(ImTextureID user_texture_id, const ImVec2& a, const ImVec2& b, const ImVec2& uv_a, const ImVec2& uv_b, ImU32 col, float rounding, int rounding_corners = ImDrawCornerFlags_All);
        AddImageRounded(user_texture_id, a, b, uv_a, uv_b, col, rounding, rounding_corners = exports.wCornerFlags.All) {
            this.native.AddImageRounded(ImGuiContext.setTexture(user_texture_id), a, b, uv_a, uv_b, col, rounding, rounding_corners);
        }
        // IMGUI_API void  AddPolyline(const ImVec2* points, const int num_points, ImU32 col, bool closed, float thickness);
        AddPolyline(points, num_points, col, closed, thickness) {
            this.native.AddPolyline(points, num_points, col, closed, thickness);
        }
        // IMGUI_API void  AddConvexPolyFilled(const ImVec2* points, const int num_points, ImU32 col);
        AddConvexPolyFilled(points, num_points, col) {
            this.native.AddConvexPolyFilled(points, num_points, col);
        }
        // IMGUI_API void  AddBezierCurve(const ImVec2& pos0, const ImVec2& cp0, const ImVec2& cp1, const ImVec2& pos1, ImU32 col, float thickness, int num_segments = 0);
        AddBezierCurve(pos0, cp0, cp1, pos1, col, thickness = 1.0, num_segments = 0) {
            this.native.AddBezierCurve(pos0, cp0, cp1, pos1, col, thickness, num_segments);
        }
        // Stateful path API, add points then finish with PathFill() or PathStroke()
        // inline    void  PathClear()                                                 { _Path.resize(0); }
        PathClear() { this.native.PathClear(); }
        // inline    void  PathLineTo(const ImVec2& pos)                               { _Path.push_back(pos); }
        PathLineTo(pos) { this.native.PathLineTo(pos); }
        // inline    void  PathLineToMergeDuplicate(const ImVec2& pos)                 { if (_Path.Size == 0 || memcmp(&_Path[_Path.Size-1], &pos, 8) != 0) _Path.push_back(pos); }
        PathLineToMergeDuplicate(pos) { this.native.PathLineToMergeDuplicate(pos); }
        // inline    void  PathFillConvex(ImU32 col)                                   { AddConvexPolyFilled(_Path.Data, _Path.Size, col); PathClear(); }
        PathFillConvex(col) { this.native.PathFillConvex(col); }
        // inline    void  PathStroke(ImU32 col, bool closed, float thickness = 1.0f)  { AddPolyline(_Path.Data, _Path.Size, col, closed, thickness); PathClear(); }
        PathStroke(col, closed, thickness = 1.0) { this.native.PathStroke(col, closed, thickness); }
        // IMGUI_API void  PathArcTo(const ImVec2& centre, float radius, float a_min, float a_max, int num_segments = 10);
        PathArcTo(centre, radius, a_min, a_max, num_segments = 10) { this.native.PathArcTo(centre, radius, a_min, a_max, num_segments); }
        // IMGUI_API void  PathArcToFast(const ImVec2& centre, float radius, int a_min_of_12, int a_max_of_12);                                // Use precomputed angles for a 12 steps circle
        PathArcToFast(centre, radius, a_min_of_12, a_max_of_12) { this.native.PathArcToFast(centre, radius, a_min_of_12, a_max_of_12); }
        // IMGUI_API void  PathBezierCurveTo(const ImVec2& p1, const ImVec2& p2, const ImVec2& p3, int num_segments = 0);
        PathBezierCurveTo(p1, p2, p3, num_segments = 0) { this.native.PathBezierCurveTo(p1, p2, p3, num_segments); }
        // IMGUI_API void  PathRect(const ImVec2& rect_min, const ImVec2& rect_max, float rounding = 0.0f, int rounding_corners_flags = ImDrawCornerFlags_All);
        PathRect(rect_min, rect_max, rounding = 0.0, rounding_corners_flags = exports.wCornerFlags.All) { this.native.PathRect(rect_min, rect_max, rounding, rounding_corners_flags); }
        // Channels
        // - Use to simulate layers. By switching channels to can render out-of-order (e.g. submit foreground primitives before background primitives)
        // - Use to minimize draw calls (e.g. if going back-and-forth between multiple non-overlapping clipping rectangles, prefer to append into separate channels then merge at the end)
        // IMGUI_API void  ChannelsSplit(int channels_count);
        ChannelsSplit(channels_count) { this.native.ChannelsSplit(channels_count); }
        // IMGUI_API void  ChannelsMerge();
        ChannelsMerge() { this.native.ChannelsMerge(); }
        // IMGUI_API void  ChannelsSetCurrent(int channel_index);
        ChannelsSetCurrent(channel_index) { this.native.ChannelsSetCurrent(channel_index); }
        // Advanced
        // IMGUI_API void  AddCallback(ImDrawCallback callback, void* callback_data);  // Your rendering function must check for 'UserCallback' in ImDrawCmd and call the function instead of rendering triangles.
        AddCallback(callback, callback_data) {
            const _callback = (parent_list, draw_cmd) => {
                callback(new ImDrawList(parent_list), new ImDrawCmd(draw_cmd));
            };
            this.native.AddCallback(_callback, callback_data);
        }
        // IMGUI_API void  AddDrawCmd();                                               // This is useful if you need to forcefully create a new draw call (to allow for dependent rendering / blending). Otherwise primitives are merged into the same draw-call as much as possible
        AddDrawCmd() { this.native.AddDrawCmd(); }
        // Internal helpers
        // NB: all primitives needs to be reserved via PrimReserve() beforehand!
        // IMGUI_API void  Clear();
        Clear() { this.native.Clear(); }
        // IMGUI_API void  ClearFreeMemory();
        ClearFreeMemory() { this.native.ClearFreeMemory(); }
        // IMGUI_API void  PrimReserve(int idx_count, int vtx_count);
        PrimReserve(idx_count, vtx_count) { this.native.PrimReserve(idx_count, vtx_count); }
        // IMGUI_API void  PrimRect(const ImVec2& a, const ImVec2& b, ImU32 col);      // Axis aligned rectangle (composed of two triangles)
        PrimRect(a, b, col) { this.native.PrimRect(a, b, col); }
        // IMGUI_API void  PrimRectUV(const ImVec2& a, const ImVec2& b, const ImVec2& uv_a, const ImVec2& uv_b, ImU32 col);
        PrimRectUV(a, b, uv_a, uv_b, col) { this.native.PrimRectUV(a, b, uv_a, uv_b, col); }
        // IMGUI_API void  PrimQuadUV(const ImVec2& a, const ImVec2& b, const ImVec2& c, const ImVec2& d, const ImVec2& uv_a, const ImVec2& uv_b, const ImVec2& uv_c, const ImVec2& uv_d, ImU32 col);
        PrimQuadUV(a, b, c, d, uv_a, uv_b, uv_c, uv_d, col) { this.native.PrimQuadUV(a, b, c, d, uv_a, uv_b, uv_c, uv_d, col); }
        // inline    void  PrimWriteVtx(const ImVec2& pos, const ImVec2& uv, ImU32 col){ _VtxWritePtr->pos = pos; _VtxWritePtr->uv = uv; _VtxWritePtr->col = col; _VtxWritePtr++; _VtxCurrentIdx++; }
        PrimWriteVtx(pos, uv, col) { this.native.PrimWriteVtx(pos, uv, col); }
        // inline    void  PrimWriteIdx(ImDrawIdx idx)                                 { *_IdxWritePtr = idx; _IdxWritePtr++; }
        PrimWriteIdx(idx) { this.native.PrimWriteIdx(idx); }
        // inline    void  PrimVtx(const ImVec2& pos, const ImVec2& uv, ImU32 col)     { PrimWriteIdx((ImDrawIdx)_VtxCurrentIdx); PrimWriteVtx(pos, uv, col); }
        PrimVtx(pos, uv, col) { this.native.PrimVtx(pos, uv, col); }
        // IMGUI_API void  UpdateClipRect();
        UpdateClipRect() { this.native.UpdateClipRect(); }
        // IMGUI_API void  UpdateTextureID();
        UpdateTextureID() { this.native.UpdateTextureID(); }
    }
    // All draw data to render an ImGui frame
    class ImDrawData {
        constructor(native) {
            this.native = native;
        }
        IterateDrawLists(callback) {
            this.native.IterateDrawLists((draw_list) => {
                callback(new ImDrawList(draw_list));
            });
        }
        // bool            Valid;                  // Only valid after Render() is called and before the next NewFrame() is called.
        get Valid() { return this.native.Valid; }
        // ImDrawList**    CmdLists;
        // int             CmdListsCount;
        get CmdListsCount() { return this.native.CmdListsCount; }
        // int             TotalIdxCount;          // For convenience, sum of all cmd_lists idx_buffer.Size
        get TotalIdxCount() { return this.native.TotalIdxCount; }
        // int             TotalVtxCount;          // For convenience, sum of all cmd_lists vtx_buffer.Size
        get TotalVtxCount() { return this.native.TotalVtxCount; }
        // ImVec2          DisplayPos;             // Upper-left position of the viewport to render (== upper-left of the orthogonal projection matrix to use)
        get DisplayPos() { return this.native.DisplayPos; }
        // ImVec2          DisplaySize;            // Size of the viewport to render (== io.DisplaySize for the main viewport) (DisplayPos + DisplaySize == lower-right of the orthogonal projection matrix to use)
        get DisplaySize() { return this.native.DisplaySize; }
        // ImVec2          FramebufferScale;       // Amount of pixels for each unit of DisplaySize. Based on io.DisplayFramebufferScale. Generally (1,1) on normal display, (2,2) on OSX with Retina display.
        get FramebufferScale() { return this.native.FramebufferScale; }
        // Functions
        // ImDrawData() { Valid = false; CmdLists = NULL; CmdListsCount = TotalVtxCount = TotalIdxCount = 0; }
        // IMGUI_API void DeIndexAllBuffers();               // For backward compatibility or convenience: convert all buffers from indexed to de-indexed, in case you cannot render indexed. Note: this is slow and most likely a waste of resources. Always prefer indexed rendering!
        DeIndexAllBuffers() { this.native.DeIndexAllBuffers(); }
        // IMGUI_API void ScaleClipRects(const ImVec2& fb_scale);  // Helper to scale the ClipRect field of each ImDrawCmd. Use if your final output buffer is at a different scale than ImGui expects, or if there is a difference between your window resolution and framebuffer resolution.
        ScaleClipRects(fb_scale) {
            this.native.ScaleClipRects(fb_scale);
        }
    }
    class script_ImFontConfig {
        constructor() {
            // void*           FontData;                   //          // TTF/OTF data
            // int             FontDataSize;               //          // TTF/OTF data size
            this.FontData = null;
            // bool            FontDataOwnedByAtlas;       // true     // TTF/OTF data ownership taken by the container ImFontAtlas (will delete memory itself).
            this.FontDataOwnedByAtlas = true;
            // int             FontNo;                     // 0        // Index of font within TTF/OTF file
            this.FontNo = 0;
            // float           SizePixels;                 //          // Size in pixels for rasterizer.
            this.SizePixels = 0;
            // int             OversampleH, OversampleV;   // 3, 1     // Rasterize at higher quality for sub-pixel positioning. We don't use sub-pixel positions on the Y axis.
            this.OversampleH = 3;
            this.OversampleV = 1;
            // bool            PixelSnapH;                 // false    // Align every glyph to pixel boundary. Useful e.g. if you are merging a non-pixel aligned font with the default font. If enabled, you can set OversampleH/V to 1.
            this.PixelSnapH = false;
            // ImVec2          GlyphExtraSpacing;          // 0, 0     // Extra spacing (in pixels) between glyphs. Only X axis is supported for now.
            this.GlyphExtraSpacing = new ImVec2(0, 0);
            // ImVec2          GlyphOffset;                // 0, 0     // Offset all glyphs from this font input.
            this.GlyphOffset = new ImVec2(0, 0);
            // const ImWchar*  GlyphRanges;                // NULL     // Pointer to a user-provided list of Unicode range (2 value per range, values are inclusive, zero-terminated list). THE ARRAY DATA NEEDS TO PERSIST AS LONG AS THE FONT IS ALIVE.
            this.GlyphRanges = null;
            // float           GlyphMinAdvanceX;           // 0        // Minimum AdvanceX for glyphs, set Min to align font icons, set both Min/Max to enforce mono-space font
            this.GlyphMinAdvanceX = 0;
            // float           GlyphMaxAdvanceX;           // FLT_MAX  // Maximum AdvanceX for glyphs
            this.GlyphMaxAdvanceX = Number.MAX_VALUE;
            // bool            MergeMode;                  // false    // Merge into previous ImFont, so you can combine multiple inputs font into one ImFont (e.g. ASCII font + icons + Japanese glyphs). You may want to use GlyphOffset.y when merge font of different heights.
            this.MergeMode = false;
            // unsigned int    RasterizerFlags;            // 0x00     // Settings for custom font rasterizer (e.g. ImGuiFreeType). Leave as zero if you aren't using one.
            this.RasterizerFlags = 0;
            // float           RasterizerMultiply;         // 1.0f     // Brighten (>1.0f) or darken (<1.0f) font output. Brightening small fonts may be a good workaround to make them more readable.
            this.RasterizerMultiply = 1.0;
            // [Internal]
            // char            Name[32];                               // Name (strictly to ease debugging)
            this.Name = "";
            // ImFont*         DstFont;
            this.DstFont = null;
            // IMGUI_API ImFontConfig();
        }
    }
    class ImFontConfig {
        constructor(internal = new script_ImFontConfig()) {
            this.internal = internal;
        }
        // void*           FontData;                   //          // TTF/OTF data
        // int             FontDataSize;               //          // TTF/OTF data size
        get FontData() { return this.internal.FontData; }
        // bool            FontDataOwnedByAtlas;       // true     // TTF/OTF data ownership taken by the container ImFontAtlas (will delete memory itself).
        get FontDataOwnedByAtlas() { return this.internal.FontDataOwnedByAtlas; }
        // int             FontNo;                     // 0        // Index of font within TTF/OTF file
        get FontNo() { return this.internal.FontNo; }
        // float           SizePixels;                 //          // Size in pixels for rasterizer.
        get SizePixels() { return this.internal.SizePixels; }
        // int             OversampleH, OversampleV;   // 3, 1     // Rasterize at higher quality for sub-pixel positioning. We don't use sub-pixel positions on the Y axis.
        get OversampleH() { return this.internal.OversampleH; }
        get OversampleV() { return this.internal.OversampleV; }
        // bool            PixelSnapH;                 // false    // Align every glyph to pixel boundary. Useful e.g. if you are merging a non-pixel aligned font with the default font. If enabled, you can set OversampleH/V to 1.
        get PixelSnapH() { return this.internal.PixelSnapH; }
        // ImVec2          GlyphExtraSpacing;          // 0, 0     // Extra spacing (in pixels) between glyphs. Only X axis is supported for now.
        get GlyphExtraSpacing() { return this.internal.GlyphExtraSpacing; }
        // ImVec2          GlyphOffset;                // 0, 0     // Offset all glyphs from this font input.
        get GlyphOffset() { return this.internal.GlyphOffset; }
        // const ImWchar*  GlyphRanges;                // NULL     // Pointer to a user-provided list of Unicode range (2 value per range, values are inclusive, zero-terminated list). THE ARRAY DATA NEEDS TO PERSIST AS LONG AS THE FONT IS ALIVE.
        get GlyphRanges() { return this.internal.GlyphRanges; }
        // float           GlyphMinAdvanceX;           // 0        // Minimum AdvanceX for glyphs, set Min to align font icons, set both Min/Max to enforce mono-space font
        get GlyphMinAdvanceX() { return this.internal.GlyphMinAdvanceX; }
        // float           GlyphMaxAdvanceX;           // FLT_MAX  // Maximum AdvanceX for glyphs
        get GlyphMaxAdvanceX() { return this.internal.GlyphMaxAdvanceX; }
        // bool            MergeMode;                  // false    // Merge into previous ImFont, so you can combine multiple inputs font into one ImFont (e.g. ASCII font + icons + Japanese glyphs). You may want to use GlyphOffset.y when merge font of different heights.
        get MergeMode() { return this.internal.MergeMode; }
        // unsigned int    RasterizerFlags;            // 0x00     // Settings for custom font rasterizer (e.g. ImGuiFreeType). Leave as zero if you aren't using one.
        get RasterizerFlags() { return this.internal.RasterizerFlags; }
        // float           RasterizerMultiply;         // 1.0f     // Brighten (>1.0f) or darken (<1.0f) font output. Brightening small fonts may be a good workaround to make them more readable.
        get RasterizerMultiply() { return this.internal.RasterizerMultiply; }
        // [Internal]
        // char            Name[32];                               // Name (strictly to ease debugging)
        get Name() { return this.internal.Name; }
        set Name(value) { this.internal.Name = value; }
        // ImFont*         DstFont;
        get DstFont() {
            const font = this.internal.DstFont;
            return font && new ImFont(font);
        }
    }
    // struct ImFontGlyph
    class script_ImFontGlyph {
        constructor() {
            // ImWchar         Codepoint;          // 0x0000..0xFFFF
            this.Codepoint = 0;
            // float           AdvanceX;           // Distance to next character (= data from font + ImFontConfig::GlyphExtraSpacing.x baked in)
            this.AdvanceX = 0.0;
            // float           X0, Y0, X1, Y1;     // Glyph corners
            this.X0 = 0.0;
            this.Y0 = 0.0;
            this.X1 = 1.0;
            this.Y1 = 1.0;
            // float           U0, V0, U1, V1;     // Texture coordinates
            this.U0 = 0.0;
            this.V0 = 0.0;
            this.U1 = 1.0;
            this.V1 = 1.0;
        }
    }
    class ImFontGlyph {
        constructor(internal = new script_ImFontGlyph()) {
            this.internal = internal;
        }
        // ImWchar         Codepoint;          // 0x0000..0xFFFF
        get Codepoint() { return this.internal.Codepoint; }
        // float           AdvanceX;           // Distance to next character (= data from font + ImFontConfig::GlyphExtraSpacing.x baked in)
        get AdvanceX() { return this.internal.AdvanceX; }
        ;
        // float           X0, Y0, X1, Y1;     // Glyph corners
        get X0() { return this.internal.X0; }
        ;
        get Y0() { return this.internal.Y0; }
        ;
        get X1() { return this.internal.X1; }
        ;
        get Y1() { return this.internal.Y1; }
        ;
        // float           U0, V0, U1, V1;     // Texture coordinates
        get U0() { return this.internal.U0; }
        ;
        get V0() { return this.internal.V0; }
        ;
        get U1() { return this.internal.U1; }
        ;
        get V1() { return this.internal.V1; }
        ;
    }
    (function (ImFontAtlasFlags) {
        ImFontAtlasFlags[ImFontAtlasFlags["None"] = 0] = "None";
        ImFontAtlasFlags[ImFontAtlasFlags["NoPowerOfTwoHeight"] = 1] = "NoPowerOfTwoHeight";
        ImFontAtlasFlags[ImFontAtlasFlags["NoMouseCursors"] = 2] = "NoMouseCursors";
    })(exports.ImFontAtlasFlags || (exports.ImFontAtlasFlags = {}));
    // Load and rasterize multiple TTF/OTF fonts into a same texture.
    // Sharing a texture for multiple fonts allows us to reduce the number of draw calls during rendering.
    // We also add custom graphic data into the texture that serves for ImGui.
    //  1. (Optional) Call AddFont*** functions. If you don't call any, the default font will be loaded for you.
    //  2. Call GetTexDataAsAlpha8() or GetTexDataAsRGBA32() to build and retrieve pixels data.
    //  3. Upload the pixels data into a texture within your graphics system.
    //  4. Call SetTexID(my_tex_id); and pass the pointer/identifier to your texture. This value will be passed back to you during rendering to identify the texture.
    // IMPORTANT: If you pass a 'glyph_ranges' array to AddFont*** functions, you need to make sure that your array persist up until the ImFont is build (when calling GetTextData*** or Build()). We only copy the pointer, not the data.
    class ImFontAtlas {
        constructor(native) {
            this.native = native;
        }
        // IMGUI_API ImFontAtlas();
        // IMGUI_API ~ImFontAtlas();
        // IMGUI_API ImFont*           AddFont(const ImFontConfig* font_cfg);
        // IMGUI_API ImFont*           AddFontDefault(const ImFontConfig* font_cfg = NULL);
        AddFontDefault(font_cfg = null) {
            return new ImFont(this.native.AddFontDefault(font_cfg));
        }
        // IMGUI_API ImFont*           AddFontFromFileTTF(const char* filename, float size_pixels, const ImFontConfig* font_cfg = NULL, const ImWchar* glyph_ranges = NULL);
        // IMGUI_API ImFont*           AddFontFromMemoryTTF(void* font_data, int font_size, float size_pixels, const ImFontConfig* font_cfg = NULL, const ImWchar* glyph_ranges = NULL); // Note: Transfer ownership of 'ttf_data' to ImFontAtlas! Will be deleted after Build(). Set font_cfg->FontDataOwnedByAtlas to false to keep ownership.
        AddFontFromMemoryTTF(data, size_pixels, font_cfg = null, glyph_ranges = null) {
            return new ImFont(this.native.AddFontFromMemoryTTF(new Uint8Array(data), size_pixels, font_cfg && font_cfg.internal, glyph_ranges));
        }
        // IMGUI_API ImFont*           AddFontFromMemoryCompressedTTF(const void* compressed_font_data, int compressed_font_size, float size_pixels, const ImFontConfig* font_cfg = NULL, const ImWchar* glyph_ranges = NULL); // 'compressed_font_data' still owned by caller. Compress with binary_to_compressed_c.cpp.
        // IMGUI_API ImFont*           AddFontFromMemoryCompressedBase85TTF(const char* compressed_font_data_base85, float size_pixels, const ImFontConfig* font_cfg = NULL, const ImWchar* glyph_ranges = NULL);              // 'compressed_font_data_base85' still owned by caller. Compress with binary_to_compressed_c.cpp with -base85 parameter.
        // IMGUI_API void              ClearTexData();             // Clear the CPU-side texture data. Saves RAM once the texture has been copied to graphics memory.
        ClearTexData() { this.native.ClearTexData(); }
        // IMGUI_API void              ClearInputData();           // Clear the input TTF data (inc sizes, glyph ranges)
        ClearInputData() { this.native.ClearInputData(); }
        // IMGUI_API void              ClearFonts();               // Clear the ImGui-side font data (glyphs storage, UV coordinates)
        ClearFonts() { this.native.ClearFonts(); }
        // IMGUI_API void              Clear();                    // Clear all
        Clear() { this.native.Clear(); }
        // Build atlas, retrieve pixel data.
        // User is in charge of copying the pixels into graphics memory (e.g. create a texture with your engine). Then store your texture handle with SetTexID().
        // RGBA32 format is provided for convenience and compatibility, but note that unless you use CustomRect to draw color data, the RGB pixels emitted from Fonts will all be white (~75% of waste).
        // Pitch = Width * BytesPerPixels
        // IMGUI_API bool              Build();                    // Build pixels data. This is called automatically for you by the GetTexData*** functions.
        Build() { return this.native.Build(); }
        // IMGUI_API bool              IsBuilt()                   { return Fonts.Size > 0 && (TexPixelsAlpha8 != NULL || TexPixelsRGBA32 != NULL); }
        IsBuilt() { return this.native.IsBuilt(); }
        // IMGUI_API void              GetTexDataAsAlpha8(unsigned char** out_pixels, int* out_width, int* out_height, int* out_bytes_per_pixel = NULL);  // 1 byte per-pixel
        GetTexDataAsAlpha8() {
            return this.native.GetTexDataAsAlpha8();
        }
        // IMGUI_API void              GetTexDataAsRGBA32(unsigned char** out_pixels, int* out_width, int* out_height, int* out_bytes_per_pixel = NULL);  // 4 bytes-per-pixel
        GetTexDataAsRGBA32() {
            return this.native.GetTexDataAsRGBA32();
        }
        // void                        SetTexID(ImTextureID id)    { TexID = id; }
        SetTexID(id) { this.TexID = id; }
        //-------------------------------------------
        // Glyph Ranges
        //-------------------------------------------
        // Helpers to retrieve list of common Unicode ranges (2 value per range, values are inclusive, zero-terminated list)
        // NB: Make sure that your string are UTF-8 and NOT in your local code page. In C++11, you can create UTF-8 string literal using the u8"Hello world" syntax. See FAQ for details.
        // IMGUI_API const ImWchar*    GetGlyphRangesDefault();    // Basic Latin, Extended Latin
        GetGlyphRangesDefault() { return this.native.GetGlyphRangesDefault(); }
        // IMGUI_API const ImWchar*    GetGlyphRangesKorean();     // Default + Korean characters
        GetGlyphRangesKorean() { return this.native.GetGlyphRangesKorean(); }
        // IMGUI_API const ImWchar*    GetGlyphRangesJapanese();   // Default + Hiragana, Katakana, Half-Width, Selection of 1946 Ideographs
        GetGlyphRangesJapanese() { return this.native.GetGlyphRangesJapanese(); }
        // IMGUI_API const ImWchar*    GetGlyphRangesChineseFull();            // Default + Half-Width + Japanese Hiragana/Katakana + full set of about 21000 CJK Unified Ideographs
        GetGlyphRangesChineseFull() { return this.native.GetGlyphRangesChineseFull(); }
        // IMGUI_API const ImWchar*    GetGlyphRangesChineseSimplifiedCommon();// Default + Half-Width + Japanese Hiragana/Katakana + set of 2500 CJK Unified Ideographs for common simplified Chinese
        GetGlyphRangesChineseSimplifiedCommon() { return this.native.GetGlyphRangesChineseSimplifiedCommon(); }
        // IMGUI_API const ImWchar*    GetGlyphRangesCyrillic();   // Default + about 400 Cyrillic characters
        GetGlyphRangesCyrillic() { return this.native.GetGlyphRangesCyrillic(); }
        // IMGUI_API const ImWchar*    GetGlyphRangesThai();       // Default + Thai characters
        GetGlyphRangesThai() { return this.native.GetGlyphRangesThai(); }
        // IMGUI_API const ImWchar*    GetGlyphRangesVietnamese();       // Default + Vietnamese characters
        GetGlyphRangesVietnamese() { return this.native.GetGlyphRangesVietnamese(); }
        // Helpers to build glyph ranges from text data. Feed your application strings/characters to it then call BuildRanges().
        // struct GlyphRangesBuilder
        // {
        //     ImVector<unsigned char> UsedChars;  // Store 1-bit per Unicode code point (0=unused, 1=used)
        //     GlyphRangesBuilder()                { UsedChars.resize(0x10000 / 8); memset(UsedChars.Data, 0, 0x10000 / 8); }
        //     bool           GetBit(int n) const  { return (UsedChars[n >> 3] & (1 << (n & 7))) != 0; }
        //     void           SetBit(int n)        { UsedChars[n >> 3] |= 1 << (n & 7); }  // Set bit 'c' in the array
        //     void           AddChar(ImWchar c)   { SetBit(c); }                          // Add character
        //     IMGUI_API void AddText(const char* text, const char* text_end = NULL);      // Add string (each character of the UTF-8 string are added)
        //     IMGUI_API void AddRanges(const ImWchar* ranges);                            // Add ranges, e.g. builder.AddRanges(ImFontAtlas::GetGlyphRangesDefault) to force add all of ASCII/Latin+Ext
        //     IMGUI_API void BuildRanges(ImVector<ImWchar>* out_ranges);                  // Output new ranges
        // };
        //-------------------------------------------
        // Custom Rectangles/Glyphs API
        //-------------------------------------------
        // You can request arbitrary rectangles to be packed into the atlas, for your own purposes. After calling Build(), you can query the rectangle position and render your pixels.
        // You can also request your rectangles to be mapped as font glyph (given a font + Unicode point), so you can render e.g. custom colorful icons and use them as regular glyphs.
        // struct CustomRect
        // {
        //     unsigned int    ID;             // Input    // User ID. Use <0x10000 to map into a font glyph, >=0x10000 for other/internal/custom texture data.
        //     unsigned short  Width, Height;  // Input    // Desired rectangle dimension
        //     unsigned short  X, Y;           // Output   // Packed position in Atlas
        //     float           GlyphAdvanceX;  // Input    // For custom font glyphs only (ID<0x10000): glyph xadvance
        //     ImVec2          GlyphOffset;    // Input    // For custom font glyphs only (ID<0x10000): glyph display offset
        //     ImFont*         Font;           // Input    // For custom font glyphs only (ID<0x10000): target font
        //     CustomRect()            { ID = 0xFFFFFFFF; Width = Height = 0; X = Y = 0xFFFF; GlyphAdvanceX = 0.0f; GlyphOffset = ImVec2(0,0); Font = NULL; }
        //     bool IsPacked() const   { return X != 0xFFFF; }
        // };
        // IMGUI_API int       AddCustomRectRegular(unsigned int id, int width, int height);                                                                   // Id needs to be >= 0x10000. Id >= 0x80000000 are reserved for ImGui and ImDrawList
        // IMGUI_API int       AddCustomRectFontGlyph(ImFont* font, ImWchar id, int width, int height, float advance_x, const ImVec2& offset = ImVec2(0,0));   // Id needs to be < 0x10000 to register a rectangle to map into a specific font.
        // IMGUI_API void      CalcCustomRectUV(const CustomRect* rect, ImVec2* out_uv_min, ImVec2* out_uv_max);
        // const CustomRect*   GetCustomRectByIndex(int index) const { if (index < 0) return NULL; return &CustomRects[index]; }
        //-------------------------------------------
        // Members
        //-------------------------------------------
        // bool                        Locked;             // Marked as Locked by ImGui::NewFrame() so attempt to modify the atlas will assert.
        get Locked() { return this.native.Locked; }
        set Locked(value) { this.native.Locked = value; }
        // ImFontAtlasFlags            Flags;              // Build flags (see ImFontAtlasFlags_)
        get Flags() { return this.native.Flags; }
        set Flags(value) { this.native.Flags = value; }
        // ImTextureID                 TexID;              // User data to refer to the texture once it has been uploaded to user's graphic systems. It is passed back to you during rendering via the ImDrawCmd structure.
        get TexID() {
            return ImGuiContext.getTexture(this.native.TexID);
        }
        set TexID(value) {
            this.native.TexID = ImGuiContext.setTexture(value);
        }
        // int                         TexDesiredWidth;    // Texture width desired by user before Build(). Must be a power-of-two. If have many glyphs your graphics API have texture size restrictions you may want to increase texture width to decrease height.
        get TexDesiredWidth() { return this.native.TexDesiredWidth; }
        set TexDesiredWidth(value) { this.native.TexDesiredWidth = value; }
        // int                         TexGlyphPadding;    // Padding between glyphs within texture in pixels. Defaults to 1.
        get TexGlyphPadding() { return this.native.TexGlyphPadding; }
        set TexGlyphPadding(value) { this.native.TexGlyphPadding = value; }
        // [Internal]
        // NB: Access texture data via GetTexData*() calls! Which will setup a default font for you.
        // unsigned char*              TexPixelsAlpha8;    // 1 component per pixel, each component is unsigned 8-bit. Total size = TexWidth * TexHeight
        // unsigned int*               TexPixelsRGBA32;    // 4 component per pixel, each component is unsigned 8-bit. Total size = TexWidth * TexHeight * 4
        // int                         TexWidth;           // Texture width calculated during Build().
        get TexWidth() { return this.native.TexWidth; }
        // int                         TexHeight;          // Texture height calculated during Build().
        get TexHeight() { return this.native.TexHeight; }
        // ImVec2                      TexUvScale;         // = (1.0f/TexWidth, 1.0f/TexHeight)
        get TexUvScale() { return this.native.TexUvScale; }
        // ImVec2                      TexUvWhitePixel;    // Texture coordinates to a white pixel
        get TexUvWhitePixel() { return this.native.TexUvWhitePixel; }
        // ImVector<ImFont*>           Fonts;              // Hold all the fonts returned by AddFont*. Fonts[0] is the default font upon calling ImGui::NewFrame(), use ImGui::PushFont()/PopFont() to change the current font.
        get Fonts() {
            const fonts = new ImVector();
            this.native.IterateFonts((font) => {
                fonts.push(new ImFont(font));
            });
            return fonts;
        }
    }
    // Font runtime data and rendering
    // ImFontAtlas automatically loads a default embedded font for you when you call GetTexDataAsAlpha8() or GetTexDataAsRGBA32().
    class ImFont {
        constructor(native) {
            this.native = native;
        }
        // Members: Hot ~62/78 bytes
        // float                       FontSize;           // <user set>   // Height of characters, set during loading (don't change after loading)
        get FontSize() { return this.native.FontSize; }
        // float                       Scale;              // = 1.f        // Base font scale, multiplied by the per-window font scale which you can adjust with SetFontScale()
        get Scale() { return this.native.Scale; }
        set Scale(value) { this.native.Scale = value; }
        // ImVec2                      DisplayOffset;      // = (0.f,1.f)  // Offset font rendering by xx pixels
        get DisplayOffset() { return this.native.DisplayOffset; }
        // ImVector<ImFontGlyph>       Glyphs;             //              // All glyphs.
        get Glyphs() {
            const glyphs = new ImVector();
            this.native.IterateGlyphs((glyph) => {
                glyphs.push(new ImFontGlyph(glyph)); // TODO: wrap native
            });
            return glyphs;
        }
        // ImVector<float>             IndexAdvanceX;      //              // Sparse. Glyphs->AdvanceX in a directly indexable way (more cache-friendly, for CalcTextSize functions which are often bottleneck in large UI).
        // get IndexAdvanceX(): any { return this.native.IndexAdvanceX; }
        // ImVector<unsigned short>    IndexLookup;        //              // Sparse. Index glyphs by Unicode code-point.
        // get IndexLookup(): any { return this.native.IndexLookup; }
        // const ImFontGlyph*          FallbackGlyph;      // == FindGlyph(FontFallbackChar)
        get FallbackGlyph() {
            const glyph = this.native.FallbackGlyph;
            return glyph && new ImFontGlyph(glyph);
        }
        set FallbackGlyph(value) {
            this.native.FallbackGlyph = value && value.internal;
        }
        // float                       FallbackAdvanceX;   // == FallbackGlyph->AdvanceX
        get FallbackAdvanceX() { return this.native.FallbackAdvanceX; }
        // ImWchar                     FallbackChar;       // = '?'        // Replacement glyph if one isn't found. Only set via SetFallbackChar()
        get FallbackChar() { return this.native.FallbackChar; }
        // Members: Cold ~18/26 bytes
        // short                       ConfigDataCount;    // ~ 1          // Number of ImFontConfig involved in creating this font. Bigger than 1 when merging multiple font sources into one ImFont.
        get ConfigDataCount() { return this.ConfigData.length; }
        // ImFontConfig*               ConfigData;         //              // Pointer within ContainerAtlas->ConfigData
        get ConfigData() {
            const cfg_data = [];
            this.native.IterateConfigData((cfg) => {
                cfg_data.push(new ImFontConfig(cfg));
            });
            return cfg_data;
        }
        // ImFontAtlas*                ContainerAtlas;     //              // What we has been loaded into
        get ContainerAtlas() { return null; }
        // float                       Ascent, Descent;    //              // Ascent: distance from top to bottom of e.g. 'A' [0..FontSize]
        get Ascent() { return this.native.Ascent; }
        get Descent() { return this.native.Descent; }
        // int                         MetricsTotalSurface;//              // Total surface in pixels to get an idea of the font rasterization/texture cost (not exact, we approximate the cost of padding between glyphs)
        get MetricsTotalSurface() { return this.native.MetricsTotalSurface; }
        // Methods
        // IMGUI_API ImFont();
        // IMGUI_API ~ImFont();
        // IMGUI_API void              ClearOutputData();
        ClearOutputData() { return this.native.ClearOutputData(); }
        // IMGUI_API void              BuildLookupTable();
        BuildLookupTable() { return this.native.BuildLookupTable(); }
        // IMGUI_API const ImFontGlyph*FindGlyph(ImWchar c) const;
        FindGlyph(c) {
            const glyph = this.native.FindGlyph(c);
            return glyph && new ImFontGlyph(glyph);
        }
        // IMGUI_API const ImFontGlyph*FindGlyphNoFallback(ImWchar c) const;
        FindGlyphNoFallback(c) {
            const glyph = this.native.FindGlyphNoFallback(c);
            return glyph && new ImFontGlyph(glyph);
        }
        // IMGUI_API void              SetFallbackChar(ImWchar c);
        SetFallbackChar(c) { return this.native.SetFallbackChar(c); }
        // float                       GetCharAdvance(ImWchar c) const     { return ((int)c < IndexAdvanceX.Size) ? IndexAdvanceX[(int)c] : FallbackAdvanceX; }
        GetCharAdvance(c) { return this.native.GetCharAdvance(c); }
        // bool                        IsLoaded() const                    { return ContainerAtlas != NULL; }
        IsLoaded() { return this.native.IsLoaded(); }
        // const char*                 GetDebugName() const                { return ConfigData ? ConfigData->Name : "<unknown>"; }
        GetDebugName() { return this.native.GetDebugName(); }
        // 'max_width' stops rendering after a certain width (could be turned into a 2d size). FLT_MAX to disable.
        // 'wrap_width' enable automatic word-wrapping across multiple lines to fit into given width. 0.0f to disable.
        // IMGUI_API ImVec2            CalcTextSizeA(float size, float max_width, float wrap_width, const char* text_begin, const char* text_end = NULL, const char** remaining = NULL) const; // utf8
        CalcTextSizeA(size, max_width, wrap_width, text_begin, text_end = null, remaining = null) {
            return this.native.CalcTextSizeA(size, max_width, wrap_width, text_end !== null ? text_begin.substring(0, text_end) : text_begin, remaining, new ImVec2());
        }
        // IMGUI_API const char*       CalcWordWrapPositionA(float scale, const char* text, const char* text_end, float wrap_width) const;
        CalcWordWrapPositionA(scale, text, text_end = null, wrap_width) {
            return this.native.CalcWordWrapPositionA(scale, text_end !== null ? text.substring(0, text_end) : text, wrap_width);
        }
        // IMGUI_API void              RenderChar(ImDrawList* draw_list, float size, ImVec2 pos, ImU32 col, unsigned short c) const;
        RenderChar(draw_list, size, pos, col, c) {
            this.native.RenderChar(draw_list.native, size, pos, col, c);
        }
        // IMGUI_API void              RenderText(ImDrawList* draw_list, float size, ImVec2 pos, ImU32 col, const ImVec4& clip_rect, const char* text_begin, const char* text_end, float wrap_width = 0.0f, bool cpu_fine_clip = false) const;
        RenderText(draw_list, size, pos, col, clip_rect, text_begin, text_end = null, wrap_width = 0.0, cpu_fine_clip = false) { }
    }
    // a script version of BindImGui.ImGuiStyle with matching interface
    class script_ImGuiStyle {
        constructor() {
            this.Alpha = 1.0;
            this.WindowPadding = new ImVec2(8, 8);
            this.WindowRounding = 7.0;
            this.WindowBorderSize = 0.0;
            this.WindowMinSize = new ImVec2(32, 32);
            this.WindowTitleAlign = new ImVec2(0.0, 0.5);
            this.WindowMenuButtonPosition = exports.ImGuiDir.Left;
            this.ChildRounding = 0.0;
            this.ChildBorderSize = 1.0;
            this.PopupRounding = 0.0;
            this.PopupBorderSize = 1.0;
            this.FramePadding = new ImVec2(4, 3);
            this.FrameRounding = 0.0;
            this.FrameBorderSize = 0.0;
            this.ItemSpacing = new ImVec2(8, 4);
            this.ItemInnerSpacing = new ImVec2(4, 4);
            this.TouchExtraPadding = new ImVec2(0, 0);
            this.IndentSpacing = 21.0;
            this.ColumnsMinSpacing = 6.0;
            this.ScrollbarSize = 16.0;
            this.ScrollbarRounding = 9.0;
            this.GrabMinSize = 10.0;
            this.GrabRounding = 0.0;
            this.TabRounding = 0.0;
            this.TabBorderSize = 0.0;
            this.ButtonTextAlign = new ImVec2(0.5, 0.5);
            this.SelectableTextAlign = new ImVec2(0.0, 0.0);
            this.DisplayWindowPadding = new ImVec2(22, 22);
            this.DisplaySafeAreaPadding = new ImVec2(4, 4);
            this.MouseCursorScale = 1;
            this.AntiAliasedLines = true;
            this.AntiAliasedFill = true;
            this.CurveTessellationTol = 1.25;
            this.Colors = [];
            for (let i = 0; i < exports.ImGuiCol.COUNT; ++i) {
                this.Colors[i] = new ImVec4();
            }
            const _this = new ImGuiStyle(this);
            const native = new exports.bind.ImGuiStyle();
            const _that = new ImGuiStyle(native);
            _that.Copy(_this);
            exports.bind.StyleColorsClassic(native);
            _this.Copy(_that);
            native.delete();
        }
        _getAt_Colors(index) { return this.Colors[index]; }
        _setAt_Colors(index, color) { this.Colors[index].Copy(color); return true; }
        ScaleAllSizes(scale_factor) {
            const _this = new ImGuiStyle(this);
            const native = new exports.bind.ImGuiStyle();
            const _that = new ImGuiStyle(native);
            _that.Copy(_this);
            native.ScaleAllSizes(scale_factor);
            _this.Copy(_that);
            native.delete();
        }
    }
    class ImGuiStyle {
        constructor(internal = new script_ImGuiStyle()) {
            this.internal = internal;
            this.Colors = new Proxy([], {
                get: (target, key) => {
                    if (key === "length") {
                        return exports.ImGuiCol.COUNT;
                    }
                    return this.internal._getAt_Colors(Number(key));
                },
                set: (target, key, value) => {
                    return this.internal._setAt_Colors(Number(key), value);
                },
            });
        }
        get Alpha() { return this.internal.Alpha; }
        set Alpha(value) { this.internal.Alpha = value; }
        get WindowPadding() { return this.internal.WindowPadding; }
        get WindowRounding() { return this.internal.WindowRounding; }
        set WindowRounding(value) { this.internal.WindowRounding = value; }
        get WindowBorderSize() { return this.internal.WindowBorderSize; }
        set WindowBorderSize(value) { this.internal.WindowBorderSize = value; }
        get WindowMinSize() { return this.internal.WindowMinSize; }
        get WindowTitleAlign() { return this.internal.WindowTitleAlign; }
        get WindowMenuButtonPosition() { return this.internal.WindowMenuButtonPosition; }
        set WindowMenuButtonPosition(value) { this.internal.WindowMenuButtonPosition = value; }
        get ChildRounding() { return this.internal.ChildRounding; }
        set ChildRounding(value) { this.internal.ChildRounding = value; }
        get ChildBorderSize() { return this.internal.ChildBorderSize; }
        set ChildBorderSize(value) { this.internal.ChildBorderSize = value; }
        get PopupRounding() { return this.internal.PopupRounding; }
        set PopupRounding(value) { this.internal.PopupRounding = value; }
        get PopupBorderSize() { return this.internal.PopupBorderSize; }
        set PopupBorderSize(value) { this.internal.PopupBorderSize = value; }
        get FramePadding() { return this.internal.FramePadding; }
        get FrameRounding() { return this.internal.FrameRounding; }
        set FrameRounding(value) { this.internal.FrameRounding = value; }
        get FrameBorderSize() { return this.internal.FrameBorderSize; }
        set FrameBorderSize(value) { this.internal.FrameBorderSize = value; }
        get ItemSpacing() { return this.internal.ItemSpacing; }
        get ItemInnerSpacing() { return this.internal.ItemInnerSpacing; }
        get TouchExtraPadding() { return this.internal.TouchExtraPadding; }
        get IndentSpacing() { return this.internal.IndentSpacing; }
        set IndentSpacing(value) { this.internal.IndentSpacing = value; }
        get ColumnsMinSpacing() { return this.internal.ColumnsMinSpacing; }
        set ColumnsMinSpacing(value) { this.internal.ColumnsMinSpacing = value; }
        get ScrollbarSize() { return this.internal.ScrollbarSize; }
        set ScrollbarSize(value) { this.internal.ScrollbarSize = value; }
        get ScrollbarRounding() { return this.internal.ScrollbarRounding; }
        set ScrollbarRounding(value) { this.internal.ScrollbarRounding = value; }
        get GrabMinSize() { return this.internal.GrabMinSize; }
        set GrabMinSize(value) { this.internal.GrabMinSize = value; }
        get GrabRounding() { return this.internal.GrabRounding; }
        set GrabRounding(value) { this.internal.GrabRounding = value; }
        get TabRounding() { return this.internal.TabRounding; }
        set TabRounding(value) { this.internal.TabRounding = value; }
        get TabBorderSize() { return this.internal.TabBorderSize; }
        set TabBorderSize(value) { this.internal.TabBorderSize = value; }
        get ButtonTextAlign() { return this.internal.ButtonTextAlign; }
        get SelectableTextAlign() { return this.internal.SelectableTextAlign; }
        get DisplayWindowPadding() { return this.internal.DisplayWindowPadding; }
        get DisplaySafeAreaPadding() { return this.internal.DisplaySafeAreaPadding; }
        get MouseCursorScale() { return this.internal.MouseCursorScale; }
        set MouseCursorScale(value) { this.internal.MouseCursorScale = value; }
        get AntiAliasedLines() { return this.internal.AntiAliasedLines; }
        set AntiAliasedLines(value) { this.internal.AntiAliasedLines = value; }
        get AntiAliasedFill() { return this.internal.AntiAliasedFill; }
        set AntiAliasedFill(value) { this.internal.AntiAliasedFill = value; }
        get CurveTessellationTol() { return this.internal.CurveTessellationTol; }
        set CurveTessellationTol(value) { this.internal.CurveTessellationTol = value; }
        Copy(other) {
            this.Alpha = other.Alpha;
            this.WindowPadding.Copy(other.WindowPadding);
            this.WindowRounding = other.WindowRounding;
            this.WindowBorderSize = other.WindowBorderSize;
            this.WindowMinSize.Copy(other.WindowMinSize);
            this.WindowTitleAlign.Copy(other.WindowTitleAlign);
            this.WindowMenuButtonPosition = other.WindowMenuButtonPosition;
            this.ChildRounding = other.ChildRounding;
            this.ChildBorderSize = other.ChildBorderSize;
            this.PopupRounding = other.PopupRounding;
            this.PopupBorderSize = other.PopupBorderSize;
            this.FramePadding.Copy(other.FramePadding);
            this.FrameRounding = other.FrameRounding;
            this.FrameBorderSize = other.FrameBorderSize;
            this.ItemSpacing.Copy(other.ItemSpacing);
            this.ItemInnerSpacing.Copy(other.ItemInnerSpacing);
            this.TouchExtraPadding.Copy(other.TouchExtraPadding);
            this.IndentSpacing = other.IndentSpacing;
            this.ColumnsMinSpacing = other.ColumnsMinSpacing;
            this.ScrollbarSize = other.ScrollbarSize;
            this.ScrollbarRounding = other.ScrollbarRounding;
            this.GrabMinSize = other.GrabMinSize;
            this.GrabRounding = other.GrabRounding;
            this.TabRounding = other.TabRounding;
            this.TabBorderSize = other.TabBorderSize;
            this.ButtonTextAlign.Copy(other.ButtonTextAlign);
            this.DisplayWindowPadding.Copy(other.DisplayWindowPadding);
            this.DisplaySafeAreaPadding.Copy(other.DisplaySafeAreaPadding);
            this.MouseCursorScale = other.MouseCursorScale;
            this.AntiAliasedLines = other.AntiAliasedLines;
            this.AntiAliasedFill = other.AntiAliasedFill;
            this.CurveTessellationTol = other.CurveTessellationTol;
            for (let i = 0; i < exports.ImGuiCol.COUNT; ++i) {
                this.Colors[i].Copy(other.Colors[i]);
            }
            return this;
        }
        ScaleAllSizes(scale_factor) { this.internal.ScaleAllSizes(scale_factor); }
    }
    // This is where your app communicate with Dear ImGui. Access via ImGui::GetIO().
    // Read 'Programmer guide' section in .cpp file for general usage.
    class ImGuiIO {
        constructor(native) {
            this.native = native;
            // int           KeyMap[ImGuiKey_COUNT];   // <unset>              // Map of indices into the KeysDown[512] entries array
            this.KeyMap = new Proxy([], {
                get: (target, key) => {
                    if (key === "length") {
                        return exports.Key.COUNT;
                    }
                    return this.native._getAt_KeyMap(Number(key));
                },
                set: (target, key, value) => {
                    return this.native._setAt_KeyMap(Number(key), value);
                },
            });
            // bool        MouseDown[5];               // Mouse buttons: left, right, middle + extras. ImGui itself mostly only uses left button (BeginPopupContext** are using right button). Others buttons allows us to track if the mouse is being used by your application + available to user as a convenience via IsMouse** API.
            this.MouseDown = new Proxy([], {
                get: (target, key) => {
                    if (key === "length") {
                        return 5;
                    }
                    return this.native._getAt_MouseDown(Number(key));
                },
                set: (target, key, value) => {
                    return this.native._setAt_MouseDown(Number(key), value);
                },
            });
            // bool        KeysDown[512];              // Keyboard keys that are pressed (in whatever storage order you naturally have access to keyboard data)
            this.KeysDown = new Proxy([], {
                get: (target, key) => {
                    if (key === "length") {
                        return 512;
                    }
                    return this.native._getAt_KeysDown(Number(key));
                },
                set: (target, key, value) => {
                    return this.native._setAt_KeysDown(Number(key), value);
                },
            });
            // float       NavInputs[ImGuiNavInput_COUNT]; // Gamepad inputs (keyboard keys will be auto-mapped and be written here by ImGui::NewFrame)
            this.NavInputs = new Proxy([], {
                get: (target, key) => {
                    if (key === "length") {
                        return exports.NavInput.COUNT;
                    }
                    return this.native._getAt_NavInputs(Number(key));
                },
                set: (target, key, value) => {
                    return this.native._setAt_NavInputs(Number(key), value);
                },
            });
            //------------------------------------------------------------------
            // [Internal] ImGui will maintain those fields. Forward compatibility not guaranteed!
            //------------------------------------------------------------------
            // ImVec2      MousePosPrev;               // Previous mouse position temporary storage (nb: not for public use, set to MousePos in NewFrame())
            // ImVec2      MouseClickedPos[5];         // Position at time of clicking
            this.MouseClickedPos = new Proxy([], {
                get: (target, key) => {
                    if (key === "length") {
                        return 5;
                    }
                    return this.native._getAt_MouseClickedPos(Number(key));
                },
            });
            // float       MouseClickedTime[5];        // Time of last click (used to figure out double-click)
            // bool        MouseClicked[5];            // Mouse button went from !Down to Down
            // bool        MouseDoubleClicked[5];      // Has mouse button been double-clicked?
            // bool        MouseReleased[5];           // Mouse button went from Down to !Down
            // bool        MouseDownOwned[5];          // Track if button was clicked inside a window. We don't request mouse capture from the application if click started outside ImGui bounds.
            // float       MouseDownDuration[5];       // Duration the mouse button has been down (0.0f == just clicked)
            this.MouseDownDuration = new Proxy([], {
                get: (target, key) => {
                    if (key === "length") {
                        return 5;
                    }
                    return this.native._getAt_MouseDownDuration(Number(key));
                },
            });
            // float       MouseDownDurationPrev[5];   // Previous time the mouse button has been down
            // ImVec2      MouseDragMaxDistanceAbs[5]; // Maximum distance, absolute, on each axis, of how much mouse has traveled from the clicking point
            // float       MouseDragMaxDistanceSqr[5]; // Squared maximum distance of how much mouse has traveled from the clicking point
            // float       KeysDownDuration[512];      // Duration the keyboard key has been down (0.0f == just pressed)
            this.KeysDownDuration = new Proxy([], {
                get: (target, key) => {
                    if (key === "length") {
                        return 512;
                    }
                    return this.native._getAt_KeysDownDuration(Number(key));
                },
            });
            // float       KeysDownDurationPrev[512];  // Previous duration the key has been down
            // float       NavInputsDownDuration[ImGuiNavInput_COUNT];
            this.NavInputsDownDuration = new Proxy([], {
                get: (target, key) => {
                    if (key === "length") {
                        return exports.NavInput.COUNT;
                    }
                    return this.native._getAt_NavInputsDownDuration(Number(key));
                },
            });
        }
        //------------------------------------------------------------------
        // Settings (fill once)                 // Default value:
        //------------------------------------------------------------------
        // ImGuiConfigFlags   ConfigFlags;         // = 0                  // See ImGuiConfigFlags_ enum. Set by user/application. Gamepad/keyboard navigation options, etc.
        get ConfigFlags() { return this.native.ConfigFlags; }
        set ConfigFlags(value) { this.native.ConfigFlags = value; }
        // ImGuiBackendFlags  BackendFlags;        // = 0                  // Set ImGuiBackendFlags_ enum. Set by imgui_impl_xxx files or custom back-end to communicate features supported by the back-end.
        get BackendFlags() { return this.native.BackendFlags; }
        set BackendFlags(value) { this.native.BackendFlags = value; }
        // ImVec2        DisplaySize;              // <unset>              // Display size, in pixels. For clamping windows positions.
        get DisplaySize() { return this.native.DisplaySize; }
        // float         DeltaTime;                // = 1.0f/60.0f         // Time elapsed since last frame, in seconds.
        get DeltaTime() { return this.native.DeltaTime; }
        set DeltaTime(value) { this.native.DeltaTime = value; }
        // float         IniSavingRate;            // = 5.0f               // Maximum time between saving positions/sizes to .ini file, in seconds.
        get IniSavingRate() { return this.native.IniSavingRate; }
        set IniSavingRate(value) { this.native.IniSavingRate = value; }
        // const char*   IniFilename;              // = "imgui.ini"        // Path to .ini file. NULL to disable .ini saving.
        get IniFilename() { return this.native.IniFilename; }
        set IniFilename(value) { this.native.IniFilename = value; }
        // const char*   LogFilename;              // = "imgui_log.txt"    // Path to .log file (default parameter to ImGui::LogToFile when no file is specified).
        get LogFilename() { return this.native.LogFilename; }
        set LogFilename(value) { this.native.LogFilename = value; }
        // float         MouseDoubleClickTime;     // = 0.30f              // Time for a double-click, in seconds.
        get MouseDoubleClickTime() { return this.native.MouseDoubleClickTime; }
        set MouseDoubleClickTime(value) { this.native.MouseDoubleClickTime = value; }
        // float         MouseDoubleClickMaxDist;  // = 6.0f               // Distance threshold to stay in to validate a double-click, in pixels.
        get MouseDoubleClickMaxDist() { return this.native.MouseDoubleClickMaxDist; }
        set MouseDoubleClickMaxDist(value) { this.native.MouseDoubleClickMaxDist = value; }
        // float         MouseDragThreshold;       // = 6.0f               // Distance threshold before considering we are dragging
        get MouseDragThreshold() { return this.native.MouseDragThreshold; }
        set MouseDragThreshold(value) { this.native.MouseDragThreshold = value; }
        // float         KeyRepeatDelay;           // = 0.250f             // When holding a key/button, time before it starts repeating, in seconds (for buttons in Repeat mode, etc.).
        get KeyRepeatDelay() { return this.native.KeyRepeatDelay; }
        set KeyRepeatDelay(value) { this.native.KeyRepeatDelay = value; }
        // float         KeyRepeatRate;            // = 0.050f             // When holding a key/button, rate at which it repeats, in seconds.
        get KeyRepeatRate() { return this.native.KeyRepeatRate; }
        set KeyRepeatRate(value) { this.native.KeyRepeatRate = value; }
        // void*         UserData;                 // = NULL               // Store your own data for retrieval by callbacks.
        get UserData() { return this.native.UserData; }
        set UserData(value) { this.native.UserData = value; }
        // ImFontAtlas*  Fonts;                    // <auto>               // Load and assemble one or more fonts into a single tightly packed texture. Output to Fonts array.
        get Fonts() { return new ImFontAtlas(this.native.Fonts); }
        // float         FontGlobalScale;          // = 1.0f               // Global scale all fonts
        get FontGlobalScale() { return this.native.FontGlobalScale; }
        set FontGlobalScale(value) { this.native.FontGlobalScale = value; }
        // bool          FontAllowUserScaling;     // = false              // Allow user scaling text of individual window with CTRL+Wheel.
        get FontAllowUserScaling() { return this.native.FontAllowUserScaling; }
        set FontAllowUserScaling(value) { this.native.FontAllowUserScaling = value; }
        // ImFont*       FontDefault;              // = NULL               // Font to use on NewFrame(). Use NULL to uses Fonts->Fonts[0].
        get FontDefault() {
            const font = this.native.FontDefault;
            return (font === null) ? null : new ImFont(font);
        }
        set FontDefault(value) {
            this.native.FontDefault = value && value.native;
        }
        // ImVec2        DisplayFramebufferScale;  // = (1.0f,1.0f)        // For retina display or other situations where window coordinates are different from framebuffer coordinates. User storage only, presently not used by ImGui.
        get DisplayFramebufferScale() { return this.native.DisplayFramebufferScale; }
        // Miscellaneous configuration options
        // bool          OptMacOSXBehaviors;       // = defined(__APPLE__) // OS X style: Text editing cursor movement using Alt instead of Ctrl, Shortcuts using Cmd/Super instead of Ctrl, Line/Text Start and End using Cmd+Arrows instead of Home/End, Double click selects by word instead of selecting whole text, Multi-selection in lists uses Cmd/Super instead of Ctrl
        get ConfigMacOSXBehaviors() { return this.native.ConfigMacOSXBehaviors; }
        set ConfigMacOSXBehaviors(value) { this.native.ConfigMacOSXBehaviors = value; }
        // bool          ConfigInputTextCursorBlink;   // = true               // Enable blinking cursor, for users who consider it annoying.
        get ConfigInputTextCursorBlink() { return this.native.ConfigInputTextCursorBlink; }
        set ConfigInputTextCursorBlink(value) { this.native.ConfigInputTextCursorBlink = value; }
        // bool          ConfigWindowsResizeFromEdges; // = false          // [BETA] Enable resizing of windows from their edges and from the lower-left corner. This requires (io.BackendFlags & ImGuiBackendFlags_HasMouseCursors) because it needs mouse cursor feedback. (This used to be the ImGuiWindowFlags_ResizeFromAnySide flag)
        get ConfigWindowsResizeFromEdges() { return this.native.ConfigWindowsResizeFromEdges; }
        set ConfigWindowsResizeFromEdges(value) { this.native.ConfigWindowsResizeFromEdges = value; }
        // bool        ConfigWindowsMoveFromTitleBarOnly;// = false        // [BETA] Set to true to only allow moving windows when clicked+dragged from the title bar. Windows without a title bar are not affected.
        get ConfigWindowsMoveFromTitleBarOnly() { return this.native.ConfigWindowsMoveFromTitleBarOnly; }
        set ConfigWindowsMoveFromTitleBarOnly(value) { this.native.ConfigWindowsMoveFromTitleBarOnly = value; }
        //------------------------------------------------------------------
        // Settings (User Functions)
        //------------------------------------------------------------------
        // Optional: Platform/Renderer back-end name (informational only! will be displayed in About Window) + User data for back-end/wrappers to store their own stuff.
        // const char* BackendPlatformName;            // = NULL
        get BackendPlatformName() { return this.native.BackendPlatformName; }
        set BackendPlatformName(value) { this.native.BackendPlatformName = value; }
        // const char* BackendRendererName;            // = NULL
        get BackendRendererName() { return this.native.BackendRendererName; }
        set BackendRendererName(value) { this.native.BackendRendererName = value; }
        // void*       BackendPlatformUserData;        // = NULL
        get BackendPlatformUserData() { return this.native.BackendPlatformUserData; }
        set BackendPlatformUserData(value) { this.native.BackendPlatformUserData = value; }
        // void*       BackendRendererUserData;        // = NULL
        get BackendRendererUserData() { return this.native.BackendRendererUserData; }
        set BackendRendererUserData(value) { this.native.BackendRendererUserData = value; }
        // void*       BackendLanguageUserData;        // = NULL
        get BackendLanguageUserData() { return this.native.BackendLanguageUserData; }
        set BackendLanguageUserData(value) { this.native.BackendLanguageUserData = value; }
        // Optional: access OS clipboard
        // (default to use native Win32 clipboard on Windows, otherwise uses a private clipboard. Override to access OS clipboard on other architectures)
        // const char* (*GetClipboardTextFn)(void* user_data);
        get GetClipboardTextFn() { return this.native.GetClipboardTextFn; }
        set GetClipboardTextFn(value) { this.native.GetClipboardTextFn = value; }
        // void        (*SetClipboardTextFn)(void* user_data, const char* text);
        get SetClipboardTextFn() { return this.native.SetClipboardTextFn; }
        set SetClipboardTextFn(value) { this.native.SetClipboardTextFn = value; }
        // void*       ClipboardUserData;
        get ClipboardUserData() { return this.native.ClipboardUserData; }
        set ClipboardUserData(value) { this.native.ClipboardUserData = value; }
        // Optional: override memory allocations. MemFreeFn() may be called with a NULL pointer.
        // (default to posix malloc/free)
        // void*       (*MemAllocFn)(size_t sz);
        // void        (*MemFreeFn)(void* ptr);
        // Optional: notify OS Input Method Editor of the screen position of your cursor for text input position (e.g. when using Japanese/Chinese IME in Windows)
        // (default to use native imm32 api on Windows)
        // void        (*ImeSetInputScreenPosFn)(int x, int y);
        // void*       ImeWindowHandle;            // (Windows) Set this to your HWND to get automatic IME cursor positioning.
        //------------------------------------------------------------------
        // Input - Fill before calling NewFrame()
        //------------------------------------------------------------------
        // ImVec2      MousePos;                   // Mouse position, in pixels. Set to ImVec2(-FLT_MAX,-FLT_MAX) if mouse is unavailable (on another screen, etc.)
        get MousePos() { return this.native.MousePos; }
        // float       MouseWheel;                 // Mouse wheel: 1 unit scrolls about 5 lines text.
        get MouseWheel() { return this.native.MouseWheel; }
        set MouseWheel(value) { this.native.MouseWheel = value; }
        // float       MouseWheelH;                    // Mouse wheel (Horizontal). Most users don't have a mouse with an horizontal wheel, may not be filled by all back-ends.
        get MouseWheelH() { return this.native.MouseWheelH; }
        set MouseWheelH(value) { this.native.MouseWheelH = value; }
        // bool        MouseDrawCursor;            // Request ImGui to draw a mouse cursor for you (if you are on a platform without a mouse cursor).
        get MouseDrawCursor() { return this.native.MouseDrawCursor; }
        set MouseDrawCursor(value) { this.native.MouseDrawCursor = value; }
        // bool        KeyCtrl;                    // Keyboard modifier pressed: Control
        get KeyCtrl() { return this.native.KeyCtrl; }
        set KeyCtrl(value) { this.native.KeyCtrl = value; }
        // bool        KeyShift;                   // Keyboard modifier pressed: Shift
        get KeyShift() { return this.native.KeyShift; }
        set KeyShift(value) { this.native.KeyShift = value; }
        // bool        KeyAlt;                     // Keyboard modifier pressed: Alt
        get KeyAlt() { return this.native.KeyAlt; }
        set KeyAlt(value) { this.native.KeyAlt = value; }
        // bool        KeySuper;                   // Keyboard modifier pressed: Cmd/Super/Windows
        get KeySuper() { return this.native.KeySuper; }
        set KeySuper(value) { this.native.KeySuper = value; }
        // Functions
        // IMGUI_API void AddInputCharacter(ImWchar c);                        // Add new character into InputCharacters[]
        AddInputCharacter(c) { this.native.AddInputCharacter(c); }
        // IMGUI_API void AddInputCharactersUTF8(const char* utf8_chars);      // Add new characters into InputCharacters[] from an UTF-8 string
        AddInputCharactersUTF8(utf8_chars) { this.native.AddInputCharactersUTF8(utf8_chars); }
        // inline void    ClearInputCharacters() { InputCharacters[0] = 0; }   // Clear the text input buffer manually
        ClearInputCharacters() { this.native.ClearInputCharacters(); }
        //------------------------------------------------------------------
        // Output - Retrieve after calling NewFrame()
        //------------------------------------------------------------------
        // bool        WantCaptureMouse;           // When io.WantCaptureMouse is true, do not dispatch mouse input data to your main application. This is set by ImGui when it wants to use your mouse (e.g. unclicked mouse is hovering a window, or a widget is active).
        get WantCaptureMouse() { return this.native.WantCaptureMouse; }
        set WantCaptureMouse(value) { this.native.WantCaptureMouse = value; }
        // bool        WantCaptureKeyboard;        // When io.WantCaptureKeyboard is true, do not dispatch keyboard input data to your main application. This is set by ImGui when it wants to use your keyboard inputs.
        get WantCaptureKeyboard() { return this.native.WantCaptureKeyboard; }
        set WantCaptureKeyboard(value) { this.native.WantCaptureKeyboard = value; }
        // bool        WantTextInput;              // Mobile/console: when io.WantTextInput is true, you may display an on-screen keyboard. This is set by ImGui when it wants textual keyboard input to happen (e.g. when a InputText widget is active).
        get WantTextInput() { return this.native.WantTextInput; }
        set WantTextInput(value) { this.native.WantTextInput = value; }
        // bool        WantSetMousePos;              // [BETA-NAV] MousePos has been altered, back-end should reposition mouse on next frame. Set only when 'NavMovesMouse=true'.
        get WantSetMousePos() { return this.native.WantSetMousePos; }
        set WantSetMousePos(value) { this.native.WantSetMousePos = value; }
        // bool        WantSaveIniSettings;        // When manual .ini load/save is active (io.IniFilename == NULL), this will be set to notify your application that you can call SaveIniSettingsToMemory() and save yourself. IMPORTANT: You need to clear io.WantSaveIniSettings yourself.
        get WantSaveIniSettings() { return this.native.WantSaveIniSettings; }
        set WantSaveIniSettings(value) { this.native.WantSaveIniSettings = value; }
        // bool        NavActive;                  // Directional navigation is currently allowed (will handle ImGuiKey_NavXXX events) = a window is focused and it doesn't use the ImGuiWindowFlags_NoNavInputs flag.
        get NavActive() { return this.native.NavActive; }
        set NavActive(value) { this.native.NavActive = value; }
        // bool        NavVisible;                 // Directional navigation is visible and allowed (will handle ImGuiKey_NavXXX events).
        get NavVisible() { return this.native.NavVisible; }
        set NavVisible(value) { this.native.NavVisible = value; }
        // float       Framerate;                  // Application framerate estimation, in frame per second. Solely for convenience. Rolling average estimation based on IO.DeltaTime over 120 frames
        get Framerate() { return this.native.Framerate; }
        // int         MetricsRenderVertices;      // Vertices output during last call to Render()
        get MetricsRenderVertices() { return this.native.MetricsRenderVertices; }
        // int         MetricsRenderIndices;       // Indices output during last call to Render() = number of triangles * 3
        get MetricsRenderIndices() { return this.native.MetricsRenderIndices; }
        // int         MetricsRenderWindows;       // Number of visible windows
        get MetricsRenderWindows() { return this.native.MetricsRenderWindows; }
        // int         MetricsActiveWindows;       // Number of visible root windows (exclude child windows)
        get MetricsActiveWindows() { return this.native.MetricsActiveWindows; }
        // int         MetricsActiveAllocations;   // Number of active allocations, updated by MemAlloc/MemFree based on current context. May be off if you have multiple imgui contexts.
        get MetricsActiveAllocations() { return this.native.MetricsActiveAllocations; }
        // ImVec2      MouseDelta;                 // Mouse delta. Note that this is zero if either current or previous position are invalid (-FLT_MAX,-FLT_MAX), so a disappearing/reappearing mouse won't have a huge delta.
        get MouseDelta() { return this.native.MouseDelta; }
    }
    // Context creation and access, if you want to use multiple context, share context between modules (e.g. DLL).
    // All contexts share a same ImFontAtlas by default. If you want different font atlas, you can new() them and overwrite the GetIO().Fonts variable of an ImGui context.
    // All those functions are not reliant on the current context.
    class ImGuiContext {
        constructor(native) {
            this.native = native;
            this.textures = [];
        }
        static getTexture(index) {
            if (ImGuiContext.current_ctx === null) {
                throw new Error();
            }
            return ImGuiContext.current_ctx._getTexture(index);
        }
        static setTexture(texture) {
            if (ImGuiContext.current_ctx === null) {
                throw new Error();
            }
            return ImGuiContext.current_ctx._setTexture(texture);
        }
        _getTexture(index) {
            return this.textures[index] || null;
        }
        _setTexture(texture) {
            let index = this.textures.indexOf(texture);
            if (index === -1) {
                for (let i = 0; i < this.textures.length; ++i) {
                    if (this.textures[i] === null) {
                        this.textures[i] = texture;
                        return i;
                    }
                }
                index = this.textures.length;
                this.textures.push(texture);
            }
            return index;
        }
    }
    ImGuiContext.current_ctx = null;
    // IMGUI_API ImGuiContext* CreateContext(ImFontAtlas* shared_font_atlas = NULL);
    function CreateContext(shared_font_atlas = null) {
        const ctx = new ImGuiContext(exports.bind.CreateContext());
        if (ImGuiContext.current_ctx === null) {
            ImGuiContext.current_ctx = ctx;
        }
        return ctx;
    }
    // IMGUI_API void          DestroyContext(ImGuiContext* ctx = NULL);   // NULL = Destroy current context
    function DestroyContext(ctx = null) {
        if (ctx === null) {
            ctx = ImGuiContext.current_ctx;
            ImGuiContext.current_ctx = null;
        }
        exports.bind.DestroyContext((ctx === null) ? null : ctx.native);
    }
    // IMGUI_API ImGuiContext* GetCurrentContext();
    function GetCurrentContext() {
        // const ctx_native: BindImGui.ImGuiContext | null = bind.GetCurrentContext();
        return ImGuiContext.current_ctx;
    }
    // IMGUI_API void          SetCurrentContext(ImGuiContext* ctx);
    function SetCurrentContext(ctx) {
        exports.bind.SetCurrentContext((ctx === null) ? null : ctx.native);
        ImGuiContext.current_ctx = ctx;
    }
    // IMGUI_API bool          DebugCheckVersionAndDataLayout(const char* version_str, size_t sz_io, size_t sz_style, size_t sz_vec2, size_t sz_vec4, size_t sz_drawvert);
    function DebugCheckVersionAndDataLayout(version_str, sz_io, sz_style, sz_vec2, sz_vec4, sz_draw_vert, sz_draw_idx) {
        return exports.bind.DebugCheckVersionAndDataLayout(version_str, sz_io, sz_style, sz_vec2, sz_vec4, sz_draw_vert, sz_draw_idx);
    }
    // Main
    // IMGUI_API ImGuiIO&      GetIO();
    function GetIO() { return new ImGuiIO(exports.bind.GetIO()); }
    // IMGUI_API ImGuiStyle&   GetStyle();
    function GetStyle() { return new ImGuiStyle(exports.bind.GetStyle()); }
    // IMGUI_API void          NewFrame();                                 // start a new ImGui frame, you can submit any command from this point until Render()/EndFrame().
    function NewFrame() { exports.bind.NewFrame(); }
    // IMGUI_API void          EndFrame();                                 // ends the ImGui frame. automatically called by Render(), so most likely don't need to ever call that yourself directly. If you don't need to render you may call EndFrame() but you'll have wasted CPU already. If you don't need to render, better to not create any imgui windows instead!
    function EndFrame() { exports.bind.EndFrame(); }
    // IMGUI_API void          Render();                                   // ends the ImGui frame, finalize the draw data, then call your io.RenderDrawListsFn() function if set.
    function Render() { exports.bind.Render(); }
    // IMGUI_API ImDrawData*   GetDrawData();                              // same value as passed to your io.RenderDrawListsFn() function. valid after Render() and until the next call to NewFrame()
    function GetDrawData() {
        const draw_data = exports.bind.GetDrawData();
        return (draw_data === null) ? null : new ImDrawData(draw_data);
    }
    // Demo, Debug, Informations
    // IMGUI_API void          ShowDemoWindow(bool* p_open = NULL);        // create demo/test window (previously called ShowTestWindow). demonstrate most ImGui features. call this to learn about the library! try to make it always available in your application!
    function ShowDemoWindow(p_open = null) { exports.bind.ShowDemoWindow(p_open); }
    // IMGUI_API void          ShowAboutWindow(bool* p_open = NULL);       // create about window. display Dear ImGui version, credits and build/system information.
    function ShowAboutWindow(p_open = null) {
        if (p_open === null) {
            exports.bind.ShowAboutWindow(null);
        }
        else if (Array.isArray(p_open)) {
            exports.bind.ShowAboutWindow(p_open);
        }
        else {
            const ref_open = [p_open()];
            exports.bind.ShowAboutWindow(ref_open);
            p_open(ref_open[0]);
        }
    }
    // IMGUI_API void          ShowMetricsWindow(bool* p_open = NULL);     // create metrics window. display ImGui internals: draw commands (with individual draw calls and vertices), window list, basic internal state, etc.
    function ShowMetricsWindow(p_open = null) {
        if (p_open === null) {
            exports.bind.ShowMetricsWindow(null);
        }
        else if (Array.isArray(p_open)) {
            exports.bind.ShowMetricsWindow(p_open);
        }
        else {
            const ref_open = [p_open()];
            exports.bind.ShowMetricsWindow(ref_open);
            p_open(ref_open[0]);
        }
    }
    // IMGUI_API void          ShowStyleEditor(ImGuiStyle* ref = NULL);    // add style editor block (not a window). you can pass in a reference ImGuiStyle structure to compare to, revert to and save to (else it uses the default style)
    function ShowStyleEditor(ref = null) {
        if (ref === null) {
            exports.bind.ShowStyleEditor(null);
        }
        else if (ref.internal instanceof exports.bind.ImGuiStyle) {
            exports.bind.ShowStyleEditor(ref.internal);
        }
        else {
            const native = new exports.bind.ImGuiStyle();
            const wrap = new ImGuiStyle(native);
            wrap.Copy(ref);
            exports.bind.ShowStyleEditor(native);
            ref.Copy(wrap);
            native.delete();
        }
    }
    // IMGUI_API bool          ShowStyleSelector(const char* label);
    function ShowStyleSelector(label) { return exports.bind.ShowStyleSelector(label); }
    // IMGUI_API void          ShowFontSelector(const char* label);
    function ShowFontSelector(label) { exports.bind.ShowFontSelector(label); }
    // IMGUI_API void          ShowUserGuide();                            // add basic help/info block (not a window): how to manipulate ImGui as a end-user (mouse/keyboard controls).
    function ShowUserGuide() { exports.bind.ShowUserGuide(); }
    // IMGUI_API const char*   GetVersion();
    function GetVersion() { return exports.bind.GetVersion(); }
    // Styles
    // IMGUI_API void          StyleColorsClassic(ImGuiStyle* dst = NULL);
    function StyleColorsClassic(dst = null) {
        if (dst === null) {
            exports.bind.StyleColorsClassic(null);
        }
        else if (dst.internal instanceof exports.bind.ImGuiStyle) {
            exports.bind.StyleColorsClassic(dst.internal);
        }
        else {
            const native = new exports.bind.ImGuiStyle();
            const wrap = new ImGuiStyle(native);
            wrap.Copy(dst);
            exports.bind.StyleColorsClassic(native);
            dst.Copy(wrap);
            native.delete();
        }
    }
    // IMGUI_API void          StyleColorsDark(ImGuiStyle* dst = NULL);
    function StyleColorsDark(dst = null) {
        if (dst === null) {
            exports.bind.StyleColorsDark(null);
        }
        else if (dst.internal instanceof exports.bind.ImGuiStyle) {
            exports.bind.StyleColorsDark(dst.internal);
        }
        else {
            const native = new exports.bind.ImGuiStyle();
            const wrap = new ImGuiStyle(native);
            wrap.Copy(dst);
            exports.bind.StyleColorsDark(native);
            dst.Copy(wrap);
            native.delete();
        }
    }
    // IMGUI_API void          StyleColorsLight(ImGuiStyle* dst = NULL);
    function StyleColorsLight(dst = null) {
        if (dst === null) {
            exports.bind.StyleColorsLight(null);
        }
        else if (dst.internal instanceof exports.bind.ImGuiStyle) {
            exports.bind.StyleColorsLight(dst.internal);
        }
        else {
            const native = new exports.bind.ImGuiStyle();
            const wrap = new ImGuiStyle(native);
            wrap.Copy(dst);
            exports.bind.StyleColorsLight(native);
            dst.Copy(wrap);
            native.delete();
        }
    }
    // Window
    // IMGUI_API bool          Begin(const char* name, bool* p_open = NULL, ImGuiWindowFlags flags = 0);                                                   // push window to the stack and start appending to it. see .cpp for details. return false when window is collapsed, so you can early out in your code. 'bool* p_open' creates a widget on the upper-right to close the window (which sets your bool to false).
    function Begin(name, open = null, flags = 0) {
        if (open === null) {
            return exports.bind.Begin(name, null, flags);
        }
        else if (Array.isArray(open)) {
            return exports.bind.Begin(name, open, flags);
        }
        else {
            const ref_open = [open()];
            const opened = exports.bind.Begin(name, ref_open, flags);
            open(ref_open[0]);
            return opened;
        }
    }
    // IMGUI_API void          End();                                                                                                                      // finish appending to current window, pop it off the window stack.
    function End() { exports.bind.End(); }
    // IMGUI_API bool          BeginChild(const char* str_id, const ImVec2& size = ImVec2(0,0), bool border = false, ImGuiWindowFlags extra_flags = 0);    // begin a scrolling region. size==0.0f: use remaining window size, size<0.0f: use remaining window size minus abs(size). size>0.0f: fixed size. each axis can use a different mode, e.g. ImVec2(0,400).
    // IMGUI_API bool          BeginChild(ImGuiID id, const ImVec2& size = ImVec2(0,0), bool border = false, ImGuiWindowFlags extra_flags = 0);            // "
    function BeginChild(id, size = ImVec2.ZERO, border = false, extra_flags = 0) {
        return exports.bind.BeginChild(id, size, border, extra_flags);
    }
    // IMGUI_API void          EndChild();
    function EndChild() { exports.bind.EndChild(); }
    // IMGUI_API ImVec2        GetContentRegionMax();                                              // current content boundaries (typically window boundaries including scrolling, or current column boundaries), in windows coordinates
    function GetContentRegionMax(out = new ImVec2()) {
        return exports.bind.GetContentRegionMax(out);
    }
    // IMGUI_API ImVec2        GetContentRegionAvail();                                            // == GetContentRegionMax() - GetCursorPos()
    function GetContentRegionAvail(out = new ImVec2()) {
        return exports.bind.GetContentRegionAvail(out);
    }
    // IMGUI_API ImVec2        GetWindowContentRegionMin();                                        // content boundaries min (roughly (0,0)-Scroll), in window coordinates
    function GetWindowContentRegionMin(out = new ImVec2()) {
        return exports.bind.GetWindowContentRegionMin(out);
    }
    // IMGUI_API ImVec2        GetWindowContentRegionMax();                                        // content boundaries max (roughly (0,0)+Size-Scroll) where Size can be override with SetNextWindowContentSize(), in window coordinates
    function GetWindowContentRegionMax(out = new ImVec2()) {
        return exports.bind.GetWindowContentRegionMax(out);
    }
    // IMGUI_API float         GetWindowContentRegionWidth();                                      //
    function GetWindowContentRegionWidth() { return exports.bind.GetWindowContentRegionWidth(); }
    // IMGUI_API ImDrawList*   GetWindowDrawList();                                                // get rendering command-list if you want to append your own draw primitives
    function GetWindowDrawList() {
        return new ImDrawList(exports.bind.GetWindowDrawList());
    }
    // IMGUI_API ImVec2        GetWindowPos();                                                     // get current window position in screen space (useful if you want to do your own drawing via the DrawList api)
    function GetWindowPos(out = new ImVec2()) {
        return exports.bind.GetWindowPos(out);
    }
    // IMGUI_API ImVec2        GetWindowSize();                                                    // get current window size
    function GetWindowSize(out = new ImVec2()) {
        return exports.bind.GetWindowSize(out);
    }
    // IMGUI_API float         GetWindowWidth();
    function GetWindowWidth() { return exports.bind.GetWindowWidth(); }
    // IMGUI_API float         GetWindowHeight();
    function GetWindowHeight() { return exports.bind.GetWindowHeight(); }
    // IMGUI_API bool          IsWindowCollapsed();
    function IsWindowCollapsed() { return exports.bind.IsWindowCollapsed(); }
    // IMGUI_API bool          IsWindowAppearing();
    function IsWindowAppearing() { return exports.bind.IsWindowAppearing(); }
    // IMGUI_API void          SetWindowFontScale(float scale);                                    // per-window font scale. Adjust IO.FontGlobalScale if you want to scale all windows
    function SetWindowFontScale(scale) { exports.bind.SetWindowFontScale(scale); }
    // IMGUI_API void          SetNextWindowPos(const ImVec2& pos, ImGuiCond cond = 0, const ImVec2& pivot = ImVec2(0,0)); // set next window position. call before Begin(). use pivot=(0.5f,0.5f) to center on given point, etc.
    function SetNextWindowPos(pos, cond = 0, pivot = ImVec2.ZERO) {
        exports.bind.SetNextWindowPos(pos, cond, pivot);
    }
    // IMGUI_API void          SetNextWindowSize(const ImVec2& size, ImGuiCond cond = 0);          // set next window size. set axis to 0.0f to force an auto-fit on this axis. call before Begin()
    function SetNextWindowSize(pos, cond = 0) {
        exports.bind.SetNextWindowSize(pos, cond);
    }
    // IMGUI_API void          SetNextWindowSizeConstraints(const ImVec2& size_min, const ImVec2& size_max, ImGuiSizeConstraintCallback custom_callback = NULL, void* custom_callback_data = NULL); // set next window size limits. use -1,-1 on either X/Y axis to preserve the current size. Use callback to apply non-trivial programmatic constraints.
    function SetNextWindowSizeConstraints(size_min, size_max, custom_callback = null, custom_callback_data = null) {
        if (custom_callback) {
            exports.bind.SetNextWindowSizeConstraints(size_min, size_max, (data) => {
                custom_callback(new ImGuiSizeCallbackData(data, custom_callback_data));
            }, null);
        }
        else {
            exports.bind.SetNextWindowSizeConstraints(size_min, size_max, null, null);
        }
    }
    // IMGUI_API void          SetNextWindowContentSize(const ImVec2& size);                       // set next window content size (~ enforce the range of scrollbars). not including window decorations (title bar, menu bar, etc.). set an axis to 0.0f to leave it automatic. call before Begin()
    function SetNextWindowContentSize(size) {
        exports.bind.SetNextWindowContentSize(size);
    }
    // IMGUI_API void          SetNextWindowCollapsed(bool collapsed, ImGuiCond cond = 0);         // set next window collapsed state. call before Begin()
    function SetNextWindowCollapsed(collapsed, cond = 0) {
        exports.bind.SetNextWindowCollapsed(collapsed, cond);
    }
    // IMGUI_API void          SetNextWindowFocus();                                               // set next window to be focused / front-most. call before Begin()
    function SetNextWindowFocus() { exports.bind.SetNextWindowFocus(); }
    // IMGUI_API void          SetNextWindowBgAlpha(float alpha);                                  // set next window background color alpha. helper to easily modify ImGuiCol_WindowBg/ChildBg/PopupBg.
    function SetNextWindowBgAlpha(alpha) { exports.bind.SetNextWindowBgAlpha(alpha); }
    // IMGUI_API void          SetWindowPos(const ImVec2& pos, ImGuiCond cond = 0);                // (not recommended) set current window position - call within Begin()/End(). prefer using SetNextWindowPos(), as this may incur tearing and side-effects.
    // IMGUI_API void          SetWindowSize(const ImVec2& size, ImGuiCond cond = 0);              // (not recommended) set current window size - call within Begin()/End(). set to ImVec2(0,0) to force an auto-fit. prefer using SetNextWindowSize(), as this may incur tearing and minor side-effects.
    // IMGUI_API void          SetWindowCollapsed(bool collapsed, ImGuiCond cond = 0);             // (not recommended) set current window collapsed state. prefer using SetNextWindowCollapsed().
    // IMGUI_API void          SetWindowFocus();                                                   // (not recommended) set current window to be focused / front-most. prefer using SetNextWindowFocus().
    // IMGUI_API void          SetWindowPos(const char* name, const ImVec2& pos, ImGuiCond cond = 0);      // set named window position.
    // IMGUI_API void          SetWindowSize(const char* name, const ImVec2& size, ImGuiCond cond = 0);    // set named window size. set axis to 0.0f to force an auto-fit on this axis.
    // IMGUI_API void          SetWindowCollapsed(const char* name, bool collapsed, ImGuiCond cond = 0);   // set named window collapsed state
    // IMGUI_API void          SetWindowFocus(const char* name);                                           // set named window to be focused / front-most. use NULL to remove focus.
    function SetWindowPos(name_or_pos, pos_or_cond = 0, cond = 0) {
        if (typeof (name_or_pos) === "string") {
            exports.bind.SetWindowNamePos(name_or_pos, pos_or_cond, cond);
            return;
        }
        else {
            exports.bind.SetWindowPos(name_or_pos, pos_or_cond);
        }
    }
    function SetWindowSize(name_or_size, size_or_cond = 0, cond = 0) {
        if (typeof (name_or_size) === "string") {
            exports.bind.SetWindowNamePos(name_or_size, size_or_cond, cond);
        }
        else {
            exports.bind.SetWindowSize(name_or_size, size_or_cond);
        }
    }
    function SetWindowCollapsed(name_or_collapsed, collapsed_or_cond = 0, cond = 0) {
        if (typeof (name_or_collapsed) === "string") {
            exports.bind.SetWindowNameCollapsed(name_or_collapsed, collapsed_or_cond, cond);
        }
        else {
            exports.bind.SetWindowCollapsed(name_or_collapsed, collapsed_or_cond);
        }
    }
    function SetWindowFocus(name) {
        if (typeof (name) === "string") {
            exports.bind.SetWindowNameFocus(name);
        }
        else {
            exports.bind.SetWindowFocus();
        }
    }
    // IMGUI_API float         GetScrollX();                                                       // get scrolling amount [0..GetScrollMaxX()]
    function GetScrollX() { return exports.bind.GetScrollX(); }
    // IMGUI_API float         GetScrollY();                                                       // get scrolling amount [0..GetScrollMaxY()]
    function GetScrollY() { return exports.bind.GetScrollY(); }
    // IMGUI_API float         GetScrollMaxX();                                                    // get maximum scrolling amount ~~ ContentSize.X - WindowSize.X
    function GetScrollMaxX() { return exports.bind.GetScrollMaxX(); }
    // IMGUI_API float         GetScrollMaxY();                                                    // get maximum scrolling amount ~~ ContentSize.Y - WindowSize.Y
    function GetScrollMaxY() { return exports.bind.GetScrollMaxY(); }
    // IMGUI_API void          SetScrollX(float scroll_x);                                         // set scrolling amount [0..GetScrollMaxX()]
    function SetScrollX(scroll_x) { exports.bind.SetScrollX(scroll_x); }
    // IMGUI_API void          SetScrollY(float scroll_y);                                         // set scrolling amount [0..GetScrollMaxY()]
    function SetScrollY(scroll_y) { exports.bind.SetScrollY(scroll_y); }
    // IMGUI_API void          SetScrollHereY(float center_y_ratio = 0.5f);                         // adjust scrolling amount to make current cursor position visible. center_y_ratio=0.0: top, 0.5: center, 1.0: bottom. When using to make a "default/current item" visible, consider using SetItemDefaultFocus() instead.
    function SetScrollHereY(center_y_ratio = 0.5) {
        exports.bind.SetScrollHereY(center_y_ratio);
    }
    // IMGUI_API void          SetScrollFromPosY(float pos_y, float center_y_ratio = 0.5f);        // adjust scrolling amount to make given position valid. use GetCursorPos() or GetCursorStartPos()+offset to get valid positions.
    function SetScrollFromPosY(pos_y, center_y_ratio = 0.5) {
        exports.bind.SetScrollFromPosY(pos_y, center_y_ratio);
    }
    // IMGUI_API void          SetStateStorage(ImGuiStorage* tree);                                // replace tree state storage with our own (if you want to manipulate it yourself, typically clear subsection of it)
    // IMGUI_API ImGuiStorage* GetStateStorage();
    // Parameters stacks (shared)
    // IMGUI_API void          PushFont(ImFont* font);                                             // use NULL as a shortcut to push default font
    function PushFont(font) { exports.bind.PushFont(font ? font.native : null); }
    // IMGUI_API void          PopFont();
    function PopFont() { exports.bind.PopFont(); }
    // IMGUI_API void          PushStyleColor(ImGuiCol idx, ImU32 col);
    // IMGUI_API void          PushStyleColor(ImGuiCol idx, const ImVec4& col);
    function PushStyleColor(idx, col) {
        if (col instanceof ImColor) {
            exports.bind.PushStyleColor(idx, col.Value);
        }
        else {
            exports.bind.PushStyleColor(idx, col);
        }
    }
    // IMGUI_API void          PopStyleColor(int count = 1);
    function PopStyleColor(count = 1) {
        exports.bind.PopStyleColor(count);
    }
    // IMGUI_API void          PushStyleVar(ImGuiStyleVar idx, float val);
    // IMGUI_API void          PushStyleVar(ImGuiStyleVar idx, const ImVec2& val);
    function PushStyleVar(idx, val) {
        exports.bind.PushStyleVar(idx, val);
    }
    // IMGUI_API void          PopStyleVar(int count = 1);
    function PopStyleVar(count = 1) {
        exports.bind.PopStyleVar(count);
    }
    // IMGUI_API const ImVec4& GetStyleColorVec4(ImGuiCol idx);                                    // retrieve style color as stored in ImGuiStyle structure. use to feed back into PushStyleColor(), otherwhise use GetColorU32() to get style color + style alpha.
    function GetStyleColorVec4(idx) {
        return exports.bind.GetStyleColorVec4(idx);
    }
    // IMGUI_API ImFont*       GetFont();                                                          // get current font
    function GetFont() {
        return new ImFont(exports.bind.GetFont());
    }
    // IMGUI_API float         GetFontSize();                                                      // get current font size (= height in pixels) of current font with current scale applied
    function GetFontSize() { return exports.bind.GetFontSize(); }
    // IMGUI_API ImVec2        GetFontTexUvWhitePixel();                                           // get UV coordinate for a while pixel, useful to draw custom shapes via the ImDrawList API
    function GetFontTexUvWhitePixel(out = new ImVec2()) {
        return exports.bind.GetFontTexUvWhitePixel(out);
    }
    function GetColorU32(...args) {
        if (args.length === 1) {
            if (typeof (args[0]) === "number") {
                // TODO: ImGuiCol or ImU32
                const idx = args[0];
                return exports.bind.GetColorU32_A(idx, 1.0);
            }
            else {
                const col = args[0];
                return exports.bind.GetColorU32_B(col);
            }
        }
        else {
            const idx = args[0];
            const alpha_mul = args[1];
            return exports.bind.GetColorU32_A(idx, alpha_mul);
        }
    }
    // Parameters stacks (current window)
    // IMGUI_API void          PushItemWidth(float item_width);                                    // width of items for the common item+label case, pixels. 0.0f = default to ~2/3 of windows width, >0.0f: width in pixels, <0.0f align xx pixels to the right of window (so -1.0f always align width to the right side)
    function PushItemWidth(item_width) { exports.bind.PushItemWidth(item_width); }
    // IMGUI_API void          PopItemWidth();
    function PopItemWidth() { exports.bind.PopItemWidth(); }
    // IMGUI_API float         CalcItemWidth();                                                    // width of item given pushed settings and current cursor position
    function SetNextItemWidth(item_width) { exports.bind.SetNextItemWidth(item_width); } // set width of the _next_ common large "item+label" widget. >0.0f: width in pixels, <0.0f align xx pixels to the right of window (so -1.0f always align width to the right side)
    function CalcItemWidth() { return exports.bind.CalcItemWidth(); }
    // IMGUI_API void          PushTextWrapPos(float wrap_pos_x = 0.0f);                           // word-wrapping for Text*() commands. < 0.0f: no wrapping; 0.0f: wrap to end of window (or column); > 0.0f: wrap at 'wrap_pos_x' position in window local space
    function PushTextWrapPos(wrap_pos_x = 0.0) {
        exports.bind.PushTextWrapPos(wrap_pos_x);
    }
    // IMGUI_API void          PopTextWrapPos();
    function PopTextWrapPos() { exports.bind.PopTextWrapPos(); }
    // IMGUI_API void          PushAllowKeyboardFocus(bool allow_keyboard_focus);                  // allow focusing using TAB/Shift-TAB, enabled by default but you can disable it for certain widgets
    function PushAllowKeyboardFocus(allow_keyboard_focus) { exports.bind.PushAllowKeyboardFocus(allow_keyboard_focus); }
    // IMGUI_API void          PopAllowKeyboardFocus();
    function PopAllowKeyboardFocus() { exports.bind.PopAllowKeyboardFocus(); }
    // IMGUI_API void          PushButtonRepeat(bool repeat);                                      // in 'repeat' mode, Button*() functions return repeated true in a typematic manner (using io.KeyRepeatDelay/io.KeyRepeatRate setting). Note that you can call IsItemActive() after any Button() to tell if the button is held in the current frame.
    function PushButtonRepeat(repeat) { exports.bind.PushButtonRepeat(repeat); }
    // IMGUI_API void          PopButtonRepeat();
    function PopButtonRepeat() { exports.bind.PopButtonRepeat(); }
    // Cursor / Layout
    // IMGUI_API void          Separator();                                                        // separator, generally horizontal. inside a menu bar or in horizontal layout mode, this becomes a vertical separator.
    function Separator() { exports.bind.Separator(); }
    // IMGUI_API void          SameLine(float pos_x = 0.0f, float spacing_w = -1.0f);              // call between widgets or groups to layout them horizontally
    function SameLine(pos_x = 0.0, spacing_w = -1.0) {
        exports.bind.SameLine(pos_x, spacing_w);
    }
    // IMGUI_API void          NewLine();                                                          // undo a SameLine()
    function NewLine() { exports.bind.NewLine(); }
    // IMGUI_API void          Spacing();                                                          // add vertical spacing
    function Spacing() { exports.bind.Spacing(); }
    // IMGUI_API void          Dummy(const ImVec2& size);                                          // add a dummy item of given size
    function Dummy(size) { exports.bind.Dummy(size); }
    // IMGUI_API void          Indent(float indent_w = 0.0f);                                      // move content position toward the right, by style.IndentSpacing or indent_w if != 0
    function Indent(indent_w = 0.0) { exports.bind.Indent(indent_w); }
    // IMGUI_API void          Unindent(float indent_w = 0.0f);                                    // move content position back to the left, by style.IndentSpacing or indent_w if != 0
    function Unindent(indent_w = 0.0) { exports.bind.Unindent(indent_w); }
    // IMGUI_API void          BeginGroup();                                                       // lock horizontal starting position + capture group bounding box into one "item" (so you can use IsItemHovered() or layout primitives such as SameLine() on whole group, etc.)
    function BeginGroup() { exports.bind.BeginGroup(); }
    // IMGUI_API void          EndGroup();
    function EndGroup() { exports.bind.EndGroup(); }
    // IMGUI_API ImVec2        GetCursorPos();                                                     // cursor position is relative to window position
    function GetCursorPos(out = new ImVec2()) { return exports.bind.GetCursorPos(out); }
    // IMGUI_API float         GetCursorPosX();                                                    // "
    function GetCursorPosX() { return exports.bind.GetCursorPosX(); }
    // IMGUI_API float         GetCursorPosY();                                                    // "
    function GetCursorPosY() { return exports.bind.GetCursorPosY(); }
    // IMGUI_API void          SetCursorPos(const ImVec2& local_pos);                              // "
    function SetCursorPos(local_pos) { exports.bind.SetCursorPos(local_pos); }
    // IMGUI_API void          SetCursorPosX(float x);                                             // "
    function SetCursorPosX(x) { exports.bind.SetCursorPosX(x); }
    // IMGUI_API void          SetCursorPosY(float y);                                             // "
    function SetCursorPosY(y) { exports.bind.SetCursorPosY(y); }
    // IMGUI_API ImVec2        GetCursorStartPos();                                                // initial cursor position
    function GetCursorStartPos(out = new ImVec2()) { return exports.bind.GetCursorStartPos(out); }
    // IMGUI_API ImVec2        GetCursorScreenPos();                                               // cursor position in absolute screen coordinates [0..io.DisplaySize] (useful to work with ImDrawList API)
    function GetCursorScreenPos(out = new ImVec2()) { return exports.bind.GetCursorScreenPos(out); }
    // IMGUI_API void          SetCursorScreenPos(const ImVec2& pos);                              // cursor position in absolute screen coordinates [0..io.DisplaySize]
    function SetCursorScreenPos(pos) { exports.bind.SetCursorScreenPos(pos); }
    // IMGUI_API void          AlignTextToFramePadding();                                          // vertically align/lower upcoming text to FramePadding.y so that it will aligns to upcoming widgets (call if you have text on a line before regular widgets)
    function AlignTextToFramePadding() { exports.bind.AlignTextToFramePadding(); }
    // IMGUI_API float         GetTextLineHeight();                                                // ~ FontSize
    function GetTextLineHeight() { return exports.bind.GetTextLineHeight(); }
    // IMGUI_API float         GetTextLineHeightWithSpacing();                                     // ~ FontSize + style.ItemSpacing.y (distance in pixels between 2 consecutive lines of text)
    function GetTextLineHeightWithSpacing() { return exports.bind.GetTextLineHeightWithSpacing(); }
    // IMGUI_API float         GetFrameHeight();                                                   // ~ FontSize + style.FramePadding.y * 2
    function GetFrameHeight() { return exports.bind.GetFrameHeight(); }
    // IMGUI_API float         GetFrameHeightWithSpacing();                                        // ~ FontSize + style.FramePadding.y * 2 + style.ItemSpacing.y (distance in pixels between 2 consecutive lines of framed widgets)
    function GetFrameHeightWithSpacing() { return exports.bind.GetFrameHeightWithSpacing(); }
    // Columns
    // You can also use SameLine(pos_x) for simplified columns. The columns API is still work-in-progress and rather lacking.
    // IMGUI_API void          Columns(int count = 1, const char* id = NULL, bool border = true);
    function Columns(count = 1, id = null, border = true) {
        id = id || "";
        exports.bind.Columns(count, id, border);
    }
    // IMGUI_API void          NextColumn();                                                       // next column, defaults to current row or next row if the current row is finished
    function NextColumn() { exports.bind.NextColumn(); }
    // IMGUI_API int           GetColumnIndex();                                                   // get current column index
    function GetColumnIndex() { return exports.bind.GetColumnIndex(); }
    // IMGUI_API float         GetColumnWidth(int column_index = -1);                              // get column width (in pixels). pass -1 to use current column
    function GetColumnWidth(column_index = -1) {
        return exports.bind.GetColumnWidth(column_index);
    }
    // IMGUI_API void          SetColumnWidth(int column_index, float width);                      // set column width (in pixels). pass -1 to use current column
    function SetColumnWidth(column_index, width) { exports.bind.SetColumnWidth(column_index, width); }
    // IMGUI_API float         GetColumnOffset(int column_index = -1);                             // get position of column line (in pixels, from the left side of the contents region). pass -1 to use current column, otherwise 0..GetColumnsCount() inclusive. column 0 is typically 0.0f
    function GetColumnOffset(column_index = -1) {
        return exports.bind.GetColumnOffset(column_index);
    }
    // IMGUI_API void          SetColumnOffset(int column_index, float offset_x);                  // set position of column line (in pixels, from the left side of the contents region). pass -1 to use current column
    function SetColumnOffset(column_index, offset_x) { exports.bind.SetColumnOffset(column_index, offset_x); }
    // IMGUI_API int           GetColumnsCount();
    function GetColumnsCount() { return exports.bind.GetColumnsCount(); }
    // ID scopes
    // If you are creating widgets in a loop you most likely want to push a unique identifier (e.g. object pointer, loop index) so ImGui can differentiate them.
    // You can also use the "##foobar" syntax within widget label to distinguish them from each others. Read "A primer on the use of labels/IDs" in the FAQ for more details.
    // IMGUI_API void          PushID(const char* str_id);                                         // push identifier into the ID stack. IDs are hash of the entire stack!
    // IMGUI_API void          PushID(const char* str_id_begin, const char* str_id_end);
    // IMGUI_API void          PushID(const void* ptr_id);
    // IMGUI_API void          PushID(int int_id);
    function PushID(id) { exports.bind.PushID(id); }
    // IMGUI_API void          PopID();
    function PopID() { exports.bind.PopID(); }
    // IMGUI_API ImGuiID       GetID(const char* str_id);                                          // calculate unique ID (hash of whole ID stack + given parameter). e.g. if you want to query into ImGuiStorage yourself
    // IMGUI_API ImGuiID       GetID(const char* str_id_begin, const char* str_id_end);
    // IMGUI_API ImGuiID       GetID(const void* ptr_id);
    function GetID(id) { return exports.bind.GetID(id); }
    // Widgets: Text
    // IMGUI_API void          TextUnformatted(const char* text, const char* text_end = NULL);               // raw text without formatting. Roughly equivalent to Text("%s", text) but: A) doesn't require null terminated string if 'text_end' is specified, B) it's faster, no memory copy is done, no buffer size limits, recommended for long chunks of text.
    function TextUnformatted(text, text_end = null) { exports.bind.TextUnformatted(text_end !== null ? text.substring(0, text_end) : text); }
    // IMGUI_API void          Text(const char* fmt, ...)                                     IM_FMTARGS(1); // simple formatted text
    // IMGUI_API void          TextV(const char* fmt, va_list args)                           IM_FMTLIST(1);
    function Text(fmt /*, ...args: any[]*/) { exports.bind.Text(fmt /*, ...args*/); }
    // IMGUI_API void          TextColored(const ImVec4& col, const char* fmt, ...)           IM_FMTARGS(2); // shortcut for PushStyleColor(ImGuiCol_Text, col); Text(fmt, ...); PopStyleColor();
    // IMGUI_API void          TextColoredV(const ImVec4& col, const char* fmt, va_list args) IM_FMTLIST(2);
    function TextColored(col, fmt /*, ...args: any[]*/) {
        exports.bind.TextColored((col instanceof ImColor) ? col.Value : col, fmt /*, ...args*/);
    }
    // IMGUI_API void          TextDisabled(const char* fmt, ...)                             IM_FMTARGS(1); // shortcut for PushStyleColor(ImGuiCol_Text, style.Colors[ImGuiCol_TextDisabled]); Text(fmt, ...); PopStyleColor();
    // IMGUI_API void          TextDisabledV(const char* fmt, va_list args)                   IM_FMTLIST(1);
    function TextDisabled(fmt /*, ...args: any[]*/) { exports.bind.TextDisabled(fmt /*, ...args*/); }
    // IMGUI_API void          TextWrapped(const char* fmt, ...)                              IM_FMTARGS(1); // shortcut for PushTextWrapPos(0.0f); Text(fmt, ...); PopTextWrapPos();. Note that this won't work on an auto-resizing window if there's no other widgets to extend the window width, yoy may need to set a size using SetNextWindowSize().
    // IMGUI_API void          TextWrappedV(const char* fmt, va_list args)                    IM_FMTLIST(1);
    function TextWrapped(fmt /*, ...args: any[]*/) { exports.bind.TextWrapped(fmt /*, ...args*/); }
    // IMGUI_API void          LabelText(const char* label, const char* fmt, ...)             IM_FMTARGS(2); // display text+label aligned the same way as value+label widgets
    // IMGUI_API void          LabelTextV(const char* label, const char* fmt, va_list args)   IM_FMTLIST(2);
    function LabelText(label, fmt /*, ...args: any[]*/) { exports.bind.LabelText(label, fmt /*, ...args*/); }
    // IMGUI_API void          BulletText(const char* fmt, ...)                               IM_FMTARGS(1); // shortcut for Bullet()+Text()
    // IMGUI_API void          BulletTextV(const char* fmt, va_list args)                     IM_FMTLIST(1);
    function BulletText(fmt /*, ...args: any[]*/) { exports.bind.BulletText(fmt /*, ...args*/); }
    // IMGUI_API void          Bullet();                                                                     // draw a small circle and keep the cursor on the same line. advance cursor x position by GetTreeNodeToLabelSpacing(), same distance that TreeNode() uses
    function Bullet() { exports.bind.Bullet(); }
    // Widgets: Main
    // IMGUI_API bool          Button(const char* label, const ImVec2& size = ImVec2(0,0));            // button
    function Button(label, size = ImVec2.ZERO) {
        return exports.bind.Button(label, size);
    }
    // IMGUI_API bool          SmallButton(const char* label);                                         // button with FramePadding=(0,0) to easily embed within text
    function SmallButton(label) { return exports.bind.SmallButton(label); }
    // IMGUI_API bool          ArrowButton(const char* str_id, ImGuiDir dir);                  // square button with an arrow shape
    function ArrowButton(str_id, dir) { return exports.bind.ArrowButton(str_id, dir); }
    // IMGUI_API bool          InvisibleButton(const char* str_id, const ImVec2& size);                // button behavior without the visuals, useful to build custom behaviors using the public api (along with IsItemActive, IsItemHovered, etc.)
    function InvisibleButton(str_id, size) {
        return exports.bind.InvisibleButton(str_id, size);
    }
    // IMGUI_API void          Image(ImTextureID user_texture_id, const ImVec2& size, const ImVec2& uv0 = ImVec2(0,0), const ImVec2& uv1 = ImVec2(1,1), const ImVec4& tint_col = ImVec4(1,1,1,1), const ImVec4& border_col = ImVec4(0,0,0,0));
    function Image(user_texture_id, size, uv0 = ImVec2.ZERO, uv1 = ImVec2.UNIT, tint_col = ImVec4.WHITE, border_col = ImVec4.ZERO) {
        exports.bind.Image(ImGuiContext.setTexture(user_texture_id), size, uv0, uv1, tint_col, border_col);
    }
    // IMGUI_API bool          ImageButton(ImTextureID user_texture_id, const ImVec2& size, const ImVec2& uv0 = ImVec2(0,0),  const ImVec2& uv1 = ImVec2(1,1), int frame_padding = -1, const ImVec4& bg_col = ImVec4(0,0,0,0), const ImVec4& tint_col = ImVec4(1,1,1,1));    // <0 frame_padding uses default frame padding settings. 0 for no padding
    function ImageButton(user_texture_id, size, uv0 = ImVec2.ZERO, uv1 = ImVec2.UNIT, frame_padding = -1, bg_col = ImVec4.ZERO, tint_col = ImVec4.WHITE) {
        return exports.bind.ImageButton(ImGuiContext.setTexture(user_texture_id), size, uv0, uv1, frame_padding, bg_col, tint_col);
    }
    // IMGUI_API bool          Checkbox(const char* label, bool* v);
    function Checkbox(label, v) {
        if (Array.isArray(v)) {
            return exports.bind.Checkbox(label, v);
        }
        else {
            const ref_v = [v()];
            const ret = exports.bind.Checkbox(label, ref_v);
            v(ref_v[0]);
            return ret;
        }
    }
    // IMGUI_API bool          CheckboxFlags(const char* label, unsigned int* flags, unsigned int flags_value);
    function CheckboxFlags(label, flags, flags_value) {
        if (Array.isArray(flags)) {
            return exports.bind.CheckboxFlags(label, flags, flags_value);
        }
        else {
            const ref_flags = [flags()];
            const ret = exports.bind.CheckboxFlags(label, ref_flags, flags_value);
            flags(ref_flags[0]);
            return ret;
        }
    }
    function RadioButton(label, ...args) {
        if (typeof (args[0]) === "boolean") {
            const active = args[0];
            return exports.bind.RadioButton_A(label, active);
        }
        else {
            const v = args[0];
            const v_button = args[1];
            const _v = Array.isArray(v) ? v : [v()];
            const ret = exports.bind.RadioButton_B(label, _v, v_button);
            if (!Array.isArray(v)) {
                v(_v[0]);
            }
            return ret;
        }
    }
    function PlotLines(label, ...args) {
        if (Array.isArray(args[0])) {
            const values = args[0];
            const values_getter = (data, idx) => values[idx * stride];
            const values_count = typeof (args[1]) === "number" ? args[1] : values.length;
            const values_offset = typeof (args[2]) === "number" ? args[2] : 0;
            const overlay_text = typeof (args[3]) === "string" ? args[3] : null;
            const scale_min = typeof (args[4]) === "number" ? args[4] : Number.MAX_VALUE;
            const scale_max = typeof (args[5]) === "number" ? args[5] : Number.MAX_VALUE;
            const graph_size = args[6] || ImVec2.ZERO;
            const stride = typeof (args[7]) === "number" ? args[7] : 1;
            exports.bind.PlotLines(label, values_getter, null, values_count, values_offset, overlay_text, scale_min, scale_max, graph_size);
        }
        else {
            const values_getter = args[0];
            const data = args[1];
            const values_count = args[2];
            const values_offset = typeof (args[3]) === "number" ? args[3] : 0;
            const overlay_text = typeof (args[4]) === "string" ? args[4] : null;
            const scale_min = typeof (args[5]) === "number" ? args[5] : Number.MAX_VALUE;
            const scale_max = typeof (args[6]) === "number" ? args[6] : Number.MAX_VALUE;
            const graph_size = args[7] || ImVec2.ZERO;
            exports.bind.PlotLines(label, values_getter, data, values_count, values_offset, overlay_text, scale_min, scale_max, graph_size);
        }
    }
    function PlotHistogram(label, ...args) {
        if (Array.isArray(args[0])) {
            const values = args[0];
            const values_getter = (data, idx) => values[idx * stride];
            const values_count = typeof (args[1]) === "number" ? args[1] : values.length;
            const values_offset = typeof (args[2]) === "number" ? args[2] : 0;
            const overlay_text = typeof (args[3]) === "string" ? args[3] : null;
            const scale_min = typeof (args[4]) === "number" ? args[4] : Number.MAX_VALUE;
            const scale_max = typeof (args[5]) === "number" ? args[5] : Number.MAX_VALUE;
            const graph_size = args[6] || ImVec2.ZERO;
            const stride = typeof (args[7]) === "number" ? args[7] : 1;
            exports.bind.PlotHistogram(label, values_getter, null, values_count, values_offset, overlay_text, scale_min, scale_max, graph_size);
        }
        else {
            const values_getter = args[0];
            const data = args[1];
            const values_count = args[2];
            const values_offset = typeof (args[3]) === "number" ? args[3] : 0;
            const overlay_text = typeof (args[4]) === "string" ? args[4] : null;
            const scale_min = typeof (args[5]) === "number" ? args[5] : Number.MAX_VALUE;
            const scale_max = typeof (args[6]) === "number" ? args[6] : Number.MAX_VALUE;
            const graph_size = args[7] || ImVec2.ZERO;
            exports.bind.PlotHistogram(label, values_getter, data, values_count, values_offset, overlay_text, scale_min, scale_max, graph_size);
        }
    }
    // IMGUI_API void          ProgressBar(float fraction, const ImVec2& size_arg = ImVec2(-1,0), const char* overlay = NULL);
    function ProgressBar(fraction, size_arg = new ImVec2(-1, 0), overlay = null) {
        exports.bind.ProgressBar(fraction, size_arg, overlay);
    }
    // Widgets: Combo Box
    // The new BeginCombo()/EndCombo() api allows you to manage your contents and selection state however you want it.
    // The old Combo() api are helpers over BeginCombo()/EndCombo() which are kept available for convenience purpose.
    // IMGUI_API bool          BeginCombo(const char* label, const char* preview_value, ImGuiComboFlags flags = 0);
    function BeginCombo(label, preview_value = null, flags = 0) {
        return exports.bind.BeginCombo(label, preview_value, flags);
    }
    // IMGUI_API void          EndCombo();
    function EndCombo() { exports.bind.EndCombo(); }
    function Combo(label, current_item, ...args) {
        let ret = false;
        const _current_item = Array.isArray(current_item) ? current_item : [current_item()];
        if (Array.isArray(args[0])) {
            const items = args[0];
            const items_count = typeof (args[1]) === "number" ? args[1] : items.length;
            const popup_max_height_in_items = typeof (args[2]) === "number" ? args[2] : -1;
            const items_getter = (data, idx, out_text) => { out_text[0] = items[idx]; return true; };
            ret = exports.bind.Combo(label, _current_item, items_getter, null, items_count, popup_max_height_in_items);
        }
        else if (typeof (args[0]) === "string") {
            const items_separated_by_zeros = args[0];
            const popup_max_height_in_items = typeof (args[1]) === "number" ? args[1] : -1;
            const items = items_separated_by_zeros.replace(/^\0+|\0+$/g, "").split("\0");
            const items_count = items.length;
            const items_getter = (data, idx, out_text) => { out_text[0] = items[idx]; return true; };
            ret = exports.bind.Combo(label, _current_item, items_getter, null, items_count, popup_max_height_in_items);
        }
        else {
            const items_getter = args[0];
            const data = args[1];
            const items_count = args[2];
            const popup_max_height_in_items = typeof (args[3]) === "number" ? args[3] : -1;
            ret = exports.bind.Combo(label, _current_item, items_getter, data, items_count, popup_max_height_in_items);
        }
        if (!Array.isArray(current_item)) {
            current_item(_current_item[0]);
        }
        return ret;
    }
    // Widgets: Drags (tip: ctrl+click on a drag box to input with keyboard. manually input values aren't clamped, can go off-bounds)
    // For all the Float2/Float3/Float4/Int2/Int3/Int4 versions of every functions, note that a 'float v[X]' function argument is the same as 'float* v', the array syntax is just a way to document the number of elements that are expected to be accessible. You can pass address of your first element out of a contiguous set, e.g. &myvector.x
    // IMGUI_API bool          DragFloat(const char* label, float* v, float v_speed = 1.0f, float v_min = 0.0f, float v_max = 0.0f, const char* display_format = "%.3f", float power = 1.0f);     // If v_min >= v_max we have no bound
    function DragFloat(label, v, v_speed = 1.0, v_min = 0.0, v_max = 0.0, display_format = "%.3f", power = 1.0) {
        const _v = import_Scalar(v);
        const ret = exports.bind.DragFloat(label, _v, v_speed, v_min, v_max, display_format, power);
        export_Scalar(_v, v);
        return ret;
    }
    // IMGUI_API bool          DragFloat2(const char* label, float v[2], float v_speed = 1.0f, float v_min = 0.0f, float v_max = 0.0f, const char* display_format = "%.3f", float power = 1.0f);
    function DragFloat2(label, v, v_speed = 1.0, v_min = 0.0, v_max = 0.0, display_format = "%.3f", power = 1.0) {
        const _v = import_Vector2(v);
        const ret = exports.bind.DragFloat2(label, _v, v_speed, v_min, v_max, display_format, power);
        export_Vector2(_v, v);
        return ret;
    }
    // IMGUI_API bool          DragFloat3(const char* label, float v[3], float v_speed = 1.0f, float v_min = 0.0f, float v_max = 0.0f, const char* display_format = "%.3f", float power = 1.0f);
    function DragFloat3(label, v, v_speed = 1.0, v_min = 0.0, v_max = 0.0, display_format = "%.3f", power = 1.0) {
        const _v = import_Vector3(v);
        const ret = exports.bind.DragFloat3(label, _v, v_speed, v_min, v_max, display_format, power);
        export_Vector3(_v, v);
        return ret;
    }
    // IMGUI_API bool          DragFloat4(const char* label, float v[4], float v_speed = 1.0f, float v_min = 0.0f, float v_max = 0.0f, const char* display_format = "%.3f", float power = 1.0f);
    function DragFloat4(label, v, v_speed = 1.0, v_min = 0.0, v_max = 0.0, display_format = "%.3f", power = 1.0) {
        const _v = import_Vector4(v);
        const ret = exports.bind.DragFloat4(label, _v, v_speed, v_min, v_max, display_format, power);
        export_Vector4(_v, v);
        return ret;
    }
    // IMGUI_API bool          DragFloatRange2(const char* label, float* v_current_min, float* v_current_max, float v_speed = 1.0f, float v_min = 0.0f, float v_max = 0.0f, const char* display_format = "%.3f", const char* display_format_max = NULL, float power = 1.0f);
    function DragFloatRange2(label, v_current_min, v_current_max, v_speed = 1.0, v_min = 0.0, v_max = 0.0, display_format = "%.3f", display_format_max = null, power = 1.0) {
        const _v_current_min = import_Scalar(v_current_min);
        const _v_current_max = import_Scalar(v_current_max);
        const ret = exports.bind.DragFloatRange2(label, _v_current_min, _v_current_max, v_speed, v_min, v_max, display_format, display_format_max, power);
        export_Scalar(_v_current_min, v_current_min);
        export_Scalar(_v_current_max, v_current_max);
        return ret;
    }
    // IMGUI_API bool          DragInt(const char* label, int* v, float v_speed = 1.0f, int v_min = 0, int v_max = 0, const char* display_format = "%d");                                       // If v_min >= v_max we have no bound
    function DragInt(label, v, v_speed = 1.0, v_min = 0, v_max = 0, format = "%d") {
        const _v = import_Scalar(v);
        const ret = exports.bind.DragInt(label, _v, v_speed, v_min, v_max, format);
        export_Scalar(_v, v);
        return ret;
    }
    // IMGUI_API bool          DragInt2(const char* label, int v[2], float v_speed = 1.0f, int v_min = 0, int v_max = 0, const char* format = "%d");
    function DragInt2(label, v, v_speed = 1.0, v_min = 0, v_max = 0, format = "%d") {
        const _v = import_Vector2(v);
        const ret = exports.bind.DragInt2(label, _v, v_speed, v_min, v_max, format);
        export_Vector2(_v, v);
        return ret;
    }
    // IMGUI_API bool          DragInt3(const char* label, int v[3], float v_speed = 1.0f, int v_min = 0, int v_max = 0, const char* format = "%d");
    function DragInt3(label, v, v_speed = 1.0, v_min = 0, v_max = 0, format = "%d") {
        const _v = import_Vector3(v);
        const ret = exports.bind.DragInt3(label, _v, v_speed, v_min, v_max, format);
        export_Vector3(_v, v);
        return ret;
    }
    // IMGUI_API bool          DragInt4(const char* label, int v[4], float v_speed = 1.0f, int v_min = 0, int v_max = 0, const char* format = "%d");
    function DragInt4(label, v, v_speed = 1.0, v_min = 0, v_max = 0, format = "%d") {
        const _v = import_Vector4(v);
        const ret = exports.bind.DragInt4(label, _v, v_speed, v_min, v_max, format);
        export_Vector4(_v, v);
        return ret;
    }
    // IMGUI_API bool          DragIntRange2(const char* label, int* v_current_min, int* v_current_max, float v_speed = 1.0f, int v_min = 0, int v_max = 0, const char* display_format = "%.0f", const char* display_format_max = NULL);
    function DragIntRange2(label, v_current_min, v_current_max, v_speed = 1.0, v_min = 0, v_max = 0, format = "%d", format_max = null) {
        const _v_current_min = import_Scalar(v_current_min);
        const _v_current_max = import_Scalar(v_current_max);
        const ret = exports.bind.DragIntRange2(label, _v_current_min, _v_current_max, v_speed, v_min, v_max, format, format_max);
        export_Scalar(_v_current_min, v_current_min);
        export_Scalar(_v_current_max, v_current_max);
        return ret;
    }
    // IMGUI_API bool          DragScalar(const char* label, ImGuiDataType data_type, void* v, float v_speed, const void* v_min = NULL, const void* v_max = NULL, const char* format = NULL, float power = 1.0f);
    // IMGUI_API bool          DragScalarN(const char* label, ImGuiDataType data_type, void* v, int components, float v_speed, const void* v_min = NULL, const void* v_max = NULL, const char* format = NULL, float power = 1.0f);
    function DragScalar(label, v, v_speed, v_min = null, v_max = null, format = null, power = 1.0) {
        if (v instanceof Int8Array) {
            return exports.bind.DragScalar(label, exports.ImGuiDataType.S8, v, v_speed, v_min, v_max, format, power);
        }
        if (v instanceof Uint8Array) {
            return exports.bind.DragScalar(label, exports.ImGuiDataType.U8, v, v_speed, v_min, v_max, format, power);
        }
        if (v instanceof Int16Array) {
            return exports.bind.DragScalar(label, exports.ImGuiDataType.S16, v, v_speed, v_min, v_max, format, power);
        }
        if (v instanceof Uint16Array) {
            return exports.bind.DragScalar(label, exports.ImGuiDataType.U16, v, v_speed, v_min, v_max, format, power);
        }
        if (v instanceof Int32Array) {
            return exports.bind.DragScalar(label, exports.ImGuiDataType.S32, v, v_speed, v_min, v_max, format, power);
        }
        if (v instanceof Uint32Array) {
            return exports.bind.DragScalar(label, exports.ImGuiDataType.U32, v, v_speed, v_min, v_max, format, power);
        }
        // if (v instanceof Int64Array) { return bind.DragScalar(label, ImGuiDataType.S64, v, v_speed, v_min, v_max, format, power); }
        // if (v instanceof Uint64Array) { return bind.DragScalar(label, ImGuiDataType.U64, v, v_speed, v_min, v_max, format, power); }
        if (v instanceof Float32Array) {
            return exports.bind.DragScalar(label, exports.ImGuiDataType.Float, v, v_speed, v_min, v_max, format, power);
        }
        if (v instanceof Float64Array) {
            return exports.bind.DragScalar(label, exports.ImGuiDataType.Double, v, v_speed, v_min, v_max, format, power);
        }
        throw new Error();
    }
    // Widgets: Input with Keyboard
    // IMGUI_API bool          InputText(const char* label, char* buf, size_t buf_size, ImGuiInputTextFlags flags = 0, ImGuiInputTextCallback callback = NULL, void* user_data = NULL);
    function InputText(label, buf, buf_size = buf instanceof ImStringBuffer ? buf.size : ImGuiInputTextDefaultSize, flags = 0, callback = null, user_data = null) {
        const _callback = callback && ((data) => callback(new ImGuiInputTextCallbackData(data, user_data))) || null;
        if (Array.isArray(buf)) {
            return exports.bind.InputText(label, buf, buf_size, flags, _callback, null);
        }
        else if (buf instanceof ImStringBuffer) {
            const ref_buf = [buf.buffer];
            const _buf_size = Math.min(buf_size, buf.size);
            const ret = exports.bind.InputText(label, ref_buf, _buf_size, flags, _callback, null);
            buf.buffer = ref_buf[0];
            return ret;
        }
        else {
            const ref_buf = [buf()];
            const ret = exports.bind.InputText(label, ref_buf, buf_size, flags, _callback, null);
            buf(ref_buf[0]);
            return ret;
        }
    }
    // IMGUI_API bool          InputTextWithHint(const char* label, const char* hint, char* buf, size_t buf_size, ImGuiInputTextFlags flags = 0, ImGuiInputTextCallback callback = NULL, void* user_data = NULL);
    function InputTextWithHint(label, hint, buf, buf_size = buf instanceof ImStringBuffer ? buf.size : ImGuiInputTextDefaultSize, flags = 0, callback = null, user_data = null) {
        const _callback = callback && ((data) => callback(new ImGuiInputTextCallbackData(data, user_data))) || null;
        if (Array.isArray(buf)) {
            return exports.bind.InputTextWithHint(label, hint, buf, buf_size, flags, _callback, null);
        }
        else if (buf instanceof ImStringBuffer) {
            const ref_buf = [buf.buffer];
            const _buf_size = Math.min(buf_size, buf.size);
            const ret = exports.bind.InputTextWithHint(label, hint, ref_buf, _buf_size, flags, _callback, null);
            buf.buffer = ref_buf[0];
            return ret;
        }
        else {
            const ref_buf = [buf()];
            const ret = exports.bind.InputTextWithHint(label, hint, ref_buf, buf_size, flags, _callback, null);
            buf(ref_buf[0]);
            return ret;
        }
    }
    // IMGUI_API bool          InputTextMultiline(const char* label, char* buf, size_t buf_size, const ImVec2& size = ImVec2(0,0), ImGuiInputTextFlags flags = 0, ImGuiInputTextCallback callback = NULL, void* user_data = NULL);
    function InputTextMultiline(label, buf, buf_size = buf instanceof ImStringBuffer ? buf.size : ImGuiInputTextDefaultSize, size = ImVec2.ZERO, flags = 0, callback = null, user_data = null) {
        const _callback = callback && ((data) => callback(new ImGuiInputTextCallbackData(data, user_data))) || null;
        if (Array.isArray(buf)) {
            return exports.bind.InputTextMultiline(label, buf, buf_size, size, flags, _callback, null);
        }
        else if (buf instanceof ImStringBuffer) {
            const ref_buf = [buf.buffer];
            const _buf_size = Math.min(buf_size, buf.size);
            const ret = exports.bind.InputTextMultiline(label, ref_buf, _buf_size, size, flags, _callback, null);
            buf.buffer = ref_buf[0];
            return ret;
        }
        else {
            const ref_buf = [buf()];
            const ret = exports.bind.InputTextMultiline(label, ref_buf, buf_size, size, flags, _callback, null);
            buf(ref_buf[0]);
            return ret;
        }
    }
    // IMGUI_API bool          InputFloat(const char* label, float* v, float step = 0.0f, float step_fast = 0.0f, const char* format = "%.3f", ImGuiInputTextFlags extra_flags = 0);
    function InputFloat(label, v, step = 0.0, step_fast = 0.0, format = "%.3f", extra_flags = 0) {
        const _v = import_Scalar(v);
        const ret = exports.bind.InputFloat(label, _v, step, step_fast, format, extra_flags);
        export_Scalar(_v, v);
        return ret;
    }
    // IMGUI_API bool          InputFloat2(const char* label, float v[2], const char* format = "%.3f", ImGuiInputTextFlags extra_flags = 0);
    function InputFloat2(label, v, format = "%.3f", extra_flags = 0) {
        const _v = import_Vector2(v);
        const ret = exports.bind.InputFloat2(label, _v, format, extra_flags);
        export_Vector2(_v, v);
        return ret;
    }
    // IMGUI_API bool          InputFloat3(const char* label, float v[3], const char* format = "%.3f", ImGuiInputTextFlags extra_flags = 0);
    function InputFloat3(label, v, format = "%.3f", extra_flags = 0) {
        const _v = import_Vector3(v);
        const ret = exports.bind.InputFloat3(label, _v, format, extra_flags);
        export_Vector3(_v, v);
        return ret;
    }
    // IMGUI_API bool          InputFloat4(const char* label, float v[4], const char* format = "%.3f", ImGuiInputTextFlags extra_flags = 0);
    function InputFloat4(label, v, format = "%.3f", extra_flags = 0) {
        const _v = import_Vector4(v);
        const ret = exports.bind.InputFloat4(label, _v, format, extra_flags);
        export_Vector4(_v, v);
        return ret;
    }
    // IMGUI_API bool          InputInt(const char* label, int* v, int step = 1, int step_fast = 100, ImGuiInputTextFlags extra_flags = 0);
    function InputInt(label, v, step = 1, step_fast = 100, extra_flags = 0) {
        const _v = import_Scalar(v);
        const ret = exports.bind.InputInt(label, _v, step, step_fast, extra_flags);
        export_Scalar(_v, v);
        return ret;
    }
    // IMGUI_API bool          InputInt2(const char* label, int v[2], ImGuiInputTextFlags extra_flags = 0);
    function InputInt2(label, v, extra_flags = 0) {
        const _v = import_Vector2(v);
        const ret = exports.bind.InputInt2(label, _v, extra_flags);
        export_Vector2(_v, v);
        return ret;
    }
    // IMGUI_API bool          InputInt3(const char* label, int v[3], ImGuiInputTextFlags extra_flags = 0);
    function InputInt3(label, v, extra_flags = 0) {
        const _v = import_Vector3(v);
        const ret = exports.bind.InputInt3(label, _v, extra_flags);
        export_Vector3(_v, v);
        return ret;
    }
    // IMGUI_API bool          InputInt4(const char* label, int v[4], ImGuiInputTextFlags extra_flags = 0);
    function InputInt4(label, v, extra_flags = 0) {
        const _v = import_Vector4(v);
        const ret = exports.bind.InputInt4(label, _v, extra_flags);
        export_Vector4(_v, v);
        return ret;
    }
    // IMGUI_API bool          InputDouble(const char* label, float* v, float step = 0.0f, float step_fast = 0.0f, const char* format = "%.6f", ImGuiInputTextFlags extra_flags = 0);
    function InputDouble(label, v, step = 0.0, step_fast = 0.0, format = "%.6f", extra_flags = 0) {
        const _v = import_Scalar(v);
        const ret = exports.bind.InputDouble(label, _v, step, step_fast, format, extra_flags);
        export_Scalar(_v, v);
        return ret;
    }
    // IMGUI_API bool          InputScalar(const char* label, ImGuiDataType data_type, void* v, const void* step = NULL, const void* step_fast = NULL, const char* format = NULL, ImGuiInputTextFlags extra_flags = 0);
    // IMGUI_API bool          InputScalarN(const char* label, ImGuiDataType data_type, void* v, int components, const void* step = NULL, const void* step_fast = NULL, const char* format = NULL, ImGuiInputTextFlags extra_flags = 0);
    function InputScalar(label, v, step = null, step_fast = null, format = null, extra_flags = 0) {
        if (v instanceof Int8Array) {
            return exports.bind.InputScalar(label, exports.ImGuiDataType.S8, v, step, step_fast, format, extra_flags);
        }
        if (v instanceof Uint8Array) {
            return exports.bind.InputScalar(label, exports.ImGuiDataType.U8, v, step, step_fast, format, extra_flags);
        }
        if (v instanceof Int16Array) {
            return exports.bind.InputScalar(label, exports.ImGuiDataType.S16, v, step, step_fast, format, extra_flags);
        }
        if (v instanceof Uint16Array) {
            return exports.bind.InputScalar(label, exports.ImGuiDataType.U16, v, step, step_fast, format, extra_flags);
        }
        if (v instanceof Int32Array) {
            return exports.bind.InputScalar(label, exports.ImGuiDataType.S32, v, step, step_fast, format, extra_flags);
        }
        if (v instanceof Uint32Array) {
            return exports.bind.InputScalar(label, exports.ImGuiDataType.U32, v, step, step_fast, format, extra_flags);
        }
        // if (v instanceof Int64Array) { return bind.InputScalar(label, ImGuiDataType.S64, v, step, step_fast, format, extra_flags); }
        // if (v instanceof Uint64Array) { return bind.InputScalar(label, ImGuiDataType.U64, v, step, step_fast, format, extra_flags); }
        if (v instanceof Float32Array) {
            return exports.bind.InputScalar(label, exports.ImGuiDataType.Float, v, step, step_fast, format, extra_flags);
        }
        if (v instanceof Float64Array) {
            return exports.bind.InputScalar(label, exports.ImGuiDataType.Double, v, step, step_fast, format, extra_flags);
        }
        throw new Error();
    }
    // Widgets: Sliders (tip: ctrl+click on a slider to input with keyboard. manually input values aren't clamped, can go off-bounds)
    // IMGUI_API bool          SliderFloat(const char* label, float* v, float v_min, float v_max, const char* format = "%.3f", float power = 1.0f);     // adjust format to decorate the value with a prefix or a suffix for in-slider labels or unit display. Use power!=1.0 for logarithmic sliders
    function SliderFloat(label, v, v_min, v_max, format = "%.3f", power = 1.0) {
        const _v = import_Scalar(v);
        const ret = exports.bind.SliderFloat(label, _v, v_min, v_max, format, power);
        export_Scalar(_v, v);
        return ret;
    }
    // IMGUI_API bool          SliderFloat2(const char* label, float v[2], float v_min, float v_max, const char* format = "%.3f", float power = 1.0f);
    function SliderFloat2(label, v, v_min, v_max, format = "%.3f", power = 1.0) {
        const _v = import_Vector2(v);
        const ret = exports.bind.SliderFloat2(label, _v, v_min, v_max, format, power);
        export_Vector2(_v, v);
        return ret;
    }
    // IMGUI_API bool          SliderFloat3(const char* label, float v[3], float v_min, float v_max, const char* format = "%.3f", float power = 1.0f);
    function SliderFloat3(label, v, v_min, v_max, format = "%.3f", power = 1.0) {
        const _v = import_Vector3(v);
        const ret = exports.bind.SliderFloat3(label, _v, v_min, v_max, format, power);
        export_Vector3(_v, v);
        return ret;
    }
    // IMGUI_API bool          SliderFloat4(const char* label, float v[4], float v_min, float v_max, const char* format = "%.3f", float power = 1.0f);
    function SliderFloat4(label, v, v_min, v_max, format = "%.3f", power = 1.0) {
        const _v = import_Vector4(v);
        const ret = exports.bind.SliderFloat4(label, _v, v_min, v_max, format, power);
        export_Vector4(_v, v);
        return ret;
    }
    // IMGUI_API bool          SliderAngle(const char* label, float* v_rad, float v_degrees_min = -360.0f, float v_degrees_max = +360.0f);
    function SliderAngle(label, v_rad, v_degrees_min = -360.0, v_degrees_max = +360.0) {
        const _v_rad = import_Scalar(v_rad);
        const ret = exports.bind.SliderAngle(label, _v_rad, v_degrees_min, v_degrees_max);
        export_Scalar(_v_rad, v_rad);
        return ret;
    }
    function SliderAngle3(label, v_rad, v_degrees_min = -360.0, v_degrees_max = +360.0) {
        const _v_rad = import_Vector3(v_rad);
        _v_rad[0] = Math.floor(_v_rad[0] * 180 / Math.PI);
        _v_rad[1] = Math.floor(_v_rad[1] * 180 / Math.PI);
        _v_rad[2] = Math.floor(_v_rad[2] * 180 / Math.PI);
        const ret = exports.bind.SliderInt3(label, _v_rad, v_degrees_min, v_degrees_max, "%d deg");
        _v_rad[0] = _v_rad[0] * Math.PI / 180;
        _v_rad[1] = _v_rad[1] * Math.PI / 180;
        _v_rad[2] = _v_rad[2] * Math.PI / 180;
        export_Vector3(_v_rad, v_rad);
        return ret;
    }
    // IMGUI_API bool          SliderInt(const char* label, int* v, int v_min, int v_max, const char* format = "%d");
    function SliderInt(label, v, v_min, v_max, format = "%d") {
        const _v = import_Scalar(v);
        const ret = exports.bind.SliderInt(label, _v, v_min, v_max, format);
        export_Scalar(_v, v);
        return ret;
    }
    // IMGUI_API bool          SliderInt2(const char* label, int v[2], int v_min, int v_max, const char* format = "%d");
    function SliderInt2(label, v, v_min, v_max, format = "%d") {
        const _v = import_Vector2(v);
        const ret = exports.bind.SliderInt2(label, _v, v_min, v_max, format);
        export_Vector2(_v, v);
        return ret;
    }
    // IMGUI_API bool          SliderInt3(const char* label, int v[3], int v_min, int v_max, const char* format = "%d");
    function SliderInt3(label, v, v_min, v_max, format = "%d") {
        const _v = import_Vector3(v);
        const ret = exports.bind.SliderInt3(label, _v, v_min, v_max, format);
        export_Vector3(_v, v);
        return ret;
    }
    // IMGUI_API bool          SliderInt4(const char* label, int v[4], int v_min, int v_max, const char* format = "%d");
    function SliderInt4(label, v, v_min, v_max, format = "%d") {
        const _v = import_Vector4(v);
        const ret = exports.bind.SliderInt4(label, _v, v_min, v_max, format);
        export_Vector4(_v, v);
        return ret;
    }
    // IMGUI_API bool          SliderScalar(const char* label, ImGuiDataType data_type, void* v, const void* v_min, const void* v_max, const char* format = NULL, float power = 1.0f);
    // IMGUI_API bool          SliderScalarN(const char* label, ImGuiDataType data_type, void* v, int components, const void* v_min, const void* v_max, const char* format = NULL, float power = 1.0f);
    function SliderScalar(label, v, v_min, v_max, format = null, power = 1.0) {
        if (v instanceof Int8Array) {
            return exports.bind.SliderScalar(label, exports.ImGuiDataType.S8, v, v_min, v_max, format, power);
        }
        if (v instanceof Uint8Array) {
            return exports.bind.SliderScalar(label, exports.ImGuiDataType.U8, v, v_min, v_max, format, power);
        }
        if (v instanceof Int16Array) {
            return exports.bind.SliderScalar(label, exports.ImGuiDataType.S16, v, v_min, v_max, format, power);
        }
        if (v instanceof Uint16Array) {
            return exports.bind.SliderScalar(label, exports.ImGuiDataType.U16, v, v_min, v_max, format, power);
        }
        if (v instanceof Int32Array) {
            return exports.bind.SliderScalar(label, exports.ImGuiDataType.S32, v, v_min, v_max, format, power);
        }
        if (v instanceof Uint32Array) {
            return exports.bind.SliderScalar(label, exports.ImGuiDataType.U32, v, v_min, v_max, format, power);
        }
        // if (v instanceof Int64Array) { return bind.SliderScalar(label, ImGuiDataType.S64, v, v_min, v_max, format, power); }
        // if (v instanceof Uint64Array) { return bind.SliderScalar(label, ImGuiDataType.U64, v, v_min, v_max, format, power); }
        if (v instanceof Float32Array) {
            return exports.bind.SliderScalar(label, exports.ImGuiDataType.Float, v, v_min, v_max, format, power);
        }
        if (v instanceof Float64Array) {
            return exports.bind.SliderScalar(label, exports.ImGuiDataType.Double, v, v_min, v_max, format, power);
        }
        throw new Error();
    }
    // IMGUI_API bool          VSliderFloat(const char* label, const ImVec2& size, float* v, float v_min, float v_max, const char* format = "%.3f", float power = 1.0f);
    function VSliderFloat(label, size, v, v_min, v_max, format = "%.3f", power = 1.0) {
        const _v = import_Scalar(v);
        const ret = exports.bind.VSliderFloat(label, size, _v, v_min, v_max, format, power);
        export_Scalar(_v, v);
        return ret;
    }
    // IMGUI_API bool          VSliderInt(const char* label, const ImVec2& size, int* v, int v_min, int v_max, const char* format = "%d");
    function VSliderInt(label, size, v, v_min, v_max, format = "%d") {
        const _v = import_Scalar(v);
        const ret = exports.bind.VSliderInt(label, size, _v, v_min, v_max, format);
        export_Scalar(_v, v);
        return ret;
    }
    // IMGUI_API bool          VSliderScalar(const char* label, const ImVec2& size, ImGuiDataType data_type, void* v, const void* v_min, const void* v_max, const char* format = NULL, float power = 1.0f);
    function VSliderScalar(label, size, data_type, v, v_min, v_max, format = null, power = 1.0) {
        if (v instanceof Int8Array) {
            return exports.bind.VSliderScalar(label, size, exports.ImGuiDataType.S8, v, v_min, v_max, format, power);
        }
        if (v instanceof Uint8Array) {
            return exports.bind.VSliderScalar(label, size, exports.ImGuiDataType.U8, v, v_min, v_max, format, power);
        }
        if (v instanceof Int16Array) {
            return exports.bind.VSliderScalar(label, size, exports.ImGuiDataType.S16, v, v_min, v_max, format, power);
        }
        if (v instanceof Uint16Array) {
            return exports.bind.VSliderScalar(label, size, exports.ImGuiDataType.U16, v, v_min, v_max, format, power);
        }
        if (v instanceof Int32Array) {
            return exports.bind.VSliderScalar(label, size, exports.ImGuiDataType.S32, v, v_min, v_max, format, power);
        }
        if (v instanceof Uint32Array) {
            return exports.bind.VSliderScalar(label, size, exports.ImGuiDataType.U32, v, v_min, v_max, format, power);
        }
        // if (v instanceof Int64Array) { return bind.VSliderScalar(label, size, ImGuiDataType.S64, v, v_min, v_max, format, power); }
        // if (v instanceof Uint64Array) { return bind.VSliderScalar(label, size, ImGuiDataType.U64, v, v_min, v_max, format, power); }
        if (v instanceof Float32Array) {
            return exports.bind.VSliderScalar(label, size, exports.ImGuiDataType.Float, v, v_min, v_max, format, power);
        }
        if (v instanceof Float64Array) {
            return exports.bind.VSliderScalar(label, size, exports.ImGuiDataType.Double, v, v_min, v_max, format, power);
        }
        throw new Error();
    }
    // Widgets: Color Editor/Picker (tip: the ColorEdit* functions have a little colored preview square that can be left-clicked to open a picker, and right-clicked to open an option menu.)
    // Note that a 'float v[X]' function argument is the same as 'float* v', the array syntax is just a way to document the number of elements that are expected to be accessible. You can the pass the address of a first float element out of a contiguous structure, e.g. &myvector.x
    // IMGUI_API bool          ColorEdit3(const char* label, float col[3], ImGuiColorEditFlags flags = 0);
    function ColorEdit3(label, col, flags = 0) {
        const _col = import_Color3(col);
        const ret = exports.bind.ColorEdit3(label, _col, flags);
        export_Color3(_col, col);
        return ret;
    }
    // IMGUI_API bool          ColorEdit4(const char* label, float col[4], ImGuiColorEditFlags flags = 0);
    function ColorEdit4(label, col, flags = 0) {
        const _col = import_Color4(col);
        const ret = exports.bind.ColorEdit4(label, _col, flags);
        export_Color4(_col, col);
        return ret;
    }
    // IMGUI_API bool          ColorPicker3(const char* label, float col[3], ImGuiColorEditFlags flags = 0);
    function ColorPicker3(label, col, flags = 0) {
        const _col = import_Color3(col);
        const ret = exports.bind.ColorPicker3(label, _col, flags);
        export_Color3(_col, col);
        return ret;
    }
    // IMGUI_API bool          ColorPicker4(const char* label, float col[4], ImGuiColorEditFlags flags = 0, const float* ref_col = NULL);
    function ColorPicker4(label, col, flags = 0, ref_col = null) {
        const _col = import_Color4(col);
        const _ref_col = ref_col ? import_Color4(ref_col) : null;
        const ret = exports.bind.ColorPicker4(label, _col, flags, _ref_col);
        export_Color4(_col, col);
        if (_ref_col && ref_col) {
            export_Color4(_ref_col, ref_col);
        }
        return ret;
    }
    // IMGUI_API bool          ColorButton(const char* desc_id, const ImVec4& col, ImGuiColorEditFlags flags = 0, ImVec2 size = ImVec2(0,0));  // display a colored square/button, hover for details, return true when pressed.
    function ColorButton(desc_id, col, flags = 0, size = ImVec2.ZERO) {
        return exports.bind.ColorButton(desc_id, col, flags, size);
    }
    // IMGUI_API void          SetColorEditOptions(ImGuiColorEditFlags flags);                         // initialize current options (generally on application startup) if you want to select a default format, picker type, etc. User will be able to change many settings, unless you pass the _NoOptions flag to your calls.
    function SetColorEditOptions(flags) {
        exports.bind.SetColorEditOptions(flags);
    }
    function TreeNode(...args) {
        if (typeof (args[0]) === "string") {
            if (args.length === 1) {
                const label = args[0];
                return exports.bind.TreeNode_A(label);
            }
            else {
                const str_id = args[0];
                const fmt = args[1];
                return exports.bind.TreeNode_B(str_id, fmt);
            }
        }
        else {
            const ptr_id = args[0];
            const fmt = args[1];
            return exports.bind.TreeNode_C(ptr_id, fmt);
        }
    }
    function TreeNodeEx(...args) {
        if (typeof (args[0]) === "string") {
            if (args.length < 3) {
                const label = args[0];
                const flags = args[1] || 0;
                return exports.bind.TreeNodeEx_A(label, flags);
            }
            else {
                const str_id = args[0];
                const flags = args[1];
                const fmt = args[2];
                return exports.bind.TreeNodeEx_B(str_id, flags, fmt);
            }
        }
        else {
            const ptr_id = args[0];
            const flags = args[1];
            const fmt = args[2];
            return exports.bind.TreeNodeEx_C(ptr_id, flags, fmt);
        }
    }
    function TreePush(...args) {
        if (typeof (args[0]) === "string") {
            const str_id = args[0];
            exports.bind.TreePush_A(str_id);
        }
        else {
            const ptr_id = args[0];
            exports.bind.TreePush_B(ptr_id);
        }
    }
    // IMGUI_API void          TreePop();                                                              // ~ Unindent()+PopId()
    function TreePop() { exports.bind.TreePop(); }
    // IMGUI_API void          TreeAdvanceToLabelPos();                                                // advance cursor x position by GetTreeNodeToLabelSpacing()
    function TreeAdvanceToLabelPos() { exports.bind.TreeAdvanceToLabelPos(); }
    // IMGUI_API float         GetTreeNodeToLabelSpacing();                                            // horizontal distance preceding label when using TreeNode*() or Bullet() == (g.FontSize + style.FramePadding.x*2) for a regular unframed TreeNode
    function GetTreeNodeToLabelSpacing() { return exports.bind.GetTreeNodeToLabelSpacing(); }
    function CollapsingHeader(label, ...args) {
        if (args.length === 0) {
            return exports.bind.CollapsingHeader_A(label, 0);
        }
        else {
            if (typeof (args[0]) === "number") {
                const flags = args[0];
                return exports.bind.CollapsingHeader_A(label, flags);
            }
            else {
                const p_open = args[0];
                const flags = args[1] || 0;
                const ref_open = Array.isArray(p_open) ? p_open : [p_open()];
                const ret = exports.bind.CollapsingHeader_B(label, ref_open, flags);
                if (!Array.isArray(p_open)) {
                    p_open(ref_open[0]);
                }
                return ret;
            }
        }
    }
    // IMGUI_API void          SetNextItemOpen(bool is_open, ImGuiCond cond = 0);                  // set next TreeNode/CollapsingHeader open state.
    function SetNextItemOpen(is_open, cond = 0) {
        exports.bind.SetNextItemOpen(is_open, cond);
    }
    function Selectable(label, ...args) {
        if (args.length === 0) {
            return exports.bind.Selectable_A(label, false, 0, ImVec2.ZERO);
        }
        else {
            if (typeof (args[0]) === "boolean") {
                const selected = args[0];
                const flags = args[1] || 0;
                const size = args[2] || ImVec2.ZERO;
                return exports.bind.Selectable_A(label, selected, flags, size);
            }
            else {
                const p_selected = args[0];
                const flags = args[1] || 0;
                const size = args[2] || ImVec2.ZERO;
                const ref_selected = Array.isArray(p_selected) ? p_selected : [p_selected()];
                const ret = exports.bind.Selectable_B(label, ref_selected, flags, size);
                if (!Array.isArray(p_selected)) {
                    p_selected(ref_selected[0]);
                }
                return ret;
            }
        }
    }
    function ListBox(label, current_item, ...args) {
        let ret = false;
        const _current_item = Array.isArray(current_item) ? current_item : [current_item()];
        if (Array.isArray(args[0])) {
            const items = args[0];
            const items_count = typeof (args[1]) === "number" ? args[1] : items.length;
            const height_in_items = typeof (args[2]) === "number" ? args[2] : -1;
            ret = exports.bind.ListBox_A(label, _current_item, items, items_count, height_in_items);
        }
        else {
            const items_getter = args[0];
            const data = args[1];
            const items_count = args[2];
            const height_in_items = typeof (args[3]) === "number" ? args[3] : -1;
            ret = exports.bind.ListBox_B(label, _current_item, items_getter, data, items_count, height_in_items);
        }
        if (!Array.isArray(current_item)) {
            current_item(_current_item[0]);
        }
        return ret;
    }
    function ListBoxHeader(label, ...args) {
        if (typeof (args[0]) === "object") {
            const size = args[0];
            return exports.bind.ListBoxHeader_A(label, size);
        }
        else {
            const items_count = args[0];
            const height_in_items = typeof (args[1]) === "number" ? args[1] : -1;
            return exports.bind.ListBoxHeader_B(label, items_count, height_in_items);
        }
    }
    // IMGUI_API void          ListBoxFooter();                                                        // terminate the scrolling region
    function ListBoxFooter() {
        exports.bind.ListBoxFooter();
    }
    function Value(prefix, ...args) {
        if (typeof (args[0]) === "boolean") {
            exports.bind.Value_A(prefix, args[0]);
        }
        else if (typeof (args[0]) === "number") {
            if (Number.isInteger(args[0])) {
                exports.bind.Value_B(prefix, args[0]);
            }
            else {
                exports.bind.Value_D(prefix, args[0], typeof (args[1]) === "string" ? args[1] : null);
            }
        }
        else {
            exports.bind.Text(prefix + String(args[0]));
        }
    }
    // Tooltips
    // IMGUI_API void          BeginTooltip();                                                     // begin/append a tooltip window. to create full-featured tooltip (with any kind of contents).
    function BeginTooltip() { exports.bind.BeginTooltip(); }
    // IMGUI_API void          EndTooltip();
    function EndTooltip() { exports.bind.EndTooltip(); }
    // IMGUI_API void          SetTooltip(const char* fmt, ...) IM_FMTARGS(1);                     // set text tooltip under mouse-cursor, typically use with ImGui::IsItemHovered(). overidde any previous call to SetTooltip().
    // IMGUI_API void          SetTooltipV(const char* fmt, va_list args) IM_FMTLIST(1);
    function SetTooltip(fmt) {
        exports.bind.SetTooltip(fmt);
    }
    // Menus
    // IMGUI_API bool          BeginMainMenuBar();                                                 // create and append to a full screen menu-bar. only call EndMainMenuBar() if this returns true!
    function BeginMainMenuBar() { return exports.bind.BeginMainMenuBar(); }
    // IMGUI_API void          EndMainMenuBar();
    function EndMainMenuBar() { exports.bind.EndMainMenuBar(); }
    // IMGUI_API bool          BeginMenuBar();                                                     // append to menu-bar of current window (requires ImGuiWindowFlags_MenuBar flag set on parent window). only call EndMenuBar() if this returns true!
    function BeginMenuBar() { return exports.bind.BeginMenuBar(); }
    // IMGUI_API void          EndMenuBar();
    function EndMenuBar() { exports.bind.EndMenuBar(); }
    // IMGUI_API bool          BeginMenu(const char* label, bool enabled = true);                  // create a sub-menu entry. only call EndMenu() if this returns true!
    function BeginMenu(label, enabled = true) { return exports.bind.BeginMenu(label, enabled); }
    // IMGUI_API void          EndMenu();
    function EndMenu() { exports.bind.EndMenu(); }
    function MenuItem(label, ...args) {
        if (args.length === 0) {
            return exports.bind.MenuItem_A(label, null, false, true);
        }
        else if (args.length === 1) {
            const shortcut = args[0];
            return exports.bind.MenuItem_A(label, shortcut, false, true);
        }
        else {
            const shortcut = args[0];
            if (typeof (args[1]) === "boolean") {
                const selected = args[1];
                const enabled = typeof (args[2]) === "boolean" ? args[2] : true;
                return exports.bind.MenuItem_A(label, shortcut, selected, enabled);
            }
            else {
                const p_selected = args[1];
                const enabled = typeof (args[2]) === "boolean" ? args[2] : true;
                const ref_selected = Array.isArray(p_selected) ? p_selected : [p_selected()];
                const ret = exports.bind.MenuItem_B(label, shortcut, ref_selected, enabled);
                if (!Array.isArray(p_selected)) {
                    p_selected(ref_selected[0]);
                }
                return ret;
            }
        }
    }
    // Popups
    // IMGUI_API void          OpenPopup(const char* str_id);                                      // call to mark popup as open (don't call every frame!). popups are closed when user click outside, or if CloseCurrentPopup() is called within a BeginPopup()/EndPopup() block. By default, Selectable()/MenuItem() are calling CloseCurrentPopup(). Popup identifiers are relative to the current ID-stack (so OpenPopup and BeginPopup needs to be at the same level).
    function OpenPopup(str_id) { exports.bind.OpenPopup(str_id); }
    // IMGUI_API bool          OpenPopupOnItemClick(const char* str_id = NULL, int mouse_button = 1);                                  // helper to open popup when clicked on last item. return true when just opened.
    function OpenPopupOnItemClick(str_id = null, mouse_button = 1) {
        return exports.bind.OpenPopupOnItemClick(str_id, mouse_button);
    }
    // IMGUI_API bool          BeginPopup(const char* str_id);                                     // return true if the popup is open, and you can start outputting to it. only call EndPopup() if BeginPopup() returned true!
    function BeginPopup(str_id) { return exports.bind.BeginPopup(str_id); }
    // IMGUI_API bool          BeginPopupModal(const char* name, bool* p_open = NULL, ImGuiWindowFlags extra_flags = 0);               // modal dialog (block interactions behind the modal window, can't close the modal window by clicking outside)
    function BeginPopupModal(str_id = "", p_open = null, extra_flags = 0) {
        if (Array.isArray(p_open)) {
            return exports.bind.BeginPopupModal(str_id, p_open, extra_flags);
        }
        else if (typeof (p_open) === "function") {
            const _p_open = [p_open()];
            const ret = exports.bind.BeginPopupModal(str_id, _p_open, extra_flags);
            p_open(_p_open[0]);
            return ret;
        }
        else {
            return exports.bind.BeginPopupModal(str_id, null, extra_flags);
        }
    }
    // IMGUI_API bool          BeginPopupContextItem(const char* str_id = NULL, int mouse_button = 1);                                 // helper to open and begin popup when clicked on last item. if you can pass a NULL str_id only if the previous item had an id. If you want to use that on a non-interactive item such as Text() you need to pass in an explicit ID here. read comments in .cpp!
    function BeginPopupContextItem(str_id = null, mouse_button = 1) {
        return exports.bind.BeginPopupContextItem(str_id, mouse_button);
    }
    // IMGUI_API bool          BeginPopupContextWindow(const char* str_id = NULL, int mouse_button = 1, bool also_over_items = true);  // helper to open and begin popup when clicked on current window.
    function BeginPopupContextWindow(str_id = null, mouse_button = 1, also_over_items = true) {
        return exports.bind.BeginPopupContextWindow(str_id, mouse_button, also_over_items);
    }
    // IMGUI_API bool          BeginPopupContextVoid(const char* str_id = NULL, int mouse_button = 1);                                 // helper to open and begin popup when clicked in void (where there are no imgui windows).
    function BeginPopupContextVoid(str_id = null, mouse_button = 1) {
        return exports.bind.BeginPopupContextVoid(str_id, mouse_button);
    }
    // IMGUI_API void          EndPopup();
    function EndPopup() { exports.bind.EndPopup(); }
    // IMGUI_API bool          IsPopupOpen(const char* str_id);                                    // return true if the popup is open
    function IsPopupOpen(str_id) { return exports.bind.IsPopupOpen(str_id); }
    // IMGUI_API void          CloseCurrentPopup();                                                // close the popup we have begin-ed into. clicking on a MenuItem or Selectable automatically close the current popup.
    function CloseCurrentPopup() { exports.bind.CloseCurrentPopup(); }
    // Tab Bars, Tabs
    // [BETA API] API may evolve!
    // IMGUI_API bool          BeginTabBar(const char* str_id, ImGuiTabBarFlags flags = 0);        // create and append into a TabBar
    function BeginTabBar(str_id, flags = 0) { return exports.bind.BeginTabBar(str_id, flags); }
    // IMGUI_API void          EndTabBar();                                                        // only call EndTabBar() if BeginTabBar() returns true!
    function EndTabBar() { exports.bind.EndTabBar(); }
    // IMGUI_API bool          BeginTabItem(const char* label, bool* p_open = NULL, ImGuiTabItemFlags flags = 0);// create a Tab. Returns true if the Tab is selected.
    function BeginTabItem(label, p_open = null, flags = 0) {
        // return bind.BeginTabItem(label, p_open, flags);
        if (p_open === null) {
            return exports.bind.BeginTabItem(label, null, flags);
        }
        else if (Array.isArray(p_open)) {
            return exports.bind.BeginTabItem(label, p_open, flags);
        }
        else {
            const ref_open = [p_open()];
            const ret = exports.bind.BeginTabItem(label, ref_open, flags);
            p_open(ref_open[0]);
            return ret;
        }
    }
    // IMGUI_API void          EndTabItem();                                                       // only call EndTabItem() if BeginTabItem() returns true!
    function EndTabItem() { exports.bind.EndTabItem(); }
    // IMGUI_API void          SetTabItemClosed(const char* tab_or_docked_window_label);           // notify TabBar or Docking system of a closed tab/window ahead (useful to reduce visual flicker on reorderable tab bars). For tab-bar: call after BeginTabBar() and before Tab submissions. Otherwise call with a window name.
    function SetTabItemClosed(tab_or_docked_window_label) { exports.bind.SetTabItemClosed(tab_or_docked_window_label); }
    // Logging/Capture: all text output from interface is captured to tty/file/clipboard. By default, tree nodes are automatically opened during logging.
    // IMGUI_API void          LogToTTY(int max_depth = -1);                                       // start logging to tty
    function LogToTTY(max_depth = -1) {
        exports.bind.LogToTTY(max_depth);
    }
    // IMGUI_API void          LogToFile(int max_depth = -1, const char* filename = NULL);         // start logging to file
    function LogToFile(max_depth = -1, filename = null) {
        exports.bind.LogToFile(max_depth, filename);
    }
    // IMGUI_API void          LogToClipboard(int max_depth = -1);                                 // start logging to OS clipboard
    function LogToClipboard(max_depth = -1) {
        exports.bind.LogToClipboard(max_depth);
    }
    // IMGUI_API void          LogFinish();                                                        // stop logging (close file, etc.)
    function LogFinish() { exports.bind.LogFinish(); }
    // IMGUI_API void          LogButtons();                                                       // helper to display buttons for logging to tty/file/clipboard
    function LogButtons() { exports.bind.LogButtons(); }
    // IMGUI_API void          LogText(const char* fmt, ...) IM_FMTARGS(1);                        // pass text data straight to log (without being displayed)
    function LogText(fmt) {
        exports.bind.LogText(fmt);
    }
    const _ImGui_DragDropPayload_data = {};
    // Drag and Drop
    // [BETA API] Missing Demo code. API may evolve.
    // IMGUI_API bool          BeginDragDropSource(ImGuiDragDropFlags flags = 0);                // call when the current item is active. If this return true, you can call SetDragDropPayload() + EndDragDropSource()
    function BeginDragDropSource(flags = 0) {
        return exports.bind.BeginDragDropSource(flags);
    }
    // IMGUI_API bool          SetDragDropPayload(const char* type, const void* data, size_t size, ImGuiCond cond = 0);// type is a user defined string of maximum 8 characters. Strings starting with '_' are reserved for dear imgui internal types. Data is copied and held by imgui.
    function SetDragDropPayload(type, data, cond = 0) {
        _ImGui_DragDropPayload_data[type] = data;
        return exports.bind.SetDragDropPayload(type, data, 0, cond);
    }
    // IMGUI_API void          EndDragDropSource();
    function EndDragDropSource() {
        exports.bind.EndDragDropSource();
    }
    // IMGUI_API bool          BeginDragDropTarget();                                                                  // call after submitting an item that may receive an item. If this returns true, you can call AcceptDragDropPayload() + EndDragDropTarget()
    function BeginDragDropTarget() {
        return exports.bind.BeginDragDropTarget();
    }
    // IMGUI_API const ImGuiPayload* AcceptDragDropPayload(const char* type, ImGuiDragDropFlags flags = 0);            // accept contents of a given type. If ImGuiDragDropFlags_AcceptBeforeDelivery is set you can peek into the payload before the mouse button is released.
    function AcceptDragDropPayload(type, flags = 0) {
        const data = _ImGui_DragDropPayload_data[type];
        return exports.bind.AcceptDragDropPayload(type, flags) ? { Data: data } : null;
    }
    // IMGUI_API void          EndDragDropTarget();
    function EndDragDropTarget() {
        exports.bind.EndDragDropTarget();
    }
    // Clipping
    // IMGUI_API void          PushClipRect(const ImVec2& clip_rect_min, const ImVec2& clip_rect_max, bool intersect_with_current_clip_rect);
    function PushClipRect(clip_rect_min, clip_rect_max, intersect_with_current_clip_rect) {
        exports.bind.PushClipRect(clip_rect_min, clip_rect_max, intersect_with_current_clip_rect);
    }
    // IMGUI_API void          PopClipRect();
    function PopClipRect() {
        exports.bind.PopClipRect();
    }
    // Focus
    // (FIXME: Those functions will be reworked after we merge the navigation branch + have a pass at focusing/tabbing features.)
    // (Prefer using "SetItemDefaultFocus()" over "if (IsWindowAppearing()) SetScrollHere()" when applicable, to make your code more forward compatible when navigation branch is merged)
    // IMGUI_API void          SetItemDefaultFocus();                                              // make last item the default focused item of a window (WIP navigation branch only). Pleaase use instead of SetScrollHere().
    function SetItemDefaultFocus() { exports.bind.SetItemDefaultFocus(); }
    // IMGUI_API void          SetKeyboardFocusHere(int offset = 0);                               // focus keyboard on the next widget. Use positive 'offset' to access sub components of a multiple component widget. Use -1 to access previous widget.
    function SetKeyboardFocusHere(offset = 0) {
        exports.bind.SetKeyboardFocusHere(offset);
    }
    // Utilities
    // IMGUI_API bool          IsItemHovered(ImGuiHoveredFlags flags = 0);                         // is the last item hovered? (and usable, aka not blocked by a popup, etc.). See ImGuiHoveredFlags for more options.
    function IsItemHovered(flags = 0) {
        return exports.bind.IsItemHovered(flags);
    }
    // IMGUI_API bool          IsItemActive();                                                     // is the last item active? (e.g. button being held, text field being edited- items that don't interact will always return false)
    function IsItemActive() { return exports.bind.IsItemActive(); }
    // IMGUI_API bool          IsItemEdited();                                                     // is the last item active? (e.g. button being held, text field being edited- items that don't interact will always return false)
    function IsItemEdited() { return exports.bind.IsItemEdited(); }
    // IMGUI_API bool          IsItemFocused();                                                    // is the last item focused for keyboard/gamepad navigation?
    function IsItemFocused() { return exports.bind.IsItemFocused(); }
    // IMGUI_API bool          IsItemClicked(int mouse_button = 0);                                // is the last item clicked? (e.g. button/node just clicked on)
    function IsItemClicked(mouse_button = 0) {
        return exports.bind.IsItemClicked(mouse_button);
    }
    // IMGUI_API bool          IsItemVisible();                                                    // is the last item visible? (aka not out of sight due to clipping/scrolling.)
    function IsItemVisible() { return exports.bind.IsItemVisible(); }
    // IMGUI_API bool          IsItemActivated();                                                  // was the last item just made active (item was previously inactive).
    function IsItemActivated() { return exports.bind.IsItemActivated(); }
    // IMGUI_API bool          IsItemDeactivated();                                                // was the last item just made inactive (item was previously active). Useful for Undo/Redo patterns with widgets that requires continuous editing.
    function IsItemDeactivated() { return exports.bind.IsItemDeactivated(); }
    // IMGUI_API bool          IsItemDeactivatedAfterEdit();                                     // was the last item just made inactive and made a value change when it was active? (e.g. Slider/Drag moved). Useful for Undo/Redo patterns with widgets that requires continuous editing. Note that you may get false positives (some widgets such as Combo()/ListBox()/Selectable() will return true even when clicking an already selected item).
    function IsItemDeactivatedAfterEdit() { return exports.bind.IsItemDeactivatedAfterEdit(); }
    // IMGUI_API bool          IsAnyItemHovered();
    function IsAnyItemHovered() { return exports.bind.IsAnyItemHovered(); }
    // IMGUI_API bool          IsAnyItemActive();
    function IsAnyItemActive() { return exports.bind.IsAnyItemActive(); }
    // IMGUI_API bool          IsAnyItemFocused();
    function IsAnyItemFocused() { return exports.bind.IsAnyItemFocused(); }
    // IMGUI_API ImVec2        GetItemRectMin();                                                   // get bounding rectangle of last item, in screen space
    function GetItemRectMin(out = new ImVec2()) {
        return exports.bind.GetItemRectMin(out);
    }
    // IMGUI_API ImVec2        GetItemRectMax();                                                   // "
    function GetItemRectMax(out = new ImVec2()) {
        return exports.bind.GetItemRectMax(out);
    }
    // IMGUI_API ImVec2        GetItemRectSize();                                                  // get size of last item, in screen space
    function GetItemRectSize(out = new ImVec2()) {
        return exports.bind.GetItemRectSize(out);
    }
    // IMGUI_API void          SetItemAllowOverlap();                                              // allow last item to be overlapped by a subsequent item. sometimes useful with invisible buttons, selectables, etc. to catch unused area.
    function SetItemAllowOverlap() { exports.bind.SetItemAllowOverlap(); }
    // IMGUI_API bool          IsWindowFocused(ImGuiFocusedFlags flags = 0);                       // is current window focused? or its root/child, depending on flags. see flags for options.
    function IsWindowFocused(flags = 0) {
        return exports.bind.IsWindowFocused(flags);
    }
    // IMGUI_API bool          IsWindowHovered(ImGuiHoveredFlags flags = 0);                       // is current window hovered (and typically: not blocked by a popup/modal)? see flags for options.
    function IsWindowHovered(flags = 0) {
        return exports.bind.IsWindowHovered(flags);
    }
    function IsRectVisible(...args) {
        if (args.length === 1) {
            const size = args[0];
            return exports.bind.IsRectVisible_A(size);
        }
        else {
            const rect_min = args[0];
            const rect_max = args[1];
            return exports.bind.IsRectVisible_B(rect_min, rect_max);
        }
    }
    // IMGUI_API float         GetTime();
    function GetTime() { return exports.bind.GetTime(); }
    // IMGUI_API int           GetFrameCount();
    function GetFrameCount() { return exports.bind.GetFrameCount(); }
    function GetBackgroundDrawList() {
        return new ImDrawList(exports.bind.GetBackgroundDrawList());
    }
    function GetForegroundDrawList() {
        return new ImDrawList(exports.bind.GetForegroundDrawList());
    }
    // IMGUI_API ImDrawListSharedData* GetDrawListSharedData();
    function GetDrawListSharedData() {
        return new ImDrawListSharedData(exports.bind.GetDrawListSharedData());
    }
    // IMGUI_API const char*   GetStyleColorName(ImGuiCol idx);
    function GetStyleColorName(idx) { return exports.bind.GetStyleColorName(idx); }
    // IMGUI_API ImVec2        CalcTextSize(const char* text, const char* text_end = NULL, bool hide_text_after_double_hash = false, float wrap_width = -1.0f);
    function CalcTextSize(text, text_end = null, hide_text_after_double_hash = false, wrap_width = -1, out = new ImVec2()) {
        return exports.bind.CalcTextSize(text_end !== null ? text.substring(0, text_end) : text, hide_text_after_double_hash, wrap_width, out);
    }
    // IMGUI_API void          CalcListClipping(int items_count, float items_height, int* out_items_display_start, int* out_items_display_end);    // calculate coarse clipping for large list of evenly sized items. Prefer using the ImGuiListClipper higher-level helper if you can.
    function CalcListClipping(items_count, items_height, out_items_display_start, out_items_display_end) {
        return exports.bind.CalcListClipping(items_count, items_height, out_items_display_start, out_items_display_end);
    }
    // IMGUI_API bool          BeginChildFrame(ImGuiID id, const ImVec2& size, ImGuiWindowFlags extra_flags = 0);    // helper to create a child window / scrolling region that looks like a normal widget frame
    function BeginChildFrame(id, size, extra_flags = 0) {
        return exports.bind.BeginChildFrame(id, size, extra_flags);
    }
    // IMGUI_API void          EndChildFrame();
    function EndChildFrame() { exports.bind.EndChildFrame(); }
    // IMGUI_API ImVec4        ColorConvertU32ToFloat4(ImU32 in);
    function ColorConvertU32ToFloat4(in_, out = new ImVec4()) {
        return exports.bind.ColorConvertU32ToFloat4(in_, out);
    }
    // IMGUI_API ImU32         ColorConvertFloat4ToU32(const ImVec4& in);
    function ColorConvertFloat4ToU32(in_) {
        return exports.bind.ColorConvertFloat4ToU32(in_);
    }
    // IMGUI_API void          ColorConvertRGBtoHSV(float r, float g, float b, float& out_h, float& out_s, float& out_v);
    function ColorConvertRGBtoHSV(r, g, b, out_h, out_s, out_v) { exports.bind.ColorConvertRGBtoHSV(r, g, b, out_h, out_s, out_v); }
    // IMGUI_API void          ColorConvertHSVtoRGB(float h, float s, float v, float& out_r, float& out_g, float& out_b);
    function ColorConvertHSVtoRGB(h, s, v, out_r, out_g, out_b) { exports.bind.ColorConvertHSVtoRGB(h, s, v, out_r, out_g, out_b); }
    // Inputs
    // IMGUI_API int           GetKeyIndex(ImGuiKey imgui_key);                                    // map ImGuiKey_* values into user's key index. == io.KeyMap[key]
    function GetKeyIndex(imgui_key) {
        return exports.bind.GetKeyIndex(imgui_key);
    }
    // IMGUI_API bool          IsKeyDown(int user_key_index);                                      // is key being held. == io.KeysDown[user_key_index]. note that imgui doesn't know the semantic of each entry of io.KeyDown[]. Use your own indices/enums according to how your backend/engine stored them into KeyDown[]!
    function IsKeyDown(user_key_index) {
        return exports.bind.IsKeyDown(user_key_index);
    }
    // IMGUI_API bool          IsKeyPressed(int user_key_index, bool repeat = true);               // was key pressed (went from !Down to Down). if repeat=true, uses io.KeyRepeatDelay / KeyRepeatRate
    function IsKeyPressed(user_key_index, repeat = true) {
        return exports.bind.IsKeyPressed(user_key_index, repeat);
    }
    // IMGUI_API bool          IsKeyReleased(int user_key_index);                                  // was key released (went from Down to !Down)..
    function IsKeyReleased(user_key_index) {
        return exports.bind.IsKeyReleased(user_key_index);
    }
    // IMGUI_API int           GetKeyPressedAmount(int key_index, float repeat_delay, float rate); // uses provided repeat rate/delay. return a count, most often 0 or 1 but might be >1 if RepeatRate is small enough that DeltaTime > RepeatRate
    function GetKeyPressedAmount(user_key_index, repeat_delay, rate) {
        return exports.bind.GetKeyPressedAmount(user_key_index, repeat_delay, rate);
    }
    // IMGUI_API bool          IsMouseDown(int button);                                            // is mouse button held
    function IsMouseDown(button) {
        return exports.bind.IsMouseDown(button);
    }
    // IMGUI_API bool          IsMouseClicked(int button, bool repeat = false);                    // did mouse button clicked (went from !Down to Down)
    function IsMouseClicked(button, repeat = false) {
        return exports.bind.IsMouseClicked(button, repeat);
    }
    // IMGUI_API bool          IsMouseDoubleClicked(int button);                                   // did mouse button double-clicked. a double-click returns false in IsMouseClicked(). uses io.MouseDoubleClickTime.
    function IsMouseDoubleClicked(button) {
        return exports.bind.IsMouseDoubleClicked(button);
    }
    // IMGUI_API bool          IsMouseReleased(int button);                                        // did mouse button released (went from Down to !Down)
    function IsMouseReleased(button) {
        return exports.bind.IsMouseReleased(button);
    }
    // IMGUI_API bool          IsMouseDragging(int button = 0, float lock_threshold = -1.0f);      // is mouse dragging. if lock_threshold < -1.0f uses io.MouseDraggingThreshold
    function IsMouseDragging(button = 0, lock_threshold = -1.0) {
        return exports.bind.IsMouseDragging(button, lock_threshold);
    }
    // IMGUI_API bool          IsMouseHoveringRect(const ImVec2& r_min, const ImVec2& r_max, bool clip = true);  // is mouse hovering given bounding rect (in screen space). clipped by current clipping settings. disregarding of consideration of focus/window ordering/blocked by a popup.
    function IsMouseHoveringRect(r_min, r_max, clip = true) {
        return exports.bind.IsMouseHoveringRect(r_min, r_max, clip);
    }
    // IMGUI_API bool          IsMousePosValid(const ImVec2* mouse_pos = NULL);                    //
    function IsMousePosValid(mouse_pos = null) {
        return exports.bind.IsMousePosValid(mouse_pos);
    }
    // IMGUI_API ImVec2        GetMousePos();                                                      // shortcut to ImGui::GetIO().MousePos provided by user, to be consistent with other calls
    function GetMousePos(out = new ImVec2()) {
        return exports.bind.GetMousePos(out);
    }
    // IMGUI_API ImVec2        GetMousePosOnOpeningCurrentPopup();                                 // retrieve backup of mouse positioning at the time of opening popup we have BeginPopup() into
    function GetMousePosOnOpeningCurrentPopup(out = new ImVec2()) {
        return exports.bind.GetMousePosOnOpeningCurrentPopup(out);
    }
    // IMGUI_API ImVec2        GetMouseDragDelta(int button = 0, float lock_threshold = -1.0f);    // dragging amount since clicking. if lock_threshold < -1.0f uses io.MouseDraggingThreshold
    function GetMouseDragDelta(button = 0, lock_threshold = -1.0, out = new ImVec2()) {
        return exports.bind.GetMouseDragDelta(button, lock_threshold, out);
    }
    // IMGUI_API void          ResetMouseDragDelta(int button = 0);                                //
    function ResetMouseDragDelta(button = 0) {
        exports.bind.ResetMouseDragDelta(button);
    }
    // IMGUI_API ImGuiMouseCursor GetMouseCursor();                                                // get desired cursor type, reset in ImGui::NewFrame(), this is updated during the frame. valid before Render(). If you use software rendering by setting io.MouseDrawCursor ImGui will render those for you
    function GetMouseCursor() { return exports.bind.GetMouseCursor(); }
    // IMGUI_API void          SetMouseCursor(ImGuiMouseCursor type);                              // set desired cursor type
    function SetMouseCursor(type) { exports.bind.SetMouseCursor(type); }
    // IMGUI_API void          CaptureKeyboardFromApp(bool capture = true);                        // manually override io.WantCaptureKeyboard flag next frame (said flag is entirely left for your application handle). e.g. force capture keyboard when your widget is being hovered.
    function CaptureKeyboardFromApp(capture = true) {
        return exports.bind.CaptureKeyboardFromApp(capture);
    }
    // IMGUI_API void          CaptureMouseFromApp(bool capture = true);                           // manually override io.WantCaptureMouse flag next frame (said flag is entirely left for your application handle).
    function CaptureMouseFromApp(capture = true) {
        exports.bind.CaptureMouseFromApp(capture);
    }
    // Clipboard Utilities (also see the LogToClipboard() function to capture or output text data to the clipboard)
    // IMGUI_API const char*   GetClipboardText();
    function GetClipboardText() { return exports.bind.GetClipboardText(); }
    // IMGUI_API void          SetClipboardText(const char* text);
    function SetClipboardText(text) { exports.bind.SetClipboardText(text); }
    // Settings/.Ini Utilities
    // The disk functions are automatically called if io.IniFilename != NULL (default is "imgui.ini").
    // Set io.IniFilename to NULL to load/save manually. Read io.WantSaveIniSettings description about handling .ini saving manually.
    // IMGUI_API void          LoadIniSettingsFromDisk(const char* ini_filename);                  // call after CreateContext() and before the first call to NewFrame(). NewFrame() automatically calls LoadIniSettingsFromDisk(io.IniFilename).
    function LoadIniSettingsFromDisk(ini_filename) { throw new Error(); } // TODO
    // IMGUI_API void          LoadIniSettingsFromMemory(const char* ini_data, size_t ini_size=0); // call after CreateContext() and before the first call to NewFrame() to provide .ini data from your own data source.
    function LoadIniSettingsFromMemory(ini_data, ini_size = 0) { exports.bind.LoadIniSettingsFromMemory(ini_data); }
    // IMGUI_API void          SaveIniSettingsToDisk(const char* ini_filename);
    function SaveIniSettingsToDisk(ini_filename) { throw new Error(); } // TODO
    // IMGUI_API const char*   SaveIniSettingsToMemory(size_t* out_ini_size = NULL);               // return a zero-terminated string with the .ini data which you can save by your own mean. call when io.WantSaveIniSettings is set, then save data by your own mean and clear io.WantSaveIniSettings.
    function SaveIniSettingsToMemory(out_ini_size = null) { return exports.bind.SaveIniSettingsToMemory(); }
    // Memory Utilities
    // All those functions are not reliant on the current context.
    // If you reload the contents of imgui.cpp at runtime, you may need to call SetCurrentContext() + SetAllocatorFunctions() again.
    // IMGUI_API void          SetAllocatorFunctions(void* (*alloc_func)(size_t sz, void* user_data), void(*free_func)(void* ptr, void* user_data), void* user_data = NULL);
    function SetAllocatorFunctions(alloc_func, free_func, user_data = null) {
        exports.bind.SetAllocatorFunctions(alloc_func, free_func, user_data);
    }
    // IMGUI_API void*         MemAlloc(size_t sz);
    function MemAlloc(sz) { exports.bind.MemAlloc(sz); }
    // IMGUI_API void          MemFree(void* ptr);
    function MemFree(ptr) { exports.bind.MemFree(ptr); }

    exports.AcceptDragDropPayload = AcceptDragDropPayload;
    exports.AlignTextToFramePadding = AlignTextToFramePadding;
    exports.ArrowButton = ArrowButton;
    exports.BackendFlags = exports.ImGuiBackendFlags;
    exports.Begin = Begin;
    exports.BeginChild = BeginChild;
    exports.BeginChildFrame = BeginChildFrame;
    exports.BeginCombo = BeginCombo;
    exports.BeginDragDropSource = BeginDragDropSource;
    exports.BeginDragDropTarget = BeginDragDropTarget;
    exports.BeginGroup = BeginGroup;
    exports.BeginMainMenuBar = BeginMainMenuBar;
    exports.BeginMenu = BeginMenu;
    exports.BeginMenuBar = BeginMenuBar;
    exports.BeginPopup = BeginPopup;
    exports.BeginPopupContextItem = BeginPopupContextItem;
    exports.BeginPopupContextVoid = BeginPopupContextVoid;
    exports.BeginPopupContextWindow = BeginPopupContextWindow;
    exports.BeginPopupModal = BeginPopupModal;
    exports.BeginTabBar = BeginTabBar;
    exports.BeginTabItem = BeginTabItem;
    exports.BeginTooltip = BeginTooltip;
    exports.Bind = bindImgui$1;
    exports.Bullet = Bullet;
    exports.BulletText = BulletText;
    exports.Button = Button;
    exports.CalcItemWidth = CalcItemWidth;
    exports.CalcListClipping = CalcListClipping;
    exports.CalcTextSize = CalcTextSize;
    exports.CaptureKeyboardFromApp = CaptureKeyboardFromApp;
    exports.CaptureMouseFromApp = CaptureMouseFromApp;
    exports.Checkbox = Checkbox;
    exports.CheckboxFlags = CheckboxFlags;
    exports.CloseCurrentPopup = CloseCurrentPopup;
    exports.Col = exports.ImGuiCol;
    exports.CollapsingHeader = CollapsingHeader;
    exports.ColorButton = ColorButton;
    exports.ColorConvertFloat4ToU32 = ColorConvertFloat4ToU32;
    exports.ColorConvertHSVtoRGB = ColorConvertHSVtoRGB;
    exports.ColorConvertRGBtoHSV = ColorConvertRGBtoHSV;
    exports.ColorConvertU32ToFloat4 = ColorConvertU32ToFloat4;
    exports.ColorEdit3 = ColorEdit3;
    exports.ColorEdit4 = ColorEdit4;
    exports.ColorEditFlags = exports.ImGuiColorEditFlags;
    exports.ColorPicker3 = ColorPicker3;
    exports.ColorPicker4 = ColorPicker4;
    exports.Columns = Columns;
    exports.Combo = Combo;
    exports.ComboFlags = exports.ImGuiComboFlags;
    exports.Cond = exports.ImGuiCond;
    exports.ConfigFlags = exports.ImGuiConfigFlags;
    exports.CreateContext = CreateContext;
    exports.DataType = exports.ImGuiDataType;
    exports.DebugCheckVersionAndDataLayout = DebugCheckVersionAndDataLayout;
    exports.DestroyContext = DestroyContext;
    exports.Dir = exports.ImGuiDir;
    exports.DragDropFlags = exports.ImGuiDragDropFlags;
    exports.DragFloat = DragFloat;
    exports.DragFloat2 = DragFloat2;
    exports.DragFloat3 = DragFloat3;
    exports.DragFloat4 = DragFloat4;
    exports.DragFloatRange2 = DragFloatRange2;
    exports.DragInt = DragInt;
    exports.DragInt2 = DragInt2;
    exports.DragInt3 = DragInt3;
    exports.DragInt4 = DragInt4;
    exports.DragIntRange2 = DragIntRange2;
    exports.DragScalar = DragScalar;
    exports.Dummy = Dummy;
    exports.End = End;
    exports.EndChild = EndChild;
    exports.EndChildFrame = EndChildFrame;
    exports.EndCombo = EndCombo;
    exports.EndDragDropSource = EndDragDropSource;
    exports.EndDragDropTarget = EndDragDropTarget;
    exports.EndFrame = EndFrame;
    exports.EndGroup = EndGroup;
    exports.EndMainMenuBar = EndMainMenuBar;
    exports.EndMenu = EndMenu;
    exports.EndMenuBar = EndMenuBar;
    exports.EndPopup = EndPopup;
    exports.EndTabBar = EndTabBar;
    exports.EndTabItem = EndTabItem;
    exports.EndTooltip = EndTooltip;
    exports.FocusedFlags = exports.ImGuiFocusedFlags;
    exports.GetBackgroundDrawList = GetBackgroundDrawList;
    exports.GetClipboardText = GetClipboardText;
    exports.GetColorU32 = GetColorU32;
    exports.GetColumnIndex = GetColumnIndex;
    exports.GetColumnOffset = GetColumnOffset;
    exports.GetColumnWidth = GetColumnWidth;
    exports.GetColumnsCount = GetColumnsCount;
    exports.GetContentRegionAvail = GetContentRegionAvail;
    exports.GetContentRegionMax = GetContentRegionMax;
    exports.GetCurrentContext = GetCurrentContext;
    exports.GetCursorPos = GetCursorPos;
    exports.GetCursorPosX = GetCursorPosX;
    exports.GetCursorPosY = GetCursorPosY;
    exports.GetCursorScreenPos = GetCursorScreenPos;
    exports.GetCursorStartPos = GetCursorStartPos;
    exports.GetDrawData = GetDrawData;
    exports.GetDrawListSharedData = GetDrawListSharedData;
    exports.GetFont = GetFont;
    exports.GetFontSize = GetFontSize;
    exports.GetFontTexUvWhitePixel = GetFontTexUvWhitePixel;
    exports.GetForegroundDrawList = GetForegroundDrawList;
    exports.GetFrameCount = GetFrameCount;
    exports.GetFrameHeight = GetFrameHeight;
    exports.GetFrameHeightWithSpacing = GetFrameHeightWithSpacing;
    exports.GetID = GetID;
    exports.GetIO = GetIO;
    exports.GetItemRectMax = GetItemRectMax;
    exports.GetItemRectMin = GetItemRectMin;
    exports.GetItemRectSize = GetItemRectSize;
    exports.GetKeyIndex = GetKeyIndex;
    exports.GetKeyPressedAmount = GetKeyPressedAmount;
    exports.GetMouseCursor = GetMouseCursor;
    exports.GetMouseDragDelta = GetMouseDragDelta;
    exports.GetMousePos = GetMousePos;
    exports.GetMousePosOnOpeningCurrentPopup = GetMousePosOnOpeningCurrentPopup;
    exports.GetScrollMaxX = GetScrollMaxX;
    exports.GetScrollMaxY = GetScrollMaxY;
    exports.GetScrollX = GetScrollX;
    exports.GetScrollY = GetScrollY;
    exports.GetStyle = GetStyle;
    exports.GetStyleColorName = GetStyleColorName;
    exports.GetStyleColorVec4 = GetStyleColorVec4;
    exports.GetTextLineHeight = GetTextLineHeight;
    exports.GetTextLineHeightWithSpacing = GetTextLineHeightWithSpacing;
    exports.GetTime = GetTime;
    exports.GetTreeNodeToLabelSpacing = GetTreeNodeToLabelSpacing;
    exports.GetVersion = GetVersion;
    exports.GetWindowContentRegionMax = GetWindowContentRegionMax;
    exports.GetWindowContentRegionMin = GetWindowContentRegionMin;
    exports.GetWindowContentRegionWidth = GetWindowContentRegionWidth;
    exports.GetWindowDrawList = GetWindowDrawList;
    exports.GetWindowHeight = GetWindowHeight;
    exports.GetWindowPos = GetWindowPos;
    exports.GetWindowSize = GetWindowSize;
    exports.GetWindowWidth = GetWindowWidth;
    exports.HoveredFlags = exports.ImGuiHoveredFlags;
    exports.IMGUI_CHECKVERSION = IMGUI_CHECKVERSION;
    exports.IMGUI_PAYLOAD_TYPE_COLOR_3F = IMGUI_PAYLOAD_TYPE_COLOR_3F;
    exports.IMGUI_PAYLOAD_TYPE_COLOR_4F = IMGUI_PAYLOAD_TYPE_COLOR_4F;
    exports.IMGUI_VERSION = IMGUI_VERSION;
    exports.IMGUI_VERSION_NUM = IMGUI_VERSION_NUM;
    exports.IM_ARRAYSIZE = IM_ARRAYSIZE;
    exports.IM_ASSERT = IM_ASSERT;
    exports.IM_COL32 = IM_COL32;
    exports.IM_COL32_A_MASK = IM_COL32_A_MASK;
    exports.IM_COL32_A_SHIFT = IM_COL32_A_SHIFT;
    exports.IM_COL32_BLACK = IM_COL32_BLACK;
    exports.IM_COL32_BLACK_TRANS = IM_COL32_BLACK_TRANS;
    exports.IM_COL32_B_SHIFT = IM_COL32_B_SHIFT;
    exports.IM_COL32_G_SHIFT = IM_COL32_G_SHIFT;
    exports.IM_COL32_R_SHIFT = IM_COL32_R_SHIFT;
    exports.IM_COL32_WHITE = IM_COL32_WHITE;
    exports.ImColor = ImColor;
    exports.ImDrawCallback_ResetRenderState = ImDrawCallback_ResetRenderState;
    exports.ImDrawChannel = ImDrawChannel;
    exports.ImDrawCmd = ImDrawCmd;
    exports.ImDrawCornerFlags = exports.wCornerFlags;
    exports.ImDrawData = ImDrawData;
    exports.ImDrawIdxSize = ImDrawIdxSize;
    exports.ImDrawList = ImDrawList;
    exports.ImDrawListFlags = exports.wListFlags;
    exports.ImDrawListSharedData = ImDrawListSharedData;
    exports.ImDrawVert = ImDrawVert;
    exports.ImDrawVertColOffset = ImDrawVertColOffset;
    exports.ImDrawVertPosOffset = ImDrawVertPosOffset;
    exports.ImDrawVertSize = ImDrawVertSize;
    exports.ImDrawVertUVOffset = ImDrawVertUVOffset;
    exports.ImFont = ImFont;
    exports.ImFontAtlas = ImFontAtlas;
    exports.ImFontConfig = ImFontConfig;
    exports.ImFontGlyph = ImFontGlyph;
    exports.ImGuiContext = ImGuiContext;
    exports.ImGuiIO = ImGuiIO;
    exports.ImGuiInputTextCallbackData = ImGuiInputTextCallbackData;
    exports.ImGuiInputTextDefaultSize = ImGuiInputTextDefaultSize;
    exports.ImGuiInputTextFlags = exports.InputTextFlags;
    exports.ImGuiKey = exports.Key;
    exports.ImGuiListClipper = ImGuiListClipper;
    exports.ImGuiMouseCursor = exports.MouseCursor;
    exports.ImGuiNavInput = exports.NavInput;
    exports.ImGuiSelectableFlags = exports.SelectableFlags;
    exports.ImGuiSizeCallbackData = ImGuiSizeCallbackData;
    exports.ImGuiStorage = ImGuiStorage;
    exports.ImGuiStyle = ImGuiStyle;
    exports.ImGuiStyleVar = exports.StyleVar;
    exports.ImGuiTabBarFlags = exports.TabBarFlags;
    exports.ImGuiTabItemFlags = exports.TabItemFlags;
    exports.ImGuiTextBuffer = ImGuiTextBuffer;
    exports.ImGuiTextFilter = ImGuiTextFilter;
    exports.ImGuiTreeNodeFlags = exports.TreeNodeFlags;
    exports.ImGuiWindowFlags = exports.WindowFlags;
    exports.ImStringBuffer = ImStringBuffer;
    exports.ImVec2 = ImVec2;
    exports.ImVec4 = ImVec4;
    exports.ImVector = ImVector;
    exports.Image = Image;
    exports.ImageButton = ImageButton;
    exports.Indent = Indent;
    exports.InputDouble = InputDouble;
    exports.InputFloat = InputFloat;
    exports.InputFloat2 = InputFloat2;
    exports.InputFloat3 = InputFloat3;
    exports.InputFloat4 = InputFloat4;
    exports.InputInt = InputInt;
    exports.InputInt2 = InputInt2;
    exports.InputInt3 = InputInt3;
    exports.InputInt4 = InputInt4;
    exports.InputScalar = InputScalar;
    exports.InputText = InputText;
    exports.InputTextMultiline = InputTextMultiline;
    exports.InputTextWithHint = InputTextWithHint;
    exports.InvisibleButton = InvisibleButton;
    exports.IsAnyItemActive = IsAnyItemActive;
    exports.IsAnyItemFocused = IsAnyItemFocused;
    exports.IsAnyItemHovered = IsAnyItemHovered;
    exports.IsItemActivated = IsItemActivated;
    exports.IsItemActive = IsItemActive;
    exports.IsItemClicked = IsItemClicked;
    exports.IsItemDeactivated = IsItemDeactivated;
    exports.IsItemDeactivatedAfterEdit = IsItemDeactivatedAfterEdit;
    exports.IsItemEdited = IsItemEdited;
    exports.IsItemFocused = IsItemFocused;
    exports.IsItemHovered = IsItemHovered;
    exports.IsItemVisible = IsItemVisible;
    exports.IsKeyDown = IsKeyDown;
    exports.IsKeyPressed = IsKeyPressed;
    exports.IsKeyReleased = IsKeyReleased;
    exports.IsMouseClicked = IsMouseClicked;
    exports.IsMouseDoubleClicked = IsMouseDoubleClicked;
    exports.IsMouseDown = IsMouseDown;
    exports.IsMouseDragging = IsMouseDragging;
    exports.IsMouseHoveringRect = IsMouseHoveringRect;
    exports.IsMousePosValid = IsMousePosValid;
    exports.IsMouseReleased = IsMouseReleased;
    exports.IsPopupOpen = IsPopupOpen;
    exports.IsRectVisible = IsRectVisible;
    exports.IsWindowAppearing = IsWindowAppearing;
    exports.IsWindowCollapsed = IsWindowCollapsed;
    exports.IsWindowFocused = IsWindowFocused;
    exports.IsWindowHovered = IsWindowHovered;
    exports.LabelText = LabelText;
    exports.ListBox = ListBox;
    exports.ListBoxFooter = ListBoxFooter;
    exports.ListBoxHeader = ListBoxHeader;
    exports.LoadIniSettingsFromDisk = LoadIniSettingsFromDisk;
    exports.LoadIniSettingsFromMemory = LoadIniSettingsFromMemory;
    exports.LogButtons = LogButtons;
    exports.LogFinish = LogFinish;
    exports.LogText = LogText;
    exports.LogToClipboard = LogToClipboard;
    exports.LogToFile = LogToFile;
    exports.LogToTTY = LogToTTY;
    exports.MemAlloc = MemAlloc;
    exports.MemFree = MemFree;
    exports.MenuItem = MenuItem;
    exports.NewFrame = NewFrame;
    exports.NewLine = NewLine;
    exports.NextColumn = NextColumn;
    exports.OpenPopup = OpenPopup;
    exports.OpenPopupOnItemClick = OpenPopupOnItemClick;
    exports.PlotHistogram = PlotHistogram;
    exports.PlotLines = PlotLines;
    exports.PopAllowKeyboardFocus = PopAllowKeyboardFocus;
    exports.PopButtonRepeat = PopButtonRepeat;
    exports.PopClipRect = PopClipRect;
    exports.PopFont = PopFont;
    exports.PopID = PopID;
    exports.PopItemWidth = PopItemWidth;
    exports.PopStyleColor = PopStyleColor;
    exports.PopStyleVar = PopStyleVar;
    exports.PopTextWrapPos = PopTextWrapPos;
    exports.ProgressBar = ProgressBar;
    exports.PushAllowKeyboardFocus = PushAllowKeyboardFocus;
    exports.PushButtonRepeat = PushButtonRepeat;
    exports.PushClipRect = PushClipRect;
    exports.PushFont = PushFont;
    exports.PushID = PushID;
    exports.PushItemWidth = PushItemWidth;
    exports.PushStyleColor = PushStyleColor;
    exports.PushStyleVar = PushStyleVar;
    exports.PushTextWrapPos = PushTextWrapPos;
    exports.RadioButton = RadioButton;
    exports.Render = Render;
    exports.ResetMouseDragDelta = ResetMouseDragDelta;
    exports.SameLine = SameLine;
    exports.SaveIniSettingsToDisk = SaveIniSettingsToDisk;
    exports.SaveIniSettingsToMemory = SaveIniSettingsToMemory;
    exports.Selectable = Selectable;
    exports.Separator = Separator;
    exports.SetAllocatorFunctions = SetAllocatorFunctions;
    exports.SetClipboardText = SetClipboardText;
    exports.SetColorEditOptions = SetColorEditOptions;
    exports.SetColumnOffset = SetColumnOffset;
    exports.SetColumnWidth = SetColumnWidth;
    exports.SetCurrentContext = SetCurrentContext;
    exports.SetCursorPos = SetCursorPos;
    exports.SetCursorPosX = SetCursorPosX;
    exports.SetCursorPosY = SetCursorPosY;
    exports.SetCursorScreenPos = SetCursorScreenPos;
    exports.SetDragDropPayload = SetDragDropPayload;
    exports.SetItemAllowOverlap = SetItemAllowOverlap;
    exports.SetItemDefaultFocus = SetItemDefaultFocus;
    exports.SetKeyboardFocusHere = SetKeyboardFocusHere;
    exports.SetMouseCursor = SetMouseCursor;
    exports.SetNextItemOpen = SetNextItemOpen;
    exports.SetNextItemWidth = SetNextItemWidth;
    exports.SetNextWindowBgAlpha = SetNextWindowBgAlpha;
    exports.SetNextWindowCollapsed = SetNextWindowCollapsed;
    exports.SetNextWindowContentSize = SetNextWindowContentSize;
    exports.SetNextWindowFocus = SetNextWindowFocus;
    exports.SetNextWindowPos = SetNextWindowPos;
    exports.SetNextWindowSize = SetNextWindowSize;
    exports.SetNextWindowSizeConstraints = SetNextWindowSizeConstraints;
    exports.SetScrollFromPosY = SetScrollFromPosY;
    exports.SetScrollHereY = SetScrollHereY;
    exports.SetScrollX = SetScrollX;
    exports.SetScrollY = SetScrollY;
    exports.SetTabItemClosed = SetTabItemClosed;
    exports.SetTooltip = SetTooltip;
    exports.SetWindowCollapsed = SetWindowCollapsed;
    exports.SetWindowFocus = SetWindowFocus;
    exports.SetWindowFontScale = SetWindowFontScale;
    exports.SetWindowPos = SetWindowPos;
    exports.SetWindowSize = SetWindowSize;
    exports.ShowAboutWindow = ShowAboutWindow;
    exports.ShowDemoWindow = ShowDemoWindow;
    exports.ShowFontSelector = ShowFontSelector;
    exports.ShowMetricsWindow = ShowMetricsWindow;
    exports.ShowStyleEditor = ShowStyleEditor;
    exports.ShowStyleSelector = ShowStyleSelector;
    exports.ShowUserGuide = ShowUserGuide;
    exports.SliderAngle = SliderAngle;
    exports.SliderAngle3 = SliderAngle3;
    exports.SliderFloat = SliderFloat;
    exports.SliderFloat2 = SliderFloat2;
    exports.SliderFloat3 = SliderFloat3;
    exports.SliderFloat4 = SliderFloat4;
    exports.SliderInt = SliderInt;
    exports.SliderInt2 = SliderInt2;
    exports.SliderInt3 = SliderInt3;
    exports.SliderInt4 = SliderInt4;
    exports.SliderScalar = SliderScalar;
    exports.SmallButton = SmallButton;
    exports.Spacing = Spacing;
    exports.StyleColorsClassic = StyleColorsClassic;
    exports.StyleColorsDark = StyleColorsDark;
    exports.StyleColorsLight = StyleColorsLight;
    exports.Text = Text;
    exports.TextColored = TextColored;
    exports.TextDisabled = TextDisabled;
    exports.TextUnformatted = TextUnformatted;
    exports.TextWrapped = TextWrapped;
    exports.TreeAdvanceToLabelPos = TreeAdvanceToLabelPos;
    exports.TreeNode = TreeNode;
    exports.TreeNodeEx = TreeNodeEx;
    exports.TreePop = TreePop;
    exports.TreePush = TreePush;
    exports.Unindent = Unindent;
    exports.VSliderFloat = VSliderFloat;
    exports.VSliderInt = VSliderInt;
    exports.VSliderScalar = VSliderScalar;
    exports.Value = Value;
    exports.default = imgui;
    exports.script_ImFontConfig = script_ImFontConfig;
    exports.script_ImFontGlyph = script_ImFontGlyph;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
