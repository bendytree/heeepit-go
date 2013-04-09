
module.exports = process.env.NODE_ENV === 'production' ?
	{
		redisurl: '',
		mongourl: ''
	}
	:
	{
		redisurl: null, //localhost needs no connection string
		mongourl: 'mongodb://localhost/heeepit'
	};
