if (typeof(AURORA) === "undefined") var AURORA = {};

/**
* Source code from pikacode.com/mercurial.intuxication.org/js-hacks.tar.gz
*/

AURORA.Map = function(linkEntries) {
    this.current = undefined;
    this.size = 0;
    this.isLinked = true;

    this.hash.current = 0;

    if(linkEntries === false)
        this.disableLinking();
}

AURORA.Map.prototype = {

    constructor: AURORA.Map,

    from: function(obj, foreignKeys, linkEntries) {
        var map = new AURORA.Map(linkEntries);

        for(var prop in obj) {
            if(foreignKeys || obj.hasOwnProperty(prop))
                map.put(prop, obj[prop]);
        }

        return map;
    },

    noop: function() {
        return this;
    },

    illegal: function() {
        throw new Error('can\'t do this with unlinked maps');
    },

    disableLinking: function() {
        this.isLinked = false;
        this.link = AURORA.Map.noop;
        this.unlink =  AURORA.Map.noop;
        this.disableLinking =  AURORA.Map.noop;
        this.next =  AURORA.Map.illegal;
        this.key =  AURORA.Map.illegal;
        this.value =  AURORA.Map.illegal;
        this.removeAll =  AURORA.Map.illegal;
        this.each =  AURORA.Map.illegal;
        this.flip =  AURORA.Map.illegal;
        this.drop =  AURORA.Map.illegal;
        this.listKeys =  AURORA.Map.illegal;
        this.listValues =  AURORA.Map.illegal;

        return this;
    },

    hash: function(value) {
        return value instanceof Object ? (value.__hash ||
            (value.__hash = 'object ' + ++arguments.callee.current)) :
            (typeof value) + ' ' + String(value);
    },

    link: function(entry) {
        if(this.size === 0) {
            entry.prev = entry;
            entry.next = entry;
            this.current = entry;
        }
        else {
            entry.prev = this.current.prev;
            entry.prev.next = entry;
            entry.next = this.current;
            this.current.prev = entry;
        }
    },

    unlink: function(entry) {
        if(this.size === 0)
            this.current = undefined;
        else {
            entry.prev.next = entry.next;
            entry.next.prev = entry.prev;
            if(entry === this.current)
                this.current = entry.next;
        }
    },

    get: function(key) {
        var entry = this[this.hash(key)];
        return typeof entry === 'undefined' ? undefined : entry.value;
    },

    put: function(key, value) {
        var hash = this.hash(key);

        if(this.hasOwnProperty(hash))
            this[hash].value = value;
        else {
            var entry = { key : key, value : value };
            this[hash] = entry;

            this.link(entry);
            ++this.size;
        }

        return this;
    },

    remove: function(key) {
        var hash = this.hash(key);

        if(this.hasOwnProperty(hash)) {
            --this.size;
            this.unlink(this[hash]);

            delete this[hash];
        }

        return this;
    },

    removeAll: function() {
        while(this.size)
            this.remove(this.key());

        return this;
    },

    contains: function(key) {
        return this.hasOwnProperty(this.hash(key));
    },

    isUndefined: function(key) {
        var hash = this.hash(key);
        return this.hasOwnProperty(hash) ?
            typeof this[hash] === 'undefined' : false;
    },

    next: function() {
        this.current = this.current.next;
    },

    key: function() {
        return this.current.key;
    },

    value: function() {
        return this.current.value;
    },

   each: function(func, thisArg) {
        if(typeof thisArg === 'undefined')
            thisArg = this;

        for(var i = this.size; i--; this.next()) {
            var n = func.call(thisArg, this.key(), this.value(), i > 0);
            if(typeof n === 'number')
                i += n; // allows to add/remove entries in func
        }

        return this;
    },

    flip: function(linkEntries) {
        var map = new AURORA.Map(linkEntries);

        for(var i = this.size; i--; this.next()) {
            var	value = this.value(),
                list = map.get(value);

            if(list) list.push(this.key());
            else map.put(value, [this.key()]);
        }

        return map;
    },

    drop: function(func, thisArg) {
        if(typeof thisArg === 'undefined')
            thisArg = this;

        for(var i = this.size; i--; ) {
            if(func.call(thisArg, this.key(), this.value())) {
                this.remove(this.key());
                --i;
            }
            else this.next();
        }

        return this;
    },

    listValues: function() {
        var list = [];

        for(var i = this.size; i--; this.next())
            list.push(this.value());

        return list;
    },

    listKeys: function() {
        var list = [];

        for(var i = this.size; i--; this.next())
            list.push(this.key());

        return list;
    },

    toString: function() {
        var string = '[object Map';

        function addEntry(key, value, hasNext) {
            string += '    { ' + this.hash(key) + ' : ' + value + ' }' +
                (hasNext ? ',' : '') + '\n';
        }

        if(this.isLinked && this.size) {
            string += '\n';
            this.each(addEntry);
        }

        string += ']';
        return string;
    },

    reverseIndexTableFrom: function(array, linkEntries) {
        var map = new AURORA.Map(linkEntries);

        for(var i = 0, len = array.length; i < len; ++i) {
            var	entry = array[i],
                list = map.get(entry);

            if(list) list.push(i);
            else map.put(entry, [i]);
        }

        return map;
    },

    cross: function(map1, map2, func, thisArg) {
        var linkedMap, otherMap;

        if(map1.isLinked) {
            linkedMap = map1;
            otherMap = map2;
        }
        else if(map2.isLinked) {
            linkedMap = map2;
            otherMap = map1;
        }
        else AURORA.Map.illegal();

        for(var i = linkedMap.size; i--; linkedMap.next()) {
            var key = linkedMap.key();
            if(otherMap.contains(key))
                func.call(thisArg, key, map1.get(key), map2.get(key));
        }

        return thisArg;
    },

    uniqueArray: function(array) {
        var map = new AURORA.Map;

        for(var i = 0, len = array.length; i < len; ++i)
            map.put(array[i]);

        return map.listKeys();
    }

};