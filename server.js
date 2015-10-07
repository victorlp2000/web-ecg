function Server(severUrl) {
	var url = serverUrl;

	function getData(callback) {
		$.get(url, data, function success(data) {
			callback(data);
		}, 'json');
	}

	function postData(data, callback) {
		$.post(url, data, function success(data) {
			callback(data);
		}, 'json');
	}

	return {
		getData: getData,
		postData: postData,
	}
}