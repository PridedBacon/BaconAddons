import request from "../../requestV2/index.js";

export default new (class MayorUtils {
    constructor() {
        this.lastDerpyCheck = 0;
        this.lastDerpyResult = false;
    }

    isDerpy() {
        if (!(this.lastDerpyCheck + 3600 * 1000 < Date.now()))
            return new Promise((resolve) => resolve(this.lastDerpyResult));

        return request(
            "https://api.hypixel.net/v2/resources/skyblock/election"
        ).then((rawdata) => {
            const data = JSON.parse(rawdata);

            this.lastDerpyCheck = Date.now();
            this.lastDerpyResult =
                data["success"] && data["mayor"]["key"] === "derp";

            return this.lastDerpyResult;
        });
    }
})();
