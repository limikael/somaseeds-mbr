const fetch=require("node-fetch");
const querystring=require("querystring");

class FetchUtil {
	static async fetch(url, options) {
		return fetch(url,options);
	}

	static async postForm(url, data, options) {
		let useOptions={
			...options,
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: querystring.stringify(data)
		};

		return FetchUtil.fetch(url,useOptions);
	}
}

module.exports=FetchUtil;