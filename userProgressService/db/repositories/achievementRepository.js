const {achievement} = require('../models/achievement');
const {mongooseUpdateParams} = require('../../options');
const mongoose = require('mongoose');
const {MongoClient, GridFSBucket} = require('mongodb');
const {MONGODB_URI, MONGODB_DB_NAME} = require('../../config');
const {bucketName} = require('../../options').fileDb;
const {mongoOptions} = require('../../options');
const stream = require('stream');

async function create({file, conditions, description, name}) {
    const fileId = mongoose.Types.ObjectId();
    await createFile({file, fileId});
    return await createAchievement({name, fileId, conditions, description})
}

async function createFile({file, fileId}) {
    return await MongoClient.connect(MONGODB_URI, mongoOptions).then(client => {
        const db = client.db(MONGODB_DB_NAME);
        const bucket = new GridFSBucket(db, {bucketName});
        return createFileByBucket({
            file,
            fileId,
            bucket,
        });
    });
}

function createFileByBucket({file, fileId, bucket}) {
    const {buffer, originalname, mimetype} = file;
    const bufferStream = new stream.PassThrough();
    bufferStream.end(Buffer.from(buffer));
    const uploadStream = bucket.openUploadStreamWithId(fileId, originalname, {contentType: mimetype});
    bufferStream.pipe(uploadStream);
    return new Promise(resolve => bufferStream.on('finish', resolve))
}

async function createAchievement({name, fileId, conditions, description}) {
    const newAchievementModel = new achievement({
        name,
        fileId,
        conditions,
        description,
    });
    return await newAchievementModel.save();
}

async function updateFile({fileId, file}) {
    return await MongoClient.connect(MONGODB_URI, mongoOptions).then(client => {
        const db = client.db(MONGODB_DB_NAME);
        const bucket = new GridFSBucket(db, {bucketName});
        return bucket.delete(fileId)
            .then(() => createFileByBucket({
                file,
                fileId,
                bucket,
            }));
    })
}

async function findFile(fileId) {
    return await MongoClient.connect(MONGODB_URI, mongoOptions).then(client => {
        const db = client.db(MONGODB_DB_NAME);
        const bucket = new GridFSBucket(db, {bucketName});
        return bucket.find({_id: mongoose.Types.ObjectId(fileId)})
            .toArray().then(fileInfos => {
                const [fileInfo] = fileInfos;
                const downloadStream = bucket.openDownloadStreamByName(fileInfo.filename);
                const chunks = [];
                downloadStream.on('data', ch => chunks.push(ch));
                return new Promise(resolve => {
                    downloadStream.on('close', () => {
                        fileInfo.buffer = Buffer.concat(chunks);
                        resolve(fileInfo);
                    });
                })
            });
    })
}

async function findMany({achievementForFind, count, sort, skip}) {//todo check
    const find = achievement.find(achievementForFind).select('+conditions').sort(sort);
    if (count !== undefined)
        find.limit(skip + count);
    return await find;
}


async function addConditions({id, conditions}) {//todo check
    return await achievement.findByIdAndUpdate(id,
        {$push: {'conditions': conditions}},
        {
            upsert: true,
            ...mongooseUpdateParams
        });
}

async function deleteConditions({id, conditions}) {//todo check
    return await achievement.findOneAndUpdate(id,
        {$pull: {'conditions': conditions}},
        mongooseUpdateParams);
}

async function updateAchievement({id, name, conditions, description}) {
    return await achievement.findByIdAndUpdate(id, {name, conditions, description}, mongooseUpdateParams);
}

async function findById(id) {
    return await achievement.findById(id).select('+conditions');
}

module.exports = {
    create,
    findById,
    addConditions,
    findMany,
    findFile,
    updateFile,
    deleteConditions,
    updateAchievement,
};