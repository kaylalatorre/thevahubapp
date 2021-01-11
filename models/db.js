const mongoose = require('mongoose');
const url = `mongodb://TVH-admin:zLXsFFmBmU4QkQvT@tvh-cluster-shard-00-00.zuv4e.mongodb.net:27017,tvh-cluster-shard-00-01.zuv4e.mongodb.net:27017,tvh-cluster-shard-00-02.zuv4e.mongodb.net:27017/tvh-db?authSource=admin&replicaSet=atlas-wfdg1t-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true`;

const options = {
	useUnifiedTopology: true,
	useNewUrlParser: true
};
mongoose.set('useCreateIndex', true);

const database = {
	connect: async function() {
		try {
			await mongoose.connect(url, options);
			console.log('Connected to db');
		} catch (e) {
			throw e;
		}
	},
	
	insertOne: async function(model, doc) {
		try {
			var result = await model.create(doc);
			console.log('Added ' + result);
			return true;
		} catch (e) {
			return false;
		}
	},
	
	insertMany: async function(model, docs) {
		try {
			var result = await model.insertMany(docs);
			console.log('Added ' + result);
			return true;
		} catch (e) {
			return false;
		}
	},
	
	findOne: async function(model, query, projection) {
		try {
			var result = await model.findOne(query, projection);
			return result;
		} catch (e) {
			return false;
		}
	},
	
	findMany: async function(model, query, projection) {
		try {
			var result = await model.find(query, projection);
			return result;
		} catch (e) {
			return false;
		}
	},
	
	updateOne: async function(model, filter, update) { //model, filter (similar to "find"), update (what to update)
		try {
			var result = await model.updateOne(filter, update);
			console.log('Document modified: ' + result.nModified);
			return true;
		} catch (e) {
			return false;
		}
	},
	
	updateMany: async function(model, filter, update) {
		try {
			var result = await model.updateMany(filter, update);
			console.log('Document modified: ' + result.nModified);
			return true;
		} catch (e) {
			return false;
		}
	},
	
	deleteOne: async function(model, conditions) {
		try {
			var result = await model.deleteOne(conditions);
			console.log('Document deleted: ' + result.deletedCount);
			return true;
		} catch (e) {
			return false;
		}
	},
	
	deleteMany: async function(model, conditions) {
		try {
			var result = await model.deleteMany(conditions);
			console.log('Document deleted: ' + result.deletedCount);
			return true;
		} catch (e) {
			return false;
		}
	},
	
	aggregate: async function(model, pipelines) {
		try {
			var result = await model.aggregate(pipelines);
			return result;
		} catch (e) {
			return false;
		}
	}
};

module.exports = database;
