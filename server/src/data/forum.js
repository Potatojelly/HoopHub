import {db} from "../db/database.js";


export async function getComments(postID,currentPage,commentsPerPage) {
    const offset = (currentPage - 1) * commentsPerPage
    const rowCount = await db.query(`SELECT COUNT(*) AS count
                                    FROM (
                                        SELECT c.post_id
                                        FROM comments c
                                        WHERE c.post_id = $1
                                        UNION ALL
                                        SELECT r.post_id
                                        FROM replies r
                                        WHERE r.post_id = $1
                                    ) AS combined_data
                                    GROUP BY post_id`,[postID])
                    .then((result) => {
                        if(result.rowCount === 0) return 0;
                        else return parseInt(result.rows[0].count);
                    });

    return db.query(`SELECT c.id, 
                        'comment' AS type,
                        CASE
                            WHEN c.deleted = 1 THEN NULL
                            ELSE c.body
                        END AS body,
                        c.created_at AS comment_created_at,
                        NULL AS reply_created_at,
                        c.id AS reply_parent_id,
                        c.post_id,
                        c.deleted,
                        CASE
                            WHEN c.deleted = 1 THEN NULL
                            ELSE users.id
                        END AS user_id,
                            CASE
                            WHEN c.deleted = 1 THEN NULL
                            ELSE users.nickname
                        END AS nickname,
                            CASE
                            WHEN c.deleted = 1 THEN NULL
                            ELSE users.image_url
                        END AS image_url
                    FROM comments c
                    JOIN users ON users.id = c.user_id
                    WHERE c.post_id = $1
                    UNION ALL
                    SELECT r.id, 
                        'reply' AS type,
                        CASE
                            WHEN r.deleted = 1 THEN NULL
                            ELSE r.body
                        END AS body,
                        NULL AS comment_created_at, 
                        r.created_at AS reply_created_at,
                        r.comment_id AS reply_parent_id,
                        r.post_id,
                        r.deleted,
                        CASE
                            WHEN r.deleted = 1 THEN NULL
                            ELSE users.id
                        END AS user_id,
                            CASE
                            WHEN r.deleted = 1 THEN NULL
                            ELSE users.nickname
                        END AS nickname,
                            CASE
                            WHEN r.deleted = 1 THEN NULL
                            ELSE users.image_url
                        END AS image_url
                    FROM replies r 
                    JOIN users ON users.id = r.user_id
                    WHERE r.post_id = $1
                    ORDER BY reply_parent_id DESC, comment_created_at ASC, reply_created_at ASC
                    LIMIT $2
                    OFFSET $3`
                    ,[postID, commentsPerPage, offset])
            .then((result)=>{
                const data = {};
                data.comments = [...result.rows];
                data.current_page = 1;
                data.total_comments = rowCount;
                data.comments_per_page = commentsPerPage;
                return data;
            })
            .catch((err)=>console.log(err));
}

export async function updateView(postID) {
    return db.query(`UPDATE posts SET views = views + 1 WHERE postS.id = $1`
                    ,[postID])
            .then((result)=> result.rows)
            .catch((err)=>console.log(err));
}

export async function createComment(comment) {
    const {userID, postID, body} = comment;
    return db.query("INSERT INTO comments (user_id, post_id, body) VALUES ($1, $2, $3)",
        [userID,postID,body])
            .then((result)=>result.rowCount)
            .catch((err)=>console.log(err));
}

export async function updateComment(comment) {
    const {postID, commentID, body} = comment;
    return db.query("UPDATE comments SET body=$1 WHERE id=$2 AND post_id=$3",
        [body,commentID,postID])
            .then((result)=>result.rowCount)
            .catch((err)=>console.log(err));
}

export async function deleteComment(comment) {
    const {postID, commentID} = comment;
    return db.query("UPDATE comments SET deleted=1 WHERE id=$1 AND post_id=$2",
        [commentID,postID])
            .then((result)=>result.rowCount)
            .catch((err)=>console.log(err));
}

