import {db} from "../db/database.js";

export async function searchUser(params) {
    const {userID,nickname} = params;
    return db.query(`SELECT DISTINCT ON (nickname) 
                        * ,
                        ROW_NUMBER() OVER (PARTITION BY nickname ORDER BY \"fromUserID\" IS NOT NULL DESC, \"toUserID\" IS NOT NULL DESC) AS rnk
                    FROM
                    (
                        SELECT 
                            users.id,
                            mongo_id AS \"mongoID\",
                            users.nickname,
                            users.image_url AS \"imageURL\",
                            COALESCE(fr.from_user_id, NULL)  AS \"fromUserID\",
                            COALESCE(fr.to_user_id, NULL) AS \"toUserID\",
                            COALESCE(fr.status, NULL) AS status
                        FROM users
                        LEFT JOIN friend_requests fr ON users.id = fr.from_user_id OR users.id = fr.to_user_id
                        WHERE (users.nickname ILIKE $1 AND users.id <> $2)
                        UNION
                        SELECT 
                            users.id,
                            mongo_id AS \"mongoID\",
                            users.nickname,
                            users.image_url AS \"imageURL\",
                            NULL AS \"fromUserID\",
                            NULL AS  \"toUserID\",
                            NULL AS status
                        FROM users
                        WHERE users.nickname ILIKE $1 AND users.id <> $2
                    ) AS table1
                    WHERE (nickname ILIKE $1 AND (\"fromUserID\" = $2 OR \"toUserID\" = $2))
                    OR (nickname ILIKE $1 AND \"fromUserID\" IS NULL AND \"toUserID\" IS NULL AND status IS NULL)
                    ORDER BY nickname ASC
                        `
                    ,[`${nickname}%`,userID])
    .then((result)=>{return result.rows})
    .catch((err)=>console.log(err));
}