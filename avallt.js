(function() {
    window.avalltJS = {};
    var addFn = function(fnName, fn) {
        window.avalltJS[fnName] = fn;
    }

    var isArray = function(value) {
        return toString.call(value) === '[object Array]';
    }

    var isObject = function(value) {
        return toString.call(value) === '[object Object]';
    };

    /**
     * Analyses the diff between given objects
     *
     * @param  {Object} objectL
     * @param  {Object} objectR
     * @return {Object} calculated diff information about the given objects
     */
    var diff = function(objectL, objectR) {
        var propertiesOfLeft = [],
            propertiesOfRight = [],
            missingPropertiesLeft = [],
            missingPropertiesRight = [],
            valuesDiff = [];

        for (var property in objectL) {
            if (objectL.hasOwnProperty(property)) {
                propertiesOfLeft.push(property);
            }
        }

        for (var property in objectR) {
            if (objectR.hasOwnProperty(property)) {
                propertiesOfRight.push(property);
            }
        }
        var propertyExistsInList = function(property, list) {
            for (var j = 0; j < list.length; j++) {
                if (property === list[j]) {
                    return true;
                }
            }
            return false;
        }

        for (var i = 0; i < propertiesOfLeft.length; i++) {
            var property = propertiesOfLeft[i];

            if (propertyExistsInList(property, propertiesOfRight) === false) {
                missingPropertiesLeft.push(property);
            }
        }

        for (var i = 0; i < propertiesOfRight.length; i++) {
            var property = propertiesOfRight[i];

            if (propertyExistsInList(property, propertiesOfLeft) === false) {
                missingPropertiesRight.push(property);
            } else {
                valuesDiff.push({
                    property: property,
                    left: objectL[property],
                    right: objectR[property]
                });
            }
        }

        return {
            propsLeft: propertiesOfLeft,
            propsRight: propertiesOfRight,
            missingPropsLeft: missingPropertiesLeft,
            missingPropsRight: missingPropertiesRight,
            valuesDiff: valuesDiff
        }
    }
    addFn('diff', diff);

    var _handleObjectProperty = function(item, property) {
        if (isObject(item)) {
            removeNestedProperty(item, property);
        } else if (isArray(item)) {
            for (var i = 0; i < item.length; i++) {
                removeNestedProperty(item[i], property);
            }
        }
    }

    var removeNestedProperty = function(obj, property) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                if (prop === property) {
                    delete obj[prop];
                } else {
                    _handleObjectProperty(obj[prop], property);
                }
            }
        }
        return obj;
    }

    addFn('removeNestedProperty', removeNestedProperty);
})()