export async function createReply(reply) {
    const {userID, postID, commentID, body} = reply;
    return db.query("INSERT INTO replies (user_id, post_id, comment_id, body) VALUES ($1, $2, $3, $4)",
        [userID,postID,commentID,body])
            .then((result)=>result.rowCount)
            .catch((err)=>console.log(err));
}
export async function updateReply(reply) {
    const {postID, replyID, commentID, body} = reply;
    return db.query("UPDATE replies SET body=$1 WHERE id=$2 AND comment_id= $3 AND post_id=$4",
        [body,replyID,commentID,postID])
            .then((result)=>{return result.rowCount})
            .catch((err)=>console.log(err));
}

export async function deleteReply(reply) {
    const {postID, commentID, replyID} = reply;
    return db.query("UPDATE replies SET deleted=1 WHERE id=$1 AND comment_id= $2 AND post_id=$3",
        [replyID,commentID,postID])
            .then((result)=>{return result.rowCount})
            .catch((err)=>console.log(err));
}

export async function getPosts(keyword,currentPage,postsPerPage) {
    const offset = (currentPage - 1) * postsPerPage
    let rowCount;
    if(keyword) {
        rowCount = await db.query(`SELECT COUNT(*) FROM posts
                                        WHERE title ILIKE $1 AND deleted=0`,["%"+keyword+"%"])
                                .then((result) => {return parseInt(result.rows[0].count)});
        return db.query(`SELECT 
                            posts.id,
                            CASE
                                WHEN deleted = 1 THEN NULL
                                ELSE user_id
                            END AS user_id,
                            posts.created_at,
                            posts.title,
                            CASE
                                WHEN deleted = 1 THEN NULL
                                ELSE body
                            END AS body,
                            CASE
                                WHEN deleted = 1 THEN NULL
                                ELSE thumbnail_url
                            END AS thumbnail_url,
                            CASE
                                WHEN deleted = 1 THEN NULL
                                ELSE views
                            END AS views,
                            posts.deleted,
                            users.nickname, 
                            users.image_url, 
                            COALESCE(comment_counts.comment_count, 0) + COALESCE(reply_counts.reply_count, 0) AS total_comments
                        FROM posts
                        JOIN users ON posts.user_id = users.id
                        LEFT JOIN (
                            SELECT post_id, COUNT(*) AS comment_count
                            FROM comments
                            GROUP BY post_id
                        ) AS comment_counts ON posts.id = comment_counts.post_id
                        LEFT JOIN (
                            SELECT post_id, COUNT(*) AS reply_count
                            FROM replies
                            GROUP BY post_id
                        ) AS reply_counts ON posts.id = reply_counts.post_id
                        WHERE title ILIKE $1 AND deleted=0
                        ORDER BY posts.created_at DESC
                        LIMIT $2
                        OFFSET $3`,["%"+keyword+"%",postsPerPage,offset])
                .then((result)=>{
                    const data = {};
                    data.posts = [...result.rows];
                    data.current_page = 1;
                    data.total_posts = rowCount;
                    data.posts_per_page = postsPerPage;
                    return data;
                })
                .catch((err)=>console.log(err));
    } else {
        rowCount = await db.query("SELECT COUNT(*) FROM posts")
                    .then((result) => parseInt(result.rows[0].count));

        return db.query(`SELECT 
                            posts.id,
                            CASE
                                WHEN deleted = 1 THEN NULL
                                ELSE user_id
                            END AS user_id,
                            posts.created_at,
                            posts.title,
                            CASE
                                WHEN deleted = 1 THEN NULL
                                ELSE body
                            END AS body,
                            CASE
                                WHEN deleted = 1 THEN NULL
                                ELSE thumbnail_url
                            END AS thumbnail_url,
                            CASE
                                WHEN deleted = 1 THEN NULL
                                ELSE views
                            END AS views,
                            posts.deleted,
                            users.nickname, 
                            users.image_url, 
                            COALESCE(comment_counts.comment_count, 0) + COALESCE(reply_counts.reply_count, 0) AS total_comments
                        FROM posts
                        JOIN users ON posts.user_id = users.id
                        LEFT JOIN (
                            SELECT post_id, COUNT(*) AS comment_count
                            FROM comments
                            GROUP BY post_id
                        ) AS comment_counts ON posts.id = comment_counts.post_id
                        LEFT JOIN (
                            SELECT post_id, COUNT(*) AS reply_count
                            FROM replies
                            GROUP BY post_id
                        ) AS reply_counts ON posts.id = reply_counts.post_id
                        ORDER BY posts.created_at DESC
                        LIMIT $1
                        OFFSET $2`,[postsPerPage,offset])
                .then((result)=>{
                    const data = {};
                    data.posts = [...result.rows];
                    data.current_page = 1;
                    data.total_posts = rowCount;
                    data.posts_per_page = postsPerPage;
                    return data;
                })
                .catch((err)=>console.log(err));
    }
}

