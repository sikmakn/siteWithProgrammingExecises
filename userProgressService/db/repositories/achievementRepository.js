const {achievement} = require('../models/achievement');
const {mongooseUpdateParams} = require('../../options');
const mongoose = require('mongoose');
const {MongoClient, GridFSBucket} = require('mongodb');
const {MONGODB_URI, MONGODB_DB_NAME} = require('../../config');
const {bucketName} = require('../../options').fileDb;
const {mongoOptions} = require('../../options');
const stream = require('stream');

async function create({file, conditions, description, name, previewFile}) {
    const fileId = await createFile({file});
    const previewFileId = await createFile({file: previewFile});
    return await createAchievement({name, fileId, conditions, description, previewFileId});
}

async function updateFile({fileId, file}) {
    fileId = mongoose.Types.ObjectId(fileId);
    return await connectBucket(bucket => bucket.delete(fileId).then(() => createFileByBucket({file, fileId, bucket})));
}

async function findFile(fileId) {
    const _id = mongoose.Types.ObjectId(fileId);
    return await connectBucket(bucket => bucket.find({_id}).toArray()
        .then(([fileInfo]) => {
            if (fileInfo) return downloadFile({bucket, fileInfo});
        }));
}

async function findMany({achievementForFind, count, sort, skip}) {
    const find = achievement.find(achievementForFind).select('+conditions').sort(sort);
    if (skip !== undefined) find.skip(skip);
    if (count !== undefined) find.limit(count);
    return await find;
}

async function updateAchievement({id, name, conditions, description}) {
    return await achievement.findByIdAndUpdate(id, {name, conditions, description}, mongooseUpdateParams);
}

async function findById(id) {
    return await achievement.findById(id).select('+conditions');
}

async function deleteAchievementById(id) {
    const deletedAchievement = await achievement.findByIdAndDelete(id);
    if (!deletedAchievement) return;
    return await connectBucket(bucket => Promise.allSettled([
        bucket.delete(deletedAchievement.fileId),
        bucket.delete(deletedAchievement.previewFileId),
    ]));
}

async function deleteFileById(id) {
    const _id = mongoose.Types.ObjectId(id);
    return await connectBucket(bucket => bucket.delete(_id));
}

module.exports = {
    create,
    findById,
    findMany,
    findFile,
    updateFile,
    updateAchievement,
    deleteFileById,
    deleteAchievementById,
};

function downloadFile({bucket, fileInfo}) {
    const downloadStream = bucket.openDownloadStreamByName(fileInfo.filename);
    const chunks = [];
    downloadStream.on('data', ch => chunks.push(ch));
    return new Promise(resolve => {
        downloadStream.on('close', () =>
            resolve({...fileInfo, buffer: Buffer.concat(chunks)}));
    });
}

async function createAchievement({name, fileId, conditions, description, previewFileId}) {
    const newAchievementModel = new achievement({name, fileId, conditions, description, previewFileId});
    return await newAchievementModel.save();
}

async function createFile({file}) {
    const fileId = mongoose.Types.ObjectId();
    await connectBucket(bucket => createFileByBucket({file, fileId, bucket}));
    return fileId;
}

function createFileByBucket({file, fileId, bucket}) {
    const {buffer, originalname, mimetype} = file;
    const bufferStream = new stream.PassThrough();
    bufferStream.end(Buffer.from(buffer));
    const uploadStream = bucket.openUploadStreamWithId(fileId, originalname, {contentType: mimetype});
    bufferStream.pipe(uploadStream);
    return new Promise(resolve => bufferStream.on('finish', resolve))
}

async function connectBucket(cb) {
    return await MongoClient.connect(MONGODB_URI, mongoOptions).then(client => {
        const db = client.db(MONGODB_DB_NAME);
        const bucket = new GridFSBucket(db, {bucketName});
        return cb(bucket);
    });
}