const LocalTelRepository = require('./LocalTelRepository');


module.exports = class TelSplit {
    /**
     * @param {LocalTelRepository} repo
     */
    constructor(repo) {
        this.repo = repo ?? new LocalTelRepository();
    }

    /**
     * 電話番号をハイフン区切りに変換する。
     * @param {string} tel 
     * @returns {string}
     */
    convert(tel) {
        tel = tel.trim();
        if (tel.match(/^[0-9]+$/)) {
            // 着信課金
            const p4 = tel.slice(0, 4);
            if (p4 === '0120' || p4 === '0800') {
                return [p4, tel.slice(4, 7), tel.slice(7)].join('-');
            }

            // 携帯, IP電話
            const mob_ip = ['090', '080', '070', '050'];
            const p3 = tel.slice(0, 3);
            if (mob_ip.includes(p3)) {
                return [p3, tel.slice(3, 7), tel.slice(7)].join('-');
            }

            // 固定電話
            const p6 = tel.slice(0, 6);
            let pair = this.repo.get_local_tel_pair(p6);
            if (pair.length > 0) {
                return [pair[0], pair[1], tel.slice(6)].join('-');
            }
        }
        return tel
    }
}