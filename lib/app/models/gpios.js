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
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	rpi: {
		type: Schema.ObjectId,
		ref: 'Rpi'
	}
});

var requiredFields = ['name', 'pin', 'direction'];

_.each(requiredFields, function(requiredField){
	GpioSchema.path(requiredField).validate(function(name) {
		return name && name.length;
	}, requiredField + ' cannot be blank');
});

GpioSchema.statics = {
	load: function(id, cb) {
		this.findOne({
			_id: id
		}).populate('rpi').exec(cb);
	}
};

mongoose.model('Gpio', GpioSchema);
