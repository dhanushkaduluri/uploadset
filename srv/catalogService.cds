using {Media.db as db} from '../db/datamodel';


service MediaService @(path : '/media') {
    entity MediaFile as projection on db.MediaFile;
};