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

		let response=await FetchUtil.fetch(url,useOptions);

		if (response.status!=200)
			throw new Error("Unable to post form, error: "+response.status);

		return response;
	}
}

module.exports=FetchUtil;