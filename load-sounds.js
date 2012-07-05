// This function requires loadSound

var loadSounds = function(paths, callback, progress) {

	try {
		var context = new webkitAudioContext();
	} catch (e) {
		var p = document.createElement('p');
		p.innerHTML = 'Failed to create an audioContext.<br>' + e.message;
		document.body.appendChild(p);
		return;
	}

	var loaded = [];
	var errors = [];
	var sounds = [];

	var after = function() {
		var done = (loaded.length + errors.length) === paths.length;

		// if callback exists, execute it after all sounds have loaded
		if (done && callback) {
			callback(sounds);
		}

		// progress is an optional intermediate callback
		if (progress) {
			progress(sounds);
		}
	};

	var err = function(message, request) {
		console.log(message, request);
		errors.push(request);
		after();
	};

	var requests = paths.map(function(url, i) {
		var callback = function(buffer) {
			sounds[i] = buffer;
			loaded.push(buffer);
			after();
		};

		return loadSound(url, context, callback, err);
	});

	requests.loaded = loaded;
	requests.errors = errors;

	return requests;
};
