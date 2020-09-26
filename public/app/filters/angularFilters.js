var app = angular.module('portalFilters', [])

.filter('package', function () {
    return function(package) {
        if(typeof package === 'string') {
            return package;
        } else {
            if(package) {
                let programs = Object.keys(package);
                return package[programs[0]].ctc.toUpperCase();
            } else {
                return 'TO BE UPDATED.'
            }
        }
    };
})

.filter('limitHtml', function() {
    return function(text, limit) {

        var changedString = String(text).replace(/<[^>]+>/gm, ' ');
        var length = changedString.length;

        return length > limit ? changedString.substr(0, limit - 1) + '....' : changedString;
    }
});

