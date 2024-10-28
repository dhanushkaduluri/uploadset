namespace Media.db;

entity MediaFile {
    key id        : UUID;
    @Core.ContentDisposition.Type: 'inline'
    @Core.MediaType: mediaType
    content       : LargeBinary;  // The binary content of the file
    @Core.IsMediaType: true
    mediaType     : String;        // MIME type of the file

    fileName      : String;        // Name of the uploaded file
    size          : Integer;       // Size of the file in bytes
    url           : String;        // URL to access the uploaded file
    
}