export async function getPost(postID) {
    return await db.query(`SELECT 
                            posts.id,
                            posts.title,
                            posts.body,
                            posts.created_at,
                            posts.thumbnail_url,
                            posts.views,
                            posts.deleted,
                            users.nickname, 
                            users.image_url, 
                            COALESCE(comment_counts.comment_count, 0) + COALESCE(reply_counts.reply_count, 0) AS total_comments
                        FROM posts
                        JOIN users ON posts.user_id = users.id
                        LEFT JOIN (
                            SELECT post_id, COUNT(*) AS comment_count
                            FROM comments
                            GROUP BY post_id
                        ) AS comment_counts ON posts.id = comment_counts.post_id
                        LEFT JOIN (
                            SELECT post_id, COUNT(*) AS reply_count
                            FROM replies
                            GROUP BY post_id
                        ) AS reply_counts ON posts.id = reply_counts.post_id
                        WHERE posts.id = $1
                        ORDER BY posts.created_at DESC`                            
                            ,[postID])
                .then((result)=>{ return result.rows[0]})
                .catch((err)=>console.log(err));
}


export async function createPost(post) {
    const {userID, title, body, thumbnailURL} = post;
    return await db.query(`INSERT INTO posts (user_id, title, body, thumbnail_url) VALUES ($1, $2, $3, $4)
                            RETURNING *`                            
                            ,[userID,title,body,thumbnailURL])
                .then((result)=>{ return result.rows[0]})
                .catch((err)=>console.log(err));
}

export async function updatePost(post) {
    const {postID, title, body, thumbnailURL} = post;
    return await db.query(`UPDATE posts SET title=$1, body=$2, thumbnail_url=$3 WHERE id=$4
                            RETURNING *`                            
                            ,[title,body,thumbnailURL,postID])
                .then((result)=>{return result.rows[0]})
                .catch((err)=>console.log(err));
}

export async function deletePost(postID) {
    return await db.query(`UPDATE posts SET deleted=1 WHERE id=$1`                            
                            ,[postID])
                .then((result)=>{ return result.rowCount})
                .catch((err)=>console.log(err));
}

export async function getUserPosts(userID,currentPage,postsPerPage) {
    const offset = (currentPage - 1) * postsPerPage
    const rowCount = await db.query("SELECT COUNT(*) FROM posts WHERE user_id=$1 AND deleted=0",[userID])
                                    .then((result) => parseInt(result.rows[0].count));
    return db.query(`SELECT 
                        posts.id,
                        posts.user_id,
                        posts.created_at,
                        posts.title,
                        posts.views,
                        users.nickname, 
                        COALESCE(comment_counts.comment_count, 0) + COALESCE(reply_counts.reply_count, 0) AS total_comments
                        FROM posts
                        JOIN users ON posts.user_id = users.id
                        LEFT JOIN (
                        SELECT post_id, COUNT(*) AS comment_count
                        FROM comments
                        GROUP BY post_id
                        ) AS comment_counts ON posts.id = comment_counts.post_id
                        LEFT JOIN (
                        SELECT post_id, COUNT(*) AS reply_count
                        FROM replies
                        GROUP BY post_id
                        ) AS reply_counts ON posts.id = reply_counts.post_id
                        WHERE user_id = $1 AND deleted = 0
                        ORDER BY posts.created_at DESC
                    LIMIT $2
                    OFFSET $3`,[userID,postsPerPage,offset])
            .then((result)=>{
                const data = {};
                data.my_posts = [...result.rows];
                data.current_page = 1;
                data.total_posts = rowCount;
                data.posts_per_page = postsPerPage;
                return data;
            })
            .catch((err)=>console.log(err));
}

