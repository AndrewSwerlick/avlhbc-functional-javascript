und = require('underscore')

aVariable = "Outer";
function afun() {
  var aVariable = "Middle";
  return und.map([1,2,3], function(e) {
    var aVariable = "In";
    return [aVariable, e].join(' ');
  });
}

var globals = {}

function makeBindFun(resolver){
  return function(k,v){
    var stack = globals[k] || [];
    globals[k] = resolver(stack,v);
    return globals;
  };
}

var stackBinder = makeBindFun(function(stack, v){
  stack.push(v);
  return stack;
})

var stackUnbinder = makeBindFun(function(stack){
  stack.pop();
  return stack;
});

var dynamicLookup = function(k){
  var slot = globals[k] || [];
  return und.last(slot)
}

stackBinder('a',1)
stackBinder('b',100)


function f() {
  return dynamicLookup('a');
}

function g(){
  stackBinder('a','g'); return f();
}

function globalThis(){
  return this;
}

globalThis();
globalThis.call('barnabas');
globalThis.apply('orsulak',[]);

var nopeThis = und.bind(globalThis,'nope');
nopeThis.call('wat');

target = {
  name: 'the right value',
  aux: function(){
    return this.name;
  },
  act: function(){
    return this.aux();
  }
}

function strangeIdentity(n){
  for(var i=0;i<n;i++);
  return i;
}

function strangerIdentity(n){
  for(this['i']=0;this['i']<n;this['i']++);
  return this['i'];
}

function f(){
  this['a'] = 200;
  return this['a'] + this['b']
}

var globals = {'b':2}

f.call(und.clone(globals))

function whatWasTheLocal(){
  var CAPTURED = "Oh hai";
  return function(){
    return "The local was: " + CAPTURED;
  }
}

function createScaleFunction(FACTOR){
  return function(v){
    return und.map(v, function(n){
      return (n * FACTOR)
    })
  }
}

function createWeirdScaleFunction(FACTOR){
  return function(v){
    var captures= {'FACTOR' : FACTOR}
    return und.map(v, und.bind(function(n){
      return(n * this['FACTOR']);
    },captures))
  }
}
