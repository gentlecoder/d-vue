function SelfVue(options) {

    this.data = options.data;
    this.methods = options.methods;
    var self = new Proxy(this, {
        get: function (target, property) {
            if (property in target.data) {
                return target.data[property];
            } else {
                return target[property];
            }
        },
        set: function (target, property, value) {
            if (property in target.data) {
                target.data[property] = value;
            } else {
                target[property] = value;
            }
        }
    });

    // Object.keys(this.data).forEach(function (key) {
    //     self.proxyKeys(key);
    // });

    observe(self.data);
    new Compile(options.el, self);
    options.mounted.call(self); // 所有事情处理好后执行mounted函数
}

SelfVue.prototype = {
    proxyKeys: function (key) {
        var self = this;
        Object.defineProperty(this, key, {
            enumerable: false,
            configurable: true,
            get: function getter() {
                return self.data[key];
            },
            set: function setter(newVal) {
                self.data[key] = newVal;
            }
        });
    }
}