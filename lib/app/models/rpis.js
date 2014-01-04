var mongoose = require('mongoose'),
	_ = require('underscore'),
	Schema = mongoose.Schema,
	GpioSchema = require('./gpios').schema;

var RpiSchema = new Schema({
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
	mode: {
		type: String,
		default: ''
	},
	host: {
		type: String,
		default: ''
	},
	port: {
		type: Number
	},
	pwd: {
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
	gpios: [GpioSchema]
});

var requiredFields = ['name', 'mode'];

_.each(requiredFields, function(requiredField){
	RpiSchema.path(requiredField).validate(function(name) {
		return name.length;
	}, requiredField + ' cannot be blank');
});

RpiSchema.statics = {
	load: function(id, cb) {
		this.findOne({
			_id: id
		}).exec(cb);
	}
};

mongoose.model('Rpi', RpiSchema);
