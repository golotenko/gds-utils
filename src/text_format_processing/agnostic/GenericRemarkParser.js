

const php = require('enko-fundamentals/src/Transpiled/php.js');

/**
 * parses remarks in our format, that we leave in all GDS-es
 */
class GenericRemarkParser
{
	/** @param string remark = 'S1 9493.00 N1 9493.00 F1 5314.00 Q1 0.00' */
	static parsePriceRemark(remark)  {
		let priceRemarkRegex, tokens;
		priceRemarkRegex =
            '/^'+
            '\\s*'+
            'S(?<paxNumberS>\\d+) (?<sellingPrice>\\d+(\\.\\d{0,2})?)'+
            '\\sN(?<paxNumberN>\\d+) (?<netPrice>\\d+(\\.\\d{0,2})?)'+
            '\\sF(?<paxNumberF>\\d+) (?<fare>\\d+(\\.\\d{0,2})?)'+
            '(\\sQ\\d+ (?<fuelSurcharge>\\d+(\\.\\d{2})?))?'+
            '/';
		if (php.preg_match(priceRemarkRegex, remark, tokens = [])
            && (tokens.paxNumberS == tokens.paxNumberN && tokens.paxNumberS == tokens.paxNumberF)
		) {
			return {
				passengerNumber: php.intval(tokens.paxNumberS),
				sellingPrice: tokens.sellingPrice,
				netPrice: tokens.netPrice,
				fare: tokens.fare,
				fuelSurcharge: tokens.fuelSurcharge|| null,
			};
		} else {
			return null;
		}
	}

	static parseFxdRemark(remark) {
		if (remark.match(/FARE STORED AS FXD/)) {
			return {
				storedAsFxd: true,
			};
		} else {
			return null;
		}
	}

	/**
     * @param string line =
     * 'SFOHT/ALEX/ID1/CREATED FOR LEPIN/ID346/REQ+ ID-1' ||
     * 'SFOHT/JOHN/ID84996/REQ+ ID-123957' ||
     * 'JOHN/ID84996/REQ+ ID-123957'
     */
	static parseLeadRemarkVerbose(line)  {
		let regex, matches;
		regex =
            '/'+
            '(GD-)?'+
            '(?<agentLogin>[^\\\/]+)\/'+
            'ID(?<agentId>\\d+)\/'+
            '('+
                'CREATED FOR (?<leadCreatorLogin>[^\\\/]+)\/'+
                'ID(?<leadCreatorId>\\d+)\/'+
            ')?'+
            'REQ. ID-(?<leadId>\\d+)'+
            '(?:\\s*IN\\s+(?<pcc>[A-Z0-9]{3,9}))?'+
            '/';
		if (php.preg_match(regex, line, matches = [])) {
			return {
				agentLogin: matches.agentLogin,
				agentId: matches.agentId,
				leadOwnerLogin: matches.leadCreatorLogin || '' || null,
				leadOwnerId: matches.leadCreatorId || '' || null,
				leadId: matches.leadId,
				pcc: matches.pcc || null,
			};
		} else {
			return null;
		}
	}

	/** @param line = 'GD-WILL GOLDMAN/21146/FOR WILL GOLDMAN/21146 IN 0EKH'
      *             || 'GD-STANISLAW/2838 IN 2G55'
      *             || 'RMKS-GD-KUNKKA/8050/LEAD-1 IN 2G55' */
	static parseLeadRemarkCompact(line)  {
		let regex, matches;
		regex =
            '/'+
            'GD-'+
            '(?<agentLogin>[^\\\/]+)\/'+
            '(?<agentId>\\d+)'+
            '('+
                '\\\/FOR\\s+'+
                '(?<leadCreatorLogin>[^\\\/]+)\/'+
                '(?<leadCreatorId>\\d+)'+
            ')?'+
            '(\\\/LEAD-(?<leadId>\\d+))?\\s*'+
            'IN\\s+(?<pcc>[A-Z0-9]{3,9})'+
            '/';
		if (php.preg_match(regex, line, matches = [])) {
			return {
				agentLogin: matches.agentLogin,
				agentId: matches.agentId,
				leadOwnerLogin: matches.leadCreatorLogin || '' || null,
				leadOwnerId: matches.leadCreatorId || '' || null,
				leadId: matches.leadId || '' || null,
				pcc: matches.pcc || null,
			};
		} else {
			return null;
		}
	}

	static parseCmsLeadRemark(line)  {
		return this.parseLeadRemarkVerbose(line) // old format
            || this.parseLeadRemarkCompact(line)
            || null;
	}

	/**
     * @param string remark - clean remark text with gds-specific line number, etc...
     */
	static parse(remark)  {
		let data, type;
		if (data = this.parseCmsLeadRemark(remark)) {
			type = this.CMS_LEAD_REMARK;
		} else if (data = this.parsePriceRemark(remark)) {
			type = this.PRICE_REMARK;
		} else if (data = this.parseFxdRemark(remark)) {
			type = this.FXD_REMARK;
		} else {
			type = 'UNKNOWN';
			data = remark;
		}
		return {
			remarkType: type,
			data: data,
		};
	}
}

GenericRemarkParser.CMS_LEAD_REMARK = 'CMS_LEAD_REMARK';
GenericRemarkParser.PRICE_REMARK = 'PRICE_REMARK';
GenericRemarkParser.FXD_REMARK = 'FXD_REMARK';

module.exports = GenericRemarkParser;
