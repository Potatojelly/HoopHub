import {db} from "../db/database.js";

export async function getMyFriend(userID) {
    return db.query(`SELECT nickname, image_url AS \"imageURL\",  status_msg AS \"statusMsg\"
                    FROM friendships
                    JOIN users ON users.id = friendships.friend_id
                    WHERE friendships.user_id = $1
                    ORDER BY nickname ASC`
                    ,[userID])
        .then((result)=>result.rows)
        .catch((err)=>console.log(err));
}

export async function getMyFriendRequest(userID) {
    return db.query(`SELECT nickname, image_url AS \"imageURL\", fr.from_user_id AS \"fromUserID\", fr.to_user_id AS \"toUserID\", fr.status 
                    FROM users AS u
                    LEFT JOIN friend_requests AS fr ON u.id = fr.from_user_id OR  u.id = fr.to_user_id
                    WHERE u.id <> $1 AND fr.from_user_id = $1 AND status=\'pending\'
                    ORDER BY nickname ASC`
                    ,[userID])
        .then((result)=>result.rows)
        .catch((err)=>console.log(err));
}

export async function getReceivedFriendRequest(userID) {
    return db.query(`SELECT nickname, image_url AS \"imageURL\", fr.from_user_id AS \"fromUserID\", fr.to_user_id AS \"toUserID\", fr.status 
                    FROM users AS u
                    LEFT JOIN friend_requests AS fr ON u.id = fr.from_user_id OR  u.id = fr.to_user_id
                    WHERE u.id <> $1 AND fr.to_user_id = $1 AND status=\'pending\'
                    ORDER BY nickname ASC`
                    ,[userID])
        .then((result)=>result.rows)
        .catch((err)=>console.log(err));
}

export async function sendFriendRequest(user_id,friend_id) {
    return db.query(`INSERT INTO friend_requests (from_user_id, to_user_id, status)
                    VALUES($1, $2, $3)`,[user_id,friend_id,"pending"])
        .then((result)=>result.rowCount)
        .catch((err)=>console.log(err));
}

export async function findFriendRequest(user_id,friend_id) {
    return db.query(`SELECT * FROM friend_requests WHERE (from_user_id=$1 AND to_user_id=$2) OR (from_user_id=$2 AND to_user_id=$1)`
                    ,[user_id,friend_id])
        .then((result)=>result.rows[0])
        .catch((err)=>console.log(err));
}

export async function cancelFriendRequest(user_id,friend_id) {
    return db.query(`DELETE FROM friend_requests WHERE from_user_id=$1 AND to_user_id=$2` 
                    ,[user_id,friend_id])
        .then((result)=>result.rowCount)
        .catch((err)=>console.log(err));
}

export async function acceptFriendRequest(user_id,friend_id) {
    try {
        await db.query("BEGIN");
        const test = await db.query(`UPDATE friend_requests SET status=$3 WHERE from_user_id=$1 AND to_user_id=$2` 
                        ,[friend_id,user_id,"accepted"]);
        await db.query(`INSERT INTO friendships (user_id,friend_id) VALUES ($1,$2),($2,$1)`
                        ,[user_id,friend_id]);
        const result = await db.query("COMMIT");
        return result;
    } catch (err) {
        await db.query('ROLLBACK'); 
        console.log(err);
    }
}

export async function rejectFriendRequest(user_id,friend_id) {
    return db.query(`DELETE FROM friend_requests WHERE from_user_id=$1 AND to_user_id=$2` 
                    ,[friend_id,user_id])
        .then((result)=>result.rowCount)
        .catch((err)=>console.log(err));
}

export async function deleteFriend(user_id,friend_id) {
    try {
        await db.query("BEGIN");
        await db.query(`DELETE FROM friendships WHERE (user_id=$1 AND friend_id=$2) OR (user_id=$2 AND friend_id=$1)`
                        ,[user_id,friend_id]) 
        await db.query(`DELETE FROM friend_requests WHERE (from_user_id=$1 AND to_user_id=$2) OR (from_user_id=$2 AND to_user_id=$1)`
                        ,[friend_id,user_id])
        const result = await db.query("COMMIT");
        return result;
    } catch (err) {
        await db.query('ROLLBACK'); 
        console.log(err);
    }
}


