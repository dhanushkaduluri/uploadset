const cds = require('@sap/cds');

class SequenceHelper {
    constructor({ sequence, db }) {
        this.sequence = sequence;
        this.db = db;
    }

    async getNextNumber() {
        try {
            const result = await this.db.run(
                `SELECT NEXTVAL('${this.sequence}') AS nextVal`
            );
            return result[0].nextVal;
        } catch (error) {
            console.error("Error fetching next sequence number:", error);
            throw new Error("Could not fetch sequence number");
        }
    }
}

module.exports = SequenceHelper;
