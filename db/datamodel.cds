namespace Media.db;

entity MediaFile {
    key id        : UUID;
        @Core.MediaType   : mediaType
        content   : LargeBinary;
        @Core.IsMediaType : true
        mediaType : String;
        fileName  : String;
        url       : String;
};