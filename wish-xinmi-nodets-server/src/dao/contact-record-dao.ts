import mysql = require("./mysql");
import Daogenerator = require("./dao-generator");

const baseDao = Daogenerator({
    tableName: "xinmi_contact_record",
    columns: [
        {name: "user_id", type: Daogenerator.columnGType.string},
        {name: "contact_id", type: Daogenerator.columnGType.string},
        {name: "status", type: Daogenerator.columnGType.number},
        {name: "validate_msg", type: Daogenerator.columnGType.string},
        {name: "is_checked", type: Daogenerator.columnGType.number},
        {name: "create_time", type: Daogenerator.columnGType.datetime},
        {name: "update_time", type: Daogenerator.columnGType.datetime},
    ]
});


export = {
    ...baseDao
}