export async function getUserComments(userID,currentPage,commentsPerPage) {
    const offset = (currentPage - 1) * commentsPerPage
    const totalMyComment = await db.query(`SELECT
                                            (SELECT COUNT(*) FROM replies WHERE user_id = $1 AND deleted = 0) +
                                            (SELECT COUNT(*) FROM comments WHERE user_id = $1 AND deleted = 0) AS count`,[userID])
                                    .then((result) => parseInt(result.rows[0].count));
    return db.query(`SELECT id, type, body,created_at,t1.post_id,title AS post_title,total_comments AS post_total_comments
                    FROM
                    (
                        (SELECT c.id, 
                            'comment' AS type,
                            c.body AS body,
                            c.created_at AS created_at,
                            c.post_id
                        FROM comments c
                        JOIN users ON users.id = c.user_id
                        WHERE c.user_id = $1 AND c.deleted = 0)
                        UNION ALL
                        (SELECT r.id, 
                            'reply' AS type,
                            r.body AS body,
                            r.created_at AS created_at,
                            r.post_id
                        FROM replies r 
                        JOIN users ON users.id = r.user_id
                        WHERE r.user_id = $1 AND r.deleted = 0) 
                    ) AS t1
                    JOIN 
                    (SELECT 
                        posts.id AS post_id,
                        posts.title,
                        COALESCE(comment_counts.comment_count, 0) + COALESCE(reply_counts.reply_count, 0) AS total_comments
                    FROM posts
                    LEFT JOIN (
                        SELECT post_id, COUNT(*) AS comment_count
                        FROM comments
                        GROUP BY post_id
                    ) AS comment_counts ON posts.id = comment_counts.post_id
                    LEFT JOIN (
                        SELECT post_id, COUNT(*) AS reply_count
                        FROM replies
                        GROUP BY post_id
                    ) AS reply_counts ON posts.id = reply_counts.post_id) AS t2
                    ON t1.post_id = t2.post_id
                    ORDER BY created_at DESC
                    LIMIT $2
                    OFFSET $3`,[userID,commentsPerPage,offset])
            .then((result)=>{
                const data = {};
                data.my_comments = [...result.rows];
                data.current_page = 1;
                data.total_comments = totalMyComment;
                data.comments_per_page = commentsPerPage;
                return data;
            })
            .catch((err)=>console.log(err));
}

export async function getTargetCommentNumber(postID,commentID) {
    return db.query(`SELECT *
                    FROM 
                    (
                    SELECT row_number() OVER () AS row_number, t1.id, t1.body,t1.post_id
                    FROM
                    (
                        SELECT c.id, 
                        'comment' AS type,
                        CASE
                            WHEN c.deleted = 1 THEN NULL
                            ELSE c.body
                        END AS body,
                        c.created_at AS comment_created_at,
                        NULL AS reply_created_at,
                        c.id AS reply_parent_id,
                        c.post_id,
                        c.deleted,
                        CASE
                            WHEN c.deleted = 1 THEN NULL
                            ELSE users.id
                        END AS user_id,
                            CASE
                            WHEN c.deleted = 1 THEN NULL
                            ELSE users.nickname
                        END AS nickname,
                            CASE
                            WHEN c.deleted = 1 THEN NULL
                            ELSE users.image_url
                        END AS image_url
                        FROM comments c
                        JOIN users ON users.id = c.user_id
                        WHERE c.post_id = $1
                        UNION ALL
                        SELECT r.id, 
                        'reply' AS type,
                        CASE
                            WHEN r.deleted = 1 THEN NULL
                            ELSE r.body
                        END AS body,
                        NULL AS comment_created_at, 
                        r.created_at AS reply_created_at,
                        r.comment_id AS reply_parent_id,
                        r.post_id,
                        r.deleted,
                        CASE
                            WHEN r.deleted = 1 THEN NULL
                            ELSE users.id
                        END AS user_id,
                            CASE
                            WHEN r.deleted = 1 THEN NULL
                            ELSE users.nickname
                        END AS nickname,
                            CASE
                            WHEN r.deleted = 1 THEN NULL
                            ELSE users.image_url
                        END AS image_url
                        FROM replies r 
                        JOIN users ON users.id = r.user_id
                        WHERE r.post_id = $1
                        ORDER BY reply_parent_id DESC, comment_created_at ASC, reply_created_at ASC
                        ) AS t1
                    ) AS t2
                    WHERE id = $2`,[postID,commentID])
                .then((result) => result.rows[0].row_number);
}







