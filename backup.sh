#!/bin/sh
#=====================================================================
# Set the following variables as per your requirement
#=====================================================================
# Database Name to backup
MONGO_DATABASE="asteriskcdrdb"
# Database host name
MONGO_HOST="127.0.0.1"
# Database port
MONGO_PORT="27017"
# Backup directory
BACKUPS_DIR="/var/www/html/backups/$MONGO_DATABASE"
# Database user name
DBUSERNAME="aliveportal1"
# Database password
DBPASSWORD="VFA4ZJ7yR2F9pVj4"
# Authentication database name
DBAUTHDB="admin"
# Days to keep the backup
DAYSTORETAINBACKUP="14"
#=====================================================================
TIMESTAMP=`date`
BACKUP_NAME="$MONGO_DATABASE-$TIMESTAMP"
echo "Performing backup of $MONGO_DATABASE"
echo "--------------------------------------------"
# Create backup directory
#if ! mkdir -p $BACKUPS_DIR; then
 # echo "Can't create backup directory in $BACKUPS_DIR. Go and fix it!" 1>&2
 # exit 1;
#fi;
# Create dump
#mongodump -d $MONGO_DATABASE --username $DBUSERNAME --password $DBPASSWORD --authenticationDatabase $DBAUTHDB
#mongodump -d $MONGO_DATABASE
# Rename dump directory to backup name
#mv dump $BACKUP_NAME
# Compress backup
mongodump -d asteriskcdrdb -o $BACKUPS_DIR
tar -zcvf $BACKUPS_DIR/$BACKUP_NAME.tgz /var/www/html/backups/$BACKUP_NAME
# Delete uncompressed backup
#rm -rf /var/www/html/backups/$BACKUP_NAME
# Delete backups older than retention period
#find $BACKUPS_DIR -type f -mtime +$DAYSTORETAINBACKUP -exec rm {} +
echo "--------------------------------------------"
echo "Database backup complete!"