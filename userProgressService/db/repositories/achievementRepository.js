const {achievement} = require('../models/achievement');
const {mongooseUpdateParams} = require('../../options');
const mongoose = require('mongoose');
const {MongoClient, GridFSBucket} = require('mongodb');
const {MONGODB_URI} = require('../../config');
const {bucketName} = require('../../options').fileDb;
const stream = require('stream');

async function create({file, conditions, description, name}) {
    const fileId = mongoose.Types.ObjectId();
    return new Promise(resolve => {
        const finishCb = () => resolve(createAchievement({name, fileId, conditions, description}));
        createFile({file, fileId, finishCb});
    });
}

async function createFile({file, fileId, finishCb}) {
    MongoClient.connect(MONGODB_URI, (err, db) => {
        if (err) throw err;

        const bucket = new GridFSBucket(db, {bucketName});
        createFileByBucket({file, fileId, finishCb, bucket})
    });
}

function createFileByBucket({file, fileId, finishCb, bucket}) {
    const {buffer, originalname, mimetype} = file;
    const bufferStream = new stream.PassThrough();
    bufferStream.end(Buffer.from(buffer));
    const uploadStream = bucket.openUploadStreamWithId(fileId, originalname, {contentType: mimetype});
    bufferStream.pipe(uploadStream);
    bufferStream.on('finish', finishCb);
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

async function updateFile({fileId, file}) {//todo check
    return new Promise(resolve => {
        MongoClient.connect(MONGODB_URI, (err, db) => {
            if (err) throw err;

            const bucket = new GridFSBucket(db, {bucketName});
            bucket.delete(fileId, error => {
                if (error) throw error;
                createFileByBucket({file, fileId, finishCb: resolve, bucket});
            });
        });
    });
}

async function findFile(fileId) {
    return new Promise(resolve => {
        MongoClient.connect(MONGODB_URI, (err, db) => {
            if (err) throw err;

            const bucket = new GridFSBucket(db, {bucketName});
            bucket.find({_id: mongoose.Types.ObjectId(fileId)})
                .toArray((err, fileInfos) => {
                    const [fileInfo] = fileInfos;
                    const downloadStream = bucket.openDownloadStreamByName(fileInfo.filename);
                    const chunks = [];
                    downloadStream.on('data', ch => chunks.push(ch));
                    downloadStream.on('close', () => {
                        fileInfo.buffer = Buffer.concat(chunks);
                        resolve(fileInfo);
                    });
                });
        });
    });
}

function findMany({achievementFotFind, count, sort = {number: 1}, skip = 0}) {//todo check
    const find = achievement.find(achievementFotFind).select('+conditions').sort(sort);
    if (count !== undefined)
        find.limit(skip + count);
    return find;
}


function addConditions({id, conditions}) {//todo check
    return achievement.findByIdAndUpdate(id,
        {$push: {'conditions': conditions}},
        {
            upsert: true,
            ...mongooseUpdateParams
        });
}

function deleteConditions({id, conditions}) {//todo check
    return achievement.findOneAndUpdate(id,
        {$pull: {'conditions': conditions}},
        mongooseUpdateParams);
}

function updateAchievement({id, name, conditions, description}) {
    return achievement.findByIdAndUpdate(id, {name, conditions, description}, mongooseUpdateParams);
}

function findById(id) {
    return achievement.findById(id).select('+conditions');
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