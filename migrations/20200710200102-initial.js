exports.up = db => {
    return db.runSql(`
    CREATE TABLE phones (
        id int(11) NOT NULL AUTO_INCREMENT,
        make varchar(255) NOT NULL,
        model varchar(255) NOT NULL,
        storage varchar(255) NOT NULL,
        monthly_premium decimal(11,2) unsigned NOT NULL DEFAULT '0.00',
        yearly_premium decimal(11,2) unsigned NOT NULL DEFAULT '0.00',
        excess int(11) NOT NULL,
        last_modified timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

      CREATE TABLE premiums (
        id int(11) unsigned NOT NULL AUTO_INCREMENT,
        phone_id int(11) DEFAULT NULL,
        monthly_premium decimal(10,2) DEFAULT NULL,
        yearly_premium decimal(10,2) DEFAULT NULL,
        excess int(11) DEFAULT NULL,
        start_date datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY phone_id (phone_id)
      ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)
}

exports.down = db => {
    return db.runSql(`
     DROP TABLE phones;
     DROP TABLE premiums;
    `)
}