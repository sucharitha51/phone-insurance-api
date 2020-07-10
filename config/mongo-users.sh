# add users
mongo admin <<EOF
    db.createUser(
      {
        user: "root",
        pwd: "root",
        roles: [ { role: "root", db: "admin" } ]
      }
    );
EOF
