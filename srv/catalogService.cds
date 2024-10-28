using {Media.db as db} from '../db/datamodel';


service media {
    entity MediaFile as projection on db.MediaFile;
};