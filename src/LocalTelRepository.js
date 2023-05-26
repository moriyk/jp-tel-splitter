module.exports = class LocalTelRepository {
    /**
     * @typedef {string} LocalTel - 市外局番 + 市内局番
     * @typedef {[string, string]} LocalTelPair - 市外局番, 市内局番のペア
     * @param {Object.<LocalTel, LocalTelPair>} dict
     * @param {string} csv_url
     */
    constructor(dict = {}, csv_url = null) {
        this.dict = dict;
        if (csv_url) {
            this.load_csv(csv_url);
        }
    }

    /**
     * 市外局番, 市内局番のCSVファイルを読み込む。
     * @param {string} url
     */
    load_csv(url) {
        const req = new XMLHttpRequest();
        req.addEventListener('load', (event) => {
            const rows = event.target.responseText.split("\n");
            for (let i=1; i<rows.length; i++) {
                const cols = rows[i].split(',');
                this.dict[cols[2]] = [cols[3], cols[4]]; // Object.<LocalTel, LocalTelPair>
            }
        });
        req.open('get', url, false);
        req.send();
    }

    /**
     * 電話番号先頭6桁から市外局番, 市内局番のペアを返す
     * @param {string} p6
     * @return {Array}
     */
    get_local_tel_pair(p6) {
        if (p6 in this.dict) {
            return this.dict[p6];
        }
        return [];
    }
}