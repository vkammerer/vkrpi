var mongoose = require('mongoose'),
    _ = require('underscore'),
    Schema = mongoose.Schema;

var GpioSchema = new Schema({
    name: {
        type: String,
        default: '',
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    pin: {
        type: Number,
        default: null  
    },
    direction: {
        type: String,
        default: ''
    },
    created: {
        type: Date,
        default: Date.now
    }
});

GpioSchema.methods.flattenWithRpi = function(){
    var that = JSON.parse(JSON.stringify(this));
    that.rpi = JSON.parse(JSON.stringify(this.parent()));
    delete that.rpi.gpios;
    return that;
}

var requiredFields = ['name', 'pin', 'direction'];

_.each(requiredFields, function(requiredField){
    GpioSchema.path(requiredField).validate(function(name) {
        return name && name.length;
    }, requiredField + ' cannot be blank');
});

exports.schema = GpioSchema;
