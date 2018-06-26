const mysql = require('mysql');
const connection_params = {
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'ajaxtest',
    port : '3306'
};

module.exports = {
    mysqlConnection: function () {
        let connection = mysql.createConnection(connection_params);
        connection.connect(function (err) {
            if (err) throw err;
        })
        console.log('mysql connected!');
        return connection;
    },
    mysqlConnectionPool : function () {
        let connectionPool = mysql.createPool(connection_params);
        connectionPool.getConnection(function(err,connection){
            if (err) throw err;
            console.log('mysql pool created successfully!');
            connection.release();

        });
        return connectionPool;
    },
    mysqlInsert: function (sql, params, callback) {
        //直连模式
/*        let connection = module.exports.mysqlConnection();
        connection.query(sql, params, function (err, result) {
            if (err) {
                console.log('sql insert error :', err.message);
                connection.end();
                callback(err,result);
                throw err;
            }
            console.log('sql insert done :', result);
            connection.end();
            callback(err,result);
        });*/

        mysqlPool.getConnection(function (err, connection) {
            connection.query(sql, params, function (err, result) {
                if (err) {
                    console.log('sql insert error :', err.message);
                    connection.release();
                    callback(err,result);
                    throw err;
                }
                console.log('sql insert done :', result);
                connection.release();
                callback(err,result);
            });
        })

    },
    mysqlQuery: function (sql, callback) {
        let connection = this.mysqlConnection();
        connection.query(sql, function (err, result) {
            if (err) {
                console.log('sql query error :', err.message);
                connection.end();
                callback(err, result);
                throw err;
            }
            console.log('sql query done :', result);
            connection.end();
            callback(err, result);
        });
    },
    mysqlUpdate : function (sql, callback) {
        let connection = this.mysqlConnection();
        connection.query(sql, function (err, result) {
           if (err) {
               console.log('sql update error :',err.message);
               connection.end();
               throw err;
           }
           console.log('sql update done :', result);
           connection.end();
            callback(err, result);
        });
    },
    mysqlDelete : function (sql, callback) {
        let connection  = this.mysqlConnection();
        connection.query(sql,function (err, result) {
            if (err) {
                console.log('sql delete error :',err.message);
                connection.end();
                throw err;
            }
            console.log('sql delete done :',result);
            connection.end();
            callback(err, result);
        } )
    }
}

const mysqlPool = module.exports.mysqlConnectionPool();
