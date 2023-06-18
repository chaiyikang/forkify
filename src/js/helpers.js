import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
	return new Promise(function (_, reject) {
		setTimeout(function () {
			reject(new Error(`Request took too long! Timeout after ${s} second`));
		}, s * 1000);
	});
};

export const getJSON = async function (url) {
	try {
		// if we pass in a number to the timeout function, it is not clear where the number came from, as if it was a magic nubmer
		// we should replace it with a configuration value instead
		const response = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
		// this becomes self-explanatory, that we are using some set duration as the timeout requirement
		const responseJSON = await response.json();
		if (!response.ok) {
			throw new Error(`${response.statusText}, ${responseJSON.message}`);
		}
		return responseJSON;
	} catch (err) {
		alert(err + ` getJSON error, HELPER CAUGHT`);
		throw err;
	}
};

export const sendJSON = async function (url, uploadData) {
	try {
		// pass in object of options
		const fetchPro = fetch(url, {
			method: 'POST',
			headers: {
				// case-sensitive, here we tell the API we are sending over json data
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(uploadData),
		});

		const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
		if (!res.ok) throw new Error(`${data.message} ${res.status}`);
		// the api being used might send back the data that was uploaded
		const data = await res.json();
		return data;
	} catch (err) {
		alert(err + ` getJSON error, HELPER CAUGHT`);
		throw err;
	}
};
