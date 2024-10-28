const SequenceHelper = require("./library/SequenceHelper");
const { Readable, PassThrough } = require("stream");
const cds = require('@sap/cds');
const { log } = require("console");
cds.env.features.fetch_csrf = true

module.exports = cds.service.impl(async function () {

    const {
        MediaFile
    } = this.entities;


    /**
     * Handler method called before creating data entry
     * for entity Mediafile.
     */
    this.before('CREATE', 'MediaFile', async (req) => {

        req.data.url = `/odata/v4/media/MediaFile(${req.data.id})/content`;

       
    });

    
})