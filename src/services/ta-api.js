import fetch from "node-fetch";
import querystring from "querystring";

export class TAAPI {
	/**
	 * @param {string} key
	 */
	constructor(key) {
		this.key = key;

		this.apiUrl = "https://api.taapi.io";

		if (!this.key) throw new Error("No TA API Key found in .env");
	}


	/**
	 * Get the Simple Moving Average
	 * @param {string} asset
	 * @param {string} currency
	 * @param {string} interval
	 * @param {string} period
	 */
	async getSMA(asset, currency, interval, period) {
		// TODO: free api only allows us to use usdt
		currency = currency == "USD" ? "USDT" : "USD";
		let params = {
			secret: this.key,
			exchange: "binance",
			symbol: asset + "/" + currency,  
			interval: interval,
			period: period
		}

		const url = `${this.apiUrl}/sma?${querystring.stringify(params)}`;
		

		for (let tries = 1; tries < 3; tries++) {
			try {
				const response = await fetch(url, {
					method: "GET",
					headers: {
						"Content-Type": "application/json"
					}
				});
				
				let responseObj = await response.json();
				if ( responseObj.error != null ){
					console.log( "TA-API Error: "+ responseObj.error );
					await new Promise(resolve => setTimeout(resolve, 15000*tries));
					continue;
				}

				return responseObj.value;
			} catch (error) {
				console.error(error);
			}			
			
		}
	}
}
