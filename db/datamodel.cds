namespace Media.db;

entity MediaFile {
    key id        : UUID;

    @Core.MediaType: mediaType
    content       : LargeBinary;  // The binary content of the file
    @assert: 'mediaType in ["image/png", "image/jpeg", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]' // Validate media type
    @Core.IsMediaType: true
    mediaType     : String;        // MIME type of the file

    fileName      : String;        // Name of the uploaded file
    size          : Integer;       // Size of the file in bytes
    url           : String;        // URL to access the uploaded file
    
}
