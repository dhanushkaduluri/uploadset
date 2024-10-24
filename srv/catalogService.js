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
    this.before('CREATE', 'MediaFiles', async (req) => {
        // const { fileName, mediaType, size } = req.data;
        // console.log("CReate");
        // // Create a new media record with just metadata
        // const newMedia = {
        //     id: req.getUuid(),
        //     fileName,
        //     mediaType,
        //     size
        // };

        // try {
        //     const createdMedia = await srv.transaction(req).create(MediaFile, newMedia);
        //     req.reply(createdMedia); // Send back the created media object
        // } catch (error) {
        //     req.error(500, `Error creating media record: ${error.message}`);
        // }
        req.data.url = `RequestHeader(ID=${req.data.header_ID})/MediaFile(id=${req.data.id})/content`
    });

    // Update the content of the media record
    this.on('PUT', 'MediaFiles', async (req) => {
        console.log("put");
        const mediaId = req.params.mediaId;
        const content = req.rawBody; // Get binary content from the request

        try {
            await srv.transaction(req).update(MediaFile, mediaId, { content });
            req.reply(); // No content to return
        } catch (error) {
            req.error(500, `Error updating media content: ${error.message}`);
        }
    });
    /**
     * Handler method called on reading data entry
     * for entity Mediafile.
     **/
    
